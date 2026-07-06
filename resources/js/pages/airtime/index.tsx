import { Head, useForm, usePage } from '@inertiajs/react';
import {
    Smartphone,
    Send,
    Clock,
    CreditCard,
    CheckCircle2,
    History,
} from 'lucide-react';

interface AirtimeTransaction {
    id: string;
    montant: number;
    statut: string;
    created_at: string;
    metadonnees: {
        telephone: string;
        operateur: string;
        montant: number;
    };
}

interface Props {
    user: { solde: string | number; name: string };
    history: AirtimeTransaction[];
}

const operateurLabels: Record<string, string> = {
    orange: 'Orange',
    mtn: 'MTN',
    moov: 'Moov',
    airtel: 'Airtel',
    other: 'Autre',
};

const statutConfig: Record<string, { label: string; classes: string; icon: React.ReactNode }> = {
    success: {
        label: 'Succès',
        classes: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
        icon: <CheckCircle2 className="h-3 w-3" />,
    },
    pending: {
        label: 'En attente',
        classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
        icon: <Clock className="h-3 w-3" />,
    },
    failed: {
        label: 'Échoué',
        classes: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
        icon: <Clock className="h-3 w-3" />,
    },
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function formatMontant(value: string | number) {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0,
    }).format(num);
}

export default function AirtimeIndex({ user, history }: Props) {
    const { props } = usePage<{ flash?: { success?: string } }>();
    const flash = props.flash;

    const { data, setData, post, processing, errors, reset } = useForm({
        telephone: '',
        operateur: 'orange',
        montant: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/airtime/purchase', {
            onSuccess: () => reset(),
        });
    };

    const recentHistory = history.slice(0, 10);

    return (
        <>
            <Head title="Recharge Mobile – BlackBank" />

            <div className="space-y-6 p-4 md:p-6">
                {/* Flash success */}
                {flash?.success && (
                    <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        {flash.success}
                    </div>
                )}

                {/* Page header */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                        <Smartphone className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold">Recharge Mobile</h1>
                        <p className="text-sm text-muted-foreground">
                            Rechargez un numéro de téléphone instantanément.
                        </p>
                    </div>
                </div>

                {/* Main grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                    {/* ---- LEFT: Purchase form ---- */}
                    <div className="md:col-span-5">
                        <div className="rounded-2xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                            <h2 className="mb-5 flex items-center gap-2 text-base font-semibold">
                                <CreditCard className="h-4 w-4 text-indigo-500" />
                                Effectuer une recharge
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Téléphone */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Numéro de téléphone
                                    </label>
                                    <input
                                        type="text"
                                        className="input-field w-full"
                                        placeholder="06 xx xx xx xx"
                                        value={data.telephone}
                                        onChange={(e) => setData('telephone', e.target.value)}
                                        required
                                    />
                                    {errors.telephone && (
                                        <p className="mt-1 text-xs text-red-500">{errors.telephone}</p>
                                    )}
                                </div>

                                {/* Opérateur */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Opérateur
                                    </label>
                                    <select
                                        className="input-field w-full"
                                        value={data.operateur}
                                        onChange={(e) => setData('operateur', e.target.value)}
                                        required
                                    >
                                        <option value="orange">Orange</option>
                                        <option value="mtn">MTN</option>
                                        <option value="moov">Moov</option>
                                        <option value="airtel">Airtel</option>
                                        <option value="other">Autre</option>
                                    </select>
                                    {errors.operateur && (
                                        <p className="mt-1 text-xs text-red-500">{errors.operateur}</p>
                                    )}
                                </div>

                                {/* Montant */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Montant (FCFA)
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        className="input-field w-full"
                                        placeholder="Ex: 500"
                                        value={data.montant}
                                        onChange={(e) => setData('montant', e.target.value)}
                                        required
                                    />
                                    {errors.montant && (
                                        <p className="mt-1 text-xs text-red-500">{errors.montant}</p>
                                    )}
                                </div>

                                {/* Solde dispo */}
                                <p className="text-xs text-muted-foreground">
                                    Solde disponible :{' '}
                                    <span className="font-semibold text-foreground">
                                        {formatMontant(user.solde)}
                                    </span>
                                </p>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-2 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    <Send className="h-4 w-4" />
                                    {processing ? 'Traitement…' : 'Recharger maintenant'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* ---- RIGHT: History ---- */}
                    <div className="md:col-span-7">
                        <div className="rounded-2xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">
                                <History className="h-4 w-4 text-indigo-500" />
                                Historique des recharges
                                <span className="ml-auto text-sm font-normal text-muted-foreground">
                                    10 dernières
                                </span>
                            </h2>

                            {recentHistory.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/30">
                                        <Smartphone className="h-6 w-6 text-indigo-400" />
                                    </div>
                                    <p className="text-sm font-medium">Aucune recharge effectuée</p>
                                    <p className="max-w-xs text-xs text-muted-foreground">
                                        Votre historique de recharges apparaîtra ici une fois votre
                                        première transaction effectuée.
                                    </p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-sidebar-border/50">
                                    {recentHistory.map((tx) => {
                                        const meta = tx.metadonnees;
                                        const statut =
                                            statutConfig[tx.statut] ?? {
                                                label: tx.statut,
                                                classes: 'bg-gray-100 text-gray-600',
                                                icon: null,
                                            };
                                        return (
                                            <li
                                                key={tx.id}
                                                className="flex items-center gap-3 py-3"
                                            >
                                                {/* Icon */}
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30">
                                                    <Smartphone className="h-4 w-4" />
                                                </div>

                                                {/* Details */}
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium">
                                                        {operateurLabels[meta.operateur] ?? meta.operateur} ·{' '}
                                                        {meta.telephone}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDate(tx.created_at)}
                                                    </p>
                                                </div>

                                                {/* Amount + status */}
                                                <div className="shrink-0 text-right">
                                                    <p className="text-sm font-semibold">
                                                        {formatMontant(meta.montant)}
                                                    </p>
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statut.classes}`}
                                                    >
                                                        {statut.icon}
                                                        {statut.label}
                                                    </span>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

AirtimeIndex.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: '/dashboard' },
        { title: 'Recharge Mobile', href: '/airtime' },
    ],
};
