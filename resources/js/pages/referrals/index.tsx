import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Users,
    Share2,
    Copy,
    Check,
    Wallet,
    Calendar,
    UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

type ReferredUser = {
    id: string;
    name: string;
    email: string;
    created_at: string;
};

type Referral = {
    id: string;
    referred_user: ReferredUser;
    status: string;
    created_at: string;
};

type Props = {
    referrals: Referral[];
    referralCode: string | null;
    referralLink: string | null;
    totalEarnings: number;
    totalReferrals: number;
};

export default function ReferralsIndex({ referrals, referralCode, referralLink, totalEarnings, totalReferrals }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        referral_code: referralCode || '',
    });

    const [copied, setCopied] = React.useState(false);

    const handleCopyLink = () => {
        if (referralLink) {
            navigator.clipboard.writeText(referralLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/referrals');
    };

    const formatDate = (dateStr: string) => {
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(new Date(dateStr));
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XAF',
        }).format(amount);
    };

    return (
        <>
            <Head title="Parrainage — BlackBank" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Programme de Parrainage</h1>
                    <p className="text-sm text-muted-foreground">
                        Gagnez des récompenses en invitant vos amis
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Parrainages</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalReferrals}</div>
                        </CardContent>
                    </Card>
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
                            <CardTitle className="text-sm font-medium">Code de parrainage</CardTitle>
                            <Share2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold font-mono">
                                {referralCode || 'Non défini'}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Referral Link */}
                <Card>
                    <CardHeader>
                        <CardTitle>Votre lien de parrainage</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {referralLink ? (
                            <div className="flex gap-2">
                                <Input
                                    value={referralLink}
                                    readOnly
                                    className="font-mono"
                                />
                                <Button
                                    onClick={handleCopyLink}
                                    variant="outline"
                                    className="gap-2"
                                >
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    {copied ? 'Copié' : 'Copier'}
                                </Button>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Créez un code de parrainage pour générer votre lien
                            </p>
                        )}

                        {!referralCode && (
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <Input
                                    value={data.referral_code}
                                    onChange={e => setData('referral_code', e.target.value)}
                                    placeholder="Entrez votre code de parrainage"
                                    className="flex-1"
                                />
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Création...' : 'Créer'}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>

                {/* Referrals List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Vos parrainages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {referrals.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
                                <UserPlus className="h-10 w-10 opacity-30" />
                                <p className="text-sm">Aucun parrainage pour le moment</p>
                                <p className="text-xs">Partagez votre lien pour commencer à gagner</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Utilisateur</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Statut</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {referrals.map((referral) => (
                                        <TableRow key={referral.id}>
                                            <TableCell className="font-medium">
                                                {referral.referred_user.name}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {referral.referred_user.email}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {formatDate(referral.created_at)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {referral.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Earnings Link */}
                <div className="flex justify-end">
                    <Link href="/referrals/earnings">
                        <Button variant="outline" className="gap-2">
                            <Wallet className="h-4 w-4" />
                            Voir mes gains
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    );
}

ReferralsIndex.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: '/dashboard' },
        { title: 'Parrainage', href: '/referrals' },
    ],
};
