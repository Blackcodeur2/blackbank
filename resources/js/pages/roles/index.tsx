import { Head, Link, usePage } from '@inertiajs/react';
import {
    Shield,
    Plus,
    MoreHorizontal,
    Edit,
    Trash2,
    Key,
    Users,
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Permission = {
    id: string;
    name: string;
};

type Role = {
    id: string;
    name: string;
    permissions: Permission[];
};

type Props = {
    roles: Role[];
    permissions: Permission[];
};

export default function RolesIndex({ roles, permissions }: Props) {
    const { flash } = usePage<any>().props;

    return (
        <>
            <Head title="Rôles & Permissions — BlackBank" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Rôles & Permissions</h1>
                        <p className="text-sm text-muted-foreground">
                            Gérez les rôles et permissions des utilisateurs
                        </p>
                    </div>
                    <Link href="/roles/create">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Nouveau Rôle
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Rôles</CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{roles.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
                            <Key className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{permissions.length}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Roles Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des rôles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {roles.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
                                <Shield className="h-10 w-10 opacity-30" />
                                <p className="text-sm">Aucun rôle pour le moment</p>
                                <Link href="/roles/create">
                                    <Button variant="outline" size="sm" className="mt-2">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Créer le premier rôle
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Permissions</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roles.map((role) => (
                                        <TableRow key={role.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Shield className="h-4 w-4 text-muted-foreground" />
                                                    {role.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {role.permissions.length > 0 ? (
                                                        role.permissions.slice(0, 3).map((perm) => (
                                                            <Badge key={perm.id} variant="secondary" className="text-xs">
                                                                {perm.name}
                                                            </Badge>
                                                        ))
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">Aucune</span>
                                                    )}
                                                    {role.permissions.length > 3 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{role.permissions.length - 3}
                                                        </Badge>
                                                    )}
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
                                                            <Link href={`/roles/${role.id}/edit`}>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Modifier
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild className="text-red-600">
                                                            <Link href={`/roles/${role.id}`} method="delete">
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Supprimer
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Permissions List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Toutes les permissions disponibles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {permissions.map((perm) => (
                                <Badge key={perm.id} variant="outline">
                                    {perm.name}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

RolesIndex.layout = {
    breadcrumbs: [
        { title: 'Administration', href: '/admin/dashboard' },
        { title: 'Rôles & Permissions', href: '/roles' },
    ],
};
