import Categories from "@/components/categories";
import SearchForm from "@/components/search-form";
import SortFilterOptions from "@/components/sort-filter-options";
import { Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardPageProps {
  searchParams: Promise<{
    search?: string;
    view?: "matrix" | "list";
    sortBy?: string;
    sortOrder?: string;
    filterDate?: string;
    showOnlyToday?: string;
  }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const { search, view, sortBy, sortOrder, filterDate, showOnlyToday } =
    await searchParams;
  const currentSearch = search || "";
  const currentView = (view || "matrix") as "matrix" | "list";
  const currentSortBy = sortBy || "order";
  const currentSortOrder = sortOrder || "asc";
  const showTodayOnly = showOnlyToday === "true";

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <SearchForm currentSearch={currentSearch} />
          <ViewToggle currentView={currentView} />
        </div>
        <div className="space-y-4">
          <SortFilterOptions
            currentSortBy={currentSortBy}
            currentSortOrder={currentSortOrder}
            currentFilterDate={filterDate}
            showOnlyToday={showTodayOnly}
          />
          <div className="min-h-[calc(100vh-250px)]">
            <Categories
              show={currentView}
              sortBy={
                currentSortBy === "createdAt"
                  ? "order"
                  : (currentSortBy as "order" | "dueDate")
              }
              sortOrder={currentSortOrder as "asc" | "desc"}
              filterToday={showTodayOnly}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewToggle({ currentView }: { currentView: "matrix" | "list" }) {
  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-1">
      <Button
        variant={currentView === "matrix" ? "default" : "ghost"}
        size="sm"
        className={currentView === "matrix" ? "shadow-sm" : "hover:bg-white/50"}
        asChild
      >
        <a href={`/dashboard?view=matrix`} className="flex items-center gap-2">
          <Grid className="h-4 w-4" />
          <span className="hidden sm:inline">Matrix</span>
        </a>
      </Button>
      <Button
        variant={currentView === "list" ? "default" : "ghost"}
        size="sm"
        className={currentView === "list" ? "shadow-sm" : "hover:bg-white/50"}
        asChild
      >
        <a href={`/dashboard?view=list`} className="flex items-center gap-2">
          <List className="h-4 w-4" />
          <span className="hidden sm:inline">List</span>
        </a>
      </Button>
    </div>
  );
}
