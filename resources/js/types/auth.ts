export type KycDocument = {
    id: string;
    user_id: string;
    type: string;
    fichier?: string;
    statut: 'en_attente' | 'approuve' | 'rejete';
    commentaire?: string;
    created_at: string;
};

export type User = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    statut_kyc: 'en_attente' | 'verifie' | 'rejete';
    solde: string;
    role: 'client' | 'admin' | 'super_admin';
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    kycDocuments?: KycDocument[];
    [key: string]: unknown;
};

export type Transaction = {
    id: string;
    user_id: string;
    type: 'depot' | 'retrait' | 'virement_interne' | 'virement_externe' | 'virement_telegraphique' | 'frais' | 'interet';
    montant: string;
    statut: 'en_attente' | 'reussie' | 'echouee' | 'annulee';
    description?: string;
    reference?: string;
    metadonnees?: Record<string, unknown>;
    created_at: string;
    updated_at: string;
    // Eager-loaded relation (admin views)
    user?: User;
};

export type Auth = {
    user: User;
};

/* @chisel-passkeys */
export type Passkey = {
    id: string;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};
/* @end-chisel-passkeys */

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
