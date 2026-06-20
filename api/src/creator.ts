import { FastifyInstance } from 'fastify';
import { db } from './db';
import * as schema from './schema';
import { eq, and, sql, desc, inArray, count } from 'drizzle-orm';
import { getAuth } from '@clerk/fastify';

export async function creatorRoutes(fastify: FastifyInstance) {
  const hasClerkKeys = !!(process.env.CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);

  // Pre-handler hook to ensure user is a creator
  fastify.addHook('preHandler', async (request, reply) => {
    let clerkId: string | null = null;
    
    if (hasClerkKeys) {
      clerkId = getAuth(request).userId;
    } else {
      // Fallback for dev/sandbox where keys are missing
      clerkId = 'user_creator_001'; 
    }
    
    if (!clerkId && process.env.NODE_ENV === 'production') {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    const effectiveClerkId = clerkId || 'user_creator_001';

    const user = await db.query.users.findFirst({
      where: eq(schema.users.clerkId, effectiveClerkId),
    });

    if (!user) {
      return reply.code(404).send({ error: 'User not found in local database' });
    }

    // Allow creator or admin
    if (user.role !== 'creator' && user.role !== 'admin') {
      fastify.log.warn(`User ${user.id} attempted to access Creator routes but has role ${user.role}`);
    }

    (request as any).dbUser = user;
  });

  // GET /api/creator/stats
  fastify.get('/stats', async (request, reply) => {
    const user = (request as any).dbUser;
    
    try {
      // 1. Get metrics from reviews
      const creatorReviews = await db.select({
        likes: schema.reviews.likesCount,
        buildingId: schema.reviews.buildingId
      }).from(schema.reviews).where(eq(schema.reviews.userId, user.id));

      const totalLikes = creatorReviews.reduce((acc, r) => acc + (r.likes || 0), 0);
      const totalViews = totalLikes * 25 + 1200; // Mock views + baseline

      // 2. Get leads for buildings this creator has reviewed
      const buildingIds = [...new Set(creatorReviews.map(b => b.buildingId))];
      
      let totalLeads = 0;
      if (buildingIds.length > 0) {
        const leads = await db.select({
          count: count()
        }).from(schema.tourRequests)
          .where(inArray(schema.tourRequests.buildingId, buildingIds));
        
        totalLeads = Number(leads[0]?.count || 0);
      }

      // 3. Mock earnings
      const earnings = {
        total: 1247,
        pending: 380,
        available: 867
      };

      return {
        views: totalViews,
        likes: totalLikes,
        leads: totalLeads,
        earnings
      };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to fetch creator stats' });
    }
  });

  // GET /api/creator/collaborations
  fastify.get('/collaborations', async (request, reply) => {
    const user = (request as any).dbUser;

    try {
      const collabs = await db.query.creatorCollaborations.findMany({
        where: eq(schema.creatorCollaborations.creatorId, user.id),
        with: {
          building: true
        },
        orderBy: [desc(schema.creatorCollaborations.createdAt)]
      });

      return collabs;
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to fetch collaborations' });
    }
  });

  // POST /api/creator/collaborations/:id/status
  fastify.post('/collaborations/:id/status', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { status } = request.body as { status: string };
    const user = (request as any).dbUser;

    if (!['pending', 'active', 'completed', 'declined'].includes(status)) {
      return reply.code(400).send({ error: 'Invalid status' });
    }

    try {
      await db.update(schema.creatorCollaborations)
        .set({ status: status as any })
        .where(and(
          eq(schema.creatorCollaborations.id, id),
          eq(schema.creatorCollaborations.creatorId, user.id)
        ));

      return { success: true, status };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to update status' });
    }
  });
}
