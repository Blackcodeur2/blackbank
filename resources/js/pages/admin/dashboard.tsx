import { Head, useForm, usePage } from '@inertiajs/react';
import {
    CheckCircle,
    XCircle,
    UserCheck,
    Banknote,
    TrendingUp,
    ShieldAlert,
    Clock,
    FileText,
    Users,
    ArrowDownLeft,
    ArrowUpRight,
} from 'lucide-react';
import { useState } from 'react';
import type { User, Transaction } from '@/types';

type LoanPlan = {
    id: string;
    nom: string;
    taux_interet: string;
};

type Loan = {
    id: string;
    user_id: string;
    loan_plan_id: string;
    montant: string;
    duree_mois: number;
    taux_interet: string;
    motif: string | null;
    statut: string;
    created_at: string;
    user: User;
    plan: LoanPlan;
};

type Props = {
    stats: {
        total_users: number;
        total_deposits: string;
        total_withdrawals: string;
        pending_kyc: number;
        pending_loans: number;
        pending_deposits: number;
        pending_withdrawals: number;
    };
    pendingKycUsers: User[];
    pendingLoans: Loan[];
    pendingDeposits: Transaction[];
    pendingWithdrawals: Transaction[];
};

function formatCurrency(amount: string | number) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(amount));
}

function formatDate(dateStr: string) {
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    }).format(new Date(dateStr));
}

type Tab = 'kyc' | 'deposits' | 'withdrawals' | 'loans';

