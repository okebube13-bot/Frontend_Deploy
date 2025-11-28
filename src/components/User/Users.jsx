// components/Users/Users.js
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data.users);
    } catch (error) {
      setError("Failed to fetch users");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredUsers = () => {
    switch (filter) {
      case "manager":
        return users.filter((user) => user.role === "manager");
      case "staff":
        return users.filter((user) => user.role === "staff");
      case "student":
        return users.filter((user) => user.role === "student");
      default:
        return users;
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      manager: { color: "bg-purple-100 text-purple-800", label: "Manager" },
      staff: { color: "bg-blue-100 text-blue-800", label: "Staff" },
      student: { color: "bg-green-100 text-green-800", label: "Student" },
    };

    const config = roleConfig[role] || roleConfig.student;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const filteredUsers = getFilteredUsers();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all users in the system and their roles
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                filter === "all"
                  ? "bg-blue-100 text-blue-800 border border-blue-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Users ({users})
            </button>
            <button
              onClick={() => setFilter("manager")}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                filter === "manager"
                  ? "bg-purple-100 text-purple-800 border border-purple-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              👑 Managers ({users.filter((u) => u.role === "manager").length})
            </button>
            <button
              onClick={() => setFilter("staff")}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                filter === "staff"
                  ? "bg-blue-100 text-blue-800 border border-blue-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              👨‍💼 Staff ({users.filter((u) => u.role === "staff").length})
            </button>
            <button
              onClick={() => setFilter("student")}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                filter === "student"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🎓 Students ({users.filter((u) => u.role === "student").length})
            </button>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl">👥</span>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No users match your current filter.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredUsers.map((userItem) => (
              <div
                key={userItem._id}
                className="p-6 hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-lg font-medium text-gray-600">
                          {userItem.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* User Info */}
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {userItem.name}
                        </h3>
                        {getRoleBadge(userItem.role)}
                        {userItem._id === user._id && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{userItem.email}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        User ID: {userItem._id}
                      </p>
                    </div>
                  </div>

                  {/* User Stats (could be enhanced with actual task counts) */}
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      Joined {new Date(userItem.createdAt).toLocaleDateString()}
                    </div>
                    {/* Could add task statistics here when available */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            User Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {users.length}
              </div>
              <div className="text-sm text-gray-500">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {users.filter((u) => u.role === "manager").length}
              </div>
              <div className="text-sm text-gray-500">Managers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {users.filter((u) => u.role === "staff").length}
              </div>
              <div className="text-sm text-gray-500">Staff</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {users.filter((u) => u.role === "student").length}
              </div>
              <div className="text-sm text-gray-500">Students</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
