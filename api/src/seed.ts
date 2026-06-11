import { db } from './db';
import * as schema from './schema';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  console.log('Seeding database...');

  // --- Clear existing data ---
  console.log('Clearing existing data...');
  await db.delete(schema.answers);
  await db.delete(schema.questions);
  await db.delete(schema.savedItems);
  await db.delete(schema.reviewComments);
  await db.delete(schema.reviews);
  await db.delete(schema.affiliateLinks);
  await db.delete(schema.buildings);
  await db.delete(schema.hubs);
  await db.delete(schema.users);

  // --- New York Hub ---
  const nyHubId = uuidv4();
  await db.insert(schema.hubs).values({
    id: nyHubId,
    name: 'Manhattan Hub',
    slug: 'manhattan-hub',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    description: 'The heart of New York City.',
  });

  const nyBuildings = [
    {
      id: uuidv4(),
      hubId: nyHubId,
      name: 'Skyline Apartments',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
    },
    {
      id: uuidv4(),
      hubId: nyHubId,
      name: 'Garden Terrace',
      address: '456 Elm St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
    },
  ];
  await db.insert(schema.buildings).values(nyBuildings);

  // --- Nashville Hub (TN) ---
  const nashvilleHubId = uuidv4();
  await db.insert(schema.hubs).values({
    id: nashvilleHubId,
    name: 'Music City Hub',
    slug: 'music-city-hub',
    city: 'Nashville',
    state: 'TN',
    zipCode: '37201',
    description: 'Authentic living in the home of Country Music.',
  });

  const nashvilleBuildings = [
    {
      id: uuidv4(),
      hubId: nashvilleHubId,
      name: 'The Gibson',
      address: '789 Broadway',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37203',
    },
    {
      id: uuidv4(),
      hubId: nashvilleHubId,
      name: 'Gulch Crossing',
      address: '11th Ave S',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37203',
    },
    {
      id: uuidv4(),
      hubId: nashvilleHubId,
      name: 'Station 40',
      address: '4000 Centennial Blvd',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37209',
    },
    {
      id: uuidv4(),
      hubId: nashvilleHubId,
      name: 'Broadstone Gulch',
      address: '600 12th Ave S',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37203',
    },
  ];
  await db.insert(schema.buildings).values(nashvilleBuildings);

  // --- Memphis Hub (TN) ---
  const memphisHubId = uuidv4();
  await db.insert(schema.hubs).values({
    id: memphisHubId,
    name: 'Bluff City Hub',
    slug: 'bluff-city-hub',
    city: 'Memphis',
    state: 'TN',
    zipCode: '38103',
    description: 'Riverside views and soulful communities.',
  });

  const memphisBuildings = [
    {
      id: uuidv4(),
      hubId: memphisHubId,
      name: 'Beale Street Lofts',
      address: '200 Beale St',
      city: 'Memphis',
      state: 'TN',
      zipCode: '38103',
    },
    {
      id: uuidv4(),
      hubId: memphisHubId,
      name: 'The Chisca',
      address: '272 S Main St',
      city: 'Memphis',
      state: 'TN',
      zipCode: '38103',
    },
  ];
  await db.insert(schema.buildings).values(memphisBuildings);

  // --- Sample Users ---
  const users = [
    {
      id: uuidv4(),
      clerkId: 'user_2k0FvF5z4z4z4z4z4z4z4z4z4z',
      email: 'alex@example.com',
      username: 'alex_renter',
      fullName: 'Alex Johnson',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    },
    {
      id: uuidv4(),
      clerkId: 'user_3l1GvG6z5z5z5z5z5z5z5z5z5z',
      email: 'sarah@example.com',
      username: 'sarah_living',
      fullName: 'Sarah Miller',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    },
    {
      id: uuidv4(),
      clerkId: 'user_4m2HvH7z6z6z6z6z6z6z6z6z6z',
      email: 'jordan@example.com',
      username: 'jordan_tours',
      fullName: 'Jordan Smith',
      avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80',
    }
  ];
  await db.insert(schema.users).values(users);

  // --- Sample Reviews with Videos (Using Mux Test Assets) ---
  const reviewData = [
    {
      id: uuidv4(),
      userId: users[0].id,
      buildingId: nashvilleBuildings[0].id, // The Gibson
      rating: 5,
      title: 'Amazing rooftop view!',
      comment: 'The rooftop at The Gibson is incredible. Pro: Location is unbeatable. Con: Noise from Broadway can be a bit much on weekends.',
      videoPlaybackId: 'DS00SgjrnS012V01PhIP9zN00st01y009u9B',
      isVerifiedResident: true,
    },
    {
      id: uuidv4(),
      userId: users[1].id,
      buildingId: nashvilleBuildings[1].id, // Gulch Crossing
      rating: 4,
      title: 'Very modern and clean',
      comment: 'Gulch Crossing is super modern. Pro: High-end finishes. Con: Parking is a bit tight.',
      videoPlaybackId: 'G02W0201kY848GfK9O5rD00LzM01uO02N6uFh',
      isVerifiedResident: true,
    },
    {
      id: uuidv4(),
      userId: users[2].id,
      buildingId: memphisBuildings[0].id, // Beale Street Lofts
      rating: 5,
      title: 'Soul of the city',
      comment: 'Living at Beale Street Lofts is a dream. Pro: History and character. Con: No elevator.',
      videoPlaybackId: '8p01m5Wl01m01oAAn9ZfWvB01o02R8e5Zz02y',
      isVerifiedResident: true,
    }
  ];
  await db.insert(schema.reviews).values(reviewData);

  // --- Sample Questions ---
  const questions = [
    {
      id: uuidv4(),
      userId: users[0].id,
      buildingId: nashvilleBuildings[0].id,
      content: 'How is the management responsiveness at The Gibson?',
      category: 'Management',
    },
    {
      id: uuidv4(),
      userId: users[1].id,
      buildingId: nashvilleBuildings[1].id,
      content: 'Is the gym usually crowded in the evenings?',
      category: 'Amenities',
    }
  ];
  await db.insert(schema.questions).values(questions);

  // --- Sample Answers ---
  const answers = [
    {
      id: uuidv4(),
      questionId: questions[0].id,
      userId: users[1].id,
      content: 'They are generally pretty quick, usually within 24 hours for minor repairs.',
      isResident: true,
    }
  ];
  await db.insert(schema.answers).values(answers);

  // --- Sample Saved Items ---
  const savedItems = [
    {
      id: uuidv4(),
      userId: users[0].id,
      itemType: 'building',
      itemId: nashvilleBuildings[1].id,
    },
    {
      id: uuidv4(),
      userId: users[0].id,
      itemType: 'review',
      itemId: reviewData[1].id,
    }
  ];
  // @ts-ignore
  await db.insert(schema.savedItems).values(savedItems);

  console.log('Seed complete!');
}

seed().catch(console.error);
