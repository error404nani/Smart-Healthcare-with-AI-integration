import { streamText } from 'ai'
import { createGroq } from '@ai-sdk/groq'
import { getUserFromRequest } from '@/lib/auth'
import {
  HEALTH_ASSISTANT_SYSTEM_PROMPT,
  buildUserContextBlock,
  type UserHealthContext,
} from '@/lib/health-assistant-prompt'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface SymptomCheckRequest {
  message: string
  conversationHistory?: ChatMessage[]
  userContext?: UserHealthContext
}

async function loadUserContextFromDb(userId: string): Promise<UserHealthContext | null> {
  try {
    const db = await getDb()
    const userData = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      { projection: { email: 1, first_name: 1, last_name: 1, date_of_birth: 1, medical_history: 1 } },
    )
    if (!userData) return null
    return {
      email: userData.email,
      firstName: userData.first_name,
      lastName: userData.last_name,
      dateOfBirth: userData.date_of_birth,
      medicalHistory: userData.medical_history,
    }
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const groqKey =
      process.env.GROQ_API_KEY ||
      (process.env.GOOGLE_GENERATIVE_AI_API_KEY?.startsWith('gsk_')
        ? process.env.GOOGLE_GENERATIVE_AI_API_KEY
        : undefined)

    if (!groqKey) {
      return new Response(
        'Missing GROQ_API_KEY. Add it to your .env.local and restart the dev server.',
        { status: 500 },
      )
    }

    const groq = createGroq({ apiKey: groqKey })
    const body: SymptomCheckRequest = await request.json()

    const message = body.message?.trim()
    const conversationHistory = body.conversationHistory ?? []

    if (!message) {
      return new Response('Message is required', { status: 400 })
    }

    // Merge client-provided context with server profile when logged in
    let userContext = body.userContext ?? null
    const authUser = await getUserFromRequest(request)
    if (authUser) {
      const dbContext = await loadUserContextFromDb(authUser.id)
      userContext = { ...dbContext, ...userContext }
    }

    const systemPrompt =
      HEALTH_ASSISTANT_SYSTEM_PROMPT + buildUserContextBlock(userContext)

    const messages: ChatMessage[] = [
      ...conversationHistory.filter((m) => m.content?.trim()),
      { role: 'user', content: message },
    ]

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      temperature: 0.7,
      maxTokens: 1500,
    })

    return result.toTextStreamResponse()
  } catch (error: unknown) {
    console.error('Symptom check critical error:', error)
    const msg = error instanceof Error ? error.message : 'Failed to process message'
    return new Response(msg, { status: 500 })
  }
}
