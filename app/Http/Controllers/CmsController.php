<?php

namespace App\Http\Controllers;

use App\Models\CmsPage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class CmsController extends Controller
{
    public function index()
    {
        $this->authorize('manage settings');

        $pages = CmsPage::latest()->get();

        return Inertia::render('Cms/Index', [
            'pages' => $pages,
        ]);
    }

    public function create()
    {
        $this->authorize('manage settings');

        return Inertia::render('Cms/Create');
    }

    public function store(Request $request)
    {
        $this->authorize('manage settings');

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:cms_pages',
            'content' => 'required|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'is_published' => 'boolean',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        CmsPage::create([
            'title' => $request->title,
            'slug' => $request->slug,
            'content' => $request->content,
            'meta_title' => $request->meta_title,
            'meta_description' => $request->meta_description,
            'is_published' => $request->is_published ?? false,
        ]);

        return redirect()->route('cms.index')->with('success', 'Page créée avec succès.');
    }

    public function show(CmsPage $page)
    {
        if (!$page->is_published) {
            abort(404);
        }

        return Inertia::render('Cms/Show', [
            'page' => $page,
        ]);
    }

    public function edit(CmsPage $page)
    {
        $this->authorize('manage settings');

        return Inertia::render('Cms/Edit', [
            'page' => $page,
        ]);
    }

    public function update(Request $request, CmsPage $page)
    {
        $this->authorize('manage settings');

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:cms_pages,slug,' . $page->id,
            'content' => 'required|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'is_published' => 'boolean',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $page->update([
            'title' => $request->title,
            'slug' => $request->slug,
            'content' => $request->content,
            'meta_title' => $request->meta_title,
            'meta_description' => $request->meta_description,
            'is_published' => $request->is_published ?? false,
        ]);

        return redirect()->route('cms.index')->with('success', 'Page mise à jour avec succès.');
    }

    public function destroy(CmsPage $page)
    {
        $this->authorize('manage settings');

        $page->delete();

        return redirect()->route('cms.index')->with('success', 'Page supprimée avec succès.');
    }
}
