<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\CmsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KycController;
use App\Http\Controllers\ReferralController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TenantController;
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
        Route::get('/dashboard', [\App\Http\Controllers\AdminController::class, 'dashboard'])->name('dashboard')->middleware('permission:view analytics');
        
        // KYC validation
        Route::post('/kyc/{user}/approve', [\App\Http\Controllers\AdminController::class, 'approveKyc'])->name('kyc.approve')->middleware('permission:approve kyc');
        Route::post('/kyc/{user}/reject', [\App\Http\Controllers\AdminController::class, 'rejectKyc'])->name('kyc.reject')->middleware('permission:reject kyc');
        
        // Loan validation
        Route::post('/loans/{loan}/approve', [\App\Http\Controllers\AdminController::class, 'approveLoan'])->name('loans.approve')->middleware('permission:approve loans');
        Route::post('/loans/{loan}/reject', [\App\Http\Controllers\AdminController::class, 'rejectLoan'])->name('loans.reject')->middleware('permission:reject loans');
        
        // Transaction validation
        Route::post('/transactions/{transaction}/approve-deposit', [\App\Http\Controllers\AdminController::class, 'approveDeposit'])->name('transactions.approve-deposit')->middleware('permission:approve deposits');
        Route::post('/transactions/{transaction}/approve-withdrawal', [\App\Http\Controllers\AdminController::class, 'approveWithdrawal'])->name('transactions.approve-withdrawal')->middleware('permission:approve withdrawals');
        Route::post('/transactions/{transaction}/reject', [\App\Http\Controllers\AdminController::class, 'rejectTransaction'])->name('transactions.reject')->middleware('permission:reject transactions');

        // Support Tickets (admin)
        Route::get('/support', [\App\Http\Controllers\AdminController::class, 'tickets'])->name('support.index')->middleware('permission:manage support tickets');
        Route::post('/support/{ticket}/reply', [\App\Http\Controllers\AdminController::class, 'replyTicket'])->name('support.reply')->middleware('permission:reply support tickets');
    });

    // Landlord Admin routes (tenant management)
    Route::middleware(['admin'])->prefix('tenants')->name('tenants.')->group(function () {
        Route::get('/', [TenantController::class, 'index'])->name('index')->middleware('permission:manage tenants');
        Route::get('/create', [TenantController::class, 'create'])->name('create')->middleware('permission:manage tenants');
        Route::post('/', [TenantController::class, 'store'])->name('store')->middleware('permission:manage tenants');
        Route::get('/{tenant}', [TenantController::class, 'show'])->name('show')->middleware('permission:manage tenants');
        Route::get('/{tenant}/edit', [TenantController::class, 'edit'])->name('edit')->middleware('permission:manage tenants');
        Route::put('/{tenant}', [TenantController::class, 'update'])->name('update')->middleware('permission:manage tenants');
        Route::delete('/{tenant}', [TenantController::class, 'destroy'])->name('destroy')->middleware('permission:manage tenants');
        Route::post('/{tenant}/suspend', [TenantController::class, 'suspend'])->name('suspend')->middleware('permission:manage tenants');
        Route::post('/{tenant}/activate', [TenantController::class, 'activate'])->name('activate')->middleware('permission:manage tenants');

        // Tenant staff management (admin view)
        Route::prefix('/{tenant}/staff')->name('staff.')->group(function () {
            Route::get('/', [\App\Http\Controllers\Tenant\StaffController::class, 'index'])->name('index')->middleware('permission:manage tenants');
            Route::get('/create', [\App\Http\Controllers\Tenant\StaffController::class, 'create'])->name('create')->middleware('permission:manage tenants');
            Route::post('/', [\App\Http\Controllers\Tenant\StaffController::class, 'store'])->name('store')->middleware('permission:manage tenants');
            Route::get('/{staff}/edit', [\App\Http\Controllers\Tenant\StaffController::class, 'edit'])->name('edit')->middleware('permission:manage tenants');
            Route::put('/{staff}', [\App\Http\Controllers\Tenant\StaffController::class, 'update'])->name('update')->middleware('permission:manage tenants');
            Route::delete('/{staff}', [\App\Http\Controllers\Tenant\StaffController::class, 'destroy'])->name('destroy')->middleware('permission:manage tenants');
        });
    });

    // Accounts routes
    Route::prefix('accounts')->name('accounts.')->group(function () {
        Route::get('/', [AccountController::class, 'index'])->name('index')->middleware('permission:view own accounts');
        Route::get('/create', [AccountController::class, 'create'])->name('create')->middleware('permission:create accounts');
        Route::post('/', [AccountController::class, 'store'])->name('store')->middleware('permission:create accounts');
        Route::get('/{account}', [AccountController::class, 'show'])->name('show')->middleware('permission:view own accounts');
        Route::get('/{account}/edit', [AccountController::class, 'edit'])->name('edit')->middleware('permission:manage accounts');
        Route::put('/{account}', [AccountController::class, 'update'])->name('update')->middleware('permission:manage accounts');
        Route::delete('/{account}', [AccountController::class, 'destroy'])->name('destroy')->middleware('permission:manage accounts');
        Route::post('/{account}/freeze', [AccountController::class, 'freeze'])->name('freeze')->middleware('permission:freeze accounts');
        Route::post('/{account}/unfreeze', [AccountController::class, 'unfreeze'])->name('unfreeze')->middleware('permission:freeze accounts');
    });

    // Referral routes
    Route::prefix('referrals')->name('referrals.')->group(function () {
        Route::get('/', [ReferralController::class, 'index'])->name('index')->middleware('permission:view referrals');
        Route::post('/', [ReferralController::class, 'store'])->name('store')->middleware('permission:create referrals');
        Route::get('/earnings', [ReferralController::class, 'earnings'])->name('earnings')->middleware('permission:view referrals');
    });

    // CMS routes (admin only)
    Route::middleware(['admin'])->prefix('cms')->name('cms.')->group(function () {
        Route::get('/', [CmsController::class, 'index'])->name('index')->middleware('permission:manage settings');
        Route::get('/create', [CmsController::class, 'create'])->name('create')->middleware('permission:manage settings');
        Route::post('/', [CmsController::class, 'store'])->name('store')->middleware('permission:manage settings');
        Route::get('/{page}', [CmsController::class, 'show'])->name('show');
        Route::get('/{page}/edit', [CmsController::class, 'edit'])->name('edit')->middleware('permission:manage settings');
        Route::put('/{page}', [CmsController::class, 'update'])->name('update')->middleware('permission:manage settings');
        Route::delete('/{page}', [CmsController::class, 'destroy'])->name('destroy')->middleware('permission:manage settings');
    });

    // Roles & Permissions routes (super admin only)
    Route::middleware(['admin'])->prefix('roles')->name('roles.')->group(function () {
        Route::get('/', [RoleController::class, 'index'])->name('index')->middleware('permission:manage roles');
        Route::get('/create', [RoleController::class, 'create'])->name('create')->middleware('permission:manage roles');
        Route::post('/', [RoleController::class, 'store'])->name('store')->middleware('permission:manage roles');
        Route::get('/{role}/edit', [RoleController::class, 'edit'])->name('edit')->middleware('permission:manage roles');
        Route::put('/{role}', [RoleController::class, 'update'])->name('update')->middleware('permission:manage roles');
        Route::delete('/{role}', [RoleController::class, 'destroy'])->name('destroy')->middleware('permission:manage roles');
    });
});

require __DIR__.'/settings.php';
