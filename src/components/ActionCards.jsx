import { Plus, Users, FileText } from "lucide-react";

export default function ActionCards({ userRole, onNewTask, onViewTeam }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {userRole !== "student" && (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="text-blue-600 w-8 h-8" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Create New Task</h3>
          <p className="text-gray-600 text-sm mb-4">
            Assign new tasks to team members
          </p>
          <button
            onClick={onNewTask}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            + New Task
          </button>
        </div>
      )}

      {userRole === "manager" && (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-green-600 w-8 h-8" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Manage Team</h3>
          <p className="text-gray-600 text-sm mb-4">
            View and manage team members
          </p>
          <button
            onClick={onViewTeam}
            className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition"
          >
            View Team
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="text-purple-600 w-8 h-8" />
        </div>
        <h3 className="font-semibold text-lg mb-2">Generate Reports</h3>
        <p className="text-gray-600 text-sm mb-4">
          Create team performance reports
        </p>
        <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition">
          Reports
        </button>
      </div>
    </div>
  );
}
