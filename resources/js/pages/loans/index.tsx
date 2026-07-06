import { Head, useForm, usePage } from '@inertiajs/react';
import { AlertCircle, PiggyBank } from 'lucide-react';
import type { User } from '@/types';

type LoanPlan = {
    id: string;
    nom: string;
    taux_interet: string;
    duree_min_mois?: number;
    duree_max_mois?: number;
    nombre_echeances: number;
    montant_min: string;
    montant_max: string;
};

type Loan = {
    id: string;
    loan_plan_id: string;
    montant: string;
    taux_interet: string;
    duree_mois: number;
    motif: string | null;
    statut: 'en_attente' | 'approuve' | 'actif' | 'solde' | 'en_defaut' | 'rejete';
    created_at: string;
    plan: LoanPlan;
};

type Props = {
    user: User;
    plans: LoanPlan[];
    myLoans: Loan[];
};

function formatCurrency(amount: string | number) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(amount));
}

function formatDate(dateStr: string) {
    return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(dateStr));
}

const loanStatutBadge: Record<string, string> = {
    en_attente: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    approuve: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    actif: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    solde: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    en_defaut: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    rejete: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function LoansIndex({ user, plans, myLoans }: Props) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        loan_plan_id: '',
        montant: '',
        duree_mois: '12',
        motif: '',
    });

    const selectedPlan = plans.find((p) => p.id === data.loan_plan_id);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/loans/apply', { onSuccess: () => reset() });
    }

    return (
        <>
            <Head title="Prêts — BlackBank" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {flash?.success && (
                    <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-700 dark:bg-green-950/20 dark:border-green-800 dark:text-green-400">
                        {flash.success}
                    </div>
                )}

                {/* Available plans */}
                {plans.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                onClick={() => setData('loan_plan_id', plan.id)}
                                className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${
                                    data.loan_plan_id === plan.id
                                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20'
                                        : 'border-sidebar-border/70 bg-card hover:border-indigo-300 dark:border-sidebar-border'
                                }`}
                            >
                                <h3 className="font-bold">{plan.nom}</h3>
                                <p className="mt-1 text-2xl font-black text-indigo-600 dark:text-indigo-400">
                                    {plan.taux_interet}%
                                </p>
                                <p className="text-xs text-muted-foreground">Taux annuel</p>
                                <div className="mt-3 flex flex-col gap-1 text-xs text-muted-foreground">
                                    <span>
                                        Montant : {formatCurrency(plan.montant_min)} – {formatCurrency(plan.montant_max)}
                                    </span>
                                    <span>Écheances : {plan.nombre_echeances}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Application form */}
                <div className="rounded-2xl border border-sidebar-border/70 bg-card dark:border-sidebar-border max-w-lg">
                    <div className="border-b border-sidebar-border/70 px-5 py-4 dark:border-sidebar-border">
                        <h2 className="font-semibold">Demander un prêt</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Sélectionnez un plan ci-dessus, puis remplissez le formulaire.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
                        {!data.loan_plan_id && (
                            <div className="flex items-center gap-2 rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-xs text-yellow-700 dark:bg-yellow-950/20 dark:border-yellow-800 dark:text-yellow-400">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                Sélectionnez d'abord un plan de prêt ci-dessus.
                            </div>
                        )}

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Montant demandé (€)</label>
                            <input
                                type="number"
                                min={selectedPlan?.montant_min ?? '100'}
                                max={selectedPlan?.montant_max}
                                step="0.01"
                                required
                                value={data.montant}
                                onChange={(e) => setData('montant', e.target.value)}
                                className="input-field"
                                placeholder="Ex: 5000.00"
                                disabled={!data.loan_plan_id}
                            />
                            {errors.montant && <p className="text-xs text-destructive">{errors.montant}</p>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Durée (mois)</label>
                            <select
                                value={data.duree_mois}
                                onChange={(e) => setData('duree_mois', e.target.value)}
                                className="input-field"
                                disabled={!data.loan_plan_id}
                            >
                                {[6, 12, 18, 24, 36, 48, 60].map((d) => (
                                    <option key={d} value={d}>{d} mois</option>
                                ))}
                            </select>
                            {errors.duree_mois && <p className="text-xs text-destructive">{errors.duree_mois}</p>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Motif (optionnel)</label>
                            <textarea
                                value={data.motif}
                                onChange={(e) => setData('motif', e.target.value)}
                                className="input-field h-20 resize-none py-2"
                                placeholder="Décrivez brièvement l'objet de votre prêt…"
                                disabled={!data.loan_plan_id}
                            />
                            {errors.motif && <p className="text-xs text-destructive">{errors.motif}</p>}
                        </div>

                        {errors.loan_plan_id && (
                            <p className="text-xs text-destructive">{errors.loan_plan_id}</p>
                        )}

                        <button
                            type="submit"
                            disabled={processing || !data.loan_plan_id}
                            className="mt-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-60 transition-colors"
                        >
                            {processing ? 'Soumission…' : 'Soumettre la demande'}
                        </button>
                    </form>
                </div>

                {/* My loans */}
                <div className="rounded-2xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <div className="border-b border-sidebar-border/70 px-5 py-4 dark:border-sidebar-border">
                        <h2 className="font-semibold">Mes prêts</h2>
                    </div>
                    {myLoans.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
                            <PiggyBank className="h-8 w-8 opacity-30" />
                            <p className="text-sm">Aucun prêt pour le moment</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-sidebar-border/50 dark:divide-sidebar-border">
                            {myLoans.map((loan) => (
                                <li key={loan.id} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:gap-4">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm">{loan.plan?.nom ?? 'Prêt'}</span>
                                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${loanStatutBadge[loan.statut] ?? ''}`}>
                                                {loan.statut.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {loan.duree_mois} mois · {loan.taux_interet}% / an
                                            {' '}· Soumis le {formatDate(loan.created_at)}
                                        </p>
                                        {loan.motif && (
                                            <p className="text-xs text-muted-foreground italic mt-0.5 line-clamp-1">
                                                {loan.motif}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-bold text-sm">{formatCurrency(loan.montant)}</p>
                                        <p className="text-xs text-muted-foreground">{loan.taux_interet}% / an</p>
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

LoansIndex.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: '/dashboard' },
        { title: 'Prêts', href: '/loans' },
    ],
};
