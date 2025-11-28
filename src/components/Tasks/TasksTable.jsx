import {
  Filter,
  Plus,
  Edit2,
  Eye,
  Trash2,
  Paperclip,
  Image as ImageIcon,
} from "lucide-react";
import { useState } from "react";
import TaskDetailModal from "./TaskDetailModal";

export default function TasksTable({
  tasks,
  userRole,
  onNewTask,
  onDeleteTask,
  onUpdateStatus,
  onRefresh,
}) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-2xl font-bold">All Tasks</h2>
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            {userRole !== "student" && (
              <button
                onClick={onNewTask}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>New Task</span>
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Assignee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Attachments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tasks.map((task) => {
                const hasImages = task.images && task.images.length > 0;
                const hasFiles = task.files && task.files.length > 0;
                const totalAttachments =
                  (task.images?.length || 0) + (task.files?.length || 0);

                return (
                  <tr key={task._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewTask(task)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 text-left"
                      >
                        {task.title}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {task.assignedTo?.name}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-semibold ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={task.status}
                        onChange={(e) =>
                          onUpdateStatus(task._id, e.target.value)
                        }
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(
                          task.status
                        )}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {totalAttachments > 0 ? (
                        <div className="flex items-center space-x-2">
                          {hasImages && (
                            <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded">
                              <ImageIcon className="w-3 h-3 text-blue-600" />
                              <span className="text-xs text-blue-600">
                                {task.images.length}
                              </span>
                            </div>
                          )}
                          {hasFiles && (
                            <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded">
                              <Paperclip className="w-3 h-3 text-green-600" />
                              <span className="text-xs text-green-600">
                                {task.files.length}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${
                                task.status === "completed"
                                  ? 100
                                  : task.status === "in-progress"
                                  ? 50
                                  : 15
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">
                          {task.status === "completed"
                            ? "100"
                            : task.status === "in-progress"
                            ? "50"
                            : "15"}
                          %
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewTask(task)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteTask(task._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedTask(null);
        }}
        onUpdate={onRefresh}
        userRole={userRole}
      />
    </>
  );
}
