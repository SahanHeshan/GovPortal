import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, ArrowRight } from "lucide-react";

// Dummy data for services and time slots
const services = [
  {
    id: "birth-cert",
    name: "Birth Certificate",
    description: "Official birth certificate issuance",
    slots: [
      { time: "09:00 AM", available: 5, total: 10 },
      { time: "10:00 AM", available: 2, total: 10 },
      { time: "11:00 AM", available: 0, total: 10 },
      { time: "02:00 PM", available: 8, total: 10 },
    ]
  },
  {
    id: "marriage-cert", 
    name: "Marriage Certificate",
    description: "Official marriage certificate issuance",
    slots: [
      { time: "09:00 AM", available: 3, total: 8 },
      { time: "10:00 AM", available: 1, total: 8 },
      { time: "11:00 AM", available: 4, total: 8 },
      { time: "02:00 PM", available: 0, total: 8 },
    ]
  },
  {
    id: "business-license",
    name: "Business License",
    description: "New business registration and licensing",
    slots: [
      { time: "09:00 AM", available: 2, total: 6 },
      { time: "10:00 AM", available: 0, total: 6 },
      { time: "02:00 PM", available: 3, total: 6 },
      { time: "03:00 PM", available: 1, total: 6 },
    ]
  }
];

export function Appointments() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Appointment Management</h1>
        <p className="text-muted-foreground">Manage service appointments and time slots</p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                {service.name}
              </CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {service.slots.map((slot, index) => (
                  <Link
                    key={index}
                    to={`/services/appointments/${service.id}/${slot.time.replace(/[:\s]/g, '-').toLowerCase()}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{slot.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {slot.available}/{slot.total}
                          </span>
                        </div>
                        <Badge 
                          variant={slot.available > 0 ? "secondary" : "destructive"}
                          className="text-xs"
                        >
                          {slot.available > 0 ? `${slot.available} Available` : "Full"}
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
                    {service.slots.reduce((acc, slot) => acc + slot.total, 0)} slots/day
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available Today</span>
                  <span className="font-medium text-success">
                    {service.slots.reduce((acc, slot) => acc + slot.available, 0)} slots
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