import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Botão primário - Dourado elegante das Frutas do Amor
        default: "bg-primary text-primary-foreground hover:bg-primary-hover rounded-lg shadow-md hover:shadow-lg active:scale-98 hover:-translate-y-0.5",
        
        // Botão secundário - Rosa suave com borda
        secondary: "border-2 border-accent text-accent-foreground bg-background hover:bg-accent rounded-lg transition-all duration-200",
        
        // Botão destrutivo - Vermelho suave
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg",
        
        // Botão outline - Borda dourada
        outline: "border-2 border-primary text-primary bg-background hover:bg-primary hover:text-primary-foreground hover:border-transparent rounded-lg",
        
        // Botão ghost - Hover delicado
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-lg",
        
        // Botão link - Dourado
        link: "text-primary underline-offset-4 hover:underline",
        
        // Botão especial para Frutas do Amor
        "frutas-amor": "gradient-frutas-amor text-white hover:shadow-lg hover:-translate-y-1 rounded-xl font-bold active:scale-95",
        
        // Botão CTA - Rosa vibrante
        cta: "bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-lg shadow-md hover:shadow-lg animate-pulse-glow",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 px-4 text-xs rounded-md",
        lg: "h-12 px-8 text-base rounded-xl",
        xl: "h-14 px-10 text-lg rounded-xl",
        icon: "h-10 w-10 rounded-lg",
        full: "h-12 w-full px-8 text-base rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
