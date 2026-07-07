import { Head, Link, useForm } from '@inertiajs/react';
import { FileText, ArrowLeft, Save, Globe, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

type CmsPage = {
    id: string;
    title: string;
    slug: string;
    content: string;
    meta_title: string | null;
    meta_description: string | null;
    is_published: boolean;
    created_at: string;
    updated_at: string;
};

type Props = {
    page: CmsPage;
};

export default function CmsEdit({ page }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: page.title,
        slug: page.slug,
        content: page.content,
        meta_title: page.meta_title || '',
        meta_description: page.meta_description || '',
        is_published: page.is_published,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/cms/${page.id}`);
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

    const formatDate = (dateStr: string) => {
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(new Date(dateStr));
    };

    return (
        <>
            <Head title={`Modifier ${page.title} — BlackBank`} />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/cms">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold tracking-tight">Modifier {page.title}</h1>
                        <p className="text-sm text-muted-foreground">
                            /{page.slug}
                        </p>
                    </div>
                    <Badge variant={page.is_published ? 'default' : 'secondary'}>
                        {page.is_published ? 'Publiée' : 'Brouillon'}
                    </Badge>
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
                                        className="font-mono"
                                    />
                                    {errors.slug && (
                                        <p className="text-sm text-red-600 mt-1">{errors.slug}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1">
                                        L'URL sera: /{data.slug}
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="content">Contenu *</Label>
                                    <Textarea
                                        id="content"
                                        value={data.content}
                                        onChange={e => setData('content', e.target.value)}
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
                                        Publier la page
                                    </Label>
                                </div>

                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p>Créée le: {formatDate(page.created_at)}</p>
                                    <p>Modifiée le: {formatDate(page.updated_at)}</p>
                                </div>
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
                            {processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CmsEdit.layout = {
    breadcrumbs: [
        { title: 'Administration', href: '/admin/dashboard' },
        { title: 'CMS', href: '/cms' },
        { title: 'Modifier', href: '#' },
    ],
};
