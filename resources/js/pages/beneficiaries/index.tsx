import { Head, useForm, usePage } from '@inertiajs/react';
import { UserPlus, Trash2, Users, ArrowLeftRight } from 'lucide-react';
import type { User } from '@/types';
import { useState } from 'react';

type Beneficiary = {
    id: string;
    nom: string;
    numero_compte: string;
    libelle: string;
    created_at: string;
};

type Props = {
    beneficiaries: Beneficiary[];
};

export default function BeneficiaryIndex({ beneficiaries }: Props) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        numero_compte: '',
        libelle: '',
    });

    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
    const { delete: destroy } = useForm();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/beneficiaries', {
            onSuccess: () => reset(),
        });
    }

    function handleDelete(id: string) {
        setIsDeletingId(id);
        destroy(`/beneficiaries/${id}`, {
            onFinish: () => setIsDeletingId(null),
        });
    }

    return (
        <>
            <Head title="Bénéficiaires — BlackBank" />

            <div className="flex flex-col gap-6 p-4 md:p-6 max-w-4xl mx-auto">
                {flash?.success && (
                    <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-700 dark:bg-green-950/20 dark:border-green-800 dark:text-green-400">
                        {flash.success}
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-12">
                    {/* Add Beneficiary form (Col 5) */}
                    <div className="md:col-span-5 rounded-2xl border border-sidebar-border/70 bg-card p-5 dark:border-sidebar-border h-fit">
                        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-sidebar-border/50">
                            <UserPlus className="h-5 w-5 text-indigo-500" />
                            <h2 className="font-semibold text-sm">Ajouter un bénéficiaire</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="compte-email" className="text-xs font-medium">Adresse email (Compte)</label>
                                <input
                                    id="compte-email"
                                    type="email"
                                    required
                                    value={data.numero_compte}
                                    onChange={(e) => setData('numero_compte', e.target.value)}
                                    placeholder="ex: client@email.com"
                                    className="input-field text-sm"
                                />
                                {errors.numero_compte && (
                                    <p className="text-xs text-destructive">{errors.numero_compte}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="pseudo" className="text-xs font-medium">Libellé / Pseudo</label>
                                <input
                                    id="pseudo"
                                    type="text"
                                    required
                                    value={data.libelle}
                                    onChange={(e) => setData('libelle', e.target.value)}
                                    placeholder="ex: Jean (Ami)"
                                    className="input-field text-sm"
                                />
                                {errors.libelle && (
                                    <p className="text-xs text-destructive">{errors.libelle}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
                            >
                                {processing ? 'Ajout en cours…' : 'Enregistrer le bénéficiaire'}
                            </button>
                        </form>
                    </div>

                    {/* Beneficiaries List (Col 7) */}
                    <div className="md:col-span-7 rounded-2xl border border-sidebar-border/70 bg-card p-5 dark:border-sidebar-border">
                        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-sidebar-border/50">
                            <Users className="h-5 w-5 text-indigo-500" />
                            <h2 className="font-semibold text-sm">Mes bénéficiaires enregistrés</h2>
                        </div>

                        {beneficiaries.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
                                <ArrowLeftRight className="h-8 w-8 opacity-20" />
                                <p className="text-xs">Aucun bénéficiaire enregistré pour le moment.</p>
                                <p className="text-[10px] opacity-75">Ajoutez des destinataires pour faciliter vos virements.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {beneficiaries.map((b) => (
                                    <div
                                        key={b.id}
                                        className="flex items-center justify-between p-3 rounded-xl border border-sidebar-border/50 bg-muted/10 hover:bg-muted/20 transition-colors"
                                    >
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm text-foreground">{b.libelle}</p>
                                            <p className="text-xs text-muted-foreground truncate">{b.nom} · {b.numero_compte}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(b.id)}
                                            disabled={isDeletingId === b.id}
                                            className="p-2 text-destructive hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

BeneficiaryIndex.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: '/dashboard' },
        { title: 'Bénéficiaires', href: '/beneficiaries' },
    ],
};
