import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface CategoryManagerProps {
  categories: Array<{ id: string; name: string; color: string }>;
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export default function CategoryManager({
  categories,
  onAddCategory,
  onDeleteCategory,
  selectedCategory,
  onSelectCategory,
}: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    onAddCategory(newCategoryName.trim());
    setNewCategoryName("");
  };

  const handleDeleteCategory = (categoryId: string) => {
    onDeleteCategory(categoryId);
    if (selectedCategory === categoryId) {
      onSelectCategory("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <select
          className="flex-1 w-full p-2 border rounded-md"
          value={selectedCategory}
          onChange={(e) => onSelectCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Input
                  placeholder="Category Name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
              <Button onClick={handleAddCategory} className="w-full">
                Add Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {categories.length > 0 && (
        <div className="space-y-2 mt-4">
          <h4 className="text-sm font-medium">Manage Categories</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-2 border rounded-md">
                <span>{category.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteCategory(category.id)}
                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}