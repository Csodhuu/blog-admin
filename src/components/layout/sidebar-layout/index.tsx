"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Box,
  Car,
  CarFront,
  FileText,
  LayoutDashboard,
  PackagePlus,
  ShoppingBag,
  Wrench,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function MainSidebar() {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<string | null>(pathname);

  const baseMenuItems = [
    { id: "/", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { id: "/report", label: "Тайлан", icon: FileText, href: "/report" },
    {
      id: "warehouse-product",
      label: "Агуулахын удирдлага",
      href: "/warehouse-product",
      icon: Box,
      children: [
        {
          id: "warehouse-product",
          label: "Үндсэн агуулах",
          href: "/warehouse-product",
        },
        {
          id: "warehouse-product-item",
          label: "Сэлбэг орлогодох",
          href: "/warehouse-product-item",
          icon: PackagePlus,
        },
      ],
    },
    { id: "order", label: "Худалдаа", icon: ShoppingBag, href: "/order" },
    {
      id: "service-order",
      label: "Засвар үйлчилгээ",
      icon: CarFront,
      href: "/service-order",
    },
    {
      id: "product-sales",
      label: "Бараа борлуулалт",
      icon: ShoppingBag,
      href: "/product-sales",
    },
    { id: "ub-cab", label: "UB cab", icon: Car, href: "/ub-cab" },
    {
      id: "service-price",
      label: "Засвар үйлчилгээ тохиргоо",
      icon: Wrench,
      href: "/service-price",
    },
    {
      id: "package",
      label: "Багц үйлчилгээний тохиргоо",
      icon: PackagePlus,
      href: "/package",
    },
  ];

  const isActive = (href?: string) =>
    !!href &&
    (activeItem === href || pathname === href || pathname.startsWith(href));

  return (
    <Sidebar collapsible="icon" className="border-r shadow-lg ">
      <SidebarHeader className="h-16 px-4 border-b flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center justify-center">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold mr-2">
            A
          </div>
          <span className="text-xl font-bold group-data-[collapsible=icon]:hidden">
            asdas
          </span>
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

              {item.children && (
                <SidebarMenuSub className="ml-6 mt-1 space-y-1 border-l border-gray-200 dark:border-gray-700">
                  {item.children.map((sub) => (
                    <SidebarMenuSubItem key={sub.id}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={isActive(sub.href)}
                        onClick={() => setActiveItem(sub.href)}
                        className={cn(
                          "text-sm flex items-center justify-between w-full",
                          isActive(sub.href)
                            ? "text-purple-600 font-semibold"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        )}
                      >
                        <Link
                          href={sub.href}
                          className="flex items-center justify-between w-full"
                        >
                          <span>{sub.label}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
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
