"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import TodoDescription from "./todo-description";
import TodoTitle from "./todo-title";
import AddSubTask from "./add-sub-task";
import {
  Check,
  X,
  Calendar,
  Clock,
  Flag,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Target,
  Timer,
  Zap,
} from "lucide-react";
import { Subtask } from "@/generated/prisma";
import { calculateQuadrant, TodoItem } from "@/contexts/todo-context";
import { format, differenceInDays } from "date-fns";

// Helper function to get due date urgency styling with enhanced visual cues
const getDueDateUrgency = (dueDate: Date | null | string) => {
  if (!dueDate) return null;

  const today = new Date();
  const due = new Date(dueDate);
  const daysUntilDue = differenceInDays(due, today);

  if (daysUntilDue < 0) {
    return {
      variant: "destructive" as const,
      textClass: "text-red-700 dark:text-red-300",
      bgClass:
        "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700",
      iconClass: "text-red-600 dark:text-red-400",
      prefix: "Overdue: ",
      icon: AlertTriangle,
      status: "overdue",
    };
  } else if (daysUntilDue === 0) {
    return {
      variant: "destructive" as const,
      textClass: "text-red-700 dark:text-red-300",
      bgClass:
        "bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-700",
      iconClass: "text-red-600 dark:text-red-400",
      prefix: "Due today: ",
      icon: Timer,
      status: "today",
    };
  } else if (daysUntilDue === 1) {
    return {
      variant: "outline" as const,
      textClass: "text-orange-700 dark:text-orange-300",
      bgClass:
        "bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-200 dark:border-orange-700",
      iconClass: "text-orange-600 dark:text-orange-400",
      prefix: "Due tomorrow: ",
      icon: Clock,
      status: "tomorrow",
    };
  } else if (daysUntilDue <= 3) {
    return {
      variant: "outline" as const,
      textClass: "text-yellow-700 dark:text-yellow-300",
      bgClass:
        "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-700",
      iconClass: "text-yellow-600 dark:text-yellow-400",
      prefix: `Due in ${daysUntilDue} days: `,
      icon: Calendar,
      status: "soon",
    };
  }

  return {
    variant: "secondary" as const,
    textClass: "text-blue-700 dark:text-blue-300",
    bgClass:
      "bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-700",
    iconClass: "text-blue-600 dark:text-blue-400",
    prefix: "",
    icon: Calendar,
    status: "future",
  };
};

// Quadrant definitions with enhanced styling and gradients
const QUADRANTS = [
  {
    id: "1",
    title: "Important & Urgent",
    description: "Do First",
    color:
      "bg-gradient-to-r from-red-100 to-red-200 text-red-900 border-red-300 dark:from-red-900/30 dark:to-red-800/30 dark:text-red-100 dark:border-red-600",
    badgeVariant: "destructive" as const,
    icon: AlertTriangle,
  },
  {
    id: "2",
    title: "Important & Not Urgent",
    description: "Schedule",
    color:
      "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 border-blue-300 dark:from-blue-900/30 dark:to-blue-800/30 dark:text-blue-100 dark:border-blue-600",
    badgeVariant: "default" as const,
    icon: Target,
  },
  {
    id: "3",
    title: "Not Important & Urgent",
    description: "Delegate",
    color:
      "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-900 border-yellow-300 dark:from-yellow-900/30 dark:to-yellow-800/30 dark:text-yellow-100 dark:border-yellow-600",
    badgeVariant: "outline" as const,
    icon: Zap,
  },
  {
    id: "4",
    title: "Not Important & Not Urgent",
    description: "Eliminate",
    color:
      "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 border-gray-300 dark:from-gray-800/30 dark:to-gray-700/30 dark:text-gray-100 dark:border-gray-600",
    badgeVariant: "secondary" as const,
    icon: Circle,
  },
];

