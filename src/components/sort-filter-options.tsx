"use client";

import { CalendarIcon, SortAsc, SortDesc } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
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

interface SortFilterOptionsProps {
  currentView: "matrix" | "list";
  currentSortBy?: string;
  currentSortOrder?: string;
  currentFilterDate?: string;
  showOnlyToday?: boolean;
}

export default function SortFilterOptions({
  currentView,
  currentSortBy = "order",
  currentSortOrder = "asc",
  currentFilterDate,
  showOnlyToday = false,
}: SortFilterOptionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  const clearFilters = () => {
    setSelectedDate(undefined);
    router.push(
      `/dashboard?${createQueryString({
        sortBy: null,
        sortOrder: null,
        filterDate: null,
        showOnlyToday: null,
      })}`
    );
  };

  const hasActiveFilters =
    currentSortBy !== "order" ||
    currentSortOrder !== "asc" ||
    !!currentFilterDate ||
    showOnlyToday;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center bg-gray-100 rounded-lg p-1">
        <Select value={currentSortBy} onValueChange={handleSortByChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="order">Default</SelectItem>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="createdAt">Created</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="sm"
          className="ml-1"
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

      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={selectedDate ? "default" : "outline"}
              className={cn(
                "pl-3 pr-2 justify-between",
                !selectedDate && "text-muted-foreground"
              )}
              size="sm"
            >
              {selectedDate ? format(selectedDate, "PPP") : "Pick date"}
              <CalendarIcon className="ml-1 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Button
          variant={showOnlyToday ? "default" : "outline"}
          size="sm"
          onClick={handleTodayToggle}
          className="whitespace-nowrap"
        >
          Today's Tasks
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs"
          >
            Clear
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="ml-2 flex gap-1 flex-wrap">
          {currentSortBy !== "order" && (
            <Badge variant="secondary" className="text-xs">
              Sort: {currentSortBy === "dueDate" ? "Due date" : "Created date"}
            </Badge>
          )}
          {currentSortOrder !== "asc" && (
            <Badge variant="secondary" className="text-xs">
              Order: Descending
            </Badge>
          )}
          {selectedDate && (
            <Badge variant="secondary" className="text-xs">
              Date: {format(selectedDate, "dd MMM yyyy")}
            </Badge>
          )}
          {showOnlyToday && (
            <Badge variant="secondary" className="text-xs">
              Today only
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
