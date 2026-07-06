import { Link, usePage } from '@inertiajs/react';
import {
    Banknote,
    BookOpen,
    CreditCard,
    FolderGit2,
    Headphones,
    LayoutGrid,
    PiggyBank,
    ShieldCheck,
    Smartphone,
    TrendingUp,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Tableau de bord',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Transactions',
        href: '/transactions',
        icon: Banknote,
    },
    {
        title: 'Bénéficiaires',
        href: '/beneficiaries',
        icon: Users,
    },
    {
        title: 'Épargne',
        href: '/savings',
        icon: TrendingUp,
    },
    {
        title: 'Prêts',
        href: '/loans',
        icon: PiggyBank,
    },
    {
        title: 'Recharge Mobile',
        href: '/airtime',
        icon: Smartphone,
    },
    {
        title: 'Support Client',
        href: '/support',
        icon: Headphones,
    },
    {
        title: 'Vérification KYC',
        href: '/kyc',
        icon: ShieldCheck,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<any>().props;
    const user = auth?.user;

    const navItems = [...mainNavItems];
    if (user && (user.role === 'admin' || user.role === 'super_admin')) {
        navItems.push({
            title: 'Administration',
            href: '/admin/dashboard',
            icon: ShieldCheck,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
