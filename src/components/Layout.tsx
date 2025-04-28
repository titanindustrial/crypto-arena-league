
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "../contexts/AuthContext";
import { 
  Home, 
  Trophy, 
  User, 
  LogOut, 
  Lock, 
  BarChart4, 
  Menu, 
  X,
  Settings,
  PlusCircle,
  Bell
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: <Home className="w-5 h-5 mr-2" />,
      auth: false,
    },
    {
      name: "Contests",
      path: "/contests",
      icon: <Trophy className="w-5 h-5 mr-2" />,
      auth: false,
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <BarChart4 className="w-5 h-5 mr-2" />,
      auth: true,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <User className="w-5 h-5 mr-2" />,
      auth: true,
    },
    {
      name: "Admin",
      path: "/admin",
      icon: <Settings className="w-5 h-5 mr-2" />,
      admin: true,
    }
  ];
  
  const filteredNavItems = navItems.filter(item => {
    if (item.admin && (!user || !user.isAdmin)) {
      return false;
    }
    if (item.auth && !isAuthenticated) {
      return false;
    }
    return true;
  });

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/60 backdrop-blur-lg">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="font-bold text-2xl gradient-text flex items-center">
                <span className="text-primary">Crypto</span>
                <span className="text-crypto-gold">Arena</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <Link to="/create-contest">
                    <Button size="sm" variant="outline" className="flex items-center">
                      <PlusCircle className="w-4 h-4 mr-1" /> New Contest
                    </Button>
                  </Link>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="flex items-center space-x-2">
                  <div className="text-sm">
                    <p className="font-medium">{user?.username}</p>
                    <p className="text-muted-foreground text-xs">{user?.points} points</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={logout}>
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" className="flex items-center">
                    <Lock className="w-4 h-4 mr-2" /> Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="flex items-center">
                    <User className="w-4 h-4 mr-2" /> Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute w-full bg-card border-b border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              
              <Separator className="my-2" />
              
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2">
                    <div className="text-sm">
                      <p className="font-medium">{user?.username}</p>
                      <p className="text-muted-foreground text-xs">{user?.points} points</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 px-3 py-2">
                    <Link to="/create-contest" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                      <Button size="sm" className="w-full flex items-center justify-center">
                        <PlusCircle className="w-4 h-4 mr-1" /> New Contest
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}>
                      <LogOut className="w-4 h-4 mr-1" /> Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-2 px-3 py-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full flex items-center justify-center">
                      <Lock className="w-4 h-4 mr-2" /> Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full flex items-center justify-center">
                      <User className="w-4 h-4 mr-2" /> Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border bg-card/60 backdrop-blur-lg py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="font-bold text-lg">
                <span className="text-primary">Crypto</span>
                <span className="text-crypto-gold">Arena</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mt-4 md:mt-0">
              © {new Date().getFullYear()} CryptoArena. Fantasy trading platform.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
