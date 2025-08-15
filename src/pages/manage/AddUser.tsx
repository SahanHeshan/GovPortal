import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Users } from "lucide-react";

export function AddUser() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Add New User</h1>
        <p className="text-muted-foreground">Create and verify new user accounts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>
            This page will contain the interface for adding and verifying new users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">User Creation Interface</h3>
              <p className="text-muted-foreground">Add new user functionality will be implemented here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}