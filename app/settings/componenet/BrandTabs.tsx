import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Image,
    FileText,
    PanelRight,
    MessageSquare,
    BarChart3,
    Settings,
    Users,
    Star,
    Home,
    Package,
    Megaphone,
    UserPlus,
    LineChart,
    Menu,
    X,
    Layout
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from "next/link";

type SidebarProps = {
    className?: string;
};

export type NavItem = {
    title: string;
    href: string;
    icon: React.ReactNode;
};

export default function BrandTabs({ className }: SidebarProps) {
    const [activeTab, setActiveTab] = useState('/brand-dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const navItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/brand-dashboard',
            icon: <Home className="h-5 w-5" />,
        },
        {
            title: 'Products',
            href: '/brand-dashboard/products',
            icon: <Package className="h-5 w-5" />,
        },
        {
            title: 'Reviews',
            href: '/brand-dashboard/reviews',
            icon: <MessageSquare className="h-5 w-5" />,
        },
        {
            title: 'Resellers',
            href: '/brand-dashboard/resellers',
            icon: <Users className="h-5 w-5" />,
        },
        {
            title: 'Advertisement',
            href: '/brand-dashboard/advertisement',
            icon: <Megaphone className="h-5 w-5" />,
        },
        // {
        //     title: 'Team Access',
        //     href: '/brand-dashboard/team-access',
        //     icon: <UserPlus className="h-5 w-5" />,
        // },
        // {
        //     title: 'Analytics',
        //     href: '/brand-dashboard/analytics',
        //     icon: <LineChart className="h-5 w-5" />,
        // },
        {
            title: 'Widgets',
            href: '/brand-dashboard/widgets',
            icon: <Layout className="h-5 w-5" />,
        },
        {
            title: 'Settings',
            href: '/brand-dashboard/settings',
            icon: <Settings className="h-5 w-5" />,
        },
    ];

    // Update activeTab when location changes
    useEffect(() => {
        // Check if the current path starts with any of the nav item paths
        const matchingNavItem = navItems.find(item =>
            pathname === item.href || 
            (item.href !== '/brand-dashboard' && pathname.startsWith(item.href))
        );

        if (matchingNavItem) {
            setActiveTab(matchingNavItem.href);
        } else if (pathname === '/brand-dashboard') {
            // Default to dashboard if we're at the root of brand-dashboard
            setActiveTab('/brand-dashboard');
        }
    }, [pathname, navItems]);

    // Close mobile menu when location changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Handle window resize to automatically close mobile menu on larger screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            {/* Overlay to close menu when clicking outside (mobile only) */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-25 md:hidden z-20"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            <div >
                {/* Mobile menu toggle button */}
                <button
                    className="md:hidden absolute right-2 top-3 p-2 text-gray-500 hover:text-gray-900 focus:outline-none z-10"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                >
                    {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>

                <div className="p-4 border-b border-gray-100 flex flex-col md:block">
                    <h2 className="text-xl font-bold text-gray-900 pr-8 md:pr-0">Brand Management</h2>
                    <p className="text-sm text-gray-500 mt-1 hidden md:block">Manage your brand assets and settings</p>
                </div>

                <nav
                //     className={cn(
                //     "transition-all duration-300 ease-in-out overflow-hidden",
                //     isMobileMenuOpen ? "max-h-screen p-2" : "max-h-0 md:max-h-screen md:p-2"
                // )}
                >
                    <ul className="space-y-1 md:space-y-1">
                        {navItems.map((item) => {
                            const isActive = activeTab === item.href;

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={() => {
                                            setActiveTab(item.href);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        // className={cn(
                                        //     "flex items-center rounded-md px-3 py-3 md:py-2 text-sm font-medium transition-all",
                                        //     isActive
                                        //         ? "bg-indigo-50 text-indigo-600"
                                        //         : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        // )}
                                    >
                    <span
                    //     className={cn(
                    //     "mr-3 flex-shrink-0",
                    //     isActive ? "text-indigo-600" : "text-gray-500"
                    // )}
                    >
                      {item.icon}
                    </span>
                                        <span className="flex-1">{item.title}</span>

                                        {isActive && (
                                            <motion.div
                                                layoutId="tab-indicator"
                                                className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.2 }}
                                            />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </>
    );
}