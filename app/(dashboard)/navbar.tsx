import { UserButton } from "@/features/auth/components/user-button";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-20 w-full flex items-center p-4 h-[68px] bg-white border-b">
      <div className="ml-auto">
        <UserButton />
      </div>
    </nav>
  )
}
