import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { clerkPlugin, getAuth } from '@clerk/fastify'
import Mux from '@mux/mux-node'
import { db } from './db'
import * as schema from './schema'
import { eq, and, like, desc } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

const fastify = Fastify({
  logger: true
})

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : '*'

fastify.register(cors, {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
})

const hasClerkKeys = process.env.CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY

if (hasClerkKeys) {
  fastify.register(clerkPlugin)
} else {
  fastify.log.warn('Clerk keys missing. Auth endpoints will be disabled or bypassed.')
}

// --- Helpers ---

const getOrCreateUser = async (clerkId: string) => {
  let user = await db.query.users.findFirst({ where: eq(schema.users.clerkId, clerkId) })
  if (!user) {
    const newUserId = uuidv4()
    await db.insert(schema.users).values({
      id: newUserId,
      clerkId,
      email: `${clerkId}@placeholder.com`,
      username: `user_${clerkId.slice(-6)}`,
    })
    user = (await db.query.users.findFirst({ where: eq(schema.users.id, newUserId) })) as any
  }
  return user
}

// --- Auth Endpoints ---

fastify.get('/api/me', async (request, reply) => {
  const userId = hasClerkKeys ? getAuth(request).userId : 'user_2k0FvF5z4z4z4z4z4z4z4z4z4z' // Use a seeded clerkId
  
  if (!userId) {
    return reply.code(401).send({ error: 'Unauthorized' })
  }

  const user = await getOrCreateUser(userId)
  return user
})

// --- Hubs Endpoints ---

fastify.get('/api/hubs', async (request, reply) => {
  const { city, state, name } = request.query as { city?: string, state?: string, name?: string }
  try {
    const filters = []
    if (city) filters.push(like(schema.hubs.city, `%${city}%`))
    if (state) filters.push(eq(schema.hubs.state, state))
    if (name) filters.push(like(schema.hubs.name, `%${name}%`))

    let query = db.select().from(schema.hubs)
    if (filters.length > 0) {
      // @ts-ignore
      query = query.where(and(...filters))
    }
    
    const hubs = await query
    return hubs
  } catch (err) {
    fastify.log.error(err)
    return reply.code(500).send({ error: 'Failed to fetch hubs' })
  }
})

fastify.get('/api/hubs/:slug', async (request, reply) => {
  const { slug } = request.params as { slug: string }
  try {
    const hub = await db.query.hubs.findFirst({
      where: eq(schema.hubs.slug, slug),
      with: {
        buildings: true
      }
    })
    if (!hub) {
      return reply.code(404).send({ error: 'Hub not found' })
    }
    return hub
  } catch (err) {
    fastify.log.error(err)
    return reply.code(500).send({ error: 'Failed to fetch hub' })
  }
})

// --- Buildings Endpoints ---

fastify.get('/api/buildings', async (request, reply) => {
  const { city, state, hubId, name } = request.query as { city?: string, state?: string, hubId?: string, name?: string }
  
  try {
    const filters = []
    if (city) filters.push(like(schema.buildings.city, `%${city}%`))
    if (state) filters.push(eq(schema.buildings.state, state))
    if (hubId) filters.push(eq(schema.buildings.hubId, hubId))
    if (name) filters.push(like(schema.buildings.name, `%${name}%`))

    let query = db.select().from(schema.buildings)
    if (filters.length > 0) {
      // @ts-ignore
      query = query.where(and(...filters))
    }

    const buildings = await query
    return buildings
  } catch (err) {
    fastify.log.error(err)
    return reply.code(500).send({ error: 'Failed to fetch buildings' })
  }
})

fastify.get('/api/buildings/:id', async (request, reply) => {
  const { id } = request.params as { id: string }
  try {
    const building = await db.query.buildings.findFirst({
      where: eq(schema.buildings.id, id),
      with: {
        hub: true,
        reviews: {
          with: {
            user: true
          }
        },
        questions: {
          with: {
            user: true,
            answers: {
              with: {
                user: true
              }
            }
          }
        }
      }
    })
    if (!building) {
      return reply.code(404).send({ error: 'Building not found' })
    }
    return building
  } catch (err) {
    fastify.log.error(err)
    return reply.code(500).send({ error: 'Failed to fetch building' })
  }
})

// --- Reviews Endpoints ---

