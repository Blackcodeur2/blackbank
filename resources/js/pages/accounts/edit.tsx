import { Head, Link, useForm } from '@inertiajs/react';
import { CreditCard, ArrowLeft, Save, AlertTriangle } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';

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

type Account = {
    id: string;
    account_number: string;
    account_name: string;
    balance: number;
    status: string;
    account_type: AccountType;
    currency: Currency;
};

type Props = {
    account: Account;
    accountTypes: AccountType[];
    currencies: Currency[];
};

const statusConfig = {
    active: { label: 'Actif', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    frozen: { label: 'Gelé', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    closed: { label: 'Fermé', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

export default function AccountEdit({ account, accountTypes, currencies }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        account_name: account.account_name,
        status: account.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/accounts/${account.id}`);
    };

    const formatCurrency = (amount: number, symbol: string) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: symbol,
        }).format(amount);
    };

    const status = statusConfig[account.status as keyof typeof statusConfig] || statusConfig.active;

    return (
        <>
            <Head title={`Modifier ${account.account_name} — BlackBank`} />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/accounts">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold tracking-tight">Modifier {account.account_name}</h1>
                        <p className="text-sm text-muted-foreground font-mono">
                            {account.account_number}
                        </p>
                    </div>
                    <Badge variant="secondary" className={status.color}>
                        {status.label}
                    </Badge>
                </div>

                {/* Account Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informations du compte</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-muted-foreground">Type de compte</Label>
                                <p className="font-medium">{account.account_type.name}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Devise</Label>
                                <p className="font-medium">{account.currency.code} ({account.currency.symbol})</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Numéro de compte</Label>
                                <p className="font-medium font-mono">{account.account_number}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Solde actuel</Label>
                                <p className="font-medium">{formatCurrency(account.balance, account.currency.symbol)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Modifier le compte</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
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

                            <div>
                                <Label htmlFor="status">Statut *</Label>
                                <Select value={data.status} onValueChange={v => setData('status', v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Actif</SelectItem>
                                        <SelectItem value="frozen">Gelé</SelectItem>
                                        <SelectItem value="closed">Fermé</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && (
                                    <p className="text-sm text-red-600 mt-1">{errors.status}</p>
                                )}
                            </div>

                            {data.status === 'frozen' && (
                                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950/20">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                                                Attention
                                            </p>
                                            <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                                                Un compte gelé ne peut pas effectuer de transactions. Les dépôts et retraits seront bloqués.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {data.status === 'closed' && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                                                Attention
                                            </p>
                                            <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                                                Un compte fermé ne peut plus être utilisé. Cette action est irréversible.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <Link href="/accounts">
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

AccountEdit.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: '/dashboard' },
        { title: 'Comptes', href: '/accounts' },
        { title: 'Modifier', href: '#' },
    ],
};
