"use client";

import { CalendarIcon, SortAsc, SortDesc, FolderOpen, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { useList } from "@/contexts/list-context";

interface SortFilterOptionsProps {
  currentSortBy?: string;
  currentSortOrder?: string;
  currentFilterDate?: string;
  currentFilterList?: string;
  showOnlyToday?: boolean;
}

export default function SortFilterOptions({
  currentSortBy = "order",
  currentSortOrder = "asc",
  currentFilterDate,
  currentFilterList,
  showOnlyToday = false,
}: SortFilterOptionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lists } = useList();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    currentFilterDate ? new Date(currentFilterDate) : undefined
  );

  // Build URL with current params  // Build URL with current params
  const createQueryString = (params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    return newParams.toString();
  };

  const handleSortByChange = (value: string) => {
    router.push(`/dashboard?${createQueryString({ sortBy: value })}`);
  };

  const handleSortOrderChange = (value: string) => {
    router.push(`/dashboard?${createQueryString({ sortOrder: value })}`);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      router.push(
        `/dashboard?${createQueryString({
          filterDate: date.toISOString().split("T")[0],
          showOnlyToday: null,
        })}`
      );
    } else {
      router.push(`/dashboard?${createQueryString({ filterDate: null })}`);
    }
  };
  const handleTodayToggle = () => {
    const newShowOnlyToday = !showOnlyToday;
    router.push(
      `/dashboard?${createQueryString({
        showOnlyToday: newShowOnlyToday ? "true" : null,
        filterDate: null, // Clear specific date when toggling today
      })}`
    );
  };

  const handleListFilter = (listId: string | null) => {
    router.push(
      `/dashboard?${createQueryString({
        filterList: listId,
      })}`
    );
  };

  const clearFilters = () => {
    setSelectedDate(undefined);
    router.push(
      `/dashboard?${createQueryString({
        sortBy: null,
        sortOrder: null,
        filterDate: null,
        filterList: null,
        showOnlyToday: null,
      })}`
    );
  };
  const hasActiveFilters =
    currentSortBy !== "order" ||
    currentSortOrder !== "asc" ||
    !!currentFilterDate ||
    !!currentFilterList ||
    showOnlyToday;
  return (
    <div className="glass-effect rounded-xl p-4 border shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        {/* Sort Controls */}
        <div className="flex items-center bg-muted/30 backdrop-blur-sm rounded-lg p-1 border border-border/30">
          <Select value={currentSortBy} onValueChange={handleSortByChange}>
            <SelectTrigger className="w-[130px] border-0 bg-transparent focus:ring-0 h-8">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="border border-border/50 shadow-lg">
              <SelectItem value="order">Default Order</SelectItem>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="createdAt">Created Date</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            className="ml-1 h-8 w-8 p-0 hover:bg-background/50 transition-colors"
            onClick={() =>
              handleSortOrderChange(currentSortOrder === "asc" ? "desc" : "asc")
            }
          >
            {currentSortOrder === "asc" ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={selectedDate ? "default" : "outline"}
                className={cn(
                  "pl-3 pr-2 justify-between h-9 bg-background/50 border-border/50 hover:bg-background transition-all duration-200",
                  !selectedDate && "text-muted-foreground",
                  selectedDate &&
                    "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                size="sm"
              >
                {selectedDate
                  ? format(selectedDate, "MMM dd, yyyy")
                  : "Filter by date"}
                <CalendarIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 shadow-lg border border-border/50"
              align="end"
            >
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
                className="rounded-lg"
              />
            </PopoverContent>
          </Popover>
          {/* List Filter */}
          <Select
            value={currentFilterList || "all"}
            onValueChange={(value) =>
              handleListFilter(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-[160px] h-9 bg-background/50 border-border/50 hover:bg-background transition-all duration-200">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                <SelectValue placeholder="Filter by list" />
              </div>
            </SelectTrigger>
            <SelectContent className="border border-border/50 shadow-lg">
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-primary/60" />
                  <span>All Lists</span>
                </div>
              </SelectItem>
              <SelectItem value="ungrouped">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400" />
                  <span>Ungrouped</span>
                </div>
              </SelectItem>
              {lists.map((list) => (
                <SelectItem key={list.id} value={list.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full ring-1 ring-white/20"
                      style={{ backgroundColor: list.color }}
                    />
                    <span>{list.title}</span>
                    <span className="text-muted-foreground text-xs ml-auto">
                      {list._count.tasks}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>{" "}
          {/* Today Filter */}
          <Button
            variant={showOnlyToday ? "default" : "outline"}
            size="sm"
            onClick={handleTodayToggle}
            className={cn(
              "h-9 transition-all duration-200",
              showOnlyToday
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-background/50 border-border/50 hover:bg-background"
            )}
          >
            📅 Today
          </Button>
          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 px-3 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex gap-2 flex-wrap">
            {currentSortBy !== "order" && (
              <Badge
                variant="secondary"
                className="text-xs bg-muted/50 hover:bg-muted transition-colors"
              >
                Sort:{" "}
                {currentSortBy === "dueDate" ? "Due date" : "Created date"}
              </Badge>
            )}
            {currentSortOrder !== "asc" && (
              <Badge
                variant="secondary"
                className="text-xs bg-muted/50 hover:bg-muted transition-colors"
              >
                Order: Descending
              </Badge>
            )}
            {selectedDate && (
              <Badge
                variant="secondary"
                className="text-xs bg-muted/50 hover:bg-muted transition-colors"
              >
                📅 {format(selectedDate, "MMM dd, yyyy")}
              </Badge>
            )}
            {showOnlyToday && (
              <Badge
                variant="secondary"
                className="text-xs bg-muted/50 hover:bg-muted transition-colors"
              >
                📅 Today only
              </Badge>
            )}
            {currentFilterList && (
              <Badge
                variant="secondary"
                className="text-xs bg-muted/50 hover:bg-muted transition-colors flex items-center gap-1 group"
              >
                <FolderOpen className="w-3 h-3" />
                {currentFilterList === "ungrouped"
                  ? "Ungrouped"
                  : lists.find((l) => l.id === currentFilterList)?.title ||
                    "Unknown List"}
                <X
                  className="w-3 h-3 cursor-pointer opacity-60 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleListFilter(null);
                  }}
                />
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
