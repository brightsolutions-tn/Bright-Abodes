import { FastifyInstance } from 'fastify';
import { db } from './db';
import * as schema from './schema';
import { v4 as uuidv4 } from 'uuid';

export async function partnerRoutes(fastify: FastifyInstance) {
  // POST /api/partner-inquiries
  fastify.post('/partner-inquiries', async (request, reply) => {
    const { 
      companyName, 
      websiteUrl, 
      serviceCategory, 
      targetCities, 
      integrationLevel, 
      contactName, 
      contactEmail, 
      contactPhone 
    } = request.body as any;

    try {
      const id = uuidv4();
      await db.insert(schema.partnerInquiries).values({
        id,
        companyName,
        websiteUrl,
        serviceCategory,
        targetCities: Array.isArray(targetCities) ? targetCities.join(',') : targetCities,
        integrationLevel,
        contactName,
        contactEmail,
        contactPhone,
        status: 'new'
      });

      return { success: true, inquiryId: id };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to submit partner inquiry' });
    }
  });
}
