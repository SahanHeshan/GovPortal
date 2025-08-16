import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Calendar,
  FileText,
  Settings,
  Users,
  Clock,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { logout } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";

const serviceItems = [
  { title: "Appointments", url: "/services/appointments", icon: Calendar },
  { title: "Document Processing", url: "/services/documents", icon: FileText },
];

const manageItems = [
  {
    title: "Appointment Settings",
    url: "/manage/appointment-settings",
    icon: Clock,
  },
  {
    title: "Service Settings",
    url: "/manage/service-settings",
    icon: Settings,
  },
  { title: "Add New User", url: "/manage/add-user", icon: Users },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const collapsed = state === "collapsed";

  const isActive = (path: string) => location.pathname === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-sidebar-accent text-sidebar-accent-foreground"
      : "hover:bg-sidebar-accent/50";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        <div className="flex py-4">
          {collapsed && (
            <img src="/logoshort.png" alt="Logo" className="h-10" />
          )}
          {!collapsed && <img src="/logo.png" alt="Logo" className="h-10" />}
        </div>
        {/* Dashboard */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/dashboard" className={getNavCls}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    {!collapsed && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Services */}
        <SidebarGroup>
          <SidebarGroupLabel>Services</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {serviceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Manage */}
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {manageItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with office info and logout */}
      {!collapsed && (
        <SidebarFooter className="p-4">
          <Card className="p-3 bg-sidebar-accent/30">
            <div className="space-y-1 text-xs">
              <div className="flex flex-col items-center">
                <span className="font-medium">{user?.name_en || "N/A"}</span>
                <span className="font-medium">{user?.name_si || "N/A"}</span>
                <span className="font-medium">{user?.name_ta || "N/A"}</span>
              </div>
              <br />
              <div className="flex justify-between">
                <span className="font-medium">Name</span>
                <span className="text-sidebar-foreground/70">
                  {user?.username || "N/A"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium">Access Level</span>
                <span className="text-sidebar-foreground/70">
                  {user?.role || "N/A"}
                </span>
              </div>
            </div>
          </Card>

          <div className="mt-3 space-y-2">
            <Button variant="default" className="w-full" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <div className="flex items-center gap-2 text-xs ">
              <Clock className="w-3 h-3" />
              <span>Auto Logout</span>
              <span className="ml-auto">XX : XX : XX</span>
            </div>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
