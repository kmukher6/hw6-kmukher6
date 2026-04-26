import { Link } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Doc } from "../../convex/_generated/dataModel";
import { Folder } from "lucide-react";

type CollectionCardProps = {
  collection: Doc<"collections">;
};

function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link to="/collections/$collectionId" params={{ collectionId: collection._id as string }}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Folder className="h-4 w-4 text-muted-foreground" />
            {collection.name}
          </CardTitle>
        </CardHeader>
        {collection.description && (
          <CardContent>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {collection.description}
            </p>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}

export default CollectionCard;