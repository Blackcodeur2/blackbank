import { Head, useForm, usePage } from '@inertiajs/react';
import { PiggyBank, TrendingUp } from 'lucide-react';
import type { User } from '@/types';

type SavingsPlanType = {
    id: string;
    user_id: string;
    type: 'DPS' | 'FDR';
    montant: string;
    taux_annuel: string;
    duree_mois: number;
    statut: 'actif' | 'termine' | 'annule';
    date_debut: string;
    date_echeance: string;
    created_at: string;
};

type Props = {
    user: User;
    myPlans: SavingsPlanType[];
};

function formatCurrency(amount: string | number) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(amount));
}

function formatDate(dateStr: string) {
    return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(dateStr));
}

const statutBadge: Record<string, string> = {
    actif: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    termine: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    annule: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const planInfo = {
    DPS: {
        label: 'Dépôt d\'Épargne Progressif (DPS)',
        description: 'Épargnez régulièrement avec un taux annuel de 5%. Idéal pour une épargne de court terme.',
        taux: '5%',
        color: 'from-blue-500 to-indigo-600',
        icon: <PiggyBank className="h-6 w-6" />,
    },
    FDR: {
        label: 'Fonds de Rendement (FDR)',
        description: 'Investissez sur le long terme avec un taux annuel de 7.5%. Idéal pour faire fructifier votre capital.',
        taux: '7.5%',
        color: 'from-purple-500 to-violet-600',
        icon: <TrendingUp className="h-6 w-6" />,
    },
};

export default function SavingsIndex({ user, myPlans }: Props) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'DPS' as 'DPS' | 'FDR',
        montant: '',
        duree_mois: '12',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/savings/subscribe', { onSuccess: () => reset() });
    }

    return (
        <>
            <Head title="Épargne — BlackBank" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {flash?.success && (
                    <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-700 dark:bg-green-950/20 dark:border-green-800 dark:text-green-400">
                        {flash.success}
                    </div>
                )}

                {/* Plan cards */}
                <div className="grid gap-4 md:grid-cols-2">
                    {(Object.entries(planInfo) as [string, typeof planInfo['DPS']][]).map(([key, plan]) => (
                        <div key={key} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${plan.color} p-5 text-white shadow-lg`}>
                            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                            <div className="relative flex items-start gap-3">
                                {plan.icon}
                                <div>
                                    <h3 className="font-bold text-sm">{key}</h3>
                                    <p className="text-xs opacity-80 mt-0.5">{plan.description}</p>
                                    <p className="mt-2 text-2xl font-black">{plan.taux}</p>
                                    <p className="text-xs opacity-80">Taux annuel</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Subscribe form */}
                <div className="rounded-2xl border border-sidebar-border/70 bg-card dark:border-sidebar-border max-w-lg">
                    <div className="border-b border-sidebar-border/70 px-5 py-4 dark:border-sidebar-border">
                        <h2 className="font-semibold">Souscrire à un plan</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Solde disponible : {formatCurrency(user.solde)}
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Type de plan</label>
                            <select value={data.type} onChange={(e) => setData('type', e.target.value as 'DPS' | 'FDR')}
                                className="input-field">
                                <option value="DPS">DPS — 5% / an</option>
                                <option value="FDR">FDR — 7.5% / an</option>
                            </select>
                            {errors.type && <p className="text-xs text-destructive">{errors.type}</p>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Montant à investir (€)</label>
                            <input type="number" min="100" step="0.01" required value={data.montant}
                                onChange={(e) => setData('montant', e.target.value)}
                                className="input-field" placeholder="Min. 100 €" />
                            {errors.montant && <p className="text-xs text-destructive">{errors.montant}</p>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Durée (mois)</label>
                            <select value={data.duree_mois} onChange={(e) => setData('duree_mois', e.target.value)}
                                className="input-field">
                                {[3, 6, 12, 24, 36, 60].map((d) => (
                                    <option key={d} value={d}>{d} mois</option>
                                ))}
                            </select>
                            {errors.duree_mois && <p className="text-xs text-destructive">{errors.duree_mois}</p>}
                        </div>

                        <button type="submit" disabled={processing}
                            className="mt-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors">
                            {processing ? 'Souscription…' : 'Souscrire maintenant'}
                        </button>
                    </form>
                </div>

                {/* My plans */}
                <div className="rounded-2xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <div className="border-b border-sidebar-border/70 px-5 py-4 dark:border-sidebar-border">
                        <h2 className="font-semibold">Mes plans d'épargne</h2>
                    </div>
                    {myPlans.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
                            <PiggyBank className="h-8 w-8 opacity-30" />
                            <p className="text-sm">Aucun plan d'épargne actif</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-sidebar-border/50 dark:divide-sidebar-border">
                            {myPlans.map((plan) => (
                                <li key={plan.id} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:gap-4">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm">{plan.type}</span>
                                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statutBadge[plan.statut] ?? ''}`}>
                                                {plan.statut}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {formatDate(plan.date_debut)} → {formatDate(plan.date_echeance)}
                                            {' '}· {plan.duree_mois} mois
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm">{formatCurrency(plan.montant)}</p>
                                        <p className="text-xs text-muted-foreground">{plan.taux_annuel}% / an</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
}

SavingsIndex.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: '/dashboard' },
        { title: 'Épargne', href: '/savings' },
    ],
};
