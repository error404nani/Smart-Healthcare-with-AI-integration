'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Heart, MessageCircle, MapPin, Calendar, Pill, Brain, Loader2, Send, RefreshCw, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export default function LandingPage() {
  const [symptomInput, setSymptomInput] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([])
  const [showConversation, setShowConversation] = useState(false)

  const handleTestAi = async (e: React.FormEvent, isFollowUp = false) => {
    e.preventDefault()
    if (!symptomInput.trim()) return

    setLoading(true)
    
    if (!isFollowUp) {
      setAiResponse('')
      setConversationHistory([])
    }

    const newUserMessage: ConversationMessage = {
      role: 'user',
      content: symptomInput,
      timestamp: Date.now()
    }

    try {
      const res = await fetch('/api/symptom-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: symptomInput,
          conversationHistory: conversationHistory.map(({ role, content }) => ({
            role,
            content,
          })),
        }),
      })
      if (!res.ok) throw new Error('Failed to analyze')

      let responseText = ''
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader!.read()
        if (done) break
        const chunk = decoder.decode(value)
        responseText += chunk
        if (!isFollowUp) {
          setAiResponse((prev) => prev + chunk)
        }
      }

      const assistantMessage: ConversationMessage = {
        role: 'assistant',
        content: responseText,
        timestamp: Date.now()
      }

      setConversationHistory(prev => [...prev, newUserMessage, assistantMessage])
      
      if (isFollowUp) {
        setAiResponse(responseText)
      }
      
      setShowConversation(true)
      setSymptomInput('')
    } catch (err) {
      setAiResponse('Sorry, an error occurred analyzing your symptoms.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSymptomInput('')
    setAiResponse('')
    setConversationHistory([])
    setShowConversation(false)
    setLoading(false)
  }

  const handleFollowUp = (e: React.FormEvent) => {
    handleTestAi(e, true)
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6 }
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-slate-50 dark:bg-background -z-20" />
      <div className="fixed inset-0 -z-10 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/30 via-transparent to-transparent dark:from-blue-900 dark:via-background dark:to-background pointer-events-none" />
      <div className="fixed inset-0 -z-10 opacity-20 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-600/30 via-transparent to-transparent dark:from-purple-900 dark:via-transparent dark:to-transparent pointer-events-none" />
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">Smart Healthcare</span>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-left space-y-6">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance leading-tight"
          >
            Healthcare Made <span className="text-primary">Simple</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-muted-foreground text-balance"
          >
            Get instant health insights, consult doctors, order medicines, and find nearby clinics—all in one trusted platform
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex gap-4 flex-wrap"
          >
            <Link href="/auth/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start Free Consultation
              </Button>
            </Link>
            <Button size="lg" variant="outline">Learn More</Button>
          </motion.div>
        </div>

        {/* Enhanced AI Demo Widget */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 blur-3xl -z-10 rounded-[3rem]" />
          <Card className="p-6 border-2 shadow-xl bg-background/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Symptom Checker</h3>
                  <p className="text-xs text-muted-foreground">Advanced analysis with follow-up conversations</p>
                </div>
              </div>
              {showConversation && (
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              )}
            </div>

            {/* Conversation History */}
            {showConversation && conversationHistory.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-3 mb-4 max-h-32 overflow-y-auto">
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-muted-foreground">
                  <MessageSquare className="w-3 h-3" />
                  Conversation History
                </div>
                {conversationHistory.map((msg, idx) => (
                  <div key={idx} className={`text-xs p-2 rounded mb-1 ${
                    msg.role === 'user' 
                      ? 'bg-primary/10 text-primary ml-8' 
                      : 'bg-accent/10 text-accent mr-8'
                  }`}>
                    <strong>{msg.role === 'user' ? 'You:' : 'AI:'}</strong> {msg.content.substring(0, 100)}...
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={showConversation ? handleFollowUp : handleTestAi} className="flex gap-2 mb-4">
              <Input 
                placeholder={showConversation 
                  ? "Continue the conversation or ask follow-up questions..." 
                  : "E.g., I have a headache and fever..."
                }
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                className="flex-1"
                disabled={loading}
              />
              <Button type="submit" disabled={loading || !symptomInput.trim()}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </form>

            {aiResponse && (
              <div className="bg-muted p-4 rounded-lg text-sm h-96 overflow-y-auto border">
                <div className="text-foreground whitespace-pre-wrap">
                  {aiResponse.split('\n').map((line, idx) => {
                    if (line.startsWith('## 📊')) {
                      return <h3 key={idx} className="font-bold text-lg mt-4 mb-2 text-blue-600">{line.replace('## 📊 ', '')}</h3>
                    }
                    if (line.startsWith('## 🎯')) {
                      return <h3 key={idx} className="font-bold text-lg mt-4 mb-2 text-green-600">{line.replace('## 🎯 ', '')}</h3>
                    }
                    if (line.startsWith('### 🔴')) {
                      return <h4 key={idx} className="font-semibold text-red-600 mt-3 mb-1">{line.replace('### 🔴 ', '')}</h4>
                    }
                    if (line.startsWith('### 🟡')) {
                      return <h4 key={idx} className="font-semibold text-yellow-600 mt-3 mb-1">{line.replace('### 🟡 ', '')}</h4>
                    }
                    if (line.startsWith('### 🟠')) {
                      return <h4 key={idx} className="font-semibold text-orange-600 mt-3 mb-1">{line.replace('### 🟠 ', '')}</h4>
                    }
                    if (line.startsWith('## 📈')) {
                      return <h3 key={idx} className="font-bold text-lg mt-4 mb-2 text-purple-600">{line.replace('## 📈 ', '')}</h3>
                    }
                    if (line.startsWith('## 🔄')) {
                      return <h3 key={idx} className="font-bold text-lg mt-4 mb-2 text-indigo-600">{line.replace('## 🔄 ', '')}</h3>
                    }
                    if (line.startsWith('## 📋')) {
                      return <h3 key={idx} className="font-bold text-lg mt-4 mb-2 text-teal-600">{line.replace('## 📋 ', '')}</h3>
                    }
                    if (line.startsWith('###')) {
                      return <h4 key={idx} className="font-semibold mt-2 mb-1">{line.replace('###', '').trim()}</h4>
                    }
                    if (line.startsWith('**') && line.includes('Score:')) {
                      return <p key={idx} className="font-bold text-lg mt-2 mb-1">{line}</p>
                    }
                    if (line.startsWith('**')) {
                      return <p key={idx} className="font-semibold">{line}</p>
                    }
                    if (line.startsWith('- **')) {
                      return <p key={idx} className="ml-4">• {line.replace('- **', '**').replace('**:', '**:')}</p>
                    }
                    if (line.startsWith('-')) {
                      return <p key={idx} className="ml-4">{line}</p>
                    }
                    if (line.match(/^\d+\./)) {
                      return <p key={idx} className="ml-4">{line}</p>
                    }
                    if (line.startsWith('---')) {
                      return <hr key={idx} className="my-4 border-t border-muted-foreground/20" />
                    }
                    return <p key={idx} className="mb-1">{line}</p>
                  })}
                </div>
              </div>
            )}
            {!aiResponse && !loading && (
              <div className="bg-muted/50 p-4 rounded-lg text-sm h-96 border flex items-center justify-center text-muted-foreground text-center">
                <div>
                  <Brain className="w-8 h-8 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="mb-2">Enter your symptoms to get an enhanced analysis with:</p>
                  <ul className="text-xs space-y-1 text-left max-w-xs mx-auto">
                    <li>• Condition likelihood ranking</li>
                    <li>• Symptom severity scoring</li>
                    <li>• Follow-up questions</li>
                    <li>• Conversational support</li>
                  </ul>
                </div>
              </div>
            )}
            {loading && !aiResponse && (
              <div className="bg-muted p-4 rounded-lg text-sm h-96 border flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-primary" />
                  <p>Analyzing your symptoms...</p>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need for Better Health
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive suite of tools ensures you're always one step ahead.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: Brain, title: 'AI Symptom Checker', desc: 'Describe your symptoms and get instant medical insights powered by advanced AI.', color: 'text-primary' },
              { icon: MessageCircle, title: 'Doctor Consultation', desc: 'Chat with qualified doctors directly. Get professional medical advice anytime.', color: 'text-accent' },
              { icon: Pill, title: 'Online Pharmacy', desc: 'Order medicines with ease. Fast delivery and affordable prices on essentials.', color: 'text-primary' },
              { icon: MapPin, title: 'Find Clinics', desc: 'Locate nearby healthcare facilities with real ratings and detailed contacts.', color: 'text-accent' },
              { icon: Calendar, title: 'Easy Appointments', desc: 'Book appointments instantly and manage your schedule effortlessly.', color: 'text-primary' },
              { icon: Heart, title: 'Health Records', desc: 'Keep your medical history and prescriptions fully organized and secure.', color: 'text-accent' }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card className="p-8 hover:shadow-xl transition-all duration-300 border-border group">
                  <div className="mb-6 p-4 rounded-2xl bg-muted group-hover:bg-primary/5 transition-colors inline-block">
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Trusted by Thousands</h2>
            <p className="text-muted-foreground">Hear what our patients and doctors have to say about Smart Healthcare.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { text: "Smart Healthcare saved me a trip to the ER. The AI checker was highly accurate and I got a prescription from a doctor in 15 minutes.", author: "Sarah Jenkins", role: "Patient" },
              { text: "As a practicing physician, the platform is incredibly streamlined. It allows me to connect with patients who need immediate attention safely.", author: "Dr. Robert Chen", role: "General Practitioner" },
              { text: "The pharmacy integration is flawless. My medications arrived at my door within hours of my consultation. Truly a game-changer.", author: "Michael T.", role: "Patient" }
            ].map((testimonial, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }}>
                <Card className="p-8 h-full flex flex-col justify-between border-border bg-background/60 backdrop-blur-sm">
                  <p className="italic text-muted-foreground mb-6">"{testimonial.text}"</p>
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.author}</h4>
                    <span className="text-sm text-primary">{testimonial.role}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 py-24 text-center">
        <motion.div {...fadeInUp}>
          <h2 className="text-4xl font-bold mb-6 text-foreground">Ready to Take Control?</h2>
          <p className="text-xl text-muted-foreground mb-10">
            Join thousands of users who trust Smart Healthcare for their everyday healthcare needs.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
              Create Your Free Account
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Expanded Footer */}
      <footer className="border-t bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-primary" />
              <span className="text-xl font-bold">Smart Healthcare</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Transforming healthcare, one click at a time. Your trusted digital health companion.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Services</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition">AI Checker</Link></li>
              <li><Link href="#" className="hover:text-primary transition">Consultations</Link></li>
              <li><Link href="#" className="hover:text-primary transition">Pharmacy</Link></li>
              <li><Link href="#" className="hover:text-primary transition">Find Clinics</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contact Us</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> 123 Health Ave, NY 10012</li>
              <li className="flex items-center gap-2">📞 +1 (800) 123-4567</li>
              <li className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /> support@smarthealthcare.com</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition">Cookie Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition">HIPAA Compliance</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t">
          <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-4">
            <p>&copy; {new Date().getFullYear()} Smart Healthcare Inc. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-foreground">Twitter</Link>
              <Link href="#" className="hover:text-foreground">LinkedIn</Link>
              <Link href="#" className="hover:text-foreground">Facebook</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
