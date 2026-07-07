<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\AccountType;
use App\Models\Currency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function index()
    {
        $this->authorize('view own accounts');

        $accounts = auth()->user()->accounts()->with(['accountType', 'currency'])->get();

        return Inertia::render('Accounts/Index', [
            'accounts' => $accounts,
            'accountTypes' => AccountType::where('active', true)->get(),
            'currencies' => Currency::where('active', true)->get(),
        ]);
    }

    public function create()
    {
        $this->authorize('create accounts');

        return Inertia::render('Accounts/Create', [
            'accountTypes' => AccountType::where('active', true)->get(),
            'currencies' => Currency::where('active', true)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create accounts');

        $validator = Validator::make($request->all(), [
            'account_type_id' => 'required|exists:account_types,id',
            'currency_id' => 'required|exists:currencies,id',
            'account_number' => 'required|string|max:50|unique:accounts',
            'account_name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $account = Account::create([
            'user_id' => auth()->id(),
            'account_type_id' => $request->account_type_id,
            'currency_id' => $request->currency_id,
            'account_number' => $request->account_number,
            'account_name' => $request->account_name,
            'balance' => 0,
            'status' => 'active',
        ]);

        return redirect()->route('accounts.index')->with('success', 'Compte créé avec succès.');
    }

    public function show(Account $account)
    {
        $this->authorize('view own accounts');

        if ($account->user_id !== auth()->id() && !auth()->user()->can('manage accounts')) {
            abort(403);
        }

        $account->load(['accountType', 'currency', 'transactions']);

        return Inertia::render('Accounts/Show', [
            'account' => $account,
        ]);
    }

    public function edit(Account $account)
    {
        $this->authorize('manage accounts');

        $account->load(['accountType', 'currency']);

        return Inertia::render('Accounts/Edit', [
            'account' => $account,
            'accountTypes' => AccountType::where('active', true)->get(),
            'currencies' => Currency::where('active', true)->get(),
        ]);
    }

    public function update(Request $request, Account $account)
    {
        $this->authorize('manage accounts');

        $validator = Validator::make($request->all(), [
            'account_name' => 'required|string|max:255',
            'status' => 'required|in:active,frozen,closed',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $account->update([
            'account_name' => $request->account_name,
            'status' => $request->status,
        ]);

        return redirect()->route('accounts.index')->with('success', 'Compte mis à jour avec succès.');
    }

    public function destroy(Account $account)
    {
        $this->authorize('manage accounts');

        $account->update(['status' => 'closed']);

        return redirect()->route('accounts.index')->with('success', 'Compte fermé avec succès.');
    }

    public function freeze(Account $account)
    {
        $this->authorize('freeze accounts');

        $account->update(['status' => 'frozen']);

        return redirect()->back()->with('success', 'Compte gelé avec succès.');
    }

    public function unfreeze(Account $account)
    {
        $this->authorize('freeze accounts');

        $account->update(['status' => 'active']);

        return redirect()->back()->with('success', 'Compte réactivé avec succès.');
    }
}
