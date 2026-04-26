import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";

export const list = query({
  args: {
    collectionId: v.id("collections"),
    paginationOpts: paginationOptsValidator,
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, { collectionId, paginationOpts, searchQuery }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { page: [], isDone: true, continueCursor: "" };
    if (searchQuery && searchQuery.trim()) {
      return await ctx.db
        .query("bookmarks")
        .withSearchIndex("search_title", (q) =>
          q.search("title", searchQuery).eq("collectionId", collectionId)
        )
        .paginate(paginationOpts);
    }
    return await ctx.db
      .query("bookmarks")
      .withIndex("by_collection", (q) => q.eq("collectionId", collectionId))
      .order("desc")
      .paginate(paginationOpts);
  },
});

export const create = mutation({
  args: {
    collectionId: v.id("collections"),
    title: v.string(),
    url: v.string(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, { collectionId, title, url, note }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const collection = await ctx.db.get(collectionId);
    if (!collection || collection.userId !== userId) throw new Error("Not found");
    return await ctx.db.insert("bookmarks", {
      userId,
      collectionId,
      title,
      url,
      note,
      visitCount: 0,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("bookmarks"),
    title: v.string(),
    url: v.string(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, { id, title, url, note }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const bookmark = await ctx.db.get(id);
    if (!bookmark || bookmark.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(id, { title, url, note });
  },
});

export const remove = mutation({
  args: { id: v.id("bookmarks") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const bookmark = await ctx.db.get(id);
    if (!bookmark || bookmark.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(id);
  },
});

export const visit = mutation({
  args: { id: v.id("bookmarks") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const bookmark = await ctx.db.get(id);
    if (!bookmark || bookmark.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(id, { visitCount: bookmark.visitCount + 1 });
  },
});