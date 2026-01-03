import { Button } from "@ui/button";
import { ShareIcon } from "@ui/icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@ui/toast";

export function ShareButton({
  className,
}: ComponentProps<typeof Button>) {
  const { showToast } = useToast();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard", "success");
    } catch (error) {
      console.error("[ShareButton] Failed to copy to clipboard:", error);
      showToast("Failed to copy link", "error");
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn("h-8 px-2 md:h-fit md:px-2", className)}
          data-testid="share-button"
          onClick={handleShare}
          variant="outline">
          <ShareIcon size={16} />
        </Button>
      </TooltipTrigger>
      <TooltipContent align="start" className="hidden md:block">
        Share Link
      </TooltipContent>
    </Tooltip>
  );
}
