import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  clerkId: text('clerk_id').unique(),
  email: text('email').unique().notNull(),
  username: text('username').unique().notNull(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  role: text('role', { enum: ['renter', 'creator', 'manager', 'admin'] }).default('renter'),
  bio: text('bio'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(reviews),
  comments: many(reviewComments),
  savedItems: many(savedItems),
  questions: many(questions),
  answers: many(answers),
}));

export const hubs = sqliteTable('hubs', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  city: text('city').notNull(),
  state: text('state'),
  zipCode: text('zip_code'),
  description: text('description'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const hubsRelations = relations(hubs, ({ many }) => ({
  buildings: many(buildings),
}));

export const buildings = sqliteTable('buildings', {
  id: text('id').primaryKey(),
  hubId: text('hub_id').references(() => hubs.id),
  name: text('name').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zipCode: text('zip_code').notNull(),
  latitude: real('latitude'),
  longitude: real('longitude'),
  websiteUrl: text('website_url'),
  propertyManagerId: text('property_manager_id').references(() => users.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const buildingsRelations = relations(buildings, ({ one, many }) => ({
  hub: one(hubs, {
    fields: [buildings.hubId],
    references: [hubs.id],
  }),
  reviews: many(reviews),
  questions: many(questions),
}));

export const reviews = sqliteTable('reviews', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  buildingId: text('building_id').notNull().references(() => buildings.id),
  rating: integer('rating'),
  title: text('title'),
  comment: text('comment'),
  videoMuxAssetId: text('video_mux_asset_id'),
  videoPlaybackId: text('video_playback_id'),
  thumbnailUrl: text('thumbnail_url'),
  isVerifiedResident: integer('is_verified_resident', { mode: 'boolean' }).default(false),
  likesCount: integer('likes_count').default(0),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  building: one(buildings, {
    fields: [reviews.buildingId],
    references: [buildings.id],
  }),
  comments: many(reviewComments),
}));

export const reviewComments = sqliteTable('review_comments', {
  id: text('id').primaryKey(),
  reviewId: text('review_id').notNull().references(() => reviews.id),
  userId: text('user_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const reviewCommentsRelations = relations(reviewComments, ({ one }) => ({
  review: one(reviews, {
    fields: [reviewComments.reviewId],
    references: [reviews.id],
  }),
  user: one(users, {
    fields: [reviewComments.userId],
    references: [users.id],
  }),
}));

export const creatorCollaborations = sqliteTable('creator_collaborations', {
  id: text('id').primaryKey(),
  creatorId: text('creator_id').notNull().references(() => users.id),
  buildingId: text('building_id').notNull().references(() => buildings.id),
  status: text('status', { enum: ['pending', 'active', 'completed'] }).default('pending'),
  dealTerms: text('deal_terms'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const affiliateLinks = sqliteTable('affiliate_links', {
  id: text('id').primaryKey(),
  buildingId: text('building_id').references(() => buildings.id),
  serviceType: text('service_type'),
  url: text('url').notNull(),
  name: text('name'),
  category: text('category'),
  description: text('description'),
  clickCount: integer('click_count').default(0),
});

export const savedItems = sqliteTable('saved_items', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  itemType: text('item_type', { enum: ['building', 'review'] }).notNull(),
  itemId: text('item_id').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const savedItemsRelations = relations(savedItems, ({ one }) => ({
  user: one(users, {
    fields: [savedItems.userId],
    references: [users.id],
  }),
}));

export const questions = sqliteTable('questions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  buildingId: text('building_id').references(() => buildings.id),
  content: text('content').notNull(),
  category: text('category'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const questionsRelations = relations(questions, ({ one, many }) => ({
  user: one(users, {
    fields: [questions.userId],
    references: [users.id],
  }),
  building: one(buildings, {
    fields: [questions.buildingId],
    references: [buildings.id],
  }),
  answers: many(answers),
}));

export const answers = sqliteTable('answers', {
  id: text('id').primaryKey(),
  questionId: text('question_id').notNull().references(() => questions.id),
  userId: text('user_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  isResident: integer('is_resident', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const answersRelations = relations(answers, ({ one }) => ({
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
  user: one(users, {
    fields: [answers.userId],
    references: [users.id],
  }),
}));

export const tourRequests = sqliteTable('tour_requests', {
  id: text('id').primaryKey(),
  buildingId: text('building_id').notNull().references(() => buildings.id),
  userId: text('user_id').notNull().references(() => users.id),
  status: text('status', { enum: ['pending', 'scheduled', 'completed', 'cancelled'] }).default('pending'),
  requestedAt: text('requested_at').default(sql`CURRENT_TIMESTAMP`),
});

export const tourRequestsRelations = relations(tourRequests, ({ one }) => ({
  building: one(buildings, {
    fields: [tourRequests.buildingId],
    references: [buildings.id],
  }),
  user: one(users, {
    fields: [tourRequests.userId],
    references: [users.id],
  }),
}));

export const buildingViews = sqliteTable('building_views', {
  id: text('id').primaryKey(),
  buildingId: text('building_id').notNull().references(() => buildings.id),
  userId: text('user_id').references(() => users.id),
  viewedAt: text('viewed_at').default(sql`CURRENT_TIMESTAMP`),
});

export const buildingViewsRelations = relations(buildingViews, ({ one }) => ({
  building: one(buildings, {
    fields: [buildingViews.buildingId],
    references: [buildings.id],
  }),
}));
