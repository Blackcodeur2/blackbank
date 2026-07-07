import { Head, Link, usePage } from '@inertiajs/react';
import {
    Building2,
    Plus,
    MoreHorizontal,
    ShieldCheck,
    ShieldAlert,
    ShieldX,
    Users,
    CreditCard,
    Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Tenant = {
    id: string;
    name?: string | null;
    slug: string;
    email: string;
    phone?: string;
    primary_color: string;
    secondary_color: string;
    status: string;
    domains: Array<{ domain: string }>;
    subscription?: {
        plan: { name: string; price_monthly: number; price_yearly: number };
        billing_cycle: string;
        ends_at: string;
    };
    users_count?: number;
};

type Props = {
    tenants: Tenant[];
    plans: Array<{ id: string; name: string; price_monthly: number; price_yearly: number }>;
};

const statusConfig = {
    active: { label: 'Actif', icon: ShieldCheck, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    suspended: { label: 'Suspendu', icon: ShieldAlert, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    deleted: { label: 'Supprimé', icon: ShieldX, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

export default function TenantsIndex({ tenants, plans }: Props) {
    const { flash } = usePage<any>().props;

    return (
        <>
            <Head title="Gestion des Tenants — BlackBank" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Gestion des Tenants</h1>
                        <p className="text-sm text-muted-foreground">
                            Gérez les institutions bancaires et leurs abonnements
                        </p>
                    </div>
                    <Link href="/tenants/create">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Nouveau Tenant
                        </Button>
                    </Link>
                </div>

                {/* Flash messages */}
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-green-950/20 dark:text-green-400">
                        {flash.success}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{tenants.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Tenants Actifs</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {tenants.filter(t => t.status === 'active').length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {tenants.reduce((sum, t) => sum + (t.users_count || 0), 0)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tenants Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des Tenants</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {tenants.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
                                <Building2 className="h-10 w-10 opacity-30" />
                                <p className="text-sm">Aucun tenant pour le moment</p>
                                <Link href="/tenants/create">
                                    <Button variant="outline" size="sm" className="mt-2">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Créer le premier tenant
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Domaine</TableHead>
                                        <TableHead>Abonnement</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Utilisateurs</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tenants.map((tenant) => {
                                        const status = statusConfig[tenant.status as keyof typeof statusConfig] || statusConfig.active;
                                        const StatusIcon = status.icon;
                                        
                                        return (
                                            <TableRow key={tenant.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div 
                                                            className="flex h-10 w-10 items-center justify-center rounded-lg text-white font-bold"
                                                            style={{ backgroundColor: tenant.primary_color }}
                                                        >
                                                            {(tenant.name?.charAt(0) ?? '?').toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{tenant.name}</div>
                                                            <div className="text-xs text-muted-foreground">{tenant.email}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                                                        {tenant.domains[0]?.domain || '-'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {tenant.subscription ? (
                                                        <div className="text-sm">
                                                            <div className="font-medium">{tenant.subscription.plan.name}</div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {tenant.subscription.billing_cycle === 'yearly' ? 'Annuel' : 'Mensuel'}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">Aucun</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className={status.color}>
                                                        <StatusIcon className="h-3 w-3 mr-1" />
                                                        {status.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Users className="h-4 w-4 text-muted-foreground" />
                                                        {tenant.users_count || 0}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/tenants/${tenant.id}`}>Voir détails</Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/tenants/${tenant.id}/edit`}>Modifier</Link>
                                                            </DropdownMenuItem>
                                                            {tenant.status === 'active' && (
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/tenants/${tenant.id}/suspend`} method="post">
                                                                        Suspendre
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            )}
                                                            {tenant.status === 'suspended' && (
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/tenants/${tenant.id}/activate`} method="post">
                                                                        Activer
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuItem asChild className="text-red-600">
                                                                <Link href={`/tenants/${tenant.id}`} method="delete">
                                                                    Supprimer
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

TenantsIndex.layout = {
    breadcrumbs: [
        { title: 'Administration', href: '/admin/dashboard' },
        { title: 'Tenants', href: '/tenants' },
    ],
};
