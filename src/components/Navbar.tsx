
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

interface NavbarProps {
  userRole?: "shopkeeper" | "customer" | null;
  userName?: string | null;
}

const Navbar = ({ userRole, userName }: NavbarProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Handle logout functionality here (will be implemented with Supabase)
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-brand-blue">BillBuddy</span>
          </Link>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-brand-blue transition-colors">
            Home
          </Link>
          {userRole && (
            <Link to="/dashboard" className="text-sm font-medium hover:text-brand-blue transition-colors">
              Dashboard
            </Link>
          )}
          {userRole === "shopkeeper" && (
            <Link to="/customers" className="text-sm font-medium hover:text-brand-blue transition-colors">
              Customers
            </Link>
          )}
          {userRole === "customer" && (
            <Link to="/payments" className="text-sm font-medium hover:text-brand-blue transition-colors">
              My Payments
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {userRole ? (
            <>
              <span className="text-sm mr-2">Hi, {userName}</span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate("/login")} variant="default">
              Login
            </Button>
          )}
        </div>

        {/* Mobile navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:w-[300px]">
            <nav className="flex flex-col gap-4 mt-6">
              <Link 
                to="/" 
                className="text-sm font-medium hover:text-brand-blue transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              {userRole && (
                <Link 
                  to="/dashboard" 
                  className="text-sm font-medium hover:text-brand-blue transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {userRole === "shopkeeper" && (
                <Link 
                  to="/customers" 
                  className="text-sm font-medium hover:text-brand-blue transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Customers
                </Link>
              )}
              {userRole === "customer" && (
                <Link 
                  to="/payments" 
                  className="text-sm font-medium hover:text-brand-blue transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  My Payments
                </Link>
              )}
              
              <div className="mt-4">
                {userRole ? (
                  <>
                    <p className="text-sm mb-2">Hi, {userName}</p>
                    <Button variant="outline" onClick={handleLogout} className="w-full">
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => {
                      navigate("/login");
                      setIsOpen(false);
                    }} 
                    variant="default" 
                    className="w-full"
                  >
                    Login
                  </Button>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
