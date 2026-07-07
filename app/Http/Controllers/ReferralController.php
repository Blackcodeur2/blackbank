<?php

namespace App\Http\Controllers;

use App\Models\Referral;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ReferralController extends Controller
{
    public function index()
    {
        $this->authorize('view referrals');

        $referrals = auth()->user()->referrals()->with('referredUser')->latest()->get();
        $referralCode = auth()->user()->referral_code;
        $referralLink = auth()->user()->referral_link;
        $totalEarnings = auth()->user()->referral_earnings ?? 0;
        $totalReferrals = $referrals->count();

        return Inertia::render('Referrals/Index', [
            'referrals' => $referrals,
            'referralCode' => $referralCode,
            'referralLink' => $referralLink,
            'totalEarnings' => $totalEarnings,
            'totalReferrals' => $totalReferrals,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create referrals');

        $validator = Validator::make($request->all(), [
            'referral_code' => 'required|string|max:20|unique:users,referral_code,' . auth()->id(),
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        auth()->user()->update([
            'referral_code' => $request->referral_code,
            'referral_link' => url('/register?ref=' . $request->referral_code),
        ]);

        return redirect()->route('referrals.index')->with('success', 'Code de parrainage créé avec succès.');
    }

    public function earnings()
    {
        $this->authorize('view referrals');

        $earnings = auth()->user()->referralEarnings()->latest()->get();
        $totalEarnings = auth()->user()->referral_earnings ?? 0;
        $pendingEarnings = $earnings->where('status', 'pending')->sum('amount');
        $paidEarnings = $earnings->where('status', 'paid')->sum('amount');

        return Inertia::render('Referrals/Earnings', [
            'earnings' => $earnings,
            'totalEarnings' => $totalEarnings,
            'pendingEarnings' => $pendingEarnings,
            'paidEarnings' => $paidEarnings,
        ]);
    }
}
