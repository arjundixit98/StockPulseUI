
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Newspaper, 
  LineChart, 
  Bell,
  Menu,
  X,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NavItem = ({ 
  to, 
  label, 
  icon: Icon, 
  active
}: { 
  to: string; 
  label: string; 
  icon: React.ElementType; 
  active: boolean;
}) => (
  <Link 
    to={to}
    className={cn(
      "flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300",
      active 
        ? "bg-primary text-primary-foreground" 
        : "hover:bg-muted"
    )}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </Link>
);

export const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { to: '/', label: 'Screener', icon: BarChart3 },
    { to: '/news', label: 'News', icon: Newspaper },
    { to: '/multi-graph', label: 'Multi Graph', icon: LineChart },
    { to: '/portfolio', label: 'Portfolio', icon: Briefcase },
    { to: '/recommendations', label: 'Recommendations', icon: Bell },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "py-3 glass-card border-b border-border/50" 
          : "py-5 bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-semibold text-xl">StockPulse</span>
          </Link>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="block md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <NavItem 
                key={item.to}
                to={item.to}
                label={item.label}
                icon={item.icon}
                active={location.pathname === item.to}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <div className="md:hidden py-4 px-4 glass-card mt-2 mx-4 rounded-lg border border-border/50">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavItem 
                key={item.to}
                to={item.to}
                label={item.label}
                icon={item.icon}
                active={location.pathname === item.to}
              />
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
