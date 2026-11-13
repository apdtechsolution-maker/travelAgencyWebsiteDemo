import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  kind: text("kind").notNull(), // quote | callback | visa | token
  name: text("name"),
  phone: text("phone"),
  destination: text("destination"),
  message: text("message"),
  totalInr: integer("total_inr"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
