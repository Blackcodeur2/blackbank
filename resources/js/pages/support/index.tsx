import { Head, useForm, usePage, Link } from '@inertiajs/react';
import {
    HelpCircle,
    MessageSquare,
    AlertTriangle,
    CheckCircle2,
    Clock,
    PlusCircle,
} from 'lucide-react';

interface Ticket {
    id: string;
    sujet: string;
    priorite: 'basse' | 'moyenne' | 'haute';
    statut: 'ouvert' | 'en_cours' | 'resolu' | 'ferme';
    message: string;
    replies_count: number;
    created_at: string;
}

interface Props {
    tickets: Ticket[];
}

const statutConfig: Record<
    Ticket['statut'],
    { label: string; classes: string; icon: React.ReactNode }
> = {
    ouvert: {
        label: 'Ouvert',
        classes: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
        icon: <HelpCircle className="h-3 w-3" />,
    },
    en_cours: {
        label: 'En cours',
        classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
        icon: <Clock className="h-3 w-3" />,
    },
    resolu: {
        label: 'Résolu',
        classes: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
        icon: <CheckCircle2 className="h-3 w-3" />,
    },
    ferme: {
        label: 'Fermé',
        classes: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
        icon: <AlertTriangle className="h-3 w-3" />,
    },
};

const prioriteConfig: Record<
    Ticket['priorite'],
    { label: string; classes: string }
> = {
    basse: {
        label: 'Basse',
        classes: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    },
    moyenne: {
        label: 'Moyenne',
        classes: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    },
    haute: {
        label: 'Haute',
        classes: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    },
};

export default function SupportIndex({ tickets }: Props) {
    const { props } = usePage<{ flash?: { success?: string } }>();
    const flash = props.flash;

    const { data, setData, post, processing, errors, reset } = useForm({
        sujet: '',
        priorite: 'moyenne' as Ticket['priorite'],
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/support', {
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title="Support – BlackBank" />

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
                        <HelpCircle className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold">Tickets de Support</h1>
                        <p className="text-sm text-muted-foreground">
                            Créez un ticket ou consultez vos demandes en cours.
                        </p>
                    </div>
                </div>

                {/* Main grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                    {/* ---- LEFT: Create ticket form ---- */}
                    <div className="md:col-span-4">
                        <div className="rounded-2xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">
                                <PlusCircle className="h-4 w-4 text-indigo-500" />
                                Nouveau ticket
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Sujet */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Sujet
                                    </label>
                                    <input
                                        type="text"
                                        className="input-field w-full"
                                        placeholder="Décrivez brièvement votre problème"
                                        value={data.sujet}
                                        onChange={(e) => setData('sujet', e.target.value)}
                                        required
                                    />
                                    {errors.sujet && (
                                        <p className="mt-1 text-xs text-red-500">{errors.sujet}</p>
                                    )}
                                </div>

                                {/* Priorité */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Priorité
                                    </label>
                                    <select
                                        className="input-field w-full"
                                        value={data.priorite}
                                        onChange={(e) =>
                                            setData('priorite', e.target.value as Ticket['priorite'])
                                        }
                                        required
                                    >
                                        <option value="basse">Basse</option>
                                        <option value="moyenne">Moyenne</option>
                                        <option value="haute">Haute</option>
                                    </select>
                                    {errors.priorite && (
                                        <p className="mt-1 text-xs text-red-500">{errors.priorite}</p>
                                    )}
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Message
                                    </label>
                                    <textarea
                                        rows={5}
                                        className="input-field w-full resize-none"
                                        placeholder="Décrivez votre problème en détail (minimum 20 caractères)…"
                                        minLength={20}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        required
                                    />
                                    {errors.message && (
                                        <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                                >
                                    {processing ? 'Envoi en cours…' : 'Soumettre le ticket'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* ---- RIGHT: Ticket list ---- */}
                    <div className="md:col-span-8">
                        <div className="rounded-2xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">
                                <MessageSquare className="h-4 w-4 text-indigo-500" />
                                Mes tickets{' '}
                                <span className="ml-auto text-sm font-normal text-muted-foreground">
                                    {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
                                </span>
                            </h2>

                            {tickets.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/30">
                                        <HelpCircle className="h-7 w-7 text-indigo-400" />
                                    </div>
                                    <p className="text-sm font-medium">Aucun ticket pour l'instant</p>
                                    <p className="max-w-xs text-xs text-muted-foreground">
                                        Vous n'avez encore aucun ticket. Si vous rencontrez un problème,
                                        n'hésitez pas à en créer un — nous sommes là pour vous aider !
                                    </p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-sidebar-border/50">
                                    {tickets.map((ticket) => {
                                        const statut = statutConfig[ticket.statut];
                                        const priorite = prioriteConfig[ticket.priorite];
                                        return (
                                            <li key={ticket.id}>
                                                <Link
                                                    href={`/support/${ticket.id}`}
                                                    className="flex items-start justify-between gap-3 py-4 transition-colors hover:bg-muted/30 -mx-2 px-2 rounded-lg"
                                                >
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-medium">
                                                            {ticket.sujet}
                                                        </p>
                                                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                                            {ticket.message.slice(0, 80)}
                                                            {ticket.message.length > 80 ? '…' : ''}
                                                        </p>
                                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                                            {/* Statut badge */}
                                                            <span
                                                                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statut.classes}`}
                                                            >
                                                                {statut.icon}
                                                                {statut.label}
                                                            </span>
                                                            {/* Priorité badge */}
                                                            <span
                                                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${priorite.classes}`}
                                                            >
                                                                {priorite.label}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="shrink-0 text-right">
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <MessageSquare className="h-3 w-3" />
                                                            {ticket.replies_count}
                                                        </div>
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {new Date(ticket.created_at).toLocaleDateString('fr-FR', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                            })}
                                                        </p>
                                                    </div>
                                                </Link>
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

SupportIndex.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: '/dashboard' },
        { title: 'Tickets de Support', href: '/support' },
    ],
};
