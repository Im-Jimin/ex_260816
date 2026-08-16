import { categories } from "@/lib/data";
import CategoryCard from "./CategoryCard";

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-6">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
