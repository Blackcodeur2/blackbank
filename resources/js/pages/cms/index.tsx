import { Head, Link, usePage } from '@inertiajs/react';
import {
    FileText,
    Plus,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    Globe,
    Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type CmsPage = {
    id: string;
    title: string;
    slug: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
};

type Props = {
    pages: CmsPage[];
};

export default function CmsIndex({ pages }: Props) {
    const { flash } = usePage<any>().props;

    const formatDate = (dateStr: string) => {
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(new Date(dateStr));
    };

    return (
        <>
            <Head title="Gestion CMS — BlackBank" />

            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Gestion CMS</h1>
                        <p className="text-sm text-muted-foreground">
                            Gérez les pages personnalisables
                        </p>
                    </div>
                    <Link href="/cms/create">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Nouvelle Page
                        </Button>
                    </Link>
                </div>

                {/* Flash messages */}
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-green-950/20 dark:text-green-400">
                        {flash.success}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pages.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Publiées</CardTitle>
                            <Globe className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {pages.filter(p => p.is_published).length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Brouillons</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {pages.filter(p => !p.is_published).length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Pages Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des pages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {pages.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
                                <FileText className="h-10 w-10 opacity-30" />
                                <p className="text-sm">Aucune page pour le moment</p>
                                <Link href="/cms/create">
                                    <Button variant="outline" size="sm" className="mt-2">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Créer la première page
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Titre</TableHead>
                                        <TableHead>Slug</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Créée le</TableHead>
                                        <TableHead>Modifiée le</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pages.map((page) => (
                                        <TableRow key={page.id}>
                                            <TableCell className="font-medium">
                                                {page.title}
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">
                                                /{page.slug}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={page.is_published ? 'default' : 'secondary'}>
                                                    {page.is_published ? 'Publiée' : 'Brouillon'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    {formatDate(page.created_at)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(page.updated_at)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/cms/${page.id}`}>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Voir
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/cms/${page.id}/edit`}>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Modifier
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild className="text-red-600">
                                                            <Link href={`/cms/${page.id}`} method="delete">
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Supprimer
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

CmsIndex.layout = {
    breadcrumbs: [
        { title: 'Administration', href: '/admin/dashboard' },
        { title: 'CMS', href: '/cms' },
    ],
};
