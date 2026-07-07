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

type Plan = {
    id: string;
    name: string;
    price_monthly: number;
    price_yearly: number;
    features: string[];
};

type Props = {
    plans: Plan[];
};

export default function TenantCreate({ plans }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        email: '',
        phone: '',
        address: '',
        primary_color: '#3b82f6',
        secondary_color: '#1e40af',
        default_currency: 'XAF',
        timezone: 'Africa/Douala',
        domain: '',
        plan_id: '',
        billing_cycle: 'monthly',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/tenants');
    };

    const selectedPlan = plans.find(p => p.id === data.plan_id);
    const price = data.billing_cycle === 'yearly' 
        ? selectedPlan?.price_yearly 
        : selectedPlan?.price_monthly;

    return (
        <>
            <Head title="Créer un Tenant — BlackBank" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/tenants">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Créer un nouveau Tenant</h1>
                        <p className="text-sm text-muted-foreground">
                            Configurez une nouvelle institution bancaire
                        </p>
                    </div>
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
                                        placeholder="Ex: Demo Bank Cameroon"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="slug">Slug (identifiant unique) *</Label>
                                    <Input
                                        id="slug"
                                        value={data.slug}
                                        onChange={e => setData('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                        placeholder="demo-bank"
                                    />
                                    {errors.slug && (
                                        <p className="text-sm text-red-600 mt-1">{errors.slug}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="contact@bank.com"
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
                                        placeholder="+237 233 123 456"
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
                                        placeholder="Yaoundé, Cameroun"
                                        rows={2}
                                    />
                                    {errors.address && (
                                        <p className="text-sm text-red-600 mt-1">{errors.address}</p>
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
                            </CardContent>
                        </Card>
                    </div>

                    {/* Domaine et Abonnement */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Domaine</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="domain">Domaine *</Label>
                                    <Input
                                        id="domain"
                                        value={data.domain}
                                        onChange={e => setData('domain', e.target.value)}
                                        placeholder="demo-bank.localhost"
                                    />
                                    {errors.domain && (
                                        <p className="text-sm text-red-600 mt-1">{errors.domain}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Utilisez .localhost pour le développement
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Abonnement</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="plan_id">Plan d'abonnement *</Label>
                                    <Select value={data.plan_id} onValueChange={v => setData('plan_id', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez un plan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {plans.map(plan => (
                                                <SelectItem key={plan.id} value={plan.id}>
                                                    {plan.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.plan_id && (
                                        <p className="text-sm text-red-600 mt-1">{errors.plan_id}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="billing_cycle">Cycle de facturation *</Label>
                                    <Select value={data.billing_cycle} onValueChange={v => setData('billing_cycle', v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="monthly">Mensuel</SelectItem>
                                            <SelectItem value="yearly">Annuel</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {selectedPlan && (
                                    <div className="rounded-lg border border-border p-4 bg-muted/50">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium">Prix:</span>
                                            <span className="font-bold text-lg">
                                                {new Intl.NumberFormat('fr-FR', {
                                                    style: 'currency',
                                                    currency: data.default_currency,
                                                }).format(price || 0)}
                                            </span>
                                        </div>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            {selectedPlan.features.map((feature, i) => (
                                                <li key={i} className="flex items-center gap-2">
                                                    <span className="text-green-500">✓</span>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
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
                            {processing ? 'Création en cours...' : 'Créer le tenant'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

TenantCreate.layout = {
    breadcrumbs: [
        { title: 'Administration', href: '/admin/dashboard' },
        { title: 'Tenants', href: '/tenants' },
        { title: 'Créer', href: '/tenants/create' },
    ],
};
