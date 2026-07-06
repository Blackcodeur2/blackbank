import { Head, usePage } from '@inertiajs/react';
import {
    ArrowDownLeft,
    ArrowUpRight,
    Banknote,
    Clock,
    CreditCard,
    PiggyBank,
    ShieldCheck,
    TrendingUp,
    Wallet,
} from 'lucide-react';
import { dashboard } from '@/routes';
import type { Transaction, User } from '@/types';

type Stats = {
    solde: string;
    totalDeposits: string;
    totalWithdrawals: string;
    pendingCount: number;
};

type Props = {
    user: User;
    recentTransactions: Transaction[];
    stats: Stats;
};

// Helpers
function formatCurrency(amount: string | number) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    }).format(Number(amount));
}

function formatDate(dateStr: string) {
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(dateStr));
}

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

const kycBadge: Record<string, { label: string; classes: string }> = {
    non_soumis: { label: 'KYC non soumis', classes: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300' },
    en_attente: { label: 'KYC en attente', classes: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    verifie: { label: 'KYC vérifié ✓', classes: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    rejete: { label: 'KYC rejeté', classes: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

export default function Dashboard({ user, recentTransactions, stats }: Props) {
    const kyc = kycBadge[user.statut_kyc] ?? kycBadge['non_soumis'];

    return (
        <>
            <Head title="Tableau de bord — BlackBank" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* ── Welcome banner ── */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 p-6 text-white shadow-xl">
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute -bottom-10 -left-5 h-32 w-32 rounded-full bg-white/10 blur-xl" />
                    <div className="relative flex flex-col gap-1">
                        <p className="text-sm font-medium text-indigo-200">Bonjour, {user.name.split(' ')[0]} 👋</p>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {formatCurrency(stats.solde)}
                        </h1>
                        <p className="text-sm text-indigo-200">Solde disponible</p>
                    </div>
                    <div className="relative mt-4 flex items-center gap-3">
                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${kyc.classes}`}
                        >
                            <ShieldCheck className="h-3.5 w-3.5" />
                            {kyc.label}
                        </span>
                    </div>
                </div>

                {/* ── Stats cards ── */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <StatCard
                        icon={<ArrowDownLeft className="h-5 w-5 text-green-500" />}
                        label="Total dépôts"
                        value={formatCurrency(stats.totalDeposits)}
                        bg="bg-green-50 dark:bg-green-950/20"
                    />
                    <StatCard
                        icon={<ArrowUpRight className="h-5 w-5 text-red-500" />}
                        label="Total retraits"
                        value={formatCurrency(stats.totalWithdrawals)}
                        bg="bg-red-50 dark:bg-red-950/20"
                    />
                    <StatCard
                        icon={<Clock className="h-5 w-5 text-yellow-500" />}
                        label="En attente"
                        value={`${stats.pendingCount} opération${stats.pendingCount !== 1 ? 's' : ''}`}
                        bg="bg-yellow-50 dark:bg-yellow-950/20"
                    />
                    <StatCard
                        icon={<Wallet className="h-5 w-5 text-indigo-500" />}
                        label="Mon solde"
                        value={formatCurrency(stats.solde)}
                        bg="bg-indigo-50 dark:bg-indigo-950/20"
                    />
                </div>

                {/* ── Quick actions ── */}
                {user.statut_kyc !== 'verifie' && (
                    <div className="flex items-start gap-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950/20">
                        <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                                Vérification d'identité requise
                            </p>
                            <p className="mt-0.5 text-xs text-yellow-700 dark:text-yellow-400">
                                Complétez votre KYC pour débloquer les dépôts, retraits et transferts.
                            </p>
                        </div>
                        <a
                            href="/kyc"
                            className="flex-shrink-0 rounded-lg bg-yellow-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-yellow-700 transition-colors"
                        >
                            Vérifier →
                        </a>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <QuickAction icon={<Banknote className="h-6 w-6" />} label="Dépôt" href="/transactions/deposit" locked={user.statut_kyc !== 'verifie'} color="from-green-500 to-emerald-600" />
                    <QuickAction icon={<CreditCard className="h-6 w-6" />} label="Retrait" href="/transactions/withdraw" locked={user.statut_kyc !== 'verifie'} color="from-red-500 to-rose-600" />
                    <QuickAction icon={<TrendingUp className="h-6 w-6" />} label="Épargne" href="/savings" locked={user.statut_kyc !== 'verifie'} color="from-blue-500 to-indigo-600" />
                    <QuickAction icon={<PiggyBank className="h-6 w-6" />} label="Prêts" href="/loans" locked={user.statut_kyc !== 'verifie'} color="from-purple-500 to-violet-600" />
                </div>

                {/* ── Recent transactions ── */}
                <div className="rounded-2xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <div className="flex items-center justify-between border-b border-sidebar-border/70 px-5 py-4 dark:border-sidebar-border">
                        <h2 className="font-semibold">Transactions récentes</h2>
                        <a href="/transactions" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                            Voir tout →
                        </a>
                    </div>

                    {recentTransactions.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
                            <Banknote className="h-10 w-10 opacity-30" />
                            <p className="text-sm">Aucune transaction pour le moment</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-sidebar-border/50 dark:divide-sidebar-border">
                            {recentTransactions.map((tx) => {
                                const isCredit = tx.type === 'depot' ||
                                    tx.type === 'interet' ||
                                    (tx.type === 'virement_interne' && tx.metadonnees?.type_transfert === 'recu');
                                return (
                                    <li key={tx.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors">
                                        <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${isCredit ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                            {isCredit
                                                ? <ArrowDownLeft className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                : <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                                            }
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">
                                                {transactionTypeLabel[tx.type] ?? tx.type}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{formatDate(tx.created_at)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-semibold ${isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                {isCredit ? '+' : '-'}{formatCurrency(tx.montant)}
                                            </p>
                                            <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${transactionStatutBadge[tx.statut] ?? ''}`}>
                                                {tx.statut.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: string; bg: string }) {
    return (
        <div className={`flex flex-col gap-3 rounded-xl p-4 ${bg}`}>
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
            </div>
            <p className="text-sm font-bold leading-tight">{value}</p>
        </div>
    );
}

function QuickAction({ icon, label, href, locked, color }: {
    icon: React.ReactNode;
    label: string;
    href: string;
    locked: boolean;
    color: string;
}) {
    const content = (
        <div className={`flex flex-col items-center justify-center gap-2 rounded-xl bg-gradient-to-br ${color} p-4 text-white shadow-md transition-all duration-200 ${locked ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:scale-105 cursor-pointer'}`}>
            {icon}
            <span className="text-xs font-semibold">{label}</span>
            {locked && <span className="text-[9px] opacity-80">🔒 KYC requis</span>}
        </div>
    );

    if (locked) return content;
    return <a href={href}>{content}</a>;
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Tableau de bord',
            href: dashboard(),
        },
    ],
};
