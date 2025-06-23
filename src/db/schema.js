import {pgTable, serial, text, timestamp, integer} from 'drizzle-orm/pg-core';


export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  recipId: text('recip_id').notNull(),
  title: text('title').notNull(),
  image: text('image').notNull(),
  cookTime: text('cook_time').notNull(),
  servings: integer('servings').notNull(),
  createdAt: timestamp('created_at', {mode: 'string'}).defaultNow(),
});