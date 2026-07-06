import { Head, useForm, Link } from '@inertiajs/react';
import {
    HelpCircle,
    MessageSquare,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Send,
} from 'lucide-react';

interface Reply {
    id: string;
    message: string;
    is_admin_reply: boolean;
    created_at: string;
    user: { name: string };
}

interface Ticket {
    id: string;
    sujet: string;
    priorite: string;
    statut: string;
    message: string;
    created_at: string;
    user: { name: string };
    replies: Reply[];
}

interface Props {
    ticket: Ticket;
}

const statutConfig: Record<string, { label: string; classes: string; icon: React.ReactNode }> = {
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

const prioriteConfig: Record<string, { label: string; classes: string }> = {
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

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function Avatar({ name, admin }: { name: string; admin?: boolean }) {
    const initials = name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    return (
        <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${admin ? 'bg-emerald-600' : 'bg-indigo-600'}`}
        >
            {initials}
        </div>
    );
}

export default function ShowTicket({ ticket }: Props) {
    const statut = statutConfig[ticket.statut] ?? {
        label: ticket.statut,
        classes: 'bg-gray-100 text-gray-600',
        icon: null,
    };
    const priorite = prioriteConfig[ticket.priorite] ?? {
        label: ticket.priorite,
        classes: 'bg-gray-100 text-gray-600',
    };

    const isClosed = ticket.statut === 'ferme';

    const { data, setData, post, processing, errors, reset } = useForm({
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/support/${ticket.id}/reply`, {
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title={`${ticket.sujet} – Support BlackBank`} />

            <div className="space-y-6 p-4 md:p-6">
                {/* Back link */}
                <Link
                    href="/support"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                    ← Retour aux tickets
                </Link>

                {/* Ticket header */}
                <div className="rounded-2xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <h1 className="text-lg font-semibold leading-snug">{ticket.sujet}</h1>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Ticket #{ticket.id} · Créé le {formatDate(ticket.created_at)}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${statut.classes}`}
                            >
                                {statut.icon}
                                {statut.label}
                            </span>
                            <span
                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${priorite.classes}`}
                            >
                                Priorité {priorite.label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Conversation thread */}
                <div className="rounded-2xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <div className="border-b border-sidebar-border/50 px-6 py-4">
                        <h2 className="flex items-center gap-2 text-sm font-semibold">
                            <MessageSquare className="h-4 w-4 text-indigo-500" />
                            Conversation ({1 + ticket.replies.length} message
                            {ticket.replies.length !== 0 ? 's' : ''})
                        </h2>
                    </div>

                    <div className="space-y-4 p-6">
                        {/* Original message (client — left) */}
                        <div className="flex items-start gap-3">
                            <Avatar name={ticket.user.name} />
                            <div className="max-w-[75%]">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xs font-semibold">{ticket.user.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDate(ticket.created_at)}
                                    </span>
                                </div>
                                <div className="mt-1 rounded-2xl rounded-tl-none bg-indigo-50 px-4 py-3 text-sm dark:bg-indigo-900/20">
                                    {ticket.message}
                                </div>
                            </div>
                        </div>

                        {/* Replies */}
                        {ticket.replies.map((reply) =>
                            reply.is_admin_reply ? (
                                /* Admin — right */
                                <div key={reply.id} className="flex items-start justify-end gap-3">
                                    <div className="max-w-[75%] text-right">
                                        <div className="flex items-baseline justify-end gap-2">
                                            <span className="text-xs text-muted-foreground">
                                                {formatDate(reply.created_at)}
                                            </span>
                                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                {reply.user.name}{' '}
                                                <span className="text-xs font-normal text-muted-foreground">
                                                    (Admin)
                                                </span>
                                            </span>
                                        </div>
                                        <div className="mt-1 rounded-2xl rounded-tr-none bg-emerald-50 px-4 py-3 text-left text-sm dark:bg-emerald-900/20">
                                            {reply.message}
                                        </div>
                                    </div>
                                    <Avatar name={reply.user.name} admin />
                                </div>
                            ) : (
                                /* Client — left */
                                <div key={reply.id} className="flex items-start gap-3">
                                    <Avatar name={reply.user.name} />
                                    <div className="max-w-[75%]">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xs font-semibold">{reply.user.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDate(reply.created_at)}
                                            </span>
                                        </div>
                                        <div className="mt-1 rounded-2xl rounded-tl-none bg-indigo-50 px-4 py-3 text-sm dark:bg-indigo-900/20">
                                            {reply.message}
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    {/* Reply form */}
                    {isClosed ? (
                        <div className="border-t border-sidebar-border/50 px-6 py-4">
                            <p className="text-center text-xs text-muted-foreground">
                                Ce ticket est fermé. Vous ne pouvez plus y répondre.
                            </p>
                        </div>
                    ) : (
                        <div className="border-t border-sidebar-border/50 px-6 py-5">
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <label className="block text-sm font-medium">Votre réponse</label>
                                <textarea
                                    rows={4}
                                    className="input-field w-full resize-none"
                                    placeholder="Écrivez votre réponse…"
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    required
                                />
                                {errors.message && (
                                    <p className="text-xs text-red-500">{errors.message}</p>
                                )}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                                    >
                                        <Send className="h-4 w-4" />
                                        {processing ? 'Envoi…' : 'Envoyer la réponse'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

ShowTicket.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: '/dashboard' },
        { title: 'Tickets de Support', href: '/support' },
        { title: 'Détail du ticket', href: '#' },
    ],
};
