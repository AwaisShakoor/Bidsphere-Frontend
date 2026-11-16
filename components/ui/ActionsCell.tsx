"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ActionsCellProps = {
  editDisabled?: boolean;
  deleteDisabled?: boolean;
  disabled?: boolean;
  editTooltip?: string;
  deleteTooltip?: string;
  onEdit: () => void;
  onDelete: () => void;
};

export function ActionsCell({
  editDisabled,
  deleteDisabled,
  disabled = false,
  editTooltip = "Edit",
  deleteTooltip = "Delete",
  onEdit,
  onDelete,
}: ActionsCellProps) {
  const isEditDisabled = editDisabled ?? disabled;
  const isDeleteDisabled = deleteDisabled ?? disabled;

  return (
    <div className="flex items-center justify-end gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 text-primary hover:bg-primary/10 hover:text-primary"
              disabled={isEditDisabled}
              onClick={(event) => {
                event.stopPropagation();
                onEdit();
              }}
            >
              <Pencil className="size-4" />
              <span className="sr-only">{editTooltip}</span>
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>{editTooltip}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
              disabled={isDeleteDisabled}
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="size-4" />
              <span className="sr-only">{deleteTooltip}</span>
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>{deleteTooltip}</TooltipContent>
      </Tooltip>
    </div>
  );
}
