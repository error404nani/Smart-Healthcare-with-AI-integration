const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'smarthealthcare';

async function createProvider(email, password, role) {
  if (!uri) {
    console.error('MONGODB_URI not set');
    return;
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    
    const existing = await db.collection('users').findOne({ email });
    if (existing) {
      console.log(`User ${email} already exists`);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await db.collection('users').insertOne({
      email,
      passwordHash,
      role,
      createdAt: new Date(),
    });

    console.log(`Created ${role} user: ${email}`);
  } finally {
    await client.close();
  }
}

// Example usage:
// createProvider('admin@healthcare.com', 'admin123', 'admin');
// createProvider('doctor@healthcare.com', 'doctor123', 'doctor');
// createProvider('pharmacy@healthcare.com', 'pharmacy123', 'pharmacy');
// createProvider('clinic@healthcare.com', 'clinic123', 'clinic');

const args = process.argv.slice(2);
if (args.length === 3) {
  createProvider(args[0], args[1], args[2]);
} else {
  console.log('Usage: node create-provider.js <email> <password> <role>');
}
