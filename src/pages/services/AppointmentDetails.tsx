import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
} from "lucide-react";
import { ReservedUser } from "@/api/interfaces";
import { getReservedUsers } from "@/api/gov";

export function AppointmentDetails() {
  const { serviceId, timeSlot } = useParams<{
    serviceId: string;
    timeSlot: string;
  }>();

  const [reservedUsers, setReservedUsers] = useState<ReservedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!timeSlot) return;

    setLoading(true);
    getReservedUsers(timeSlot)
      .then((res) => setReservedUsers(res.data))
      .catch(() => setError("Failed to fetch appointments"))
      .finally(() => setLoading(false));
  }, [timeSlot]);

  if (!serviceId || !timeSlot) {
    return <div>Invalid appointment details</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/services/appointments">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Appointments
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Service {serviceId}
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {timeSlot.replace(/-/g, " ").toUpperCase()} Time Slot
          </p>
        </div>
      </div>

      {loading ? (
        <div>Loading appointments...</div>
      ) : error ? (
        <div>{error}</div>
      ) : reservedUsers.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No Appointments
              </h3>
              <p className="text-muted-foreground">
                No appointments scheduled for this time slot.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {reservedUsers.map(({ citizen, reference_id }) => {
            const documents = citizen?.document_link || [];
            return (
              <Card key={reference_id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {citizen.first_name} {citizen.last_name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {timeSlot.replace(/-/g, " ").toUpperCase()}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-success/20 text-success"
                    >
                      Active
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{citizen.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{citizen.email}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <span className="text-muted-foreground">
                            Documents:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {documents.map((doc, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                <a
                                  href={doc.url}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {doc.title}
                                </a>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </>
      )}
    </div>
  );
}
