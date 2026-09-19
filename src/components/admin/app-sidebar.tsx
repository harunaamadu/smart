"use client";

import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconHeart,
  IconHelp,
  IconMessageStar,
  IconSearch,
  IconSettings,
  IconShoppingBag,
  IconUsers,
} from "@tabler/icons-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavDocuments } from "./nav-documents";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { Logo } from "../shared";
import { useCurrentUserState } from "@/lib/auth/client";
import Link from "next/link";

// TODO: confirm these routes once the corresponding admin pages exist.
const navMain = [
  { title: "Dashboard", url: "/admin", icon: IconDashboard },
  { title: "Orders", url: "/admin/orders", icon: IconShoppingBag },
  { title: "Customers", url: "/admin/customers", icon: IconUsers },
  { title: "Analytics", url: "/admin/analytics", icon: IconChartBar },
];

// Repurposed from the shadcn demo's "documents" section — quick links into
// customer-generated content, rather than the original CMS-document links.
const insights = [
  { name: "Reviews", url: "/admin/reviews", icon: IconMessageStar },
  { name: "Wishlists", url: "/admin/wishlists", icon: IconHeart },
];

const navSecondary = [
  { title: "Settings", url: "/admin/settings", icon: IconSettings },
  { title: "Get Help", url: "/admin/help", icon: IconHelp },
  { title: "Search", url: "/admin/search", icon: IconSearch },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user } = useCurrentUserState();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/" aria-label="Go to homepage" className="block h-14 w-full">
                <Logo className="h-full! w-auto! mx-auto" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavDocuments items={insights} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.displayName ?? "Admin",
            email: user?.primaryEmail ?? "",
            avatar: user?.profileImageUrl ?? "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}