import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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

// Dummy appointment data
const appointmentData = {
  "birth-cert": {
    "09-00-am": [
      {
        id: "A001",
        name: "John Doe",
        phone: "+94 77 123 4567",
        email: "john@email.com",
        documents: ["NIC Copy", "Birth Form"],
        status: "confirmed",
        time: "09:00 AM",
      },
      {
        id: "A002",
        name: "Jane Smith",
        phone: "+94 77 234 5678",
        email: "jane@email.com",
        documents: ["NIC Copy", "Birth Form"],
        status: "confirmed",
        time: "09:15 AM",
      },
      {
        id: "A003",
        name: "Bob Wilson",
        phone: "+94 77 345 6789",
        email: "bob@email.com",
        documents: ["NIC Copy"],
        status: "pending",
        time: "09:30 AM",
      },
    ],
    "10-00-am": [
      {
        id: "A004",
        name: "Alice Brown",
        phone: "+94 77 456 7890",
        email: "alice@email.com",
        documents: ["NIC Copy", "Birth Form"],
        status: "confirmed",
        time: "10:00 AM",
      },
      {
        id: "A005",
        name: "Charlie Davis",
        phone: "+94 77 567 8901",
        email: "charlie@email.com",
        documents: ["NIC Copy", "Birth Form", "Marriage Cert"],
        status: "confirmed",
        time: "10:15 AM",
      },
    ],
  },
};

const serviceNames = {
  "birth-cert": "Birth Certificate",
  "marriage-cert": "Marriage Certificate",
  "business-license": "Business License",
};

export function AppointmentDetails() {
  const { serviceId, timeSlot } = useParams<{
    serviceId: string;
    timeSlot: string;
  }>();

  if (!serviceId || !timeSlot) {
    return <div>Invalid appointment details</div>;
  }

  const appointments =
    appointmentData[serviceId as keyof typeof appointmentData]?.[
      timeSlot as keyof (typeof appointmentData)[keyof typeof appointmentData]
    ] || [];
  const serviceName =
    serviceNames[serviceId as keyof typeof serviceNames] || serviceId;
  const formattedTime = timeSlot.replace(/-/g, " ").toUpperCase();

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
          <h1 className="text-3xl font-bold text-foreground">{serviceName}</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {formattedTime} Time Slot
          </p>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.length === 0 ? (
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
          appointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {appointment.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {appointment.time}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant={
                      appointment.status === "confirmed"
                        ? "secondary"
                        : "outline"
                    }
                    className={
                      appointment.status === "confirmed"
                        ? "bg-success/20 text-success"
                        : ""
                    }
                  >
                    {appointment.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {appointment.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">
                        {appointment.email}
                      </span>
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
                          {appointment.documents.map((doc, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {appointment.status === "pending" && (
                    <>
                      <Button variant="government" size="sm">
                        Confirm
                      </Button>
                    </>
                  )}{" "}
                  <Button size="sm">Contact</Button>
                  <Button variant="destructive" size="sm">
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
