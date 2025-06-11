"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, FolderPlus } from "lucide-react";
import { useList } from "@/contexts/list-context";

interface ListSelectorProps {
  value?: string | null;
  onChange: (listId: string | null) => void;
  disabled?: boolean;
}

export function ListSelector({ value, onChange, disabled }: ListSelectorProps) {
  const { lists, createList, loading } = useList();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    color: "#3b82f6",
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.title.trim()) return;

    try {
      setIsCreating(true);
      await createList({
        title: createForm.title,
        description: createForm.description || undefined,
        color: createForm.color,
      });
      setCreateForm({ title: "", description: "", color: "#3b82f6" });
      setShowCreateDialog(false);
    } catch (error) {
      console.error("Failed to create list:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const colors = [
    { name: "Mavi", value: "#3b82f6" },
    { name: "Yeşil", value: "#10b981" },
    { name: "Kırmızı", value: "#ef4444" },
    { name: "Sarı", value: "#f59e0b" },
    { name: "Mor", value: "#8b5cf6" },
    { name: "Pembe", value: "#ec4899" },
    { name: "Gri", value: "#6b7280" },
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor="list-select">Liste (İsteğe bağlı)</Label>
      <div className="flex gap-2">
        <Select
          value={value || "none"}
          onValueChange={(val) => onChange(val === "none" ? null : val)}
          disabled={disabled || loading}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Liste seçin veya boş bırakın" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">
              <span className="text-muted-foreground">Gruplanmamış</span>
            </SelectItem>
            {lists.map((list) => (
              <SelectItem key={list.id} value={list.id}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: list.color }}
                  />
                  <span>{list.title}</span>
                  <span className="text-muted-foreground text-xs">
                    ({list._count.tasks})
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={disabled}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FolderPlus className="h-5 w-5" />
                Yeni Liste Oluştur
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateList} className="space-y-4">
              <div>
                <Label htmlFor="list-title">Liste Adı *</Label>
                <Input
                  id="list-title"
                  value={createForm.title}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, title: e.target.value })
                  }
                  placeholder="Örn: Ev İşleri, İş Görevleri"
                  required
                />
              </div>
              <div>
                <Label htmlFor="list-description">Açıklama</Label>
                <Textarea
                  id="list-description"
                  value={createForm.description}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Liste hakkında kısa bir açıklama"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="list-color">Renk</Label>
                <div className="flex gap-2 mt-2">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        createForm.color === color.value
                          ? "border-foreground scale-110"
                          : "border-border hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() =>
                        setCreateForm({ ...createForm, color: color.value })
                      }
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  disabled={isCreating}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating || !createForm.title.trim()}
                >
                  {isCreating ? "Oluşturuluyor..." : "Oluştur"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
