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
    <div className="inline-flex items-center gap-2">
      <Input
        type="text"
        placeholder="Search todos..."
        className="w-80"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <Button onClick={handleSearch}>
        <Search />
      </Button>
    </div>
  );
}
