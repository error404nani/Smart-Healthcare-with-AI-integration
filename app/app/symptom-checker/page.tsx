'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Brain,
  Send,
  Loader,
  User,
  Bot,
  AlertTriangle,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface UserProfile {
  first_name?: string
  last_name?: string
  date_of_birth?: string
  medical_history?: string
}

const WELCOME_MESSAGE = `Hi! I'm **HealthBot**, your Smart Healthcare assistant.

I can help you with:
• **Symptom checking** — describe how you feel and I'll ask a few questions before giving guidance
• **Health questions** — general wellness and medical information
• **Using this website** — pharmacy, appointments, clinics, and more

What would you like help with today?`

const QUICK_PROMPTS = [
  'I want to check my symptoms',
  'How do I book an appointment?',
  'How does the online pharmacy work?',
  'What services does Smart Healthcare offer?',
]

export default function SymptomCheckerPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: WELCOME_MESSAGE,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    fetch('/api/user/profile')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setUserProfile(data)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const getConversationHistory = (currentMessages: Message[]) =>
    currentMessages
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({ role: m.role, content: m.content }))

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    }

    const historyBeforeSend = [...messages, userMessage]
    setMessages(historyBeforeSend)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/symptom-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          conversationHistory: getConversationHistory(messages),
          userContext: userProfile
            ? {
                firstName: userProfile.first_name,
                lastName: userProfile.last_name,
                dateOfBirth: userProfile.date_of_birth,
                medicalHistory: userProfile.medical_history,
              }
            : undefined,
        }),
      })

      if (!response.ok) {
        const errText = await response.text().catch(() => 'Failed to get response')
        throw new Error(errText)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''

      const assistantId = `assistant_${Date.now()}`
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
        },
      ])

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break
        assistantContent += decoder.decode(value, { stream: true })
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: assistantContent } : m,
          ),
        )
      }
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      setMessages((prev) => [
        ...prev,
        {
          id: `error_${Date.now()}`,
          role: 'assistant',
          content: `Sorry, I couldn't process that. ${errMsg}\n\nFor urgent health concerns, please contact a doctor or call emergency services.`,
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: WELCOME_MESSAGE,
        timestamp: new Date(),
      },
    ])
    setInput('')
  }

  const renderMessageContent = (content: string) => {
    return content.split('\n').map((line, idx) => {
      const boldParsed = line.replace(/\*\*(.+?)\*\*/g, '$1')
      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <p key={idx} className="ml-1 mb-1">
            {boldParsed}
          </p>
        )
      }
      if (line.trim() === '') {
        return <br key={idx} />
      }
      return (
        <p key={idx} className="mb-1 last:mb-0">
          {boldParsed}
        </p>
      )
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border bg-card text-card-foreground">
      {/* Header */}
      <div className="p-5 md:p-6 border-b bg-muted/30 backdrop-blur-md z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-primary/10 rounded-xl shadow-sm">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
                HealthBot Assistant
              </h1>
              <p className="text-muted-foreground text-xs md:text-sm font-medium">
                Chat about symptoms, health, or how to use Smart Healthcare
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0" />
            <p className="text-[10px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">
              Emergencies: call 911
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset} className="rounded-xl">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            New chat
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 bg-gradient-to-b from-transparent to-muted/10">
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            const isUser = message.role === 'user'
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25, type: 'spring' }}
                className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex gap-2.5 max-w-[90%] md:max-w-[78%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className="flex-shrink-0 mt-auto hidden sm:block">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
                        isUser
                          ? 'bg-primary/20 text-primary'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      {isUser ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  <div
                    className={`px-4 py-3.5 shadow-md ${
                      isUser
                        ? 'bg-primary text-primary-foreground rounded-3xl rounded-br-sm'
                        : 'bg-background text-foreground border border-border/50 rounded-3xl rounded-bl-sm'
                    }`}
                  >
                    <div className="leading-relaxed text-[14px] md:text-[15px] font-medium">
                      {renderMessageContent(message.content)}
                    </div>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider mt-2 block ${
                        isUser ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-background border border-border/50 px-4 py-3 rounded-3xl rounded-bl-sm shadow-md">
                <div className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm font-semibold text-muted-foreground animate-pulse">
                    HealthBot is typing...
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick prompts — only show at start */}
        {messages.length === 1 && !loading && (
          <div className="flex flex-wrap gap-2 pt-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-full border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                {prompt}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Input */}
      <div className="p-4 md:p-5 border-t bg-background/80 backdrop-blur-xl z-10">
        <div className="relative flex gap-2 items-end">
          <textarea
            ref={inputRef}
            rows={1}
            placeholder="Ask about symptoms, health, or the website..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage(input)
              }
            }}
            disabled={loading}
            className="flex-1 min-h-[52px] max-h-[140px] px-4 py-3 border-2 border-border/50 rounded-2xl bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 disabled:opacity-50 transition-all resize-none shadow-sm text-sm md:text-base font-medium"
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            size="icon"
            className="h-[52px] w-[52px] rounded-2xl shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-[11px] text-center text-muted-foreground font-medium mt-3">
          Not a substitute for professional medical advice.{' '}
          <kbd className="px-1 py-0.5 rounded bg-muted font-mono text-[10px]">Enter</kbd> to send
        </p>
      </div>
    </div>
  )
}
