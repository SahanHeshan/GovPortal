import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Clock } from "lucide-react";

export function AppointmentSettings() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Appointment Settings</h1>
        <p className="text-muted-foreground">Configure appointment time slots and availability</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Slot Management
          </CardTitle>
          <CardDescription>
            This page will contain settings for managing appointment time slots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Settings Configuration</h3>
              <p className="text-muted-foreground">Appointment settings interface will be implemented here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}