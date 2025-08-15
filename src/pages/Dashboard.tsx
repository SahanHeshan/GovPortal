import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  Calendar,
  FileText,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react";

// Dummy data for statistics
const stats = [
  {
    title: "Total Appointments",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: Calendar,
    description: "This month",
  },
  {
    title: "Document Requests",
    value: "856",
    change: "+8%",
    trend: "up",
    icon: FileText,
    description: "Pending processing",
  },
  {
    title: "Active Users",
    value: "342",
    change: "+5%",
    trend: "up",
    icon: Users,
    description: "Currently registered",
  },
  {
    title: "Average Wait Time",
    value: "18 min",
    change: "-3%",
    trend: "down",
    icon: Clock,
    description: "For appointments",
  },
];

const recentActivity = [
  {
    id: 1,
    type: "appointment",
    service: "Birth Certificate",
    time: "2 hours ago",
    status: "completed",
  },
  {
    id: 2,
    type: "document",
    service: "Land Registration",
    time: "4 hours ago",
    status: "pending",
  },
  {
    id: 3,
    type: "appointment",
    service: "Marriage Certificate",
    time: "6 hours ago",
    status: "cancelled",
  },
  {
    id: 4,
    type: "document",
    service: "Business License",
    time: "1 day ago",
    status: "approved",
  },
];

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your office operations
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp
                  className={`mr-1 h-3 w-3 ${
                    stat.trend === "up" ? "text-success" : "text-destructive"
                  }`}
                />
                <span
                  className={
                    stat.trend === "up" ? "text-success" : "text-destructive"
                  }
                >
                  {stat.change}
                </span>
                <span className="ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest service requests and appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {activity.type === "appointment" ? (
                      <Calendar className="h-4 w-4 text-primary" />
                    ) : (
                      <FileText className="h-4 w-4 text-accent" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {activity.service}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      activity.status === "completed"
                        ? "bg-success/20 text-success"
                        : activity.status === "pending"
                        ? "bg-warning/20 text-warning"
                        : activity.status === "approved"
                        ? "bg-success/20 text-success"
                        : "bg-destructive/20 text-destructive"
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Overview
            </CardTitle>
            <CardDescription>
              Appointments and document requests over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  Chart will be integrated here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
