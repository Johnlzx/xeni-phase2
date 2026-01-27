---
name: UI Development
description: UI component development guidelines for the Xeni project - shadcn/ui, Tailwind CSS, and React patterns
---

# UI Development Guidelines

## Tech Stack

- **Framework:** Next.js 15 with React 18
- **Styling:** Tailwind CSS with CSS variables
- **Components:** shadcn/ui (Radix UI primitives)
- **Variants:** class-variance-authority (cva)
- **Icons:** Lucide React
- **Animations:** Motion (Framer Motion)
- **Forms:** react-hook-form
- **State:** Zustand
- **Toasts:** Sonner

## Component Patterns

### Base Components

Use shadcn/ui components from `@/components/ui/`. Always check existing components before creating new ones.

```tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
```

### Class Merging

Always use the `cn()` utility for conditional classes:

```tsx
import { cn } from "@/lib/utils"

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className
)} />
```

### Component Variants with CVA

For components with multiple variants, use `class-variance-authority`:

```tsx
import { cva, type VariantProps } from "class-variance-authority"

const componentVariants = cva(
  "base-classes", // Always applied
  {
    variants: {
      variant: {
        default: "default-classes",
        secondary: "secondary-classes",
      },
      size: {
        default: "h-9 px-4",
        sm: "h-8 px-3",
        lg: "h-10 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {}

function Component({ className, variant, size, ...props }: ComponentProps) {
  return (
    <div className={cn(componentVariants({ variant, size, className }))} {...props} />
  )
}
```

### Radix UI Primitives

When building complex components, compose with Radix primitives:

```tsx
import * as DialogPrimitive from "@radix-ui/react-dialog"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogContent = React.forwardRef<...>(({ className, ...props }, ref) => (
  <DialogPrimitive.Content
    ref={ref}
    className={cn("...", className)}
    {...props}
  />
))
```

## Color System

Use CSS variable colors from the theme. Never hardcode colors.

### Semantic Colors

```tsx
// Good - uses theme variables
className="bg-primary text-primary-foreground"
className="bg-muted text-muted-foreground"
className="border-border"

// Bad - hardcoded colors
className="bg-blue-500 text-white"
```

### Available Color Tokens

| Token | Usage |
|-------|-------|
| `background` / `foreground` | Page background and text |
| `card` / `card-foreground` | Card surfaces |
| `primary` / `primary-foreground` | Primary actions |
| `secondary` / `secondary-foreground` | Secondary actions |
| `muted` / `muted-foreground` | Subtle backgrounds and text |
| `accent` / `accent-foreground` | Highlights |
| `destructive` / `destructive-foreground` | Danger/error states |
| `border` | Borders |
| `input` | Input borders |
| `ring` | Focus rings |
| `brand` / `brand-light` / `brand-dark` | Brand colors |

## Icons

Use Lucide React icons consistently:

```tsx
import { ChevronRight, Plus, Settings } from "lucide-react"

<Button>
  <Plus className="size-4" />
  Add Item
</Button>
```

Icon sizing: Use `size-4` (16px) for buttons, `size-5` (20px) for standalone icons.

## Spacing & Layout

Follow consistent spacing patterns:

- **Container padding:** `p-5` or `p-6`
- **Card padding:** `p-3` (sm), `p-5` (md), `p-6` (lg)
- **Gap between items:** `gap-2`, `gap-3`, `gap-4`
- **Section spacing:** `space-y-4`, `space-y-6`

## Animations

Use Motion for complex animations:

```tsx
import { motion } from "motion/react"

<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2 }}
>
  Content
</motion.div>
```

For simple transitions, use Tailwind:

```tsx
className="transition-all duration-200 ease-out"
```

## Form Patterns

Use react-hook-form with shadcn Form components:

```tsx
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

const form = useForm<FormData>()

<Form {...form}>
  <FormField
    control={form.control}
    name="fieldName"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Label</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

## Responsive Design

Use Tailwind breakpoints consistently:

```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
className="hidden md:block"
className="text-sm md:text-base"
```

## Dark Mode

The project supports dark mode via `next-themes`. Use dark: variants when needed:

```tsx
className="bg-white dark:bg-gray-900"
className="border-gray-200 dark:border-gray-700"
```

Prefer semantic color tokens that auto-adapt to dark mode.

## Component File Structure

```
components/
  ui/           # Base UI components (shadcn/ui)
    button.tsx
    card.tsx
    custom-*.tsx  # Custom extensions
  [feature]/    # Feature-specific components
    ComponentName.tsx
```

## Best Practices

1. **Reuse existing components** - Check `components/ui/` before creating new ones
2. **Use semantic tokens** - Never hardcode colors
3. **Keep components focused** - Single responsibility
4. **Forward refs** - For components that wrap DOM elements
5. **Type props properly** - Extend HTML attributes when appropriate
6. **Use `data-slot`** - For component identification in complex compositions
7. **Handle disabled states** - Use `disabled:` variants
8. **Focus states** - Use `focus-visible:` for keyboard navigation
