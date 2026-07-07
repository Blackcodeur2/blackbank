<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use App\Models\User;
use App\Http\Requests\StoreStaffRequest;
use App\Http\Requests\UpdateStaffRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class StaffController extends Controller
{
    public function index(Request $request)
    {
        $staff = Staff::query()
            ->when($request->get('q'), fn($q, $term) => $q->where('name', 'like', "%{$term}%"))
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('tenants/staff/Index', [
            'staff' => $staff,
        ]);
    }

    public function create()
    {
        return Inertia::render('tenants/staff/Form', ['staff' => null]);
    }

    public function store(StoreStaffRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('staff', 'public');
            $data['avatar'] = Storage::url($path);
        }

        $data['id'] = (string) Str::uuid();
        // ensure tenant_id is set via middleware/concern or pass through
        $staff = Staff::create($data);

        return redirect()->route('tenant.staff.index')->with('success', 'Staff created');
    }

    public function edit(Staff $staff)
    {
        return Inertia::render('tenants/staff/Form', ['staff' => $staff]);
    }

    public function update(UpdateStaffRequest $request, Staff $staff)
    {
        $data = $request->validated();

        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('staff', 'public');
            $data['avatar'] = Storage::url($path);
        }

        $staff->update($data);

        return redirect()->route('tenant.staff.index')->with('success', 'Staff updated');
    }

    public function destroy(Staff $staff)
    {
        $staff->delete();
        return redirect()->route('tenant.staff.index')->with('success', 'Staff removed');
    }
}
