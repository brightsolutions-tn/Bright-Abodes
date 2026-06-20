import { FastifyInstance } from 'fastify';
import { db } from './db';
import * as schema from './schema';
import { eq, avg, count, sql } from 'drizzle-orm';

export function calculateTrustScore(reviews: any[]) {
  const totalReviews = reviews.length;
  if (totalReviews === 0) {
    return {
      score: 0,
      breakdown: { rating: 0, verification: 0, authenticity: 0 },
      stats: { totalReviews: 0, verifiedCount: 0, videoCount: 0, avgRating: '0.0' }
    };
  }

  const avgRating = reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / totalReviews;
  const verifiedCount = reviews.filter(r => r.isVerifiedResident).length;
  const videoCount = reviews.filter(r => r.videoPlaybackId).length;

  const ratingScore = (avgRating / 5) * 50;
  const verificationScore = (verifiedCount / totalReviews) * 30;
  const authenticityScore = (videoCount / totalReviews) * 20;

  const totalScore = Math.round(ratingScore + verificationScore + authenticityScore);

  return {
    score: totalScore,
    breakdown: {
      rating: Math.round(ratingScore),
      verification: Math.round(verificationScore),
      authenticity: Math.round(authenticityScore),
    },
    stats: {
      totalReviews,
      verifiedCount,
      videoCount,
      avgRating: avgRating.toFixed(1)
    }
  };
}

export async function trustRoutes(fastify: FastifyInstance) {
  // GET /api/trust/:buildingId
  fastify.get('/:buildingId', async (request, reply) => {
    const { buildingId } = request.params as { buildingId: string };

    try {
      const building = await db.query.buildings.findFirst({
        where: eq(schema.buildings.id, buildingId),
        with: {
          reviews: true,
        }
      });

      if (!building) {
        return reply.code(404).send({ error: 'Building not found' });
      }

      return calculateTrustScore(building.reviews);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to calculate Trust Index' });
    }
  });

  // GET /api/trust/leaderboard
  // Returns top buildings by Trust Index
  fastify.get('/leaderboard', async (request, reply) => {
    try {
      const allBuildings = await db.query.buildings.findMany({
        with: {
          reviews: true
        }
      });

      const buildingsWithScores = allBuildings.map(b => {
        const trustData = calculateTrustScore(b.reviews);
        return {
          id: b.id,
          name: b.name,
          city: b.city,
          trustScore: trustData.score,
          reviewCount: b.reviews.length
        };
      });

      return buildingsWithScores
        .filter(b => b.reviewCount > 0)
        .sort((a, b) => b.trustScore - a.trustScore)
        .slice(0, 10);
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: 'Failed to fetch leaderboard' });
    }
  });
}
