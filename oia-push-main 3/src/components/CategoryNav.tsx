import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
}

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

export function CategoryNav({ categories, activeCategory, onCategoryClick }: CategoryNavProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement>(null);

  // Auto scroll para a categoria ativa
  useEffect(() => {
    if (activeBtnRef.current && navRef.current) {
      const nav = navRef.current;
      const activeBtn = activeBtnRef.current;
      const navRect = nav.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      
      const scrollLeft = activeBtn.offsetLeft - navRect.width / 2 + btnRect.width / 2;
      nav.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeCategory]);

  return (
    <div className="sticky top-[73px] z-40 bg-gradient-delicate/95 backdrop-blur-sm border-b border-accent/30">
      <div 
        ref={navRef}
        className="flex overflow-x-auto px-4 py-3 gap-1 no-scrollbar"
      >
        {categories.map((category) => {
          const isActive = category.id === activeCategory;
          return (
            <button
              key={category.id}
              ref={isActive ? activeBtnRef : null}
              onClick={() => onCategoryClick(category.id)}
              className={`
                whitespace-nowrap flex-shrink-0 px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-300
                ${isActive 
                  ? 'text-white bg-primary border-primary shadow-md' 
                  : 'text-muted-foreground border-transparent hover:text-primary hover:border-accent hover:bg-accent/20'
                }
              `}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}