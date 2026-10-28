import { int, sqliteTable, text, real, unique  } from "drizzle-orm/sqlite-core";
import { user } from "./auth";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";

export const location = sqliteTable(
  "location",
  {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    slug: text().notNull().unique(),
    description: text(),
    lat: real().notNull(),
    long: real().notNull(),
    userId: int()
      .notNull()
      .references(() => user.id),
    createdAt: int()
      .notNull()
      .$default(() => Date.now()),
    updatedAt: int()
      .notNull()
      .$default(() => Date.now())
      .$onUpdate(() => Date.now()),
  },
  (t) => [unique().on(t.name, t.userId)],
);

export const insertLocation = createInsertSchema(location, {
  name: (field) => field.min(1).max(100),
  description: (field) => field.max(1000),
  lat: (field) => field.min(-90).max(90),
  long: (field) => field.min(-180).max(180),
}).omit({
  userId: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertLocation = z.infer<typeof insertLocation>;
