import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import BookmarkItem from "@/components/bookmark-item";
import CreateBookmarkDialog from "@/components/create-bookmark-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trash, X } from "lucide-react";

export const Route = createFileRoute("/collections/$collectionId")({
  component: CollectionPage,
});

function CollectionPage() {
  const { collectionId } = Route.useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const isSearching = searchQuery.trim().length > 0;

  const collection = useQuery(api.collections.get, {
    id: collectionId as Id<"collections">,
  });

  const { results, status, loadMore } = usePaginatedQuery(
    api.bookmarks.list,
    collection
      ? {
          collectionId: collectionId as Id<"collections">,
          searchQuery: isSearching ? searchQuery.trim() : undefined,
        }
      : "skip",
    { initialNumItems: 20 },
  );

  const removeCollection = useMutation(api.collections.remove);

  async function handleDelete() {
    await removeCollection({ id: collectionId as Id<"collections"> });
    navigate({ to: "/" });
  }

  if (collection === undefined) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  if (collection === null) {
    return <p className="text-destructive">Collection not found.</p>;
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">{collection.name}</h1>
          {collection.description && (
            <p className="mt-1 text-sm text-muted-foreground">{collection.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <CreateBookmarkDialog collectionId={collectionId as Id<"collections">} />
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search bookmarks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0.5 top-0.5 h-8 w-8"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {results.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          {isSearching ? "No bookmarks found." : "No bookmarks yet. Add one to get started."}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {results.map((bookmark) => (
            <BookmarkItem key={bookmark._id} bookmark={bookmark} />
          ))}
        </div>
      )}

      {!isSearching && status === "CanLoadMore" && (
        <div className="mt-6 flex justify-center">
          <Button variant="outline" onClick={() => loadMore(20)}>
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}