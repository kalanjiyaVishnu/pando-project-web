import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar'

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>Transporter</SidebarGroup>
        <SidebarGroup>Material</SidebarGroup>
        <SidebarGroup>Vehicle Type</SidebarGroup>
        <SidebarGroup>Shipments</SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
