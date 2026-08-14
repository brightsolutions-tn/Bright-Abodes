import { db } from './db';
import * as schema from './schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export const getOrCreateUser = async (clerkId: string) => {
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
