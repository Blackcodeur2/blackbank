import { Head, useForm, usePage } from '@inertiajs/react';
import {
    ArrowDownLeft,
    ArrowRightLeft,
    ArrowUpRight,
    Banknote,
    Send,
} from 'lucide-react';
import { useState } from 'react';
import type { Transaction, User } from '@/types';

type Props = {
    user: User;
    transactions: {
        data: Transaction[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
};

function formatCurrency(amount: string | number) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(amount));
}

function formatDate(dateStr: string) {
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    }).format(new Date(dateStr));
}

const typeLabel: Record<string, string> = {
    depot: 'Dépôt',
    retrait: 'Retrait',
    virement_interne: 'Virement interne',
    virement_externe: 'Virement externe',
    virement_telegraphique: 'Virement télégraphique',
    frais: 'Frais',
    interet: 'Intérêt',
};

const statutBadge: Record<string, string> = {
    en_attente: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    reussie: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    echouee: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    annulee: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

type Tab = 'historique' | 'depot' | 'retrait' | 'transfert';

export default function TransactionsIndex({ user, transactions }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>('historique');
    const { flash } = usePage<{ flash: { success?: string; warning?: string } }>().props;

    return (
        <>
            <Head title="Transactions — BlackBank" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Flash messages */}
                {flash?.success && (
                    <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-700 dark:bg-green-950/20 dark:border-green-800 dark:text-green-400">
                        {flash.success}
                    </div>
                )}

                {/* Tab nav */}
                <div className="flex gap-1 rounded-xl bg-muted p-1">
                    {[
                        { id: 'historique' as Tab, label: 'Historique', icon: <Banknote className="h-4 w-4" /> },
                        { id: 'depot' as Tab, label: 'Dépôt', icon: <ArrowDownLeft className="h-4 w-4" /> },
                        { id: 'retrait' as Tab, label: 'Retrait', icon: <ArrowUpRight className="h-4 w-4" /> },
                        { id: 'transfert' as Tab, label: 'Transfert', icon: <ArrowRightLeft className="h-4 w-4" /> },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                                activeTab === tab.id
                                    ? 'bg-background shadow text-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {tab.icon}
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                {activeTab === 'historique' && (
                    <TransactionHistory transactions={transactions.data} />
                )}
                {activeTab === 'depot' && <DepositForm user={user} />}
                {activeTab === 'retrait' && <WithdrawForm user={user} />}
                {activeTab === 'transfert' && <TransferForm user={user} />}
            </div>
        </>
    );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TransactionHistory({ transactions }: { transactions: Transaction[] }) {
    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-sidebar-border/70 py-16 text-center text-muted-foreground dark:border-sidebar-border">
                <Banknote className="h-10 w-10 opacity-30" />
                <p className="text-sm">Aucune transaction pour le moment</p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-sidebar-border/70 dark:border-sidebar-border overflow-hidden">
            <ul className="divide-y divide-sidebar-border/50 dark:divide-sidebar-border">
                {transactions.map((tx) => {
                    const isCredit = tx.type === 'depot' ||
                        tx.type === 'interet' ||
                        (tx.type === 'virement_interne' && tx.metadonnees?.type_transfert === 'recu');
                    return (
                        <li key={tx.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                            <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${isCredit ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                {isCredit
                                    ? <ArrowDownLeft className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    : <ArrowUpRight className="h-5 w-5 text-red-600 dark:text-red-400" />
                                }
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{typeLabel[tx.type] ?? tx.type}</p>
                                <p className="text-xs text-muted-foreground">{formatDate(tx.created_at)}</p>
                                {tx.reference && (
                                    <p className="text-xs text-muted-foreground font-mono">{tx.reference}</p>
                                )}
                            </div>
                            <div className="text-right">
                                <p className={`text-sm font-bold ${isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {isCredit ? '+' : '-'}{formatCurrency(tx.montant)}
                                </p>
                                <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${statutBadge[tx.statut] ?? ''}`}>
                                    {tx.statut.replace('_', ' ')}
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

function DepositForm({ user }: { user: User }) {
    const { data, setData, post, processing, errors } = useForm({
        montant: '',
        description: '',
    });

    return (
        <FormCard
            title="Demande de dépôt"
            description="Soumettez une demande de dépôt. Un administrateur validera et créditera votre compte."
            icon={<ArrowDownLeft className="h-5 w-5 text-green-500" />}
        >
            <form onSubmit={(e) => { e.preventDefault(); post('/transactions/deposit'); }} className="flex flex-col gap-4">
                <FormField label="Montant (€)" error={errors.montant}>
                    <input type="number" min="1" step="0.01" required value={data.montant}
                        onChange={(e) => setData('montant', e.target.value)}
                        className="input-field" placeholder="Ex: 500.00" />
                </FormField>
                <FormField label="Description (optionnel)" error={errors.description}>
                    <input type="text" value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="input-field" placeholder="Référence de paiement…" />
                </FormField>
                <SubmitBtn processing={processing} label="Soumettre la demande" />
            </form>
        </FormCard>
    );
}

function WithdrawForm({ user }: { user: User }) {
    const { data, setData, post, processing, errors } = useForm({
        montant: '',
        description: '',
    });

    return (
        <FormCard
            title="Demande de retrait"
            description={`Solde disponible : ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(user.solde))}`}
            icon={<ArrowUpRight className="h-5 w-5 text-red-500" />}
        >
            <form onSubmit={(e) => { e.preventDefault(); post('/transactions/withdraw'); }} className="flex flex-col gap-4">
                <FormField label="Montant (€)" error={errors.montant}>
                    <input type="number" min="1" step="0.01" max={user.solde} required value={data.montant}
                        onChange={(e) => setData('montant', e.target.value)}
                        className="input-field" placeholder="Ex: 200.00" />
                </FormField>
                <FormField label="Description (optionnel)" error={errors.description}>
                    <input type="text" value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="input-field" placeholder="Motif du retrait…" />
                </FormField>
                <SubmitBtn processing={processing} label="Demander le retrait" color="bg-red-600 hover:bg-red-700" />
            </form>
        </FormCard>
    );
}

function TransferForm({ user }: { user: User }) {
    const { data, setData, post, processing, errors } = useForm({
        email_destinataire: '',
        montant: '',
        description: '',
    });

    return (
        <FormCard
            title="Virement interne"
            description="Transférez de l'argent à un autre utilisateur BlackBank instantanément."
            icon={<Send className="h-5 w-5 text-indigo-500" />}
        >
            <form onSubmit={(e) => { e.preventDefault(); post('/transactions/transfer'); }} className="flex flex-col gap-4">
                <FormField label="E-mail du destinataire" error={errors.email_destinataire}>
                    <input type="email" required value={data.email_destinataire}
                        onChange={(e) => setData('email_destinataire', e.target.value)}
                        className="input-field" placeholder="destinataire@exemple.com" />
                </FormField>
                <FormField label="Montant (€)" error={errors.montant}>
                    <input type="number" min="1" step="0.01" required value={data.montant}
                        onChange={(e) => setData('montant', e.target.value)}
                        className="input-field" placeholder="Ex: 50.00" />
                </FormField>
                <FormField label="Description (optionnel)" error={errors.description}>
                    <input type="text" value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="input-field" placeholder="Motif du transfert…" />
                </FormField>
                <SubmitBtn processing={processing} label="Envoyer le virement" color="bg-indigo-600 hover:bg-indigo-700" />
            </form>
        </FormCard>
    );
}

function FormCard({ title, description, icon, children }: {
    title: string; description: string; icon: React.ReactNode; children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-sidebar-border/70 bg-card dark:border-sidebar-border max-w-lg">
            <div className="flex items-center gap-3 border-b border-sidebar-border/70 px-5 py-4 dark:border-sidebar-border">
                {icon}
                <div>
                    <h2 className="font-semibold">{title}</h2>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </div>
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">{label}</label>
            {children}
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

function SubmitBtn({ processing, label, color = 'bg-indigo-600 hover:bg-indigo-700' }: {
    processing: boolean; label: string; color?: string;
}) {
    return (
        <button type="submit" disabled={processing}
            className={`mt-2 flex items-center justify-center gap-2 rounded-lg ${color} px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 transition-colors`}>
            {processing ? 'Traitement…' : label}
        </button>
    );
}

// CSS utility — add to global CSS
// .input-field = standard input style matching the design system
TransactionsIndex.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: '/dashboard' },
        { title: 'Transactions', href: '/transactions' },
    ],
};
