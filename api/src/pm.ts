import { FastifyInstance } from 'fastify';
import { db } from './db';
import * as schema from './schema';
import { eq, and, sql, desc, count, avg, inArray } from 'drizzle-orm';
import { getAuth } from '@clerk/fastify';

export async function pmRoutes(fastify: FastifyInstance) {
  const hasClerkKeys = !!(process.env.CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);

  // Pre-handler hook to ensure user is a property manager
  fastify.addHook('preHandler', async (request, reply) => {
    const { userId: clerkId } = getAuth(request);
    
    if (!clerkId) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    const user = await db.query.users.findFirst({
      where: eq(schema.users.clerkId, clerkId),
    });

    if (!user) {
      return reply.code(404).send({ error: 'User not found in local database' });
    }

    if (user.role !== 'manager' && user.role !== 'admin') {
      fastify.log.warn(`User ${user.id} attempted to access PM routes but has role ${user.role}`);
    }

    (request as any).dbUser = user;
  });

  // GET /api/pm/stats
  fastify.get('/stats', async (request, reply) => {
    const user = (request as any).dbUser;
    
    const managedBuildings = await db.query.buildings.findMany({
      where: eq(schema.buildings.propertyManagerId, user.id),
    });

    const buildingIds = managedBuildings.map((b) => b.id);
    if (buildingIds.length === 0) {
      return { totalBuildings: 0, activeTours: 0, avgSentiment: 0, leadsThisMonth: 0 };
    }

    // Avg Sentiment
    const sentimentResult = await db.select({
      value: avg(schema.reviews.rating)
    }).from(schema.reviews).where(inArray(schema.reviews.buildingId, buildingIds));

    // Leads This Month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const leadsResult = await db.select({
      count: count()
    }).from(schema.tourRequests)
      .where(and(
        inArray(schema.tourRequests.buildingId, buildingIds),
        sql`${schema.tourRequests.requestedAt} >= ${firstDayOfMonth}`
      ));

    // Active Tours
    const toursResult = await db.select({
      count: count()
    }).from(schema.creatorCollaborations)
      .where(and(
        inArray(schema.creatorCollaborations.buildingId, buildingIds),
        eq(schema.creatorCollaborations.status, 'active')
      ));

    return {
      totalBuildings: managedBuildings.length,
      activeTours: toursResult[0]?.count || 0,
      avgSentiment: parseFloat(sentimentResult[0]?.value || '0').toFixed(1),
      leadsThisMonth: leadsResult[0]?.count || 0,
    };
  });

  // GET /api/pm/buildings
  fastify.get('/buildings', async (request, reply) => {
    const user = (request as any).dbUser;

    const managedBuildings = await db.query.buildings.findMany({
      where: eq(schema.buildings.propertyManagerId, user.id),
      with: {
        reviews: true,
      }
    });

    // Calculate sentiment for each building
    const buildingsWithSentiment = managedBuildings.map(b => {
      const totalRating = b.reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
      const avgRating = b.reviews.length > 0 ? (totalRating / b.reviews.length).toFixed(1) : '0.0';
      return {
        id: b.id,
        name: b.name,
        address: b.address,
        city: b.city,
        state: b.state,
        avgSentiment: avgRating,
        reviewCount: b.reviews.length,
      };
    });

    return buildingsWithSentiment;
  });

  // GET /api/pm/reviews
  fastify.get('/reviews', async (request, reply) => {
    const user = (request as any).dbUser;

    const managedBuildings = await db.query.buildings.findMany({
      where: eq(schema.buildings.propertyManagerId, user.id),
      columns: { id: true }
    });

    const buildingIds = managedBuildings.map(b => b.id);
    if (buildingIds.length === 0) return [];

    const reviews = await db.query.reviews.findMany({
      where: inArray(schema.reviews.buildingId, buildingIds),
      with: {
        user: true,
        building: true,
      },
      orderBy: [desc(schema.reviews.createdAt)],
      limit: 20
    });

    return reviews;
  });

  // GET /api/pm/buildings/:id/analytics
  fastify.get('/buildings/:id/analytics', async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = (request as any).dbUser;

    // Verify PM owns this building
    const building = await db.query.buildings.findFirst({
      where: and(
        eq(schema.buildings.id, id),
        eq(schema.buildings.propertyManagerId, user.id)
      )
    });

    if (!building) {
      return reply.code(403).send({ error: 'Building not found or access denied' });
    }

    // Mock trend data for now (MVP)
    const sentimentTrends = [
      { month: 'Jan', sentiment: 4.2 },
      { month: 'Feb', sentiment: 4.5 },
      { month: 'Mar', sentiment: 4.3 },
      { month: 'Apr', sentiment: 4.6 },
      { month: 'May', sentiment: 4.8 },
      { month: 'Jun', sentiment: 4.7 },
    ];

    const leadGeneration = [
      { building: building.name, views: 572, tourRequests: 23, conversionRate: '4.0%' },
    ];

    return {
      buildingName: building.name,
      sentimentTrends,
      leadGeneration,
      // For demand heat map, we'd need time-series data of views/requests
      demandHeatMap: [
        { week: 'Week 1', level: 0.4 },
        { week: 'Week 2', level: 0.7 },
        { week: 'Week 3', level: 0.9 },
        { week: 'Week 4', level: 0.5 },
      ]
    };
  });
}
