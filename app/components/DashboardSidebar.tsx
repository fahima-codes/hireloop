'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useSession } from '@/lib/auth-client';
import {
  Bookmark,
  BriefcaseBusiness,
  Building2,
  Files,
  FileStack,
  LayoutDashboard,
  PlusCircle,
  Search,
  Settings,
  Users,
} from 'lucide-react';
import Link from 'next/link';

type MenuItem = {
  id: string;
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>; // auth-form.tsx-এর icon টাইপ প্যাটার্ন
};

type UserRole = 'seeker' | 'recruiter' | 'admin'; // lib/auth.ts-এর role additionalField অনুযায়ী

// প্রতিটি রোলের সাইডবার মেনু — url গুলো app/dashboard/<role>/... রাউটের সাথে ম্যাপ করা
const menuItemsByRole: Record<UserRole, MenuItem[]> = {
  seeker: [
    {
      id: 'dashboard',
      name: 'Dashboard',
      url: '/dashboard/seeker',
      icon: LayoutDashboard,
    },
    {
      id: 'browse-jobs',
      name: 'Browse Jobs',
      url: '/dashboard/seeker/jobs',
      icon: Search,
    },
    {
      id: 'my-applications',
      name: 'My Applications',
      url: '/dashboard/seeker/applications',
      icon: FileStack,
    },
    {
      id: 'saved-jobs',
      name: 'Saved Jobs',
      url: '/dashboard/seeker/saved',
      icon: Bookmark,
    },
    {
      id: 'settings',
      name: 'Settings',
      url: '/dashboard/seeker/settings',
      icon: Settings,
    },
  ],
  // Figma ডিজাইন অনুযায়ী: Dashboard, Manage Jobs, Applications, Settings
  recruiter: [
    {
      id: 'dashboard',
      name: 'Dashboard',
      url: '/dashboard/recruiter',
      icon: LayoutDashboard,
    },
    {
      id: 'dashboard',
      name: 'My Company',
      url: '/dashboard/recruiter/my-company',
      icon: Building2,
    },
    {
      id: 'manage-jobs',
      name: 'Manage Jobs',
      url: '/dashboard/recruiter/jobs',
      icon: BriefcaseBusiness,
    },
    {
      id: 'add-jobs',
      name: 'Add Jobs',
      url: '/dashboard/recruiter/jobs',
      icon: PlusCircle,
    },
    {
      id: 'applications',
      name: 'Applications',
      url: '/dashboard/recruiter/applications',
      icon: Files,
    },
    {
      id: 'settings',
      name: 'Settings',
      url: '/dashboard/recruiter/settings',
      icon: Settings,
    },
  ],
  admin: [
    {
      id: 'dashboard',
      name: 'Dashboard',
      url: '/dashboard/admin',
      icon: LayoutDashboard,
    },
    {
      id: 'manage-users',
      name: 'Manage Users',
      url: '/dashboard/admin/users',
      icon: Users,
    },
    {
      id: 'manage-jobs',
      name: 'Manage Jobs',
      url: '/dashboard/admin/jobs',
      icon: BriefcaseBusiness,
    },
    {
      id: 'reports',
      name: 'Reports',
      url: '/dashboard/admin/reports',
      icon: FileStack,
    },
    {
      id: 'settings',
      name: 'Settings',
      url: '/dashboard/admin/settings',
      icon: Settings,
    },
  ],
};

export function AppSidebar() {
  // useSession থেকে role আসছে — sign-up-এ পাঠানো role additionalField হিসেবে infer করা
  const { data: session } = useSession();
  const role = session?.user?.role as UserRole | undefined;

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {(role ? menuItemsByRole[role] : []).map(item => (
              <SidebarMenuItem key={item.id}>
                <Link
                  href={item.url}
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-gray-100"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