export default function TodoDetail({
  todo,
  triggerClassname,
}: {
  todo: TodoItem & {
    subtasks?: Subtask[];
  };
  triggerClassname?: string;
}) {
  // Calculate current quadrant
  const currentQuadrant = calculateQuadrant(todo.isUrgent, todo.isImportant);
  const quadrantInfo = QUADRANTS.find((q) => q.id === currentQuadrant);
  const dueDateUrgency = getDueDateUrgency(todo.dueDate);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="link"
          className={cn(
            "p-0 h-auto text-left justify-start hover:text-blue-600 transition-colors",
            triggerClassname
          )}
        >
          {todo?.title}
        </Button>
      </SheetTrigger>{" "}
      <SheetContent className="sm:max-w-4xl overflow-y-auto dark:bg-gray-950/80 backdrop-blur-sm">
        <div className="space-y-6 px-6 py-10">
          {/* Header Section with Modern Card Design */}
          <div className="bg-muted backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-6">
            <SheetHeader className="space-y-4">
              <div className="space-y-6">
                {" "}
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-4">
                    <TodoTitle id={todo.id} title={todo.title} />
                    {/* Quick Status Indicator */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-2">
                        {todo.isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-400" />
                        )}
                        <Badge
                          variant={todo.isCompleted ? "default" : "secondary"}
                          className="text-sm"
                        >
                          {todo.isCompleted ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Enhanced Category Badge with Gradient */}
                {quadrantInfo && (
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={quadrantInfo.badgeVariant}
                      className="text-sm px-4 py-2 rounded-full"
                    >
                      <quadrantInfo.icon className="w-4 h-4 mr-2" />
                      {quadrantInfo.title}
                      <span className="ml-2 text-xs opacity-75">
                        ({quadrantInfo.description})
                      </span>
                    </Badge>

                    {/* Due Date Badge */}
                    {todo.dueDate && dueDateUrgency && (
                      <Badge
                        variant={dueDateUrgency.variant}
                        className="text-sm px-4 py-2 rounded-full"
                      >
                        <dueDateUrgency.icon className="w-4 h-4 mr-2" />
                        {dueDateUrgency.prefix}
                        {format(new Date(todo.dueDate), "MMM dd")}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </SheetHeader>
          </div>{" "}
          {/* Description Section with Enhanced Styling */}
          <div className="bg-muted backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100/80 dark:bg-blue-900/30 rounded-lg">
                <Flag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Description
              </h3>
            </div>
            <div className="bg-gray-50/80 dark:bg-gray-800/30 rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50">
              <TodoDescription id={todo.id} description={todo?.description} />
            </div>
          </div>{" "}
          {/* Properties Grid with Enhanced Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Priority Section */}
            <div className="bg-muted backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100/80 dark:bg-purple-900/30 rounded-lg">
                  <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Priority Matrix
                </h3>
              </div>{" "}
              <div className="space-y-3">
                <div
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border transition-all",
                    todo.isUrgent
                      ? "bg-red-50/80 border-red-200/80 dark:bg-red-900/20 dark:border-red-700/50"
                      : "bg-gray-50/80 border-gray-200/80 dark:bg-gray-800/30 dark:border-gray-700/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Flag
                      className={cn(
                        "w-4 h-4",
                        todo.isUrgent
                          ? "text-red-600 dark:text-red-400"
                          : "text-gray-400"
                      )}
                    />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Urgent
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {todo.isUrgent ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        <Badge
                          variant="destructive"
                          className="text-xs px-2 py-1"
                        >
                          High
                        </Badge>
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 text-gray-400" />
                        <Badge
                          variant="secondary"
                          className="text-xs px-2 py-1"
                        >
                          Low
                        </Badge>
                      </>
                    )}
                  </div>
                </div>

                <div
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border transition-all",
                    todo.isImportant
                      ? "bg-blue-50/80 border-blue-200/80 dark:bg-blue-900/20 dark:border-blue-700/50"
                      : "bg-gray-50/80 border-gray-200/80 dark:bg-gray-800/30 dark:border-gray-700/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle
                      className={cn(
                        "w-4 h-4",
                        todo.isImportant
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-400"
                      )}
                    />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Important
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {todo.isImportant ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        <Badge variant="default" className="text-xs px-2 py-1">
                          High
                        </Badge>
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 text-gray-400" />
                        <Badge
                          variant="secondary"
                          className="text-xs px-2 py-1"
                        >
                          Low
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Status & Timeline Section */}
            <div className="bg-muted backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100/80 dark:bg-green-900/30 rounded-lg">
                  <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Status & Timeline
                </h3>
              </div>

              <div className="space-y-4">
                <div
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all",
                    todo.isCompleted
                      ? "bg-gradient-to-r from-green-50 to-green-100 border-green-200 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-700"
                      : "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-700"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {todo.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      )}
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Status
                      </span>
                    </div>
                    <Badge
                      variant={todo.isCompleted ? "default" : "outline"}
                      className="text-sm"
                    >
                      {todo.isCompleted ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                </div>

                {todo.dueDate && dueDateUrgency && (
                  <div
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all",
                      dueDateUrgency.bgClass
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <dueDateUrgency.icon
                          className={cn("w-5 h-5", dueDateUrgency.iconClass)}
                        />
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Due Date
                        </span>
                      </div>
                      <div className="text-right">
                        <div
                          className={cn(
                            "text-sm font-semibold",
                            dueDateUrgency.textClass
                          )}
                        >
                          {dueDateUrgency.prefix}
                          {format(new Date(todo.dueDate), "MMM dd, yyyy")}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {format(new Date(todo.dueDate), "EEEE")}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!todo.dueDate && (
                  <div className="p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-500 dark:text-gray-400">
                          Due Date
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs text-gray-500"
                      >
                        Not set
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>{" "}
          <Separator className="my-6" />
          {/* Subtasks Section with Enhanced Design */}
          <div className="bg-muted backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-800/50 p-6">
            <AddSubTask id={todo.id} subtasks={todo.subtasks ?? []} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
