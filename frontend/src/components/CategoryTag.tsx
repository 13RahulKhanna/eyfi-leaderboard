import type { Category } from "@/lib/types";

const CATEGORY_STYLES: Record<Category, string> = {
  Freelance: "bg-lime/15 text-lime border-lime/30",
  Sell: "bg-orange/15 text-orange border-orange/30",
  Build: "bg-sky-400/15 text-sky-300 border-sky-400/30",
  Teach: "bg-violet-400/15 text-violet-300 border-violet-400/30",
  Perform: "bg-pink-400/15 text-pink-300 border-pink-400/30",
  Content: "bg-amber-400/15 text-amber-300 border-amber-400/30",
};

export function CategoryTag({ category, className = "" }: { category: Category; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-wide whitespace-nowrap ${CATEGORY_STYLES[category]} ${className}`}
    >
      {category}
    </span>
  );
}
