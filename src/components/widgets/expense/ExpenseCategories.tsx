import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusCircle, X } from "lucide-react";
import { useState } from "react";
import { ExpenseCategory } from "@/types/widget";

interface ExpenseCategoriesProps {
  categories: ExpenseCategory[];
  onAddCategory: (name: string) => void;
  onRemoveCategory: (id: string) => void;
}

export default function ExpenseCategories({
  categories,
  onAddCategory,
  onRemoveCategory,
}: ExpenseCategoriesProps) {
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    onAddCategory(newCategory);
    setNewCategory("");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Categories</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="flex gap-2 mt-4">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name"
                className="flex-1"
              />
              <Button onClick={handleAddCategory}>Add</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="widget-list-item flex items-center justify-between p-2 rounded"
            style={{ borderLeft: `4px solid ${category.color}` }}
          >
            <span>{category.name}</span>
            <button
              onClick={() => onRemoveCategory(category.id)}
              className="p-1 hover:bg-muted rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}