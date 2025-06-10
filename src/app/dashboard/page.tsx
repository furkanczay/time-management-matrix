import CategoriesWithLists from "@/components/categories-with-lists";
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
    filterList?: string;
  }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const {
    search,
    view,
    sortBy,
    sortOrder,
    filterDate,
    showOnlyToday,
    filterList,
  } = await searchParams;
  const currentSearch = search || "";
  const currentView = (view || "matrix") as "matrix" | "list";
  const currentSortBy = sortBy || "order";
  const currentSortOrder = sortOrder || "asc";
  const showTodayOnly = showOnlyToday === "true";
  const currentFilterList = filterList;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="glass-effect rounded-2xl p-6 border shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <SearchForm currentSearch={currentSearch} />
              <ViewToggle currentView={currentView} />
            </div>
          </div>

          {/* Controls Section */}
          <div className="space-y-4">
            <SortFilterOptions
              currentSortBy={currentSortBy}
              currentSortOrder={currentSortOrder}
              currentFilterDate={filterDate}
              showOnlyToday={showTodayOnly}
              currentFilterList={currentFilterList}
            />

            {/* Main Content */}
            <div className="min-h-[calc(100vh-280px)]">
              <CategoriesWithLists
                show={currentView}
                sortBy={
                  currentSortBy === "createdAt"
                    ? "order"
                    : (currentSortBy as "order" | "dueDate")
                }
                sortOrder={currentSortOrder as "asc" | "desc"}
                filterToday={showTodayOnly}
                filterList={currentFilterList}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewToggle({ currentView }: { currentView: "matrix" | "list" }) {
  return (
    <div className="flex items-center bg-muted/50 backdrop-blur-sm rounded-xl p-1 border shadow-sm">
      <Button
        variant={currentView === "matrix" ? "default" : "ghost"}
        size="sm"
        className={`${
          currentView === "matrix"
            ? "shadow-sm bg-primary text-primary-foreground"
            : "hover:bg-background/50 text-muted-foreground hover:text-foreground"
        } transition-all duration-200 rounded-lg`}
        asChild
      >
        <a
          href={`/dashboard?view=matrix`}
          className="flex items-center gap-2 px-4 py-2"
        >
          <Grid className="h-4 w-4" />
          <span className="hidden sm:inline font-medium">Matrix</span>
        </a>
      </Button>
      <Button
        variant={currentView === "list" ? "default" : "ghost"}
        size="sm"
        className={`${
          currentView === "list"
            ? "shadow-sm bg-primary text-primary-foreground"
            : "hover:bg-background/50 text-muted-foreground hover:text-foreground"
        } transition-all duration-200 rounded-lg`}
        asChild
      >
        <a
          href={`/dashboard?view=list`}
          className="flex items-center gap-2 px-4 py-2"
        >
          <List className="h-4 w-4" />
          <span className="hidden sm:inline font-medium">List</span>
        </a>
      </Button>
    </div>
  );
}
