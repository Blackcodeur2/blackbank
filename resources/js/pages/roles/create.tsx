import { Head, Link, useForm } from '@inertiajs/react';
import { Shield, ArrowLeft, Save, Key, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Permission = {
    id: string;
    name: string;
};

type Props = {
    permissions: Permission[];
};

export default function RoleCreate({ permissions }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        permissions: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/roles');
    };

    const togglePermission = (permissionId: string) => {
        if (data.permissions.includes(permissionId)) {
            setData('permissions', data.permissions.filter(id => id !== permissionId));
        } else {
            setData('permissions', [...data.permissions, permissionId]);
        }
    };

    const permissionGroups: Record<string, string[]> = {
        'Gestion des tenants': ['manage tenants'],
        'Gestion des comptes': ['manage accounts', 'view own accounts', 'create accounts', 'freeze accounts'],
        'Gestion des parrainages': ['view referrals', 'create referrals'],
        'Gestion des paramètres': ['manage settings'],
        'Gestion des rôles': ['manage roles'],
        'Gestion des transactions': ['manage transactions', 'view own transactions'],
    };

    return (
        <>
            <Head title="Créer un Rôle — BlackBank" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/roles">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Créer un nouveau rôle</h1>
                        <p className="text-sm text-muted-foreground">
                            Définissez les permissions du rôle
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Role Info */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Informations du rôle</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Nom du rôle *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Ex: Gestionnaire Comptes"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Permissions */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Permissions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {Object.entries(permissionGroups).map(([groupName, groupPerms]) => {
                                    const availablePerms = permissions.filter(p => groupPerms.includes(p.name));
                                    if (availablePerms.length === 0) return null;

                                    return (
                                        <div key={groupName}>
                                            <h3 className="text-sm font-semibold mb-3">{groupName}</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {availablePerms.map((perm) => (
                                                    <button
                                                        key={perm.id}
                                                        type="button"
                                                        onClick={() => togglePermission(perm.id)}
                                                        className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-colors ${
                                                            data.permissions.includes(perm.id)
                                                                ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400'
                                                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                                                        }`}
                                                    >
                                                        {data.permissions.includes(perm.id) && (
                                                            <Check className="h-4 w-4" />
                                                        )}
                                                        <Key className="h-4 w-4" />
                                                        {perm.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Other permissions not in groups */}
                                {permissions.filter(p => !Object.values(permissionGroups).flat().includes(p.name)).length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-semibold mb-3">Autres permissions</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {permissions.filter(p => !Object.values(permissionGroups).flat().includes(p.name)).map((perm) => (
                                                <button
                                                    key={perm.id}
                                                    type="button"
                                                    onClick={() => togglePermission(perm.id)}
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-colors ${
                                                        data.permissions.includes(perm.id)
                                                            ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400'
                                                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                                                    }`}
                                                >
                                                    {data.permissions.includes(perm.id) && (
                                                        <Check className="h-4 w-4" />
                                                    )}
                                                    <Key className="h-4 w-4" />
                                                    {perm.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {errors.permissions && (
                                    <p className="text-sm text-red-600">{errors.permissions}</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <Link href="/roles">
                            <Button variant="outline" type="button">
                                Annuler
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="gap-2">
                            <Save className="h-4 w-4" />
                            {processing ? 'Création en cours...' : 'Créer le rôle'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

RoleCreate.layout = {
    breadcrumbs: [
        { title: 'Administration', href: '/admin/dashboard' },
        { title: 'Rôles & Permissions', href: '/roles' },
        { title: 'Créer', href: '/roles/create' },
    ],
};
