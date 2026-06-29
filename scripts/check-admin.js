const { MongoClient } = require('mongodb');

const uri = "mongodb://127.0.0.1:27017/swiftcare";
const dbName = "swiftcare";

async function checkUser() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const user = await db.collection('users').findOne({ email: 'admin@healthcare.com' });
    console.log('Admin user found:', user ? { email: user.email, role: user.role, hasPassword: !!user.passwordHash } : 'NOT FOUND');
  } finally {
    await client.close();
  }
}

checkUser();
