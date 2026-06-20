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

  // --- Music City Hub (Nashville & Middle TN) ---
  const nashvilleHubId = uuidv4();
  await db.insert(schema.hubs).values({
    id: nashvilleHubId,
    name: 'Music City Hub',
    slug: 'music-city-hub',
    city: 'Nashville',
    state: 'TN',
    zipCode: '37201',
    description: 'Authentic living in the home of Country Music and Middle Tennessee.',
  });

  const tnBuildings = [
    {
      id: uuidv4(),
      hubId: nashvilleHubId,
      name: 'The Fitzroy at Lebanon Marketplace',
      address: '1000 Fitzroy Ln',
      city: 'Lebanon',
      state: 'TN',
      zipCode: '37090',
    },
    {
      id: uuidv4(),
      hubId: nashvilleHubId,
      name: 'The Edison at Peytona',
      address: '1 Edison Way',
      city: 'Gallatin',
      state: 'TN',
      zipCode: '37066',
    },
    {
      id: uuidv4(),
      hubId: nashvilleHubId,
      name: "Statler McCain's Station",
      address: '101 Statler Dr',
      city: 'Gallatin',
      state: 'TN',
      zipCode: '37066',
    },
    {
      id: uuidv4(),
      hubId: nashvilleHubId,
      name: 'The Edison at Riverwood',
      address: '3801 Riverwood Dr',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37218',
    },
    {
      id: uuidv4(),
      hubId: nashvilleHubId,
      name: 'Preston Run',
      address: '300 Preston Run Blvd',
      city: 'Goodlettsville',
      state: 'TN',
      zipCode: '37072',
    },
    {
      id: uuidv4(),
      hubId: nashvilleHubId,
      name: 'Nottingham',
      address: '1 Nottingham Dr',
      city: 'Hendersonville',
      state: 'TN',
      zipCode: '37075',
    },
    {
      id: uuidv4(),
      hubId: nashvilleHubId,
      name: 'The Retreat at Iron Horse',
      address: '1 Iron Horse Way',
      city: 'Franklin',
      state: 'TN',
      zipCode: '37064',
    },
    {
      id: uuidv4(),
      hubId: nashvilleHubId,
      name: 'The Harper',
      address: '100 Harper Ln',
      city: 'Franklin',
      state: 'TN',
      zipCode: '37064',
    },
    {
      id: uuidv4(),
      hubId: nashvilleHubId,
      name: 'Picadilly',
      address: '100 Picadilly Pl',
      city: 'Goodlettsville',
      state: 'TN',
      zipCode: '37072',
    },
    {
      id: uuidv4(),
      hubId: nashvilleHubId,
      name: 'Bexley Parkstone',
      address: '1 Parkstone Way',
      city: 'Gallatin',
      state: 'TN',
      zipCode: '37066',
    },
  ];
  await db.insert(schema.buildings).values(tnBuildings);

  // --- Alabama Hub ---
  const alabamaHubId = uuidv4();
  await db.insert(schema.hubs).values({
    id: alabamaHubId,
    name: 'North Alabama Hub',
    slug: 'north-alabama-hub',
    city: 'Huntsville',
    state: 'AL',
    zipCode: '35801',
    description: 'Expanding into the Rocket City area.',
  });

  await db.insert(schema.buildings).values([{
    id: uuidv4(),
    hubId: alabamaHubId,
    name: 'The Edison at Madison',
    address: '100 Edison Dr',
    city: 'Madison',
    state: 'AL',
    zipCode: '35758',
  }]);

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
    }
  ];
  await db.insert(schema.users).values(users);

  // --- Initial Reviews for the Requested Properties ---
  const reviews = [
    {
      id: uuidv4(),
      userId: users[0].id,
      buildingId: tnBuildings[0].id, // Fitzroy
      rating: 5,
      title: 'Brand new and beautiful',
      comment: 'The Fitzroy is stunning. Lebanon is growing so fast!',
      videoPlaybackId: 'DS00SgjrnS012V01PhIP9zN00st01y009u9B',
      isVerifiedResident: true,
    },
    {
      id: uuidv4(),
      userId: users[1].id,
      buildingId: tnBuildings[1].id, // Edison at Peytona
      rating: 4,
      title: 'Great location in Gallatin',
      comment: 'Love being in Gallatin. The Edison is well-managed.',
      videoPlaybackId: 'G02W0201kY848GfK9O5rD00LzM01uO02N6uFh',
      isVerifiedResident: true,
    }
  ];
  await db.insert(schema.reviews).values(reviews);

  console.log('Seed complete!');
}

seed().catch(console.error);
