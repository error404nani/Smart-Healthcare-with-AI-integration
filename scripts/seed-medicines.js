const { MongoClient } = require('mongodb');

const medicines = [
  {
    name: 'Amoxicillin 500mg',
    description: 'Broad-spectrum antibiotic for bacterial infections',
    price: 120,
    stock: 120,
    category: 'Antibiotics',
    imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Lisinopril 10mg',
    description: 'Treats high blood pressure and heart failure',
    price: 85,
    stock: 8,
    category: 'Blood Pressure',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5e16d4182?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Metformin 500mg',
    description: 'First-line medication for type 2 diabetes',
    price: 90,
    stock: 0,
    category: 'Diabetes',
    imageUrl: 'https://images.unsplash.com/photo-1550572017-edb3dfdfbeaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Atorvastatin 20mg',
    description: 'Statins used to lower cholesterol and prevent heart disease',
    price: 110,
    stock: 45,
    category: 'Cholesterol',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5e16d4182?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Aspirin 500mg',
    description: 'Pain reliever and fever reducer',
    price: 45,
    stock: 50,
    category: 'Pain Relief',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5e16d4182?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Cough Syrup 200ml',
    description: 'Effective cough suppressant',
    price: 120,
    stock: 30,
    category: 'Cold & Flu',
    imageUrl: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Vitamin C 1000mg',
    description: 'Immune system booster supplements',
    price: 150,
    stock: 100,
    category: 'Vitamins',
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Digestive Tablets',
    description: 'Fast-acting antacid and gas relief',
    price: 80,
    stock: 60,
    category: 'Digestive Health',
    imageUrl: 'https://images.unsplash.com/photo-1550572017-edb3dfdfbeaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  }
];

async function seed() {
  const client = new MongoClient('mongodb://127.0.0.1:27017/swiftcare');
  try {
    await client.connect();
    const db = client.db('swiftcare');
    const count = await db.collection('medicines').countDocuments();
    if (count === 0) {
      await db.collection('medicines').insertMany(medicines);
      console.log('Seeded initial medicines');
    } else {
      console.log('Medicines collection already has data');
    }
  } finally {
    await client.close();
  }
}

seed().catch(console.error);
