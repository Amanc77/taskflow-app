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

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending" as Task["status"],
    priority: "medium" as Task["priority"],
    due_date: "",
  });

  useEffect(() => {
    fetchTasks();
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

  // FIXED: handleSubmit – Create & Update
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

      // Always refresh from server
      const { data } = await api.get<Task[]>("/tasks");
      setTasks(data);
    }
  };

  // FIXED: handleDelete
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
      // Always refresh from server
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

  return (
    <div className="min-h-screen bg-muted/30">
      <Toaster position="top-right" />

      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your tasks efficiently</p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
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
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> New Task
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[520px]">
              <DialogHeader>
                <DialogTitle>
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
                      <SelectTrigger>
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
                      <SelectTrigger>
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
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving…" : editingTask ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className="hover:shadow-lg transition-shadow duration-200 cursor-default"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {getStatusIcon(task.status)}
                      <span className="truncate">{task.title}</span>
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {task.description || "No description"}
                    </CardDescription>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(task)}
                      className="hover:bg-muted"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(task.id)}
                      className="hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={getPriorityBadge(task.priority)}>
                    {task.priority}
                  </Badge>
                  <Badge variant="outline">
                    {task.status.replace("_", " ")}
                  </Badge>
                  {task.due_date && (
                    <Badge variant="outline">
                      {new Date(task.due_date).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">
              No tasks found. Create your first one!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
