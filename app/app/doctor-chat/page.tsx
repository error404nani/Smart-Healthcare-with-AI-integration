'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, Send, Loader, User, Stethoscope, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function DoctorChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Hello! I\'m your virtual doctor assistant. I\'m here to help answer your health questions and provide medical guidance. Please describe your symptoms or health concerns.',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          conversationId: `conv_${Date.now()}`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      const assistantId = `msg_${Date.now()}`
      const newAssistantMessage: Message = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, newAssistantMessage])

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break

        const chunk = decoder.decode(value)
        assistantMessage += chunk

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, content: assistantMessage } : msg
          )
        )
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content:
          'Sorry, I encountered an error. Please try again later or consult with a real doctor for urgent matters.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border bg-card text-card-foreground">
      {/* Header */}
      <div className="p-6 border-b bg-muted/30 backdrop-blur-md z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <div className="p-2.5 bg-primary/10 rounded-xl shadow-sm">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Virtual Consultation</h1>
          </div>
          <p className="text-muted-foreground text-sm font-medium">
            24/7 AI Health Assistant. Connect instantly for preliminary advice.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl shadow-sm">
          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
          <p className="text-[11px] font-bold text-red-700 dark:text-red-400 uppercase tracking-widest">
            For Emergencies, Call 911
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-muted/10 relative">
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            const isUser = message.role === 'user'
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, type: 'spring' }}
                className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className="flex-shrink-0 mt-auto hidden sm:block">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md ${isUser ? 'bg-primary/20 text-primary' : 'bg-foreground text-background'}`}>
                      {isUser ? <User className="w-4 h-4" /> : <Stethoscope className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Bubble */}
                  <div
                    className={`px-5 py-4 shadow-md backdrop-blur-sm ${
                      isUser
                        ? 'bg-primary text-primary-foreground rounded-3xl rounded-br-sm'
                        : 'bg-background text-foreground border border-border/50 rounded-3xl rounded-bl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed text-[15px] font-medium">{message.content}</p>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider mt-3 block ${
                        isUser ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
             <div className="flex gap-3 max-w-[85%] md:max-w-[75%]">
                <div className="flex-shrink-0 mt-auto hidden sm:block">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-md bg-foreground text-background">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                </div>
                <div className="bg-background text-foreground border border-border/50 px-5 py-4 rounded-3xl rounded-bl-sm shadow-md">
                  <div className="flex items-center gap-3">
                    <Loader className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm font-semibold text-muted-foreground animate-pulse">Doctor is typing...</span>
                  </div>
                </div>
             </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 border-t bg-background/80 backdrop-blur-xl z-10">
        <div className="relative group">
           <div className={`absolute -inset-0.5 rounded-2xl blur opacity-20 transition duration-500 ${input ? 'bg-primary opacity-40' : 'bg-transparent'}`}></div>
           <div className="relative flex gap-3 items-end">
              <textarea
                rows={1}
                placeholder="Type your message here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                disabled={loading}
                className="flex-1 min-h-[60px] max-h-[150px] px-5 py-4 border-2 border-border/50 rounded-2xl bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 disabled:opacity-50 transition-all resize-none shadow-sm text-base font-medium"
              />
              <Button
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
                size="icon"
                className="h-[60px] w-[60px] rounded-2xl shadow-[0_4px_14px_0_rgba(10,132,255,0.39)] hover:shadow-[0_6px_20px_rgba(10,132,255,0.23)] hover:-translate-y-0.5 transition-all mb-0 flex-shrink-0"
              >
                <Send className="w-6 h-6" />
              </Button>
           </div>
        </div>
        <p className="text-xs text-center text-muted-foreground font-medium mt-4">
          Press <kbd className="px-1.5 py-0.5 rounded-md bg-muted font-mono font-bold text-[10px]">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 rounded-md bg-muted font-mono font-bold text-[10px]">Shift + Enter</kbd> for new line
        </p>
      </div>
    </div>
  )
}
