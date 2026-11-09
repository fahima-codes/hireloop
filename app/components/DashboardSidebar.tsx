import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useSession } from '@/lib/auth-client';
import { Plus } from 'lucide-react';
const menuItemsByRole = {
  seeker: [],
  recruiter: [],
  admin: [],
};

export function AppSidebar() {
  const { data: session, isPending } = useSession();
  const role = session?.user?.role;
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
        <SidebarGroup>
          <SidebarMenu>
            {
              // menuItemsByRole[role].map(item => (
              //<SidebarMenuItem key={item.id}>
              //  <SidebarMenuButton render={<a href={item.url} />}>
              //   <item.icon />
              //   <span>{item.name}</span>
              // </SidebarMenuButton>
              //</SidebarMenuItem>
              // ))
            }
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
