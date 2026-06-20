import { db } from './db';
import * as schema from './schema';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  console.log('Seeding database...');

  // --- Clear existing data ---
  console.log('Clearing existing data...');
  await db.delete(schema.buildingViews);
  await db.delete(schema.tourRequests);
  await db.delete(schema.creatorCollaborations);
  await db.delete(schema.answers);
  await db.delete(schema.questions);
  await db.delete(schema.savedItems);
  await db.delete(schema.reviewComments);
  await db.delete(schema.reviews);
  await db.delete(schema.affiliateLinks);
  await db.delete(schema.buildings);
  await db.delete(schema.hubs);
  await db.delete(schema.users);

  // --- Sample Users ---
  const pmId = uuidv4();
  const renterId1 = uuidv4();
  const renterId2 = uuidv4();
  const creatorId = uuidv4();

  const users = [
    {
      id: pmId,
      clerkId: 'user_pm_admin_123',
      email: 'sarah.manager@example.com',
      username: 'sarah_pm',
      fullName: 'Sarah Miller',
      role: 'manager' as const,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    },
    {
      id: renterId1,
      clerkId: 'user_2k0FvF5z4z4z4z4z4z4z4z4z4z',
      email: 'alex@example.com',
      username: 'alex_renter',
      fullName: 'Alex Johnson',
      role: 'renter' as const,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    },
    {
      id: renterId2,
      clerkId: 'user_3l1GvG6z5z5z5z5z5z5z5z5z5z',
      email: 'james@example.com',
      username: 'james_living',
      fullName: 'James Wilson',
      role: 'renter' as const,
    },
    {
      id: creatorId,
      clerkId: 'user_creator_001',
      email: 'creator@example.com',
      username: 'founding_creator',
      fullName: 'Emma Stone',
      role: 'creator' as const,
    }
  ];
  await db.insert(schema.users).values(users);

  // --- Music City Hub ---
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

  const buildings = [
    {
      id: uuidv4(),
      hubId: nashvilleHubId,
      name: 'Greenwood House',
      address: '123 Greenwood Ave',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37206',
      propertyManagerId: pmId,
    },
    {
      id: uuidv4(),
      hubId: nashvilleHubId,
      name: 'Maple Residences',
      address: '456 Maple St',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37203',
      propertyManagerId: pmId,
    },
    {
      id: uuidv4(),
      hubId: nashvilleHubId,
      name: 'Lakeside Apartments',
      address: '789 Lake Dr',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37214',
      propertyManagerId: pmId,
    }
  ];
  await db.insert(schema.buildings).values(buildings);

  // --- Reviews ---
  const reviews = [
    {
      id: uuidv4(),
      userId: renterId1,
      buildingId: buildings[0].id,
      rating: 5,
      title: 'Stunning place',
      comment: 'Very clean and well-maintained property. Love the vibe!',
      isVerifiedResident: true,
    },
    {
      id: uuidv4(),
      userId: renterId2,
      buildingId: buildings[1].id,
      rating: 4,
      title: 'Great location',
      comment: 'The location is unbeatable, but parking is a bit tight.',
      isVerifiedResident: true,
    }
  ];
  await db.insert(schema.reviews).values(reviews);

  // --- Creator Collaborations (Active Tours) ---
  await db.insert(schema.creatorCollaborations).values([
    {
      id: uuidv4(),
      creatorId: creatorId,
      buildingId: buildings[0].id,
      status: 'active',
      dealTerms: '1 video tour per month',
    },
    {
      id: uuidv4(),
      creatorId: creatorId,
      buildingId: buildings[1].id,
      status: 'active',
    }
  ]);

  // --- Tour Requests (Leads) ---
  await db.insert(schema.tourRequests).values([
    {
      id: uuidv4(),
      buildingId: buildings[0].id,
      userId: renterId1,
      status: 'pending',
    },
    {
      id: uuidv4(),
      buildingId: buildings[1].id,
      userId: renterId2,
      status: 'pending',
    }
  ]);

  // --- Building Views ---
  await db.insert(schema.buildingViews).values([
    { id: uuidv4(), buildingId: buildings[0].id },
    { id: uuidv4(), buildingId: buildings[0].id },
    { id: uuidv4(), buildingId: buildings[1].id },
  ]);

  console.log('Seed complete!');
}

seed().catch(console.error);
