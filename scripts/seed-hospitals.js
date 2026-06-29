const { MongoClient } = require('mongodb');

const hospitals = [
  {
    name: 'Sri Sathya Sai Institute of Higher Medical Sciences',
    facility_type: 'hospital',
    address: 'Sri Sathya Sai District, Puttaparthi, Andhra Pradesh',
    city: 'Puttaparthi',
    state: 'Andhra Pradesh',
    phone: '08555-287388',
    type: 'private',
    is_active: true,
    rating: 4.5,
    total_reviews: 0
  },
  {
    name: 'Sri Venkateswara Institute of Medical Sciences',
    facility_type: 'hospital',
    address: 'Alipiri Road, Tirupati, Andhra Pradesh',
    city: 'Tirupati',
    state: 'Andhra Pradesh',
    phone: '0877-2287777',
    type: 'government',
    is_active: true,
    rating: 4.5,
    total_reviews: 0
  },
  {
    name: 'Dr. Mohan\'s Diabetes Specialities Centre',
    facility_type: 'hospital',
    address: '10-1-1, Ramarao Peta, Vijayawada',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    phone: '0866-2487777',
    type: 'private',
    is_active: true,
    rating: 4.5,
    total_reviews: 0
  },
  {
    name: 'Krishna Institute of Medical Sciences',
    facility_type: 'hospital',
    address: '46-1-4, Jagadamba Junction, Vijayawada',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    phone: '0866-2999999',
    type: 'private',
    is_active: true,
    rating: 4.5,
    total_reviews: 0
  },
  {
    name: 'L. V. Prasad Eye Institute',
    facility_type: 'hospital',
    address: 'Door No. 8-2-1, Sri Ram Nagar, Vijayawada',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    phone: '0866-2463333',
    type: 'private',
    is_active: true,
    rating: 4.5,
    total_reviews: 0
  },
  {
    name: 'Manipal Hospital',
    facility_type: 'hospital',
    address: '22, 2-42-3, Benz Circle, Vijayawada',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    phone: '0866-2544444',
    type: 'private',
    is_active: true,
    rating: 4.5,
    total_reviews: 0
  },
  {
    name: 'Rainbow Hospital',
    facility_type: 'hospital',
    address: '22, Benz Circle, Vijayawada',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    phone: '0866-2544444',
    type: 'private',
    is_active: true,
    rating: 4.5,
    total_reviews: 0
  },
  {
    name: 'Siddhartha Medical College',
    facility_type: 'hospital',
    address: 'Ring Road, Vijayawada',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    phone: '0866-2450450',
    type: 'government',
    is_active: true,
    rating: 4.5,
    total_reviews: 0
  },
  {
    name: 'Apollo Hospitals',
    facility_type: 'hospital',
    address: '13-1-3, Waltair Main Road, Visakhapatnam',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    phone: '0891-2727272',
    type: 'private',
    is_active: true,
    rating: 4.5,
    total_reviews: 0
  },
  {
    name: 'Care Hospital',
    facility_type: 'hospital',
    address: '10-50-11/5, AS Raja Complex, Waltair Main Road, Visakhapatnam',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    phone: '0891-3041111',
    type: 'private',
    is_active: true,
    rating: 4.5,
    total_reviews: 0
  },
  {
    name: 'Dr. Agarwal\'s Eye Hospital',
    facility_type: 'hospital',
    address: '10-50-81, Waltair Main Road, Visakhapatnam',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    phone: '0891-2755555',
    type: 'private',
    is_active: true,
    rating: 4.5,
    total_reviews: 0
  },
  {
    name: 'Government ENT Hospital',
    facility_type: 'hospital',
    address: 'Jagadamba Junction, Visakhapatnam',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    phone: '0891-2564567',
    type: 'government',
    is_active: true,
    rating: 4.5,
    total_reviews: 0
  },
  {
    name: 'Government Regional Eye Hospital',
    facility_type: 'hospital',
    address: 'Jagadamba Junction, Visakhapatnam',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    phone: '0891-2564567',
    type: 'government',
    is_active: true,
    rating: 4.5,
    total_reviews: 0
  },
  {
    name: 'Government TB and Chest Hospital',
    facility_type: 'hospital',
    address: 'Jagadamba Junction, Visakhapatnam',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    phone: '0891-2564567',
    type: 'government',
    is_active: true,
    rating: 4.5,
    total_reviews: 0
  },
  {
    name: 'Government Victoria Hospital',
    facility_type: 'hospital',
    address: 'Jagadamba Junction, Visakhapatnam',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    phone: '0891-2564567',
    type: 'government',
    is_active: true,
    rating: 4.5,
    total_reviews: 0
  },
  {
    name: 'Homi Bhabha Cancer Hospital & Research Centre',
    facility_type: 'hospital',
    address: 'G I P Colony, Visakhapatnam',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    phone: '0891-2878787',
    type: 'government',
    is_active: true,
    rating: 4.5,
    total_reviews: 0
  },
  {
    name: 'King George Hospital',
    facility_type: 'hospital',
    address: 'Beach Road, Visakhapatnam',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    phone: '0891-2564567',
    type: 'government',
    is_active: true,
    rating: 4.5,
    total_reviews: 0
  },
  {
    name: 'Krishna Institute of Medical Sciences',
    facility_type: 'hospital',
    address: '16-2-74, KIMS Hospital Road, Visakhapatnam',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    phone: '0891-2526363',
    type: 'private',
    is_active: true,
    rating: 4.5,
    total_reviews: 0
  },
  {
    name: 'L. V. Prasad Eye Institute',
    facility_type: 'hospital',
    address: '11-113/1, RTC Colony, Visakhapatnam',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    phone: '0891-3989999',
    type: 'private',
    is_active: true,
    rating: 4.5,
    total_reviews: 0
  },
  {
    name: 'Medicover Hospital',
    facility_type: 'hospital',
    address: '15-2-9, Gokhale Road, Maharani Peta, Visakhapatnam',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    phone: '0891-2522222',
    type: 'private',
    is_active: true,
    rating: 4.5,
    total_reviews: 0
  },
  {
    name: 'Rainbow Hospital',
    facility_type: 'hospital',
    address: '16-2-74, KIMS Hospital Road, Visakhapatnam',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    phone: '0891-2526363',
    type: 'private',
    is_active: true,
    rating: 4.5,
    total_reviews: 0
  },
  {
    name: 'Rani Chandramani Devi Government Hospital',
    facility_type: 'hospital',
    address: 'Jagadamba Junction, Visakhapatnam',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    phone: '0891-2564567',
    type: 'government',
    is_active: true,
    rating: 4.5,
    total_reviews: 0
  },
  {
    name: 'SevenHills Hospital',
    facility_type: 'hospital',
    address: '11-4-4, Daspalla Hills, Visakhapatnam',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    phone: '0891-3989999',
    type: 'private',
    is_active: true,
    rating: 4.5,
    total_reviews: 0
  },
  {
    name: 'Visakha Institute of Medical Sciences',
    facility_type: 'hospital',
    address: 'Visakhapatnam',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    phone: 'N/A',
    type: 'government',
    is_active: true,
    rating: 4.5,
    total_reviews: 0
  }
];

async function seedHospitals() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB || 'swiftcare');
    const collection = db.collection('facilities');

    // Clear existing data
    await collection.deleteMany({});

    // Insert new data
    const result = await collection.insertMany(hospitals);
    console.log(`Inserted ${result.insertedCount} hospitals`);
  } catch (error) {
    console.error('Error seeding hospitals:', error);
  } finally {
    await client.close();
  }
}

seedHospitals();