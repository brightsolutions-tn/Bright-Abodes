import { FastifyInstance } from 'fastify';
import { db } from './db';
import * as schema from './schema';
import { eq, and, sql, desc, inArray, count } from 'drizzle-orm';
import { getAuth } from '@clerk/fastify';
import { v4 as uuidv4 } from 'uuid';

import { getOrCreateUser } from './utils';

export async function creatorRoutes(fastify: FastifyInstance) {

  // Pre-handler hook to ensure user exists and identify them
  fastify.addHook('preHandler', async (request, reply) => {
    const { userId: clerkId } = getAuth(request);
    
    if (!clerkId) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    const user = await getOrCreateUser(clerkId);

    if (!user) {
      return reply.code(500).send({ error: 'Failed to sync user' });
    }

    // Allow creator or admin for certain actions, but for base access we just need the user
    // We'll leave role checks to specific routes if needed, or keep it generic here but less restrictive
    
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

  // POST /api/creator/apply
  fastify.post('/apply', async (request, reply) => {
    const { userId: clerkId } = getAuth(request);
    
    if (!clerkId) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    const { fullName, email, city, socialHandle, videoLink } = request.body as any;

    try {
      const id = uuidv4();
      await db.insert(schema.creatorApplications).values({
        id,
        clerkId,
        fullName,
        email,
        city,
        socialHandle,
        videoLink,
        visionSyncCompleted: true, // Mocking that they've already done this or it's the start
        agreementSigned: false,
        status: 'pending'
      });

      return { success: true, applicationId: id };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to submit application' });
    }
  });

  // GET /api/creator/application-status
  fastify.get('/application-status', async (request, reply) => {
    const { userId: clerkId } = getAuth(request);

    if (!clerkId) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    try {
      const application = await db.query.creatorApplications.findFirst({
        where: eq(schema.creatorApplications.clerkId, clerkId),
        orderBy: [desc(schema.creatorApplications.createdAt)]
      });

      if (!application) {
        return { hasApplication: false };
      }

      return { hasApplication: true, application };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to fetch application status' });
    }
  });

  // POST /api/creator/sign-agreement
  fastify.post('/sign-agreement', async (request, reply) => {
    const { userId: clerkId } = getAuth(request);
    
    if (!clerkId) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    try {
      const application = await db.query.creatorApplications.findFirst({
        where: eq(schema.creatorApplications.clerkId, clerkId),
        orderBy: [desc(schema.creatorApplications.createdAt)]
      });

      if (!application) {
        return reply.code(404).send({ error: 'Application not found' });
      }

      await db.update(schema.creatorApplications)
        .set({ agreementSigned: true })
        .where(eq(schema.creatorApplications.id, application.id));

      return { success: true };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to sign agreement' });
    }
  });
}
