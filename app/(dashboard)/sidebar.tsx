import { Logo } from "./logo";
import { SidebarRouts } from "./sidebar-routes";

export const Sidebar = () => {
  return (
    <aside className="max-md:hidden flex fixed inset-y-0 left-0 z-30 flex-col w-[300px] shrink-0 bg-muted">
      <Logo />
      <SidebarRouts />
    </aside>
  )
}
