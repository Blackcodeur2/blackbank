import { Head, Link, useForm } from '@inertiajs/react';
import { CreditCard, ArrowLeft, Save } from 'lucide-react';
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

type AccountType = {
    id: string;
    name: string;
    code: string;
};

type Currency = {
    id: string;
    code: string;
    symbol: string;
};

type Props = {
    accountTypes: AccountType[];
    currencies: Currency[];
};

export default function AccountCreate({ accountTypes, currencies }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        account_type_id: '',
        currency_id: '',
        account_number: '',
        account_name: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/accounts');
    };

    const generateAccountNumber = () => {
        const prefix = 'BB';
        const random = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
        setData('account_number', `${prefix}${random}`);
    };

    return (
        <>
            <Head title="Créer un Compte — BlackBank" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/accounts">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Créer un nouveau compte</h1>
                        <p className="text-sm text-muted-foreground">
                            Configurez un nouveau compte bancaire
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Informations du compte */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations du compte</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="account_type_id">Type de compte *</Label>
                                    <Select value={data.account_type_id} onValueChange={v => setData('account_type_id', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez un type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {accountTypes.map(type => (
                                                <SelectItem key={type.id} value={type.id}>
                                                    {type.name} ({type.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.account_type_id && (
                                        <p className="text-sm text-red-600 mt-1">{errors.account_type_id}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="currency_id">Devise *</Label>
                                    <Select value={data.currency_id} onValueChange={v => setData('currency_id', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez une devise" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {currencies.map(currency => (
                                                <SelectItem key={currency.id} value={currency.id}>
                                                    {currency.code} - {currency.symbol}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.currency_id && (
                                        <p className="text-sm text-red-600 mt-1">{errors.currency_id}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="account_number">Numéro de compte *</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="account_number"
                                            value={data.account_number}
                                            onChange={e => setData('account_number', e.target.value)}
                                            placeholder="BB123456789"
                                            className="font-mono"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={generateAccountNumber}
                                        >
                                            Générer
                                        </Button>
                                    </div>
                                    {errors.account_number && (
                                        <p className="text-sm text-red-600 mt-1">{errors.account_number}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Utilisez le bouton pour générer automatiquement
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="account_name">Nom du compte *</Label>
                                    <Input
                                        id="account_name"
                                        value={data.account_name}
                                        onChange={e => setData('account_name', e.target.value)}
                                        placeholder="Mon compte principal"
                                    />
                                    {errors.account_name && (
                                        <p className="text-sm text-red-600 mt-1">{errors.account_name}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Informations additionnelles */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="rounded-lg border border-border p-4 bg-muted/50">
                                    <p className="text-sm font-medium mb-2">À propos des comptes</p>
                                    <ul className="text-sm text-muted-foreground space-y-2">
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 mt-0.5">•</span>
                                            <span>Le solde initial sera de 0</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 mt-0.5">•</span>
                                            <span>Le compte sera actif immédiatement</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 mt-0.5">•</span>
                                            <span>Vous pouvez créer plusieurs comptes dans différentes devises</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
                                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                                        Conseil
                                    </p>
                                    <p className="text-sm text-blue-800 dark:text-blue-400">
                                        Utilisez des noms descriptifs pour facilement identifier vos comptes (ex: "Compte épargne", "Compte courant").
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <Link href="/accounts">
                            <Button variant="outline" type="button">
                                Annuler
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="gap-2">
                            <Save className="h-4 w-4" />
                            {processing ? 'Création en cours...' : 'Créer le compte'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

AccountCreate.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: '/dashboard' },
        { title: 'Comptes', href: '/accounts' },
        { title: 'Créer', href: '/accounts/create' },
    ],
};
