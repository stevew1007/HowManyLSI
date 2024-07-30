import { group } from "console";
import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
  boolean,
  json,
  real,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `howmanylsi_${name}`);

export const skills = createTable("skill", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  primaryAttribute: varchar("primary_attribute", { length: 256 }).notNull(),
  secondaryAttribute: varchar("secondary_attribute", { length: 256 }).notNull(),
  skillLevel: integer("skill_level").notNull(),
  trainingMultiplier: real("training_multiplier").notNull(),
  isOmegaOnly: boolean("is_omega_only").notNull(),
  groupId: integer("group_id")
    .notNull()
    .references(() => skillGrops.id),
  icon: varchar("icon", { length: 256 }),
  published: boolean("published").notNull(),
});

export const skillGrops = createTable("skill_group", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  published: boolean("published").notNull(),
  skillList: integer("skill_list").array().notNull(),
});
