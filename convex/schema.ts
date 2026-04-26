import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  collections: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
  }).index("by_user", ["userId"]),
  bookmarks: defineTable({
    userId: v.id("users"),
    collectionId: v.id("collections"),
    title: v.string(),
    url: v.string(),
    note: v.optional(v.string()),
    visitCount: v.number(),
  })
    .index("by_collection", ["collectionId"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["collectionId"],
    }),
});