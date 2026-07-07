import { Head, Link, useForm } from '@inertiajs/react';
import { Building2, ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

type Plan = {
    id: string;
    name: string;
    price_monthly: number;
    price_yearly: number;
    features: string[];
};

type Tenant = {
    id: string;
    name: string;
    slug: string;
    email: string;
    phone?: string;
    address?: string;
    primary_color: string;
    secondary_color: string;
    default_currency: string;
    timezone: string;
    status: string;
    domains: Array<{ domain: string }>;
    subscription?: {
        id: string;
        plan: Plan;
        billing_cycle: string;
        ends_at: string;
    };
};

type Props = {
    tenant: Tenant;
    plans: Plan[];
};

const statusConfig = {
    active: { label: 'Actif', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    suspended: { label: 'Suspendu', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    deleted: { label: 'Supprimé', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

export default function TenantEdit({ tenant, plans }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: tenant.name,
        email: tenant.email,
        phone: tenant.phone || '',
        address: tenant.address || '',
        primary_color: tenant.primary_color,
        secondary_color: tenant.secondary_color,
        default_currency: tenant.default_currency,
        timezone: tenant.timezone,
        status: tenant.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/tenants/${tenant.id}`);
    };

    const status = statusConfig[tenant.status as keyof typeof statusConfig] || statusConfig.active;

    return (
        <>
            <Head title={`Modifier ${tenant.name} — BlackBank`} />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/tenants">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold tracking-tight">Modifier {tenant.name}</h1>
                        <p className="text-sm text-muted-foreground">
                            {tenant.slug} • {tenant.domains[0]?.domain}
                        </p>
                    </div>
                    <Badge variant="secondary" className={status.color}>
                        {status.label}
                    </Badge>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Informations de base */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations de base</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Nom de l'institution *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="phone">Téléphone</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                    />
                                    {errors.phone && (
                                        <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="address">Adresse</Label>
                                    <Textarea
                                        id="address"
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        rows={2}
                                    />
                                    {errors.address && (
                                        <p className="text-sm text-red-600 mt-1">{errors.address}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="status">Statut *</Label>
                                    <Select value={data.status} onValueChange={v => setData('status', v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Actif</SelectItem>
                                            <SelectItem value="suspended">Suspendu</SelectItem>
                                            <SelectItem value="deleted">Supprimé</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-red-600 mt-1">{errors.status}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Configuration */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Configuration</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="primary_color">Couleur primaire</Label>
                                        <div className="flex gap-2 items-center mt-1">
                                            <Input
                                                id="primary_color"
                                                type="color"
                                                value={data.primary_color}
                                                onChange={e => setData('primary_color', e.target.value)}
                                                className="h-10 w-20"
                                            />
                                            <Input
                                                value={data.primary_color}
                                                onChange={e => setData('primary_color', e.target.value)}
                                                className="flex-1"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="secondary_color">Couleur secondaire</Label>
                                        <div className="flex gap-2 items-center mt-1">
                                            <Input
                                                id="secondary_color"
                                                type="color"
                                                value={data.secondary_color}
                                                onChange={e => setData('secondary_color', e.target.value)}
                                                className="h-10 w-20"
                                            />
                                            <Input
                                                value={data.secondary_color}
                                                onChange={e => setData('secondary_color', e.target.value)}
                                                className="flex-1"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="default_currency">Devise par défaut</Label>
                                    <Select value={data.default_currency} onValueChange={v => setData('default_currency', v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="XAF">XAF - Franc CFA</SelectItem>
                                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                                            <SelectItem value="USD">USD - Dollar US</SelectItem>
                                            <SelectItem value="GBP">GBP - Livre Sterling</SelectItem>
                                            <SelectItem value="NGN">NGN - Naira</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="timezone">Fuseau horaire</Label>
                                    <Select value={data.timezone} onValueChange={v => setData('timezone', v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Africa/Douala">Africa/Douala</SelectItem>
                                            <SelectItem value="Africa/Lagos">Africa/Lagos</SelectItem>
                                            <SelectItem value="Africa/Abidjan">Africa/Abidjan</SelectItem>
                                            <SelectItem value="Africa/Nairobi">Africa/Nairobi</SelectItem>
                                            <SelectItem value="Africa/Cairo">Africa/Cairo</SelectItem>
                                            <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                                            <SelectItem value="Europe/London">Europe/London</SelectItem>
                                            <SelectItem value="America/New_York">America/New_York</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Info abonnement */}
                                {tenant.subscription && (
                                    <div className="rounded-lg border border-border p-4 bg-muted/50">
                                        <p className="text-sm font-medium mb-2">Abonnement actuel</p>
                                        <div className="text-sm">
                                            <p><span className="text-muted-foreground">Plan:</span> {tenant.subscription.plan.name}</p>
                                            <p><span className="text-muted-foreground">Cycle:</span> {tenant.subscription.billing_cycle === 'yearly' ? 'Annuel' : 'Mensuel'}</p>
                                            <p><span className="text-muted-foreground">Fin:</span> {new Date(tenant.subscription.ends_at).toLocaleDateString('fr-FR')}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <Link href="/tenants">
                            <Button variant="outline" type="button">
                                Annuler
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="gap-2">
                            <Save className="h-4 w-4" />
                            {processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

TenantEdit.layout = {
    breadcrumbs: [
        { title: 'Administration', href: '/admin/dashboard' },
        { title: 'Tenants', href: '/tenants' },
        { title: 'Modifier', href: '#' },
    ],
};
