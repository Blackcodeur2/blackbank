import { Head, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    FileText,
    ShieldCheck,
    Upload,
    XCircle,
} from 'lucide-react';
import type { KycDocument, User } from '@/types';

type Props = {
    user: User;
    documents: KycDocument[];
    statut: User['statut_kyc'];
};

const documentTypes = [
    { value: 'identite', label: "Carte nationale d'identité" },
    { value: 'passeport', label: 'Passeport' },
    { value: 'permis', label: 'Permis de conduire' },
    { value: 'justificatif_domicile', label: 'Justificatif de domicile' },
    { value: 'photo', label: 'Photo / Selfie' },
];

const statutConfig: Record<string, { label: string; icon: React.ReactNode; classes: string }> = {
    non_soumis: {
        label: 'Non soumis',
        icon: <AlertTriangle className="h-4 w-4" />,
        classes: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
    },
    en_attente: {
        label: 'En attente de vérification',
        icon: <Clock className="h-4 w-4" />,
        classes: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    verifie: {
        label: 'Vérifié ✓',
        icon: <CheckCircle className="h-4 w-4" />,
        classes: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    },
    rejete: {
        label: 'Rejeté',
        icon: <XCircle className="h-4 w-4" />,
        classes: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    },
};

function formatDate(dateStr: string) {
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dateStr));
}

export default function KycIndex({ user, documents, statut }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        type: string;
        fichier: File | null;
    }>({
        type: '',
        fichier: null,
    });

    const effectifStatut = (statut === 'en_attente' && documents.length === 0) ? 'non_soumis' : statut;
    const config = statutConfig[effectifStatut] ?? statutConfig['en_attente'];

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/kyc', {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    }

    return (
        <>
            <Head title="Vérification KYC — BlackBank" />

            <div className="flex flex-col gap-6 p-4 md:p-6 max-w-3xl mx-auto">
                {/* Status banner */}
                <div className={`flex items-center gap-3 rounded-xl p-4 ${config.classes}`}>
                    {config.icon}
                    <div>
                        <p className="font-semibold text-sm">Statut KYC : {config.label}</p>
                        {effectifStatut === 'non_soumis' && (
                            <p className="text-xs mt-0.5 opacity-80">
                                Soumettez vos documents pour débloquer toutes les fonctionnalités bancaires.
                            </p>
                        )}
                        {effectifStatut === 'verifie' && (
                            <p className="text-xs mt-0.5 opacity-80">
                                Votre identité a été vérifiée. Toutes les fonctionnalités sont disponibles.
                            </p>
                        )}
                    </div>
                </div>

                {/* Upload form — only if not verified */}
                {statut !== 'verifie' && (
                    <div className="rounded-2xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                        <div className="border-b border-sidebar-border/70 px-5 py-4 dark:border-sidebar-border">
                            <h2 className="font-semibold flex items-center gap-2">
                                <Upload className="h-4 w-4" />
                                Soumettre un document
                            </h2>
                            <p className="text-xs text-muted-foreground mt-1">
                                Formats acceptés : JPG, PNG, PDF — Max 5 Mo
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5">
                            {/* Type select */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="kyc-type" className="text-sm font-medium">
                                    Type de document
                                </label>
                                <select
                                    id="kyc-type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                >
                                    <option value="" disabled>Sélectionner un type…</option>
                                    {documentTypes.map((dt) => (
                                        <option key={dt.value} value={dt.value}>
                                            {dt.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.type && (
                                    <p className="text-xs text-destructive">{errors.type}</p>
                                )}
                            </div>

                            {/* File input */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="kyc-file" className="text-sm font-medium">
                                    Fichier
                                </label>
                                <input
                                    id="kyc-file"
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={(e) => setData('fichier', e.target.files?.[0] ?? null)}
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                                {errors.fichier && (
                                    <p className="text-xs text-destructive">{errors.fichier}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
                            >
                                <ShieldCheck className="h-4 w-4" />
                                {processing ? 'Envoi en cours…' : 'Soumettre le document'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Submitted documents */}
                <div className="rounded-2xl border border-sidebar-border/70 bg-card dark:border-sidebar-border">
                    <div className="border-b border-sidebar-border/70 px-5 py-4 dark:border-sidebar-border">
                        <h2 className="font-semibold flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Documents soumis
                        </h2>
                    </div>

                    {documents.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
                            <FileText className="h-8 w-8 opacity-30" />
                            <p className="text-sm">Aucun document soumis pour l'instant</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-sidebar-border/50 dark:divide-sidebar-border">
                            {documents.map((doc) => {
                                const docStatut = statutConfig[doc.statut] ?? statutConfig['en_attente'];
                                const typeLabel = documentTypes.find((d) => d.value === doc.type)?.label ?? doc.type;
                                return (
                                    <li key={doc.id} className="flex items-center gap-4 px-5 py-3.5">
                                        <FileText className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium">{typeLabel}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(doc.created_at)}
                                            </p>
                                            {doc.commentaire && (
                                                <p className="text-xs text-muted-foreground mt-0.5 italic">
                                                    {doc.commentaire}
                                                </p>
                                            )}
                                        </div>
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${docStatut.classes}`}>
                                            {docStatut.icon}
                                            {docStatut.label}
                                        </span>
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

KycIndex.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: '/dashboard' },
        { title: 'Vérification KYC', href: '/kyc' },
    ],
};
