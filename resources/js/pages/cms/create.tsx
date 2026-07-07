import { Head, Link, useForm } from '@inertiajs/react';
import { FileText, ArrowLeft, Save, Globe, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export default function CmsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        slug: '',
        content: '',
        meta_title: '',
        meta_description: '',
        is_published: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/cms');
    };

    const generateSlug = () => {
        const slug = data.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        setData('slug', slug);
    };

    return (
        <>
            <Head title="Créer une Page — BlackBank" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/cms">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Créer une nouvelle page</h1>
                        <p className="text-sm text-muted-foreground">
                            Créez une page CMS personnalisable
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Main Content */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Contenu de la page</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Titre *</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={e => setData('title', e.target.value)}
                                            placeholder="Titre de la page"
                                            className="flex-1"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={generateSlug}
                                        >
                                            Générer slug
                                        </Button>
                                    </div>
                                    {errors.title && (
                                        <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="slug">Slug (URL) *</Label>
                                    <Input
                                        id="slug"
                                        value={data.slug}
                                        onChange={e => setData('slug', e.target.value)}
                                        placeholder="ma-page"
                                        className="font-mono"
                                    />
                                    {errors.slug && (
                                        <p className="text-sm text-red-600 mt-1">{errors.slug}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1">
                                        L'URL sera: /{data.slug || 'ma-page'}
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="content">Contenu *</Label>
                                    <Textarea
                                        id="content"
                                        value={data.content}
                                        onChange={e => setData('content', e.target.value)}
                                        placeholder="Contenu de la page (HTML autorisé)"
                                        rows={10}
                                    />
                                    {errors.content && (
                                        <p className="text-sm text-red-600 mt-1">{errors.content}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* SEO Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>SEO</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="meta_title">Meta Title</Label>
                                    <Input
                                        id="meta_title"
                                        value={data.meta_title}
                                        onChange={e => setData('meta_title', e.target.value)}
                                        placeholder="Titre pour les moteurs de recherche"
                                    />
                                    {errors.meta_title && (
                                        <p className="text-sm text-red-600 mt-1">{errors.meta_title}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="meta_description">Meta Description</Label>
                                    <Textarea
                                        id="meta_description"
                                        value={data.meta_description}
                                        onChange={e => setData('meta_description', e.target.value)}
                                        placeholder="Description pour les moteurs de recherche"
                                        rows={3}
                                    />
                                    {errors.meta_description && (
                                        <p className="text-sm text-red-600 mt-1">{errors.meta_description}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Publication Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Publication</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="is_published"
                                        checked={data.is_published}
                                        onChange={e => setData('is_published', e.target.checked)}
                                        className="h-4 w-4"
                                    />
                                    <Label htmlFor="is_published" className="cursor-pointer">
                                        Publier immédiatement
                                    </Label>
                                </div>

                                {!data.is_published && (
                                    <p className="text-sm text-muted-foreground">
                                        La page sera sauvegardée comme brouillon
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <Link href="/cms">
                            <Button variant="outline" type="button">
                                Annuler
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="gap-2">
                            <Save className="h-4 w-4" />
                            {processing ? 'Création en cours...' : 'Créer la page'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CmsCreate.layout = {
    breadcrumbs: [
        { title: 'Administration', href: '/admin/dashboard' },
        { title: 'CMS', href: '/cms' },
        { title: 'Créer', href: '/cms/create' },
    ],
};
