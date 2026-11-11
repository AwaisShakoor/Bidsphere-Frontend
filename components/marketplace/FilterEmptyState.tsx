import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";

export function FilterEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <EmptyState
      title="No items match your filters"
      description="Try another category or clear your search."
      action={
        <Button type="button" variant="outline" size="sm" onClick={onClear}>
          Clear filters
        </Button>
      }
    />
  );
}
