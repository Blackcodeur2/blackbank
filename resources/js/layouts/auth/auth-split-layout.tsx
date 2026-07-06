import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import { useEffect, useState } from 'react';

const slogans = [
    {
        title: "Votre argent, réinventé.",
        desc: "Bénéficiez de transferts instantanés, d'un suivi de solde en temps réel et d'une sécurité robuste pour gérer vos finances en toute sérénité."
    },
    {
        title: "Épargnez pour l'avenir.",
        desc: "Activez des plans d'épargne DPS ou FDR performants et regardez votre capital fructifier grâce à nos taux d'intérêt compétitifs."
    },
    {
        title: "Des crédits simplifiés.",
        desc: "Financez vos projets sans tracas. Soumettez votre demande de prêt en ligne et recevez une réponse rapide de nos analystes."
    },
    {
        title: "Sécurité absolue.",
        desc: "Vos fonds sont sécurisés par des verrous transactionnels avancés, un cryptage de bout en bout et une validation d'identité rigoureuse."
    }
];

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;
    const [currentSlogan, setCurrentSlogan] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentSlogan((prev) => (prev + 1) % slogans.length);
                setIsTransitioning(false);
            }, 400); // Durée de l'effet d'estompement
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-2 overflow-hidden bg-background">
            {/* Colonne de gauche (Visuel Fintech premium & Textes animés) */}
            <div className="relative hidden lg:flex flex-col justify-between p-12 text-white overflow-hidden select-none">
                {/* Image de fond avec overlay gradient */}
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 ease-out scale-105"
                    style={{ 
                        backgroundImage: "url('/images/auth_branding.png')",
                    }}
                />
                {/* Gradient de couleur futuriste néon */}
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/90 to-indigo-950/80 mix-blend-multiply" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.15),transparent_50%)]" />

                {/* Logo & Nom du projet */}
                <div className="relative z-10 flex items-center">
                    <Link
                        href={home()}
                        className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-2 backdrop-blur-md hover:bg-white/10 transition-all duration-300"
                    >
                        <AppLogoIcon className="size-7 fill-current text-indigo-400" />
                        <span className="text-lg font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-200">
                            {name}
                        </span>
                    </Link>
                </div>

                {/* Bloc Slogan avec Glassmorphism et animation */}
                <div className="relative z-10 max-w-lg mt-auto">
                    <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-8 backdrop-blur-xl shadow-2xl space-y-6">
                        <div className="space-y-3">
                            <h2 
                                className={`text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300 transition-all duration-500 ease-in-out ${
                                    isTransitioning ? 'opacity-0 translate-y-2 scale-98' : 'opacity-100 translate-y-0 scale-100'
                                }`}
                            >
                                {slogans[currentSlogan].title}
                            </h2>
                            <p 
                                className={`text-sm sm:text-base text-slate-300 leading-relaxed transition-all duration-500 ease-in-out delay-75 ${
                                    isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                                }`}
                            >
                                {slogans[currentSlogan].desc}
                            </p>
                        </div>

                        {/* Indicateurs de diapositives */}
                        <div className="flex gap-2">
                            {slogans.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setIsTransitioning(true);
                                        setTimeout(() => {
                                            setCurrentSlogan(idx);
                                            setIsTransitioning(false);
                                        }, 300);
                                    }}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        currentSlogan === idx 
                                            ? 'w-6 bg-indigo-500' 
                                            : 'w-1.5 bg-white/20 hover:bg-white/40'
                                    }`}
                                    aria-label={`Slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer discret */}
                <div className="relative z-10 text-[11px] text-slate-500 mt-6 flex justify-between items-center">
                    <span>© {new Date().getFullYear()} {name} Inc.</span>
                    <div className="flex gap-3">
                        <span className="hover:text-slate-400 cursor-pointer">Conditions</span>
                        <span className="hover:text-slate-400 cursor-pointer">Confidentialité</span>
                    </div>
                </div>
            </div>

            {/* Colonne de droite (Formulaire d'authentification) */}
            <div className="flex flex-col justify-center items-center px-6 py-12 lg:px-8 bg-muted/20 dark:bg-zinc-950/40 relative overflow-y-auto">
                {/* Version mobile du Logo */}
                <Link
                    href={home()}
                    className="flex items-center gap-2 lg:hidden mb-8"
                >
                    <AppLogoIcon className="size-8 fill-current text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xl font-bold tracking-wider">{name}</span>
                </Link>

                {/* Card de formulaire */}
                <div className="w-full max-w-[440px] rounded-3xl border border-border/60 bg-card p-6 sm:p-10 shadow-2xl shadow-zinc-200/50 dark:shadow-none dark:border-zinc-800 space-y-6">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
