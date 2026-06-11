import { Logo } from "./logo";
import { SidebarRouts } from "./sidebar-routes";

export const Sidebar = () => {
  return (
    <aside className="hidden lg:flex fixed flex-col w-[300px] left-0 shrink-0 h-full">
      <Logo />
      <SidebarRouts />
    </aside>
  )
}