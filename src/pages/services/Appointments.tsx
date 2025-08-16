import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, ArrowRight, Filter } from "lucide-react";
import { useAppDispatch } from "@/hooks/redux";
import { loadServices } from "@/store/serviceSlice";
import { getGovServices, serviceSlots } from "@/api/gov";

export function Appointments() {
  const dispatch = useAppDispatch();
  const [services, setServices] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const fetchGovServices = async () => {
      const userString =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      const user = userString ? JSON.parse(userString) : null;

      if (!user?.id) return;

      try {
        const { data: services } = await getGovServices(user.id);
        dispatch(loadServices(services));

        const withSlots = await Promise.all(
          services.map(async (service: any) => {
            try {
              const { data: slotsData } = await serviceSlots(
                service.service_id,
                selectedDate
              );

              const formattedSlots = slotsData.map((slot: any) => {
                const start = new Date(
                  `${slot.booking_date}T${slot.start_time}`
                );
                const end = new Date(`${slot.booking_date}T${slot.end_time}`);
                return {
                  slot_id: slot.slot_id,
                  reservation_id: slot.reservation_id,
                  time: `${start.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })} - ${end.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`,
                  booked: slot.reserved_count,
                  total: slot.max_capacity,
                  status: slot.status,
                };
              });

              return { ...service, slots: formattedSlots };
            } catch {
              return { ...service, slots: [] };
            }
          })
        );

        setServices(withSlots);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGovServices();
  }, [dispatch, selectedDate]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-around"></div>
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Appointment Management
        </h1>
        <p className="text-muted-foreground">Manage service appointments</p>
      </div>

      {/* Filters in one row */}
      <Card className="p-2">
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <label className="text-md font-medium text-foreground">Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded px-2 py-1 text-sm w-36"
          />
          {/* Add more filters inline if needed */}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card
            key={service.service_id}
            className="hover:shadow-md transition-shadow"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                {service.service_name_en}
              </CardTitle>
              <CardDescription>{service.description_en}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {service.slots.map((slot: any) => (
                  <Link
                    key={slot.slot_id}
                    to={`/services/appointments/${service.service_id}/${slot.slot_id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                          {slot.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {slot.booked}/{slot.total}
                          </span>
                        </div>
                        <Badge
                          variant={
                            slot.booked >= slot.total
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {slot.booked < slot.total
                            ? `${slot.booked} Booked`
                            : "Full"}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="pt-2 border-t border-border space-y-2">
                {service.slots.length > 0 &&
                  (() => {
                    const totalSlots = service.slots.reduce(
                      (acc: number, slot: any) => acc + slot.total,
                      0
                    );
                    const bookedSlots = service.slots.reduce(
                      (acc: number, slot: any) => acc + slot.booked,
                      0
                    );
                    const bookedPercent =
                      totalSlots > 0 ? (bookedSlots / totalSlots) * 100 : 0;
                    return (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">
                            Booked Today
                          </span>
                          <span className="font-medium text-foreground">
                            {bookedSlots}/{totalSlots}
                          </span>
                        </div>
                        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-3 rounded-full ${
                              bookedPercent >= 100
                                ? "bg-destructive"
                                : "bg-primary"
                            }`}
                            style={{ width: `${bookedPercent}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
