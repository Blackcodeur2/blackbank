import { Head, Link, usePage } from '@inertiajs/react';
import {
    CreditCard,
    Plus,
    MoreHorizontal,
    Wallet,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    XCircle,
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
    accounts: Account[];
    accountTypes: AccountType[];
    currencies: Currency[];
};

const statusConfig = {
    active: { label: 'Actif', icon: CheckCircle, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    frozen: { label: 'Gelé', icon: AlertCircle, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    closed: { label: 'Fermé', icon: XCircle, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

export default function AccountsIndex({ accounts, accountTypes, currencies }: Props) {
    const { flash } = usePage<any>().props;

    const formatCurrency = (amount: number, symbol: string) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: symbol,
        }).format(amount);
    };

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    return (
        <>
            <Head title="Mes Comptes — BlackBank" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Mes Comptes</h1>
                        <p className="text-sm text-muted-foreground">
                            Gérez vos comptes bancaires
                        </p>
                    </div>
                    <Link href="/accounts/create">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Nouveau Compte
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
                            <CardTitle className="text-sm font-medium">Solde Total</CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {accounts.length > 0 ? formatCurrency(totalBalance, accounts[0].currency.symbol) : '0 FCFA'}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Comptes Actifs</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {accounts.filter(a => a.status === 'active').length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Comptes</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{accounts.length}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Accounts Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des Comptes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {accounts.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
                                <CreditCard className="h-10 w-10 opacity-30" />
                                <p className="text-sm">Aucun compte pour le moment</p>
                                <Link href="/accounts/create">
                                    <Button variant="outline" size="sm" className="mt-2">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Créer le premier compte
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Numéro</TableHead>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Devise</TableHead>
                                        <TableHead>Solde</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {accounts.map((account) => {
                                        const status = statusConfig[account.status as keyof typeof statusConfig] || statusConfig.active;
                                        const StatusIcon = status.icon;
                                        
                                        return (
                                            <TableRow key={account.id}>
                                                <TableCell className="font-mono text-sm">
                                                    {account.account_number}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {account.account_name}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                                        {account.account_type.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {account.currency.code}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-semibold">
                                                    {formatCurrency(account.balance, account.currency.symbol)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className={status.color}>
                                                        <StatusIcon className="h-3 w-3 mr-1" />
                                                        {status.label}
                                                    </Badge>
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
                                                                <Link href={`/accounts/${account.id}`}>Voir détails</Link>
                                                            </DropdownMenuItem>
                                                            {account.status === 'active' && (
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/accounts/${account.id}/edit`}>Modifier</Link>
                                                                </DropdownMenuItem>
                                                            )}
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

AccountsIndex.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: '/dashboard' },
        { title: 'Comptes', href: '/accounts' },
    ],
};