fastify.get('/api/reviews', async (request, reply) => {
  try {
    const reviews = await db.query.reviews.findMany({
      with: {
        user: true,
        building: true
      },
      orderBy: [desc(schema.reviews.createdAt)]
    })
    return reviews
  } catch (err) {
    fastify.log.error(err)
    return reply.code(500).send({ error: 'Failed to fetch global reviews' })
  }
})

fastify.get('/api/buildings/:id/reviews', async (request, reply) => {
  const { id } = request.params as { id: string }
  try {
    const reviews = await db.query.reviews.findMany({
      where: eq(schema.reviews.buildingId, id),
      with: {
        user: true,
      },
      orderBy: [desc(schema.reviews.createdAt)]
    })
    return reviews
  } catch (err) {
    fastify.log.error(err)
    return reply.code(500).send({ error: 'Failed to fetch reviews' })
  }
})

fastify.post('/api/reviews', async (request, reply) => {
  if (!hasClerkKeys) return reply.code(500).send({ error: 'Auth not configured' })
  const { userId } = getAuth(request)
  if (!userId) {
    return reply.code(401).send({ error: 'Unauthorized' })
  }

  const { buildingId, rating, comment, videoMuxAssetId, videoPlaybackId, thumbnailUrl, isVerifiedResident, title } = request.body as any
  
  try {
    const user = await getOrCreateUser(userId)

    const reviewId = uuidv4()
    await db.insert(schema.reviews).values({
      id: reviewId,
      userId: user!.id,
      buildingId,
      rating,
      comment,
      videoMuxAssetId,
      videoPlaybackId,
      thumbnailUrl,
      isVerifiedResident,
      title,
    })

    return { reviewId }
  } catch (err) {
    fastify.log.error(err)
    return reply.code(500).send({ error: 'Failed to create review' })
  }
})

// --- Comments Endpoints ---

fastify.get('/api/reviews/:id/comments', async (request, reply) => {
  const { id } = request.params as { id: string }
  try {
    const comments = await db.query.reviewComments.findMany({
      where: eq(schema.reviewComments.reviewId, id),
      with: {
        user: true,
      },
      orderBy: [desc(schema.reviewComments.createdAt)]
    })
    return comments
  } catch (err) {
    fastify.log.error(err)
    return reply.code(500).send({ error: 'Failed to fetch comments' })
  }
})

fastify.post('/api/comments', async (request, reply) => {
  if (!hasClerkKeys) return reply.code(500).send({ error: 'Auth not configured' })
  const { userId } = getAuth(request)
  if (!userId) {
    return reply.code(401).send({ error: 'Unauthorized' })
  }

  const { reviewId, content } = request.body as any

  try {
    const user = await getOrCreateUser(userId)

    const commentId = uuidv4()
    await db.insert(schema.reviewComments).values({
      id: commentId,
      reviewId,
      userId: user!.id,
      content,
    })

    return { commentId }
  } catch (err) {
    fastify.log.error(err)
    return reply.code(500).send({ error: 'Failed to create comment' })
  }
})

// --- Saved Items Endpoints ---

fastify.get('/api/saved', async (request, reply) => {
  if (!hasClerkKeys) return reply.code(500).send({ error: 'Auth not configured' })
  const { userId } = getAuth(request)
  if (!userId) {
    return reply.code(401).send({ error: 'Unauthorized' })
  }

  try {
    const user = await getOrCreateUser(userId)
    const savedItems = await db.query.savedItems.findMany({
      where: eq(schema.savedItems.userId, user!.id),
      orderBy: [desc(schema.savedItems.createdAt)]
    })

    // Fetch details for each item
    const detailedItems = await Promise.all(savedItems.map(async (item) => {
      if (item.itemType === 'building') {
        const building = await db.query.buildings.findFirst({
          where: eq(schema.buildings.id, item.itemId)
        })
        return { ...item, building }
      } else {
        const review = await db.query.reviews.findFirst({
          where: eq(schema.reviews.id, item.itemId),
          with: { user: true, building: true }
        })
        return { ...item, review }
      }
    }))

    return detailedItems
  } catch (err) {
    fastify.log.error(err)
    return reply.code(500).send({ error: 'Failed to fetch saved items' })
  }
})

