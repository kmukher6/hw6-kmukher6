import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const run = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const col1 = await ctx.db.insert("collections", {
      userId,
      name: "Dev Resources",
      description: "Useful links for development",
    });
    const col2 = await ctx.db.insert("collections", {
      userId,
      name: "Reading List",
      description: "Articles to read later",
    });
    await ctx.db.insert("bookmarks", {
      userId,
      collectionId: col1,
      title: "Convex Docs",
      url: "https://docs.convex.dev",
      note: "Official Convex documentation",
      visitCount: 0,
    });
    await ctx.db.insert("bookmarks", {
      userId,
      collectionId: col1,
      title: "TanStack Router",
      url: "https://tanstack.com/router",
      note: "Type-safe routing for React",
      visitCount: 0,
    });
    await ctx.db.insert("bookmarks", {
      userId,
      collectionId: col2,
      title: "React 19 Blog Post",
      url: "https://react.dev/blog/2024/12/05/react-19",
      note: "What's new in React 19",
      visitCount: 0,
    });
  },
});