import { Menu } from "lucide-react";
import { useState } from "react";
import SideMenu from "./SideMenu";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full max-w-md mx-auto relative bg-[#F6F6F7]">
      <header className="fixed top-0 left-0 right-0 max-w-md mx-auto z-50 bg-white/80 backdrop-blur-md">
        <div className="flex items-center p-4">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold mx-auto">ONE APP</h1>
        </div>
      </header>

      <main className="pt-16 pb-4 px-4">{children}</main>

      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
}