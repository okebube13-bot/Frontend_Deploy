export default function TeamMembers({ users, role }) {
  const filteredUsers = users.filter((u) => u.role === role);
  const title = role === "staff" ? "Staff Members" : "Students";
  const bgColor = role === "staff" ? "bg-blue-600" : "bg-green-600";
  const badgeColor =
    role === "staff"
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <div key={user._id} className="border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center text-white font-semibold text-lg`}
                >
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <span
                    className={`text-xs ${badgeColor} px-2 py-1 rounded mt-1 inline-block`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
