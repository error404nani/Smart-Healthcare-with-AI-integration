import { streamText } from 'ai'
import { getDb } from '@/lib/mongodb'
import { getUserFromRequest } from '@/lib/auth'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId } = await request.json()

    const user = await getUserFromRequest(request)

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    if (!message) {
      return new Response('Message is required', { status: 400 })
    }

    // Store the consultation metadata in MongoDB when a conversation ID is provided
    if (conversationId) {
      const db = await getDb()
      await db.collection('consultations').updateOne(
        { id: conversationId },
        {
          $setOnInsert: {
            id: conversationId,
            patient_id: user.id,
            status: 'active',
            created_at: new Date(),
          },
        },
        { upsert: true },
      )
    }

    // Stream response from AI doctor
    const systemPrompt = `You are an experienced virtual doctor assistant. You provide helpful medical information and guidance based on patient symptoms and questions. 

Important reminders:
- You are NOT a replacement for real doctors. Always advise patients to seek professional medical help for serious conditions.
- Provide balanced, evidence-based information.
- Ask clarifying questions to better understand the patient's condition.
- Always recommend consulting with a real doctor for diagnosis and treatment.
- Be empathetic and professional.`

    const result = streamText({
      // Groq periodically decommissions models; use a currently supported one.
      model: 'groq/llama-3.3-70b-versatile',
      system: systemPrompt,
      prompt: message,
      temperature: 0.7,
      maxTokens: 1024,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Chat error:', error)
    return new Response('Failed to process chat', { status: 500 })
  }
}
