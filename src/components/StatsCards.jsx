import { FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function StatsCards({ stats }) {
  const cards = [
    {
      label: "Total Tasks",
      value: stats.total,
      icon: FileText,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: Clock,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      label: "Overdue",
      value: stats.overdue,
      icon: AlertTriangle,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{card.label}</p>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
            <div
              className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}
            >
              <card.icon className={card.iconColor} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
