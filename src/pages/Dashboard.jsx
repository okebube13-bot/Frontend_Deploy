import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import API from "../utils/axiosInstance";
import Header from "../components/Layout/Header";
import StatsCards from "../components/StatsCards";
import ActionCards from "../components/ActionCards";
import ActivitySection from "../components/ActivitySection";
import TasksTable from "../components/Tasks/TasksTable";
import TeamMembers from "../components/TeamMembers";
import AddTaskModal from "../components/AddTaskModal";

export const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!token) return;
    const loadAll = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchTasks(), fetchUsers()]);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, [token]);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks/get");
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.log("Error fetching tasks:", err);
      setTasks([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users/");
      setUsers(res.data.users || []);
    } catch (err) {
      console.log("Error fetching users:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await API.put(`/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // Calculate stats
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    overdue: tasks.filter(
      (t) => t.status !== "completed" && new Date(t.dueDate) < new Date()
    ).length,
  };

  // Get recent activity
  const recentActivity = [...tasks]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3);

  // Get upcoming deadlines
  const upcomingDeadlines = [...tasks]
    .filter((t) => t.status !== "completed")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        logout={logout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content with mobile-first responsive design */}
      <main className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 py-3 sm:py-6">
        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center min-h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div className="space-y-4 sm:space-y-6">
                {/* Welcome Section - Mobile optimized */}
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 break-words">
                    Dashboard
                  </h2>
                  <p className="text-xs xs:text-sm text-gray-600 mt-1 sm:mt-2 break-words leading-relaxed">
                    Welcome back, {user?.name}! Here's your task overview.
                  </p>
                </div>

                {/* Stats Cards - Horizontal scroll on mobile */}
                <div className="mb-4 sm:mb-6 -mx-3 xs:mx-0">
                  <div className="px-3 xs:px-0">
                    <StatsCards stats={stats} />
                  </div>
                </div>

                {/* Action Cards - Stack on mobile */}
                <div className="mb-4 sm:mb-6">
                  <ActionCards
                    userRole={user?.role}
                    onNewTask={() => {
                      setIsModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    onViewTeam={() => {
                      setActiveTab("staff");
                      setIsMobileMenuOpen(false);
                    }}
                  />
                </div>

                {/* Activity Section - Stack on mobile */}
                <div className="mb-4 sm:mb-6">
                  <ActivitySection
                    recentActivity={recentActivity}
                    upcomingDeadlines={upcomingDeadlines}
                  />
                </div>
              </div>
            )}

            {/* Tasks Tab */}
            {activeTab === "tasks" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 sm:shadow sm:border-0">
                <TasksTable
                  tasks={tasks}
                  userRole={user?.role}
                  onNewTask={() => {
                    setIsModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  onDeleteTask={handleDeleteTask}
                  onUpdateStatus={handleUpdateStatus}
                  onRefresh={fetchTasks}
                />
              </div>
            )}

            {/* Staff Tab - Only for managers */}
            {activeTab === "staff" && user?.role === "manager" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 sm:shadow sm:border-0 overflow-hidden">
                <TeamMembers users={users} role="staff" />
              </div>
            )}

            {/* Students Tab - Only for managers */}
            {activeTab === "students" && user?.role === "manager" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 sm:shadow sm:border-0 overflow-hidden">
                <TeamMembers users={users} role="student" />
              </div>
            )}
          </>
        )}

        {/* Empty States - Mobile optimized */}
        {!loading && tasks.length === 0 && activeTab === "dashboard" && (
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="max-w-xs mx-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                No tasks yet
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                Get started by creating your first task.
              </p>
              {user?.role !== "student" && (
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full justify-center"
                >
                  Create First Task
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Floating Action Button */}
        {user?.role !== "student" && (
          <div className="lg:hidden fixed bottom-6 right-6 z-30">
            <button
              onClick={() => {
                setIsModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        )}
      </main>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onTaskCreated={fetchTasks}
      />

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={() => {
              setActiveTab("dashboard");
              setIsMobileMenuOpen(false);
            }}
            className={`flex flex-col items-center justify-center w-16 h-16 ${
              activeTab === "dashboard" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("tasks");
              setIsMobileMenuOpen(false);
            }}
            className={`flex flex-col items-center justify-center w-16 h-16 ${
              activeTab === "tasks" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className="text-xs mt-1">Tasks</span>
          </button>

          {user?.role === "manager" && (
            <button
              onClick={() => {
                setActiveTab("staff");
                setIsMobileMenuOpen(false);
              }}
              className={`flex flex-col items-center justify-center w-16 h-16 ${
                activeTab === "staff" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              <span className="text-xs mt-1">Team</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
