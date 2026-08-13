import {
  mysqlTable,
  varchar,
  int,
  mysqlEnum,
  timestamp,
  text,
  json,
  boolean,
} from "drizzle-orm/mysql-core";

// ============ USERS ============
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  steamId: varchar("steam_id", { length: 64 }).unique(),
  username: varchar("username", { length: 64 }).unique(),
  passwordHash: varchar("password_hash", { length: 255 }),
  displayName: varchar("display_name", { length: 128 }).notNull(),
  role: mysqlEnum("role", ["user", "admin", "superadmin"]).notNull().default("user"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============ SESSIONS ============
export const sessions = mysqlTable("sessions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: int("user_id").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============ SOLDIERS ============
export const soldiers = mysqlTable("soldiers", {
  cid: varchar("cid", { length: 16 }).primaryKey(),
  steamId: varchar("steam_id", { length: 64 }).unique(),

  nickname: varchar("nickname", { length: 128 }),
  rank: varchar("rank", { length: 128 }),
  rankSince: varchar("rank_since", { length: 32 }),
  onlineTotalHours: int("online_total_hours").notNull().default(0),
  onlineSessions: int("online_sessions").notNull().default(0),
  unitLevel: int("unit_level").notNull().default(0),
  recentSessions: json("recent_sessions").notNull().default([]),
  lastSyncedAt: timestamp("last_synced_at"),

  callsignOverride: varchar("callsign_override", { length: 128 }),
  positions: json("positions").notNull().default([]),
  squads: json("squads").notNull().default([]),
  attached: json("attached").notNull().default([]),
  medals: json("medals").notNull().default([]),
  manualCompleted: json("manual_completed").notNull().default([]),
  reprimands: int("reprimands").notNull().default(0),
  reprimandsFrozen: boolean("reprimands_frozen").notNull().default(false),
  status: varchar("status", { length: 64 }).notNull().default("active"),
  leaveUntil: varchar("leave_until", { length: 32 }),
  reserveUntil: varchar("reserve_until", { length: 32 }),
  joinDate: varchar("join_date", { length: 32 }),
  discordId: varchar("discord_id", { length: 64 }),
  avatar: varchar("avatar", { length: 512 }),
  commandRole: varchar("command_role", { length: 128 }),
  commandOrder: int("command_order"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// ============ RANKS ============
export const ranks = mysqlTable("ranks", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  order: int("order").notNull(),
  description: text("description"),
});

// ============ RANK REQUIREMENTS ============
export const rankRequirements = mysqlTable("rank_requirements", {
  id: int("id").autoincrement().primaryKey(),
  rankId: int("rank_id").notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["auto", "manual"]).notNull().default("manual"),
  metric: varchar("metric", { length: 64 }),
  threshold: int("threshold"),
});

// ============ DOCUMENTS ============
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  url: varchar("url", { length: 512 }).notNull(),
  category: varchar("category", { length: 64 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// ============ AUDIT LOGS ============
export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  action: varchar("action", { length: 32 }).notNull(),
  entityType: varchar("entity_type", { length: 64 }).notNull(),
  entityId: varchar("entity_id", { length: 64 }).notNull(),
  beforeData: json("before_data"),
  afterData: json("after_data"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============ BLACKLIST / TRAITORS ============
export const blacklist = mysqlTable("blacklist", {
  id: int("id").autoincrement().primaryKey(),
  number: varchar("number", { length: 32 }).notNull(),
  callsign: varchar("callsign", { length: 128 }).notNull(),
  steamId: varchar("steam_id", { length: 64 }).notNull(),
  reason: text("reason").notNull(),
  addedBy: int("added_by").notNull(),
  addedDate: varchar("added_date", { length: 32 }).notNull(),
  workoff: varchar("workoff", { length: 128 }).notNull(),
  status: mysqlEnum("status", ["TRIALS", "EXILED", "BANNED"]).notNull().default("BANNED"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ============ ZERGS ============
export const zergs = mysqlTable("zergs", {
  id: varchar("id", { length: 64 }).primaryKey(),
name: varchar("name", { length: 128 }).notNull(),
  danger: mysqlEnum("danger", ["низкий", "средний", "высокий"]).notNull(),
  hp: int("hp").notNull(),
  attacks: json("attacks").notNull().default([]), // [{type, range, damage}]
  recommendations: text("recommendations").notNull(),
  description: text("description").notNull(),
  image: varchar("image", { length: 512 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// ============ DROIDS ============
export const droids = mysqlTable("droids", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  hp: int("hp").notNull(),
  weapon: varchar("weapon", { length: 255 }).notNull(),
  defenseLevel: varchar("defense_level", { length: 64 }).notNull(),
  dangerLevel: varchar("danger_level", { length: 64 }).notNull(),
  tactics: text("tactics").notNull(),
  features: text("features").notNull(),
  image: varchar("image", { length: 512 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});