fastify.post('/api/saved/toggle', async (request, reply) => {
  if (!hasClerkKeys) return reply.code(500).send({ error: 'Auth not configured' })
  const { userId } = getAuth(request)
  if (!userId) {
    return reply.code(401).send({ error: 'Unauthorized' })
  }

  const { itemType, itemId } = request.body as { itemType: 'building' | 'review', itemId: string }

  try {
    const user = await getOrCreateUser(userId)
    const existing = await db.query.savedItems.findFirst({
      where: and(
        eq(schema.savedItems.userId, user!.id),
        eq(schema.savedItems.itemType, itemType),
        eq(schema.savedItems.itemId, itemId)
      )
    })

    if (existing) {
      await db.delete(schema.savedItems).where(eq(schema.savedItems.id, existing.id))
      return { status: 'unsaved' }
    } else {
      const id = uuidv4()
      await db.insert(schema.savedItems).values({
        id,
        userId: user!.id,
        itemType,
        itemId
      })
      return { status: 'saved', id }
    }
  } catch (err) {
    fastify.log.error(err)
    return reply.code(500).send({ error: 'Failed to toggle save' })
  }
})

// --- Questions & Answers Endpoints ---

fastify.get('/api/questions', async (request, reply) => {
  const { buildingId } = request.query as { buildingId?: string }
  try {
    const filters = []
    if (buildingId) filters.push(eq(schema.questions.buildingId, buildingId))

    const questions = await db.query.questions.findMany({
      // @ts-ignore
      where: filters.length > 0 ? and(...filters) : undefined,
      with: {
        user: true,
        building: true,
        answers: {
          with: {
            user: true
          }
        }
      },
      orderBy: [desc(schema.questions.createdAt)]
    })
    return questions
  } catch (err) {
    fastify.log.error(err)
    return reply.code(500).send({ error: 'Failed to fetch questions' })
  }
})

fastify.post('/api/questions', async (request, reply) => {
  if (!hasClerkKeys) return reply.code(500).send({ error: 'Auth not configured' })
  const { userId } = getAuth(request)
  if (!userId) {
    return reply.code(401).send({ error: 'Unauthorized' })
  }

  const { buildingId, content, category } = request.body as any

  try {
    const user = await getOrCreateUser(userId)
    const id = uuidv4()
    await db.insert(schema.questions).values({
      id,
      userId: user!.id,
      buildingId,
      content,
      category
    })
    return { id }
  } catch (err) {
    fastify.log.error(err)
    return reply.code(500).send({ error: 'Failed to create question' })
  }
})

fastify.post('/api/answers', async (request, reply) => {
  if (!hasClerkKeys) return reply.code(500).send({ error: 'Auth not configured' })
  const { userId } = getAuth(request)
  if (!userId) {
    return reply.code(401).send({ error: 'Unauthorized' })
  }

  const { questionId, content, isResident } = request.body as any

  try {
    const user = await getOrCreateUser(userId)
    const id = uuidv4()
    await db.insert(schema.answers).values({
      id,
      questionId,
      userId: user!.id,
      content,
      isResident
    })
    return { id }
  } catch (err) {
    fastify.log.error(err)
    return reply.code(500).send({ error: 'Failed to create answer' })
  }
})

// --- User Endpoints ---

fastify.get('/api/users/:id', async (request, reply) => {
  const { id } = request.params as { id: string }
  try {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, id),
      with: {
        reviews: {
          with: { building: true }
        }
      }
    })
    if (!user) return reply.code(404).send({ error: 'User not found' })
    return user
  } catch (err) {
    fastify.log.error(err)
    return reply.code(500).send({ error: 'Failed to fetch user' })
  }
})

// --- Video Endpoints ---

fastify.post('/api/uploads', async (request, reply) => {
  if (!hasClerkKeys) return reply.code(500).send({ error: 'Auth not configured' })
  const { userId } = getAuth(request)
  if (!userId) {
    return reply.code(401).send({ error: 'Unauthorized' })
  }

  const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET,
  })

  try {
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        playback_policy: ['public'],
        encoding_tier: 'smart',
      },
      cors_origin: '*',
    })

    return { uploadUrl: upload.url, uploadId: upload.id }
  } catch (err) {
    fastify.log.error(err)
    return reply.code(500).send({ error: 'Failed to create upload' })
  }
})

// --- Health Check ---

fastify.get('/api/health', async () => {
  return { status: 'ok', auth: hasClerkKeys ? 'enabled' : 'disabled' }
})

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
// trigger
