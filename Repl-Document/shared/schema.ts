import { pgTable, text, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  answer: text("answer").notNull(),
  timeSpentSeconds: integer("time_spent_seconds").notNull(),
  mouseMoves: integer("mouse_moves").notNull(),
  hoverCount: integer("hover_count").notNull(),
  riskScore: real("risk_score").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  createdAt: true
});

export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
