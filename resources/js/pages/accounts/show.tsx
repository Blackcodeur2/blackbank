import { Head, Link } from '@inertiajs/react';
import {
    CreditCard,
    ArrowLeft,
    TrendingUp,
    Wallet,
    Calendar,
    ArrowDownLeft,
    ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

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

type Transaction = {
    id: string;
    type: string;
    montant: number;
    statut: string;
    created_at: string;
    metadonnees?: any;
};

type Account = {
    id: string;
    account_number: string;
    account_name: string;
    balance: number;
    status: string;
    created_at: string;
    account_type: AccountType;
    currency: Currency;
    transactions: Transaction[];
};

type Props = {
    account: Account;
};

const statusConfig = {
    active: { label: 'Actif', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    frozen: { label: 'Gelé', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    closed: { label: 'Fermé', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

const transactionTypeLabel: Record<string, string> = {
    depot: 'Dépôt',
    retrait: 'Retrait',
    virement_interne: 'Virement interne',
    virement_externe: 'Virement externe',
    virement_telegraphique: 'Virement télégraphique',
    frais: 'Frais',
    interet: 'Intérêt',
};

const transactionStatutBadge: Record<string, string> = {
    en_attente: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    reussie: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    echouee: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    annulee: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

export default function AccountShow({ account }: Props) {
    const formatCurrency = (amount: number, symbol: string) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: symbol,
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(dateStr));
    };

    const status = statusConfig[account.status as keyof typeof statusConfig] || statusConfig.active;

    return (
        <>
            <Head title={`${account.account_name} — BlackBank`} />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/accounts">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold tracking-tight">{account.account_name}</h1>
                        <p className="text-sm text-muted-foreground font-mono">
                            {account.account_number}
                        </p>
                    </div>
                    <Badge variant="secondary" className={status.color}>
                        {status.label}
                    </Badge>
                </div>

                {/* Balance Card */}
                <Card className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white border-none">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-200 text-sm">Solde disponible</p>
                                <p className="text-3xl font-bold mt-1">
                                    {formatCurrency(account.balance, account.currency.symbol)}
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                                <Wallet className="h-6 w-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Info */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Type de compte</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm font-medium">{account.account_type.name}</div>
                            <div className="text-xs text-muted-foreground">{account.account_type.code}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Devise</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm font-medium">{account.currency.code}</div>
                            <div className="text-xs text-muted-foreground">{account.currency.symbol}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Ouvert le</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm font-medium">
                                {new Date(account.created_at).toLocaleDateString('fr-FR')}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Transactions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Transactions récentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {account.transactions.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
                                <CreditCard className="h-10 w-10 opacity-30" />
                                <p className="text-sm">Aucune transaction pour le moment</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead className="text-right">Montant</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {account.transactions.map((tx) => {
                                        const isCredit = tx.type === 'depot' ||
                                            tx.type === 'interet' ||
                                            (tx.type === 'virement_interne' && tx.metadonnees?.type_transfert === 'recu');
                                        
                                        return (
                                            <TableRow key={tx.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isCredit ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                                            {isCredit
                                                                ? <ArrowDownLeft className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                                : <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                            }
                                                        </div>
                                                        <span className="text-sm font-medium">
                                                            {transactionTypeLabel[tx.type] ?? tx.type}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {formatDate(tx.created_at)}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${transactionStatutBadge[tx.statut] ?? ''}`}>
                                                        {tx.statut.replace('_', ' ')}
                                                    </span>
                                                </TableCell>
                                                <TableCell className={`text-right font-semibold ${isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                    {isCredit ? '+' : '-'}{formatCurrency(tx.montant, account.currency.symbol)}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Actions */}
                {account.status === 'active' && (
                    <div className="flex items-center justify-end gap-3">
                        <Link href="/accounts">
                            <Button variant="outline">
                                Retour
                            </Button>
                        </Link>
                        <Link href={`/accounts/${account.id}/edit`}>
                            <Button>
                                Modifier le compte
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}

AccountShow.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: '/dashboard' },
        { title: 'Comptes', href: '/accounts' },
        { title: 'Détails', href: '#' },
    ],
};
