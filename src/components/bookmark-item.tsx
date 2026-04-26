import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Trash } from "lucide-react";
import EditBookmarkDialog from "@/components/edit-bookmark-dialog";

type BookmarkItemProps = {
  bookmark: Doc<"bookmarks">;
};

function BookmarkItem({ bookmark }: BookmarkItemProps) {
  const visit = useMutation(api.bookmarks.visit);
  const remove = useMutation(api.bookmarks.remove);

  async function handleVisit() {
    await visit({ id: bookmark._id });
    window.open(bookmark.url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border bg-card p-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <button
            onClick={handleVisit}
            className="flex items-center gap-1.5 text-left text-sm font-medium hover:underline"
          >
            {bookmark.title}
            <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
          </button>
          {bookmark.visitCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {bookmark.visitCount} visit{bookmark.visitCount !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{bookmark.url}</p>
        {bookmark.note && (
          <p className="mt-1 text-sm text-muted-foreground">{bookmark.note}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <EditBookmarkDialog bookmark={bookmark} />
        <Button variant="ghost" size="icon" onClick={() => remove({ id: bookmark._id })}>
          <Trash className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}

export default BookmarkItem;