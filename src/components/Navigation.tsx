import { NavLink } from "./NavLink";
import { Shield, Menu, X, LogOut, Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center gap-2 text-xl font-bold text-trust">
            <Shield className="w-6 h-6" />
            SafeSpace
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink
              to="/"
              className="text-foreground hover:text-trust transition-colors"
              activeClassName="text-trust font-semibold"
            >
              Home
            </NavLink>
            <NavLink
              to="/report"
              className="text-foreground hover:text-trust transition-colors"
              activeClassName="text-trust font-semibold"
            >
              Report
            </NavLink>
            <NavLink
              to="/transparency"
              className="text-foreground hover:text-trust transition-colors"
              activeClassName="text-trust font-semibold"
            >
              Transparency
            </NavLink>
            <NavLink
              to="/dashboard"
              className="text-foreground hover:text-trust transition-colors"
              activeClassName="text-trust font-semibold"
            >
              Dashboard
            </NavLink>
            
            {user ? (
              <>
                <Button variant="outline" size="sm" asChild>
                  <NavLink to="/community/register">
                    <Building2 className="w-4 h-4 mr-2" />
                    Register Community
                  </NavLink>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="default" size="sm" asChild>
                <NavLink to="/auth">Sign In</NavLink>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <NavLink
                to="/"
                className="text-foreground hover:text-trust transition-colors"
                activeClassName="text-trust font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/report"
                className="text-foreground hover:text-trust transition-colors"
                activeClassName="text-trust font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Report
              </NavLink>
              <NavLink
                to="/transparency"
                className="text-foreground hover:text-trust transition-colors"
                activeClassName="text-trust font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Transparency
              </NavLink>
              <NavLink
                to="/dashboard"
                className="text-foreground hover:text-trust transition-colors"
                activeClassName="text-trust font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </NavLink>
              
              {user ? (
                <>
                  <NavLink
                    to="/community/register"
                    className="text-foreground hover:text-trust transition-colors"
                    activeClassName="text-trust font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register Community
                  </NavLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-foreground hover:text-trust transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <NavLink
                  to="/auth"
                  className="text-foreground hover:text-trust transition-colors"
                  activeClassName="text-trust font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </NavLink>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