export default function AdminDashboard({
    stats,
    pendingKycUsers,
    pendingLoans,
    pendingDeposits,
    pendingWithdrawals,
}: Props) {
    const [activeTab, setActiveTab] = useState<Tab>('kyc');
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;

    return (
        <>
            <Head title="Administration — BlackBank" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight">Console d'administration</h1>
                    <p className="text-sm text-muted-foreground">Gérez les demandes de crédit, dépôts, retraits et dossiers KYC de BlackBank.</p>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-700 dark:bg-green-950/20 dark:border-green-800 dark:text-green-400">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 dark:bg-red-950/20 dark:border-red-800 dark:text-red-400">
                        {flash.error}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard icon={<Users className="h-5 w-5 text-indigo-500" />} label="Utilisateurs" value={stats.total_users} />
                    <StatCard icon={<ArrowDownLeft className="h-5 w-5 text-green-500" />} label="Dépôts validés" value={formatCurrency(stats.total_deposits)} />
                    <StatCard icon={<ArrowUpRight className="h-5 w-5 text-red-500" />} label="Retraits validés" value={formatCurrency(stats.total_withdrawals)} />
                    <StatCard icon={<ShieldAlert className="h-5 w-5 text-yellow-500" />} label="KYC en attente" value={stats.pending_kyc} />
                </div>

                {/* Tabs navigation */}
                <div className="flex gap-1 rounded-xl bg-muted p-1">
                    {[
                        { id: 'kyc' as Tab, label: `KYC (${stats.pending_kyc})`, icon: <UserCheck className="h-4 w-4" /> },
                        { id: 'deposits' as Tab, label: `Dépôts (${stats.pending_deposits})`, icon: <ArrowDownLeft className="h-4 w-4" /> },
                        { id: 'withdrawals' as Tab, label: `Retraits (${stats.pending_withdrawals})`, icon: <ArrowUpRight className="h-4 w-4" /> },
                        { id: 'loans' as Tab, label: `Prêts (${stats.pending_loans})`, icon: <TrendingUp className="h-4 w-4" /> },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold sm:text-sm transition-all ${
                                activeTab === tab.id
                                    ? 'bg-background shadow text-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab contents */}
                <div className="rounded-2xl border border-sidebar-border/70 bg-card p-4 md:p-6 dark:border-sidebar-border">
                    {activeTab === 'kyc' && <KycSection users={pendingKycUsers} />}
                    {activeTab === 'deposits' && <DepositsSection deposits={pendingDeposits} />}
                    {activeTab === 'withdrawals' && <WithdrawalsSection withdrawals={pendingWithdrawals} />}
                    {activeTab === 'loans' && <LoansSection loans={pendingLoans} />}
                </div>
            </div>
        </>
    );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
    return (
        <div className="flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-4 dark:border-sidebar-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                {icon}
            </div>
            <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-lg font-bold leading-tight">{value}</span>
            </div>
        </div>
    );
}

// ── KYC Section ──
function KycSection({ users }: { users: User[] }) {
    const { post, processing } = useForm();
    const [rejectionUserId, setRejectionUserId] = useState<string | null>(null);
    const { data, setData, post: postReject, reset } = useForm({ motif: '' });

    if (users.length === 0) {
        return <EmptyState icon={<UserCheck className="h-10 w-10 opacity-30" />} label="Aucun dossier KYC en attente." />;
    }

    function handleApprove(userId: string) {
        post(`/admin/kyc/${userId}/approve`);
    }

    function handleRejectSubmit(e: React.FormEvent, userId: string) {
        e.preventDefault();
        postReject(`/admin/kyc/${userId}/reject`, {
            onSuccess: () => {
                setRejectionUserId(null);
                reset();
            },
        });
    }

    return (
        <div className="flex flex-col gap-6">
            {users.map((user) => (
                <div key={user.id} className="flex flex-col gap-4 rounded-xl border p-4 bg-muted/20">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <div>
                            <h3 className="font-bold text-sm">{user.name}</h3>
                            <p className="text-xs text-muted-foreground">{user.email} · {user.phone}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleApprove(user.id)}
                                disabled={processing}
                                className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                <CheckCircle className="h-3.5 w-3.5" /> Approver
                            </button>
                            <button
                                onClick={() => setRejectionUserId(rejectionUserId === user.id ? null : user.id)}
                                className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
                            >
                                <XCircle className="h-3.5 w-3.5" /> Rejeter
                            </button>
                        </div>
                    </div>

                    {/* Rejection input field */}
                    {rejectionUserId === user.id && (
                        <form onSubmit={(e) => handleRejectSubmit(e, user.id)} className="flex items-center gap-2 mt-2">
                            <input
                                type="text"
                                required
                                value={data.motif}
                                onChange={(e) => setData('motif', e.target.value)}
                                placeholder="Motif du rejet (ex: CNI périmée)"
                                className="input-field max-w-md"
                            />
                            <button
                                type="submit"
                                className="rounded-lg bg-red-700 px-4 py-2 text-xs font-bold text-white hover:bg-red-800 transition-colors"
                            >
                                Valider rejet
                            </button>
                        </form>
                    )}

                    {/* Documents List */}
                    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                        {user.kycDocuments?.map((doc: any) => (
                            <div key={doc.id} className="flex items-center gap-2 rounded-lg border p-2 bg-background">
                                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium truncate">{doc.type}</p>
                                    <p className="text-[10px] text-muted-foreground">{formatDate(doc.created_at)}</p>
                                </div>
                                <a
                                    href={`/storage/${doc.fichier}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] text-indigo-600 hover:underline flex-shrink-0"
                                >
                                    Ouvrir
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── Deposits Section ──
function DepositsSection({ deposits }: { deposits: Transaction[] }) {
    const { post, processing } = useForm();

    if (deposits.length === 0) {
        return <EmptyState icon={<ArrowDownLeft className="h-10 w-10 opacity-30" />} label="Aucun dépôt en attente." />;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b text-xs uppercase text-muted-foreground">
                        <th className="py-3 px-4">Client</th>
                        <th className="py-3 px-4">Montant</th>
                        <th className="py-3 px-4">Référence</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {deposits.map((dep) => (
                        <tr key={dep.id} className="hover:bg-muted/10">
                            <td className="py-3 px-4">
                                <p className="font-semibold text-xs">{dep.user?.name}</p>
                                <p className="text-[10px] text-muted-foreground">{dep.user?.email}</p>
                            </td>
                            <td className="py-3 px-4 font-bold text-green-600">{formatCurrency(dep.montant)}</td>
                            <td className="py-3 px-4 font-mono text-xs">{dep.reference}</td>
                            <td className="py-3 px-4 text-xs">{dep.description}</td>
                            <td className="py-3 px-4 text-xs">{formatDate(dep.created_at)}</td>
                            <td className="py-3 px-4 text-right flex justify-end gap-2">
                                <button
                                    onClick={() => post(`/admin/transactions/${dep.id}/approve-deposit`)}
                                    disabled={processing}
                                    className="rounded bg-green-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    Approuver
                                </button>
                                <button
                                    onClick={() => post(`/admin/transactions/${dep.id}/reject`)}
                                    disabled={processing}
                                    className="rounded bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    Rejeter
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ── Withdrawals Section ──
function WithdrawalsSection({ withdrawals }: { withdrawals: Transaction[] }) {
    const { post, processing } = useForm();

    if (withdrawals.length === 0) {
        return <EmptyState icon={<ArrowUpRight className="h-10 w-10 opacity-30" />} label="Aucun retrait en attente." />;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b text-xs uppercase text-muted-foreground">
                        <th className="py-3 px-4">Client</th>
                        <th className="py-3 px-4">Montant</th>
                        <th className="py-3 px-4">Référence</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {withdrawals.map((w) => (
                        <tr key={w.id} className="hover:bg-muted/10">
                            <td className="py-3 px-4">
                                <p className="font-semibold text-xs">{w.user?.name}</p>
                                <p className="text-[10px] text-muted-foreground">{w.user?.email}</p>
                            </td>
                            <td className="py-3 px-4 font-bold text-red-600">{formatCurrency(w.montant)}</td>
                            <td className="py-3 px-4 font-mono text-xs">{w.reference}</td>
                            <td className="py-3 px-4 text-xs">{w.description}</td>
                            <td className="py-3 px-4 text-xs">{formatDate(w.created_at)}</td>
                            <td className="py-3 px-4 text-right flex justify-end gap-2">
                                <button
                                    onClick={() => post(`/admin/transactions/${w.id}/approve-withdrawal`)}
                                    disabled={processing}
                                    className="rounded bg-green-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    Approuver
                                </button>
                                <button
                                    onClick={() => post(`/admin/transactions/${w.id}/reject`)}
                                    disabled={processing}
                                    className="rounded bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    Rejeter
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ── Loans Section ──
function LoansSection({ loans }: { loans: Loan[] }) {
    const { post, processing } = useForm();

    if (loans.length === 0) {
        return <EmptyState icon={<TrendingUp className="h-10 w-10 opacity-30" />} label="Aucune demande de prêt en attente." />;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b text-xs uppercase text-muted-foreground">
                        <th className="py-3 px-4">Client</th>
                        <th className="py-3 px-4">Plan</th>
                        <th className="py-3 px-4">Montant</th>
                        <th className="py-3 px-4">Durée</th>
                        <th className="py-3 px-4">Taux</th>
                        <th className="py-3 px-4">Motif</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {loans.map((loan) => (
                        <tr key={loan.id} className="hover:bg-muted/10">
                            <td className="py-3 px-4">
                                <p className="font-semibold text-xs">{loan.user?.name}</p>
                                <p className="text-[10px] text-muted-foreground">{loan.user?.email}</p>
                            </td>
                            <td className="py-3 px-4 text-xs font-medium">{loan.plan?.nom}</td>
                            <td className="py-3 px-4 font-bold">{formatCurrency(loan.montant)}</td>
                            <td className="py-3 px-4 text-xs">{loan.duree_mois} mois</td>
                            <td className="py-3 px-4 text-xs">{loan.taux_interet}%</td>
                            <td className="py-3 px-4 text-xs max-w-xs truncate italic">{loan.motif ?? 'Non renseigné'}</td>
                            <td className="py-3 px-4 text-right flex justify-end gap-2">
                                <button
                                    onClick={() => post(`/admin/loans/${loan.id}/approve`)}
                                    disabled={processing}
                                    className="rounded bg-green-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    Approuver
                                </button>
                                <button
                                    onClick={() => post(`/admin/loans/${loan.id}/reject`)}
                                    disabled={processing}
                                    className="rounded bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    Rejeter
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ── Shared Empty State ──
function EmptyState({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground">
            {icon}
            <p className="text-sm font-medium">{label}</p>
        </div>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: '/dashboard' },
        { title: 'Administration', href: '/admin/dashboard' },
    ],
};
