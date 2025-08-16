import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, Calendar, FileText, TrendingUp, Clock } from "lucide-react";
import {
  getAppointmentsPercentageChange,
  getAppointmentsTodayCount,
  getMostReservedSlot,
  getOverallSatisfaction,
  getGovServices,
} from "@/api/gov";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { format, parseISO } from "date-fns";

type Trend = "up" | "down";
type StatItem = {
  title: string;
  value: string;
  change?: string;
  trend?: Trend;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  description?: string;
};

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
  const [stats, setStats] = useState<StatItem[]>([
    {
      title: "Today's Appointments",
      value: "—",
      change: "",
      trend: "up",
      icon: Calendar,
      description: "Based on selected service",
    },
    {
      title: "Change vs Yesterday",
      value: "—",
      change: "",
      trend: "up",
      icon: FileText,
      description: "Appointments percentage change",
    },
    {
      title: "Most Slot Reserving Period",
      value: "—",
      change: "",
      trend: "up",
      icon: Clock,
      description: "Time with highest reservations",
    },
    {
      title: "Overall Satisfaction",
      value: "—",
      change: "",
      trend: "up",
      icon: BarChart3,
      description: "Avg rating across categories",
    },
  ]);

  const [serviceId, setServiceId] = useState<number | null>(null);
  const [mostSeries, setMostSeries] = useState<{ date: string; max_reserved: number }[]>([]);

  const user = useMemo(() => {
    const userString =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    return userString ? JSON.parse(userString) : null;
  }, []);

  useEffect(() => {
    // Resolve a service_id to use for analytics
    const pickServiceId = async () => {
      // 1) Try localStorage cached services
      const stored =
        typeof window !== "undefined" ? localStorage.getItem("services") :
        null;
      if (stored) {
        try {
          const services = JSON.parse(stored);
          if (Array.isArray(services) && services.length > 0) {
            setServiceId(services[0].service_id);
            return;
          }
        } catch {}
      }
      // 2) Fallback: fetch services for this user
      if (user?.id) {
        try {
          const { data } = await getGovServices(user.id);
          if (Array.isArray(data) && data.length > 0) {
            setServiceId(data[0].service_id);
          }
        } catch (e) {
          // ignore; stats will remain placeholders
          console.error(e);
        }
      }
    };
    pickServiceId();
  }, [user?.id]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!serviceId) return;
      try {
        const [todayRes, changeRes, mostRes, satisfactionRes] = await Promise.all([
          getAppointmentsTodayCount(serviceId),
          getAppointmentsPercentageChange(serviceId),
          getMostReservedSlot(serviceId),
          getOverallSatisfaction(),
        ]);

        const todayCount = todayRes.data.today_count ?? 0;
        const pct = Number(changeRes.data.percentage_change ?? 0);
        const trend: Trend = pct >= 0 ? "up" : "down";
        const pctLabel = `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;

        const mostArr = Array.isArray(mostRes.data) ? mostRes.data : [];
        // Build series for chart (sorted by date asc, label formatted)
        const series = mostArr
          .slice()
          .sort((a, b) => {
            const da = Date.parse(a.booking_date);
            const db = Date.parse(b.booking_date);
            return (isNaN(da) ? 0 : da) - (isNaN(db) ? 0 : db);
          })
          .map((d) => {
            let label = d.booking_date;
            try {
              label = format(parseISO(d.booking_date), "MMM d");
            } catch {}
            return { date: label, max_reserved: Number(d.max_reserved) || 0 };
          });
        setMostSeries(series);

        const most = mostArr.length > 0 ? mostArr[0] : null;
        let mostLabel = "—";
        if (most?.start_time) {
          // Build a Date from booking_date + start_time; fallback to today if needed
          let startDt: Date | null = null;
          try {
            startDt = new Date(`${most.booking_date}T${most.start_time}`);
          } catch {
            startDt = null;
          }
          if (!startDt || isNaN(startDt.getTime())) {
            const parts = String(most.start_time).split(":");
            const h = Number(parts[0] || 0);
            const m = Number(parts[1] || 0);
            startDt = new Date();
            startDt.setHours(h, m, 0, 0);
          }
          const endDt = new Date(startDt.getTime() + 60 * 60 * 1000);
          const startLabel = format(startDt, "HH:mm");
          const endLabel = format(endDt, "HH:mm");
          mostLabel = `${startLabel} - ${endLabel}`;
        }
        const mostChange = most ? `${most.max_reserved} reserved` : "";
        const mostDesc = most ? `${most.booking_date}` : "Time with highest reservations";

        const sat = Array.isArray(satisfactionRes.data) ? satisfactionRes.data : [];
        const overallAvg = sat.length
          ? (sat.reduce((acc, it) => acc + (Number(it.avg_rating) || 0), 0) / sat.length)
          : 0;

        const newStats: StatItem[] = [
          {
            title: "Today's Appointments",
            value: String(todayCount),
            change: pctLabel,
            trend,
            icon: Calendar,
            description: "vs yesterday",
          },
          {
            title: "Change vs Yesterday",
            value: pctLabel,
            change: pctLabel,
            trend,
            icon: FileText,
            description: "Appointments percentage change",
          },
          {
            title: "Most Slots Reserving Period",
            value: mostLabel,
            change: mostChange,
            trend: "up",
            icon: Clock,
            description: mostDesc,
          },
          {
            title: "Overall Satisfaction",
            value: sat.length ? `${overallAvg.toFixed(1)}` : "—",
            change: sat.length ? `across ${sat.length} categories` : "",
            trend: "up",
            icon: BarChart3,
            description: "Avg rating",
          },
        ];
        setStats(newStats);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAnalytics();
  }, [serviceId]);
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
              {(stat.change || stat.description) && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp
                    className={`mr-1 h-3 w-3 ${
                      stat.trend === "up" ? "text-success" : "text-destructive"
                    }`}
                  />
                  {stat.change && (
                    <span
                      className={
                        stat.trend === "up" ? "text-success" : "text-destructive"
                      }
                    >
                      {stat.change}
                    </span>
                  )}
                  {stat.description && <span className="ml-1">{stat.description}</span>}
                </div>
              )}
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
        {/* Monthly Overview Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Daily Most-Reserved Slot Count
            </CardTitle>
            <CardDescription>
              Peak-slot reservations across days for the selected service
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mostSeries.length === 0 ? (
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No data to display</p>
                </div>
              </div>
            ) : (
              <ChartContainer
                className="w-full aspect-auto h-72 mx-auto"
                config={{
                  max_reserved: {
                    label: "Max reserved",
                    color: "#ffc107",
                  },
                }}
              >
                <BarChart data={mostSeries} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid vertical={false} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis tickLine={false} axisLine={false} width={32} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="max_reserved" />} />
                  <Bar dataKey="max_reserved" fill="var(--color-max_reserved)" radius={4} />
                  <ChartLegend content={<ChartLegendContent />} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
