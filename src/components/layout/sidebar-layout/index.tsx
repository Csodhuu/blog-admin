"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  BookImage,
  FileUser,
  Medal,
  PlaneTakeoff,
  TentTree,
  UserStar,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function MainSidebar() {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<string | null>(pathname);

  const baseMenuItems = [
    {
      id: "/",
      label: "Админ хэрэглэгчид",
      icon: UserStar,
      href: "/admin-user",
    },
    { id: "/about", label: "Танилцуулга", icon: BookImage, href: "/about" },
    {
      id: "/partner",
      label: "Хамтрагч байгууллага",
      icon: BookImage,
      href: "/partner",
    },
    { id: "/album", label: "Зургийн цомог", icon: BookImage, href: "/album" },
    { id: "/camps", label: "Зуслангууд", icon: TentTree, href: "/camps" },
    {
      id: "/competitions",
      label: "Тэмцээнүүд",
      icon: Medal,
      href: "/competitions",
    },
    { id: "/travel", label: "Аялал", icon: PlaneTakeoff, href: "/travel" },
    { id: "/contact", label: "Холбоо барих", icon: FileUser, href: "/contact" },
  ];

  const isActive = (href?: string) =>
    !!href &&
    (activeItem === href || pathname === href || pathname.startsWith(href));

  return (
    <Sidebar collapsible="icon" className="border-r shadow-lg ">
      <SidebarHeader className="h-16 px-4 border-b flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center justify-center h-full"
        >
          <div className="h-8 px-2 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold mr-2">
            Блог админ самбар
          </div>
        </Link>
        <MobileCloseButton />
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarMenu>
          {baseMenuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                onClick={() => item.href && setActiveItem(item.href)}
                tooltip={item.label}
                className={cn(
                  "text-sm font-medium",
                  isActive(item.href)
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}

function MobileCloseButton() {
  const { setOpenMobile } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setOpenMobile(false)}
      className="lg:hidden"
    >
      <X className="h-5 w-5" />
    </Button>
  );
}
