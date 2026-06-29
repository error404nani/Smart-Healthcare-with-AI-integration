export interface ChatMessage {
  id: string
  role: 'user' | 'doctor' | 'system'
  content: string
  timestamp: Date
  sender_name?: string
}

export function formatChatMessage(message: ChatMessage): string {
  return `[${message.timestamp.toLocaleTimeString()}] ${message.sender_name || message.role}: ${message.content}`
}

export function groupMessagesByDay(messages: ChatMessage[]) {
  const grouped: Record<string, ChatMessage[]> = {}

  messages.forEach((message) => {
    const date = new Date(message.timestamp).toLocaleDateString()
    if (!grouped[date]) {
      grouped[date] = []
    }
    grouped[date].push(message)
  })

  return grouped
}
