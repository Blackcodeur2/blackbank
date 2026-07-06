<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KycController;
use App\Http\Middleware\EnsureKycVerified;
use Illuminate\Support\Facades\Route;

// Home page
Route::inertia('/', 'welcome')->name('home');

// Custom register route (overrides Fortify's default to add phone field)
Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
Route::post('/register', [RegisteredUserController::class, 'store'])->name('register.store');

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // KYC routes (all authenticated users can submit documents)
    Route::prefix('kyc')->name('kyc.')->group(function () {
        Route::get('/', [KycController::class, 'index'])->name('index');
        Route::post('/', [KycController::class, 'store'])->name('store');
    });

    // Financial routes (requires verified KYC)
    Route::middleware([EnsureKycVerified::class])->group(function () {
        // Transactions
        Route::prefix('transactions')->name('transactions.')->group(function () {
            Route::get('/', [\App\Http\Controllers\TransactionController::class, 'index'])->name('index');
            Route::post('/transfer', [\App\Http\Controllers\TransactionController::class, 'transfer'])->name('transfer');
            Route::post('/deposit', [\App\Http\Controllers\TransactionController::class, 'deposit'])->name('deposit');
            Route::post('/withdraw', [\App\Http\Controllers\TransactionController::class, 'withdraw'])->name('withdraw');
        });

        // Savings
        Route::prefix('savings')->name('savings.')->group(function () {
            Route::get('/', [\App\Http\Controllers\SavingsController::class, 'index'])->name('index');
            Route::post('/subscribe', [\App\Http\Controllers\SavingsController::class, 'subscribe'])->name('subscribe');
        });

        // Loans
        Route::prefix('loans')->name('loans.')->group(function () {
            Route::get('/', [\App\Http\Controllers\LoanController::class, 'index'])->name('index');
            Route::post('/apply', [\App\Http\Controllers\LoanController::class, 'apply'])->name('apply');
        });

        // Beneficiaries
        Route::prefix('beneficiaries')->name('beneficiaries.')->group(function () {
            Route::get('/', [\App\Http\Controllers\BeneficiaryController::class, 'index'])->name('index');
            Route::post('/', [\App\Http\Controllers\BeneficiaryController::class, 'store'])->name('store');
            Route::delete('/{beneficiary}', [\App\Http\Controllers\BeneficiaryController::class, 'destroy'])->name('destroy');
        });

        // Support Tickets
        Route::prefix('support')->name('support.')->group(function () {
            Route::get('/', [\App\Http\Controllers\SupportTicketController::class, 'index'])->name('index');
            Route::post('/', [\App\Http\Controllers\SupportTicketController::class, 'store'])->name('store');
            Route::get('/{ticket}', [\App\Http\Controllers\SupportTicketController::class, 'show'])->name('show');
            Route::post('/{ticket}/reply', [\App\Http\Controllers\SupportTicketController::class, 'reply'])->name('reply');
        });

        // Airtime (mobile recharge)
        Route::prefix('airtime')->name('airtime.')->group(function () {
            Route::get('/', [\App\Http\Controllers\AirtimeController::class, 'index'])->name('index');
            Route::post('/purchase', [\App\Http\Controllers\AirtimeController::class, 'purchase'])->name('purchase');
        });
    });
    // Admin routes (requires admin middleware)
    Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\AdminController::class, 'dashboard'])->name('dashboard');
        
        // KYC validation
        Route::post('/kyc/{user}/approve', [\App\Http\Controllers\AdminController::class, 'approveKyc'])->name('kyc.approve');
        Route::post('/kyc/{user}/reject', [\App\Http\Controllers\AdminController::class, 'rejectKyc'])->name('kyc.reject');
        
        // Loan validation
        Route::post('/loans/{loan}/approve', [\App\Http\Controllers\AdminController::class, 'approveLoan'])->name('loans.approve');
        Route::post('/loans/{loan}/reject', [\App\Http\Controllers\AdminController::class, 'rejectLoan'])->name('loans.reject');
        
        // Transaction validation
        Route::post('/transactions/{transaction}/approve-deposit', [\App\Http\Controllers\AdminController::class, 'approveDeposit'])->name('transactions.approve-deposit');
        Route::post('/transactions/{transaction}/approve-withdrawal', [\App\Http\Controllers\AdminController::class, 'approveWithdrawal'])->name('transactions.approve-withdrawal');
        Route::post('/transactions/{transaction}/reject', [\App\Http\Controllers\AdminController::class, 'rejectTransaction'])->name('transactions.reject');

        // Support Tickets (admin)
        Route::get('/support', [\App\Http\Controllers\AdminController::class, 'tickets'])->name('support.index');
        Route::post('/support/{ticket}/reply', [\App\Http\Controllers\AdminController::class, 'replyTicket'])->name('support.reply');
    });
});

require __DIR__.'/settings.php';
