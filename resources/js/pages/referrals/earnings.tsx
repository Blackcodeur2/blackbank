import { Head, Link } from '@inertiajs/react';
import {
    Wallet,
    ArrowLeft,
    TrendingUp,
    Clock,
    CheckCircle,
    Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

type Earning = {
    id: string;
    amount: number;
    status: string;
    description: string;
    created_at: string;
};

type Props = {
    earnings: Earning[];
    totalEarnings: number;
    pendingEarnings: number;
    paidEarnings: number;
};

const statusConfig = {
    pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    paid: { label: 'Payé', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
};

export default function ReferralsEarnings({ earnings, totalEarnings, pendingEarnings, paidEarnings }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XAF',
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(new Date(dateStr));
    };

    return (
        <>
            <Head title="Mes Gains — BlackBank" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/referrals">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Mes Gains</h1>
                        <p className="text-sm text-muted-foreground">
                            Historique de vos gains de parrainage
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Gains Totaux</CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(totalEarnings)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(pendingEarnings)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Payés</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(paidEarnings)}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Earnings Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Historique des gains</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {earnings.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
                                <TrendingUp className="h-10 w-10 opacity-30" />
                                <p className="text-sm">Aucun gain pour le moment</p>
                                <p className="text-xs">Invitez des amis pour commencer à gagner</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead className="text-right">Montant</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {earnings.map((earning) => {
                                        const status = statusConfig[earning.status as keyof typeof statusConfig] || statusConfig.pending;
                                        
                                        return (
                                            <TableRow key={earning.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Wallet className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-medium">{earning.description}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4" />
                                                        {formatDate(earning.created_at)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className={status.color}>
                                                        {status.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-green-600 dark:text-green-400">
                                                    +{formatCurrency(earning.amount)}
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

ReferralsEarnings.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: '/dashboard' },
        { title: 'Parrainage', href: '/referrals' },
        { title: 'Gains', href: '/referrals/earnings' },
    ],
};
