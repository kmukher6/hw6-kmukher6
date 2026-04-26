import { createFileRoute } from "@tanstack/react-router";
import { usePaginatedQuery } from "convex/react";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { api } from "../../convex/_generated/api";
import CollectionCard from "@/components/collection-card";
import CreateCollectionDialog from "@/components/create-collection-dialog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function CollectionList() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.collections.list,
    {},
    { initialNumItems: 12 },
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Collections</h1>
        <CreateCollectionDialog />
      </div>
      {results.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No collections yet. Create one to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((col) => (
            <CollectionCard key={col._id} collection={col} />
          ))}
        </div>
      )}
      {status === "CanLoadMore" && (
        <div className="mt-6 flex justify-center">
          <Button variant="outline" onClick={() => loadMore(12)}>
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}

function IndexPage() {
  return (
    <>
      <AuthLoading>
        <p className="text-muted-foreground">Loading...</p>
      </AuthLoading>
      <Unauthenticated>
        <div className="py-20 text-center">
          <p className="text-xl font-semibold">Sign in to manage your bookmarks</p>
          <p className="mt-2 text-muted-foreground">Save and organize links in one place.</p>
        </div>
      </Unauthenticated>
      <Authenticated>
        <CollectionList />
      </Authenticated>
    </>
  );
}