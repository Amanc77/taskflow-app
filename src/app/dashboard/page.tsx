"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import api from "@/lib/axios";
import { Task } from "@/types/task";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending" as Task["status"],
    priority: "medium" as Task["priority"],
    due_date: "",
  });

  useEffect(() => {
    fetchTasks();
    if (!user) {
      setError("You must be logged in to view Dashboard.");
      setIsLoading(false);
      return;
    }
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery, filterStatus]);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get<Task[]>("/tasks");
      setTasks(data);
    } catch {
      toast.error("Failed to fetch tasks");
    }
  };

  const filterTasks = () => {
    let filtered = tasks;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description?.toLowerCase().includes(q) ?? false)
      );
    }
    if (filterStatus !== "all") {
      filtered = filtered.filter((t) => t.status === filterStatus);
    }
    setFilteredTasks(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!formData.title.trim()) {
      toast.error("Title is required");
      setIsLoading(false);
      return;
    }
    const payload = {
      ...formData,
      due_date: formData.due_date
        ? new Date(formData.due_date).toISOString()
        : null,
    };
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, payload);
        toast.success("Task updated");
      } else {
        await api.post("/tasks", payload);
        toast.success("Task created");
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error("Task not found – refreshing list");
      } else {
        toast.error(
          editingTask ? "Failed to update task" : "Failed to create task"
        );
      }
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
      resetForm();
      const { data } = await api.get<Task[]>("/tasks");
      setTasks(data);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted");
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error("Task not found – already deleted");
      } else {
        toast.error("Failed to delete task");
      }
    } finally {
      const { data } = await api.get<Task[]>("/tasks");
      setTasks(data);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      due_date: "",
    });
    setEditingTask(null);
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      due_date: task.due_date ? task.due_date.split("T")[0] : "",
    });
    setIsDialogOpen(true);
  };

  const getStatusIcon = (s: string) => {
    switch (s) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-amber-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <Card className="max-w-md w-full mx-4 shadow-xl">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{error || "You must be logged in."}</p>
            <Button
              onClick={() => (window.location.href = "/auth")}
              className="mt-4 w-full"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-blue-600">Manage your tasks efficiently</p>
        </header>

        {/* Search + Filter + New */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/80 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-48 bg-white/80 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white/90 rounded-xl">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(o) => {
              setIsDialogOpen(o);
              if (!o) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="h-4 w-4" /> New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px] bg-white/95 rounded-3xl border-0 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-blue-600">
                  {editingTask ? "Edit Task" : "Create Task"}
                </DialogTitle>
                <DialogDescription>
                  {editingTask
                    ? "Update the details below"
                    : "Fill in the details"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    className="rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea
                    id="desc"
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(v: Task["status"]) =>
                        setFormData({ ...formData, status: v })
                      }
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(v: Task["priority"]) =>
                        setFormData({ ...formData, priority: v })
                      }
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due">Due Date</Label>
                  <Input
                    id="due"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) =>
                      setFormData({ ...formData, due_date: e.target.value })
                    }
                    className="rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                    className="rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl"
                  >
                    {isLoading ? "Saving…" : editingTask ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tasks Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className="shadow-2xl border-0 rounded-3xl bg-white/80 hover:shadow-blue-200 transition-all duration-300 overflow-hidden"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="flex items-center gap-2 text-lg text-blue-700">
                      {getStatusIcon(task.status)}
                      <span className="truncate">{task.title}</span>
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-2 text-blue-600">
                      {task.description || "No description"}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(task)}
                      className="hover:bg-blue-50 rounded-full"
                    >
                      <Pencil className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(task.id)}
                      className="hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={getPriorityBadge(task.priority)}
                    className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200"
                  >
                    {task.priority}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-blue-200 text-blue-600"
                  >
                    {task.status.replace("_", " ")}
                  </Badge>
                  {task.due_date && (
                    <Badge
                      variant="outline"
                      className="border-blue-200 text-blue-600"
                    >
                      {new Date(task.due_date).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredTasks.length === 0 && (
          <Card className="p-12 text-center bg-white/80 rounded-3xl shadow-2xl border-0">
            <p className="text-blue-600 font-medium">
              No tasks found. Create your first one!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
