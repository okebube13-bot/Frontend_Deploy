import { CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function ActivitySection({ recentActivity, upcomingDeadlines }) {
  const getDaysUntil = (date) => {
    const diff = new Date(date) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((task) => (
            <div key={task._id} className="flex items-start space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  task.status === "completed"
                    ? "bg-green-100"
                    : task.status === "in-progress"
                    ? "bg-blue-100"
                    : "bg-yellow-100"
                }`}
              >
                {task.status === "completed" ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : task.status === "in-progress" ? (
                  <Clock className="w-4 h-4 text-blue-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {task.status === "completed"
                    ? "Task Completed"
                    : task.status === "in-progress"
                    ? "Task Updated"
                    : "New Task Created"}
                </p>
                <p className="text-sm text-gray-600">{task.title}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(task.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-lg mb-4">Upcoming Deadlines</h3>
        <div className="space-y-4">
          {upcomingDeadlines.map((task) => {
            const daysUntil = getDaysUntil(task.dueDate);
            const bgColor =
              daysUntil <= 2
                ? "bg-red-50"
                : daysUntil <= 5
                ? "bg-yellow-50"
                : "bg-blue-50";

            return (
              <div key={task._id} className={`${bgColor} p-4 rounded-lg`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      daysUntil <= 2
                        ? "bg-red-200 text-red-800"
                        : daysUntil <= 5
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-blue-200 text-blue-800"
                    }`}
                  >
                    {daysUntil} days
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
