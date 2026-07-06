<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the user dashboard with balance and recent transactions.
     */
    public function index(): Response
    {
        $user = Auth::user();

        $recentTransactions = Transaction::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        // Summary stats
        $totalDeposits = Transaction::where('user_id', $user->id)
            ->where('type', 'depot')
            ->where('statut', 'complete')
            ->sum('montant');

        $totalWithdrawals = Transaction::where('user_id', $user->id)
            ->where('type', 'retrait')
            ->where('statut', 'complete')
            ->sum('montant');

        $pendingTransactions = Transaction::where('user_id', $user->id)
            ->where('statut', 'en_attente')
            ->count();

        return Inertia::render('dashboard', [
            'user'                => $user,
            'recentTransactions'  => $recentTransactions,
            'stats'               => [
                'solde'             => $user->solde,
                'totalDeposits'     => $totalDeposits,
                'totalWithdrawals'  => $totalWithdrawals,
                'pendingCount'      => $pendingTransactions,
            ],
        ]);
    }
}
