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
import { Calendar, Clock, Users, ArrowRight } from "lucide-react";
import { getGovServices, serviceSlots } from "@/api/gov";

export function Appointments() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const fetchGovServices = async () => {
      const userString =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      const user = userString ? JSON.parse(userString) : null;

      if (!user?.id) {
        console.warn("No user found, skipping gov services fetch.");
        return;
      }

      try {
        const { data: services } = await getGovServices(user.id);

        const today = new Date();
        const localToday = today.toLocaleDateString("en-CA");

        const withSlots = await Promise.all(
          services.map(async (service: any) => {
            try {
              const { data: slotsData } = await serviceSlots(
                service.service_id,
                localToday
              );

              const formattedSlots = slotsData.map((slot: any) => ({
                time: new Date(slot.start_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                Booked: slot.reserved_count,
                total: slot.max_capacity,
                status: slot.status,
              }));

              return { ...service, slots: formattedSlots };
            } catch (slotErr) {
              console.error(
                `Error fetching slots for service ${service.reservation_id}:`,
                slotErr
              );
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
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Appointment Management
        </h1>
        <p className="text-muted-foreground">Manage service appointments</p>
      </div>

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
                {service.slots.map((slot, index) => (
                  <Link
                    key={index}
                    to={`/services/appointments/${
                      service.service_id
                    }/${slot.time.replace(/[:\s]/g, "-").toLowerCase()}`}
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
                            {slot.Booked}/{slot.total}
                          </span>
                        </div>
                        <Badge
                          variant={
                            slot.Booked >= slot.total
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {slot.Booked < slot.total
                            ? `${slot.Booked} Booked`
                            : "Full"}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="pt-2 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Capacity</span>
                  <span className="font-medium text-foreground">
                    {service.slots.reduce((acc, slot) => acc + slot.total, 0)}{" "}
                    slots/day
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Booked Today</span>
                  <span className="font-medium text-success">
                    {service.slots.reduce((acc, slot) => acc + slot.Booked, 0)}{" "}
                    slots
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
