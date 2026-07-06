import { Head, Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { dashboard, login, register } from '@/routes';
import { 
    ArrowRight, 
    PiggyBank, 
    TrendingUp, 
    ShieldCheck, 
    Coins, 
    Lock, 
    HelpCircle, 
    Users, 
    CreditCard, 
    Activity, 
    ChevronDown,
    Smartphone,
    CheckCircle2
} from 'lucide-react';
import { useState } from 'react';

// Plans d'épargne fictifs pour affichage
const savingsPlans = [
    {
        name: "Dépôt Progressif (DPS)",
        rate: "5.00%",
        desc: "Épargnez à votre rythme via des versements périodiques. Idéal pour construire un capital progressivement.",
        features: ["Versements réguliers", "Intérêts calculés mensuellement", "Retrait flexible après maturité"],
        badge: "Populaire"
    },
    {
        name: "Fonds de Rendement (FDR)",
        rate: "7.50%",
        desc: "Bloquez un capital de départ sur une durée fixe pour maximiser vos gains grâce à un taux d'intérêt exceptionnel.",
        features: ["Rendement maximal", "Fonds verrouillés sécurisés", "Intérêts versés périodiquement"],
        badge: "Rendement Élevé"
    }
];

// Plans de crédits fictifs pour affichage
const loanPlans = [
    {
        name: "Crédit Immobilier",
        rate: "3.20%",
        desc: "Financez l'acquisition de votre résidence principale ou secondaire avec des mensualités flexibles.",
        limit: "Jusqu'à 500 000 €"
    },
    {
        name: "Prêt Personnel",
        rate: "4.50%",
        desc: "Un besoin de trésorerie pour vos projets personnels (voyage, travaux, événements) sans justificatif complexe.",
        limit: "Jusqu'à 50 000 €"
    },
    {
        name: "Crédit Véhicule",
        rate: "3.80%",
        desc: "Achetez votre voiture neuve ou d'occasion avec une solution de financement transparente et rapide.",
        limit: "Jusqu'à 75 000 €"
    }
];

// FAQ
const faqItems = [
    {
        q: "Comment puis-je ouvrir un compte sur BlackBank ?",
        a: "L'ouverture de compte est extrêmement simple et se fait entièrement en ligne. Cliquez sur le bouton 'S'inscrire', remplissez les informations requises (nom, email, téléphone), puis complétez votre profil en soumettant vos documents KYC pour débloquer toutes les fonctionnalités bancaires."
    },
    {
        q: "Qu'est-ce que le processus KYC (Know Your Customer) ?",
        a: "Le KYC est une obligation légale de vérification d'identité. Pour protéger notre communauté et lutter contre la fraude, nous vous demandons de soumettre une pièce d'identité (CNI ou Passeport) et un justificatif de domicile. Nos administrateurs valident votre dossier sous 24h."
    },
    {
        q: "Comment fonctionnent les plans d'épargne DPS et FDR ?",
        a: "Le DPS est un plan d'épargne progressif où vous effectuez des versements réguliers. Le FDR vous permet de placer un capital de départ bloqué sur une durée prédéfinie en échange d'un taux d'intérêt plus élevé (jusqu'à 7.50% par an). Les intérêts sont crédités directement sur votre solde."
    },
    {
        q: "Comment puis-je rembourser mon crédit ?",
        a: "Une fois votre demande de crédit approuvée par nos administrateurs, les fonds sont crédités sur votre compte et un échéancier de remboursement est généré. Les mensualités sont automatiquement prélevées sur votre solde à chaque date d'échéance. Vous pouvez aussi rembourser manuellement depuis votre espace client."
    }
];

export default function Welcome() {
    const { auth } = usePage().props as unknown as { auth: { user: any } };
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    return (
        <>
            <Head title="BlackBank — Plateforme de Banque Digitale" />

            <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500 selection:text-white">
                
                {/* Header / Navbar */}
                <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
                    <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <AppLogoIcon className="size-8 fill-current text-indigo-600 dark:text-indigo-400" />
                            <span className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400">
                                BlackBank
                            </span>
                        </div>

                        {/* Navigation links - Desktop */}
                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                            <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">Services</a>
                            <a href="#savings" className="text-muted-foreground hover:text-foreground transition-colors">Épargne</a>
                            <a href="#loans" className="text-muted-foreground hover:text-foreground transition-colors">Crédits</a>
                            <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
                        </nav>

                        {/* Auth actions */}
                        <div className="flex items-center gap-3">
                            {auth?.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex h-9 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/10"
                                >
                                    Espace Client
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="inline-flex h-9 items-center justify-center rounded-xl px-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Connexion
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="inline-flex h-9 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/15"
                                    >
                                        S'inscrire
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.05),transparent_50%)]">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                            {/* Text column */}
                            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                    <Activity className="size-3.5" />
                                    Banque Digitale de Nouvelle Génération
                                </span>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-foreground">
                                    Gérez votre argent avec <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 dark:from-indigo-400 dark:to-violet-400">intelligence</span>
                                </h1>
                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                                    Une plateforme bancaire sécurisée, rapide et moderne. DPS, FDR, prêts personnalisés et virements sécurisés à portée de main.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <Link
                                        href={register()}
                                        className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 font-semibold text-white hover:bg-indigo-700 transition-colors shadow-xl shadow-indigo-600/20"
                                    >
                                        Ouvrir mon compte
                                        <ArrowRight className="size-4" />
                                    </Link>
                                    <a
                                        href="#services"
                                        className="inline-flex h-12 items-center justify-center rounded-2xl border border-border px-6 font-medium text-foreground hover:bg-muted/50 transition-all"
                                    >
                                        En savoir plus
                                    </a>
                                </div>
                            </div>

                            {/* Graphic / Branding Image column */}
                            <div className="lg:col-span-6 flex justify-center relative select-none">
                                <div className="absolute -inset-4 bg-indigo-500/5 rounded-full blur-3xl" />
                                <div className="relative rounded-3xl overflow-hidden border border-border bg-card shadow-2xl p-2 max-w-lg w-full">
                                    <img 
                                        src="/images/auth_branding.png" 
                                        alt="Branding Interface BlackBank" 
                                        className="rounded-2xl w-full object-cover aspect-video lg:aspect-auto"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Statistics Banner */}
                <section className="border-y border-border/50 bg-muted/20 py-8">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            <div>
                                <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">15 000+</p>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Utilisateurs actifs</p>
                            </div>
                            <div>
                                <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">12 M€+</p>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Dépôts sécurisés</p>
                            </div>
                            <div>
                                <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">99.9%</p>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Disponibilité système</p>
                            </div>
                            <div>
                                <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">24h / 7j</p>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Support technique</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section id="services" className="py-16 sm:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Tous les outils d'une banque moderne
                            </h2>
                            <p className="text-muted-foreground">
                                Des fonctionnalités puissantes pour garder le contrôle de votre argent à chaque instant.
                              </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Card 1 */}
                            <div className="rounded-3xl border border-border bg-card p-8 space-y-4 hover:border-indigo-500/40 hover:shadow-lg transition-all duration-300">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                    <ShieldCheck className="size-6" />
                                </div>
                                <h3 className="text-lg font-bold">Sécurité maximale</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Authentification par passkeys sans mot de passe, authentification à double facteur (2FA) et stockage local chiffré des documents.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="rounded-3xl border border-border bg-card p-8 space-y-4 hover:border-indigo-500/40 hover:shadow-lg transition-all duration-300">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                    <Coins className="size-6" />
                                </div>
                                <h3 className="text-lg font-bold">Transactions fluides</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Effectuez des dépôts, des retraits, et des virements instantanés et sécurisés par emails entre membres de la plateforme.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="rounded-3xl border border-border bg-card p-8 space-y-4 hover:border-indigo-500/40 hover:shadow-lg transition-all duration-300">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                    <Smartphone className="size-6" />
                                </div>
                                <h3 className="text-lg font-bold">Achat de crédit mobile</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Rechargez instantanément votre téléphone ou celui de vos proches grâce à notre module de recharge mobile (Airtime) intégré.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Savings Section */}
                <section id="savings" className="py-16 bg-muted/10 border-y border-border/30">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Nos Solutions d'Épargne
                            </h2>
                            <p className="text-muted-foreground">
                                Faites fructifier vos excédents de trésorerie avec des taux garantis et compétitifs.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {savingsPlans.map((plan, idx) => (
                                <div key={idx} className="relative rounded-3xl border border-border bg-card p-8 flex flex-col justify-between hover:shadow-xl transition-all duration-300">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                                                {plan.badge}
                                            </span>
                                            <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{plan.rate}</span>
                                        </div>
                                        <h3 className="text-xl font-bold">{plan.name}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{plan.desc}</p>
                                        <ul className="space-y-2 pt-2">
                                            {plan.features.map((feat, fIdx) => (
                                                <li key={fIdx} className="flex items-center gap-2 text-sm">
                                                    <CheckCircle2 className="size-4 text-green-500 shrink-0" />
                                                    <span>{feat}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="pt-6 mt-6 border-t border-border/50">
                                        <Link 
                                            href={register()}
                                            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
                                        >
                                            Souscrire maintenant
                                            <ArrowRight className="size-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Loans Section */}
                <section id="loans" className="py-16 sm:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Nos Solutions de Financement
                            </h2>
                            <p className="text-muted-foreground">
                                Réalisez vos projets immobiliers, personnels ou d'achats avec des crédits transparents.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {loanPlans.map((plan, idx) => (
                                <div key={idx} className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between hover:border-indigo-500/20 hover:shadow-lg transition-all duration-300">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-semibold text-muted-foreground">{plan.limit}</span>
                                            <span className="rounded-lg bg-indigo-500/10 px-2 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                                Taux : {plan.rate}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold">{plan.name}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{plan.desc}</p>
                                    </div>
                                    <div className="pt-4 mt-4 border-t border-border/50">
                                        <Link
                                            href={register()}
                                            className="inline-flex w-full items-center justify-center rounded-lg border border-border py-2 text-xs font-semibold hover:bg-muted/50 transition-colors"
                                        >
                                            Faire une demande
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="py-16 bg-muted/10 border-t border-border/30">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Questions Fréquentes
                            </h2>
                            <p className="text-muted-foreground">
                                Tout ce que vous devez savoir sur le fonctionnement de BlackBank.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {faqItems.map((item, idx) => (
                                <div 
                                    key={idx} 
                                    className="rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300"
                                >
                                    <button
                                        onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                        className="flex w-full items-center justify-between px-6 py-4 text-left font-semibold text-sm sm:text-base hover:bg-muted/35"
                                    >
                                        <span>{item.q}</span>
                                        <ChevronDown className={`size-5 text-muted-foreground transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                                    </button>
                                    {activeFaq === idx && (
                                        <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/20 pt-4">
                                            {item.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Banner */}
                <section className="py-16 sm:py-20 bg-indigo-600 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)]" />
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center space-y-6 relative z-10">
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                            Prêt à révolutionner la gestion de vos finances ?
                        </h2>
                        <p className="text-indigo-100 max-w-xl mx-auto">
                            Rejoignez des milliers de clients satisfaits et ouvrez votre compte numérique en moins de 5 minutes.
                        </p>
                        <div>
                            <Link
                                href={register()}
                                className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-6 font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors shadow-2xl"
                            >
                                Ouvrir mon compte gratuit
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-border bg-card py-12 text-sm text-muted-foreground">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {/* Brand col */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-foreground font-bold">
                                    <AppLogoIcon className="size-6 fill-current text-indigo-600 dark:text-indigo-400" />
                                    <span>BlackBank</span>
                                </div>
                                <p className="text-xs leading-relaxed">
                                    BlackBank est une plateforme de portefeuille numérique et d'épargne. Produits de crédits et d'épargne réglementés chiffrés de bout en bout.
                                </p>
                            </div>

                            {/* Links col 1 */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-foreground">Épargne & Crédits</h4>
                                <ul className="space-y-2 text-xs">
                                    <li><Link href={register()} className="hover:underline">Plans d'épargne FDR</Link></li>
                                    <li><Link href={register()} className="hover:underline">Plans progressifs DPS</Link></li>
                                    <li><Link href={register()} className="hover:underline">Crédit Immobilier</Link></li>
                                    <li><Link href={register()} className="hover:underline">Prêts Personnels</Link></li>
                                </ul>
                            </div>

                            {/* Links col 2 */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-foreground">Sécurité & Aide</h4>
                                <ul className="space-y-2 text-xs">
                                    <li><Link href={login()} className="hover:underline">Passkeys</Link></li>
                                    <li><Link href={login()} className="hover:underline">Double Facteur 2FA</Link></li>
                                    <li><a href="#faq" className="hover:underline">Centre d'aide</a></li>
                                    <li><Link href={register()} className="hover:underline">Tickets de Support</Link></li>
                                </ul>
                            </div>

                            {/* Legal col */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-foreground">Légal</h4>
                                <ul className="space-y-2 text-xs">
                                    <li className="hover:underline cursor-pointer">Conditions Générales</li>
                                    <li className="hover:underline cursor-pointer">Politique de Confidentialité</li>
                                    <li className="hover:underline cursor-pointer">Mentions Légales</li>
                                    <li className="hover:underline cursor-pointer">Gestion des Cookies</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
                            <p>© {new Date().getFullYear()} BlackBank Inc. Tous droits réservés.</p>
                            <p>Conçu pour une expérience bancaire haut de gamme.</p>
                        </div>
                    </div>
                </footer>

            </div>
        </>
    );
}
