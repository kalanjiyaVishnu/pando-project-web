import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { SIDEBAR_TABS } from '@/lib/config'
import Link from 'next/link'
import { LayoutDashboard, Truck, Package, Car, Settings, Ship } from 'lucide-react'

const iconMap: Record<string, any> = {
  Transporter: Truck,
  Material: Package,
  'Vehicle Type': Car,
  Shipments: Ship,
}

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r shadow-sm">
      <SidebarHeader className="h-16 border-b flex flex-row items-center justify-start group-data-[collapsible=icon]:justify-center px-4 group-data-[collapsible=icon]:px-0 overflow-hidden">
        <div className="flex items-center gap-3 shrink-0 transition-all duration-300">
          <div className="bg-primary/10 rounded-lg p-2 flex items-center justify-center shrink-0">
            <LayoutDashboard className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight group-data-[collapsible=icon]:hidden whitespace-nowrap">
            Admin Panel
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            {SIDEBAR_TABS.map((tab) => {
              const Icon = iconMap[tab.name] || LayoutDashboard
              return (
                <SidebarMenuItem key={tab.name}>
                  <SidebarMenuButton asChild tooltip={tab.name} className="h-11 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all group/menu-button">
                    <Link href={tab.href} className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
                      <Icon className="h-5 w-5 text-muted-foreground group-hover/menu-button:text-primary transition-colors shrink-0" />
                      <span className="font-medium group-data-[collapsible=icon]:hidden whitespace-nowrap">
                        {tab.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="h-12 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <div className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center">
                <div className="bg-muted rounded-full p-2 shrink-0 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden overflow-hidden">
                  <span className="text-sm font-semibold truncate">Settings</span>
                  <span className="text-xs text-muted-foreground truncate">Preferences</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}



