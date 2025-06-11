"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useTodos } from "@/contexts/todo-context";

interface SearchFormProps {
  currentSearch: string;
}

export default function SearchForm({ currentSearch }: SearchFormProps) {
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSearchTerm: setContextSearchTerm } = useTodos();

  useEffect(() => {
    setSearchTerm(currentSearch);
    setContextSearchTerm(currentSearch);
  }, [currentSearch, setContextSearchTerm]);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);

    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    } else {
      params.delete("search");
    }

    // Context'i hemen güncelle
    setContextSearchTerm(searchTerm.trim());

    // URL'i güncelle
    router.push(`/dashboard?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div className="relative max-w-md w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
        <Input
          type="text"
          placeholder="Search tasks..."
          className="pl-10 pr-20 h-11 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-200 rounded-xl shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          onClick={handleSearch}
          size="sm"
          className="absolute right-1 h-9 px-3 rounded-lg bg-primary/90 hover:bg-primary text-primary-foreground shadow-sm transition-all duration-200"
        >
          Search
        </Button>
      </div>
    </div>
  );
}
