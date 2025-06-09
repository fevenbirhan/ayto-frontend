import { GripVertical } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"
import { cn } from "@/lib/utils"

// Amharic translations
const translations = {
  resizeHandle: {
    en: "Resize handle",
    am: "መጠን �ዋጭ �ይዘት"
  }
}

const ResizablePanelGroup = ({
  className,
  direction = "horizontal",
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup> & {
  direction?: "horizontal" | "vertical"
}) => (
  <ResizablePrimitive.PanelGroup
    direction={direction}
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      "bg-background text-foreground",
      className
    )}
    {...props}
  />
)

const ResizablePanel = ResizablePrimitive.Panel

const ResizableHandle = ({
  withHandle = true,
  className,
  lang = "en",
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
  lang?: "en" | "am" // Language selector
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center",
      "bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
      "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",
      "data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1",
      "data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2",
      "data-[panel-group-direction=vertical]:after:translate-x-0",
      "[&[data-panel-group-direction=vertical]>div]:rotate-90",
      "dark:bg-border-dark dark:after:bg-border-dark",
      className
    )}
    aria-label={translations.resizeHandle[lang]}
    {...props}
  >
    {withHandle && (
      <div 
        className={cn(
          "z-10 flex h-4 w-3 items-center justify-center rounded-sm border",
          "bg-border hover:bg-border-hover",
          "dark:bg-border-dark dark:hover:bg-border-dark-hover",
          "transition-colors duration-200"
        )}
      >
        <GripVertical className="h-2.5 w-2.5 text-muted-foreground" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }