import { Link, usePage } from '@inertiajs/react';
import {
    Banknote,
    BookOpen,
    Building2,
    CreditCard,
    FileText,
    FolderGit2,
    Headphones,
    LayoutGrid,
    PiggyBank,
    ShieldCheck,
    Smartphone,
    TrendingUp,
    Users,
    UserCog,
    Settings,
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
    SidebarGroup,
    SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as accountsIndex } from '@/routes/accounts';
import { index as referralsIndex } from '@/routes/referrals';
import { index as tenantsIndex } from '@/routes/tenants';
import { index as cmsIndex } from '@/routes/cms';
import { index as rolesIndex } from '@/routes/roles';
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
    const roles = auth?.roles || [];
    const permissions = auth?.permissions || [];

    const navItems = [...mainNavItems];
    
    // Show accounts section if user has permission
    if (permissions.includes('manage accounts') || permissions.includes('view own accounts')) {
        navItems.push({
            title: 'Comptes',
            href: accountsIndex(),
            icon: CreditCard,
        });
    }
    
    // Show referrals section if enabled
    if (permissions.includes('view referrals')) {
        navItems.push({
            title: 'Parrainage',
            href: referralsIndex(),
            icon: FolderGit2,
        });
    }

    // Admin section items
    const adminNavItems: NavItem[] = [];
    
    // Show tenants management for landlord admin
    if (roles.includes('Super Admin') || roles.includes('Landlord Admin')) {
        adminNavItems.push({
            title: 'Tenants',
            href: tenantsIndex(),
            icon: Building2,
        });
    }
    
    // Show CMS for admin roles
    if (roles.includes('Super Admin') || roles.includes('Landlord Admin') || roles.includes('Tenant Admin')) {
        adminNavItems.push({
            title: 'CMS',
            href: cmsIndex(),
            icon: FileText,
        });
    }
    
    // Show roles & permissions for super admin
    if (roles.includes('Super Admin')) {
        adminNavItems.push({
            title: 'Rôles & Permissions',
            href: rolesIndex(),
            icon: UserCog,
        });
    }
    
    // Show settings for admin roles
    if (roles.includes('Super Admin') || roles.includes('Landlord Admin') || roles.includes('Tenant Admin')) {
        adminNavItems.push({
            title: 'Paramètres',
            href: '/settings',
            icon: Settings,
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
                {adminNavItems.length > 0 && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Administration</SidebarGroupLabel>
                        <NavMain items={adminNavItems} />
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
