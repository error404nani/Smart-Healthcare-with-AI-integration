import { getDb } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getDb()
    const medicines = await db
      .collection('medicines')
      .find({})
      .sort({ name: 1 })
      .toArray()

    return new Response(JSON.stringify(medicines), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching medicines:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch medicines' }), { status: 500 })
  }
}
