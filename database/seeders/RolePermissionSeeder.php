<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Create permissions
        $permissions = [
            // Tenant management (landlord only)
            'manage tenants',
            'manage subscription plans',
            'view analytics',
            
            // User management
            'manage users',
            'view users',
            'delete users',
            
            // KYC management
            'manage kyc',
            'approve kyc',
            'reject kyc',
            
            // Transaction management
            'manage transactions',
            'approve deposits',
            'approve withdrawals',
            'reject transactions',
            
            // Account management
            'manage accounts',
            'create accounts',
            'view own accounts',
            'freeze accounts',
            
            // Loan management
            'manage loans',
            'approve loans',
            'reject loans',
            'view loan reports',
            
            // Savings management
            'manage savings',
            'view savings reports',
            
            // Support management
            'manage support tickets',
            'reply support tickets',
            
            // Settings management
            'manage settings',
            'manage payment gateways',
            'manage withdrawal methods',
            
            // Role management
            'manage roles',
            
            // Referral management
            'view referrals',
            'create referrals',
            
            // Client permissions
            'create transactions',
            'view own transactions',
            'apply for loans',
            'subscribe savings',
            'create support tickets',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Create roles
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
        $landlordAdmin = Role::firstOrCreate(['name' => 'Landlord Admin', 'guard_name' => 'web']);
        $tenantAdmin = Role::firstOrCreate(['name' => 'Tenant Admin', 'guard_name' => 'web']);
        $tenantStaff = Role::firstOrCreate(['name' => 'Tenant Staff', 'guard_name' => 'web']);
        $client = Role::firstOrCreate(['name' => 'Client', 'guard_name' => 'web']);

        // Assign permissions to Super Admin (all permissions)
        $superAdmin->syncPermissions(Permission::all());

        // Assign permissions to Landlord Admin (tenant management + analytics)
        $landlordAdmin->syncPermissions([
            'manage tenants',
            'manage subscription plans',
            'view analytics',
            'manage users',
            'view users',
        ]);

        // Assign permissions to Tenant Admin (full tenant management)
        $tenantAdmin->syncPermissions([
            'manage users',
            'view users',
            'delete users',
            'manage kyc',
            'approve kyc',
            'reject kyc',
            'manage transactions',
            'approve deposits',
            'approve withdrawals',
            'reject transactions',
            'manage accounts',
            'create accounts',
            'view own accounts',
            'freeze accounts',
            'manage loans',
            'approve loans',
            'reject loans',
            'view loan reports',
            'manage savings',
            'view savings reports',
            'manage support tickets',
            'reply support tickets',
            'manage settings',
            'manage payment gateways',
            'manage withdrawal methods',
            'view referrals',
            'create referrals',
        ]);

        // Assign permissions to Tenant Staff (limited operations)
        $tenantStaff->syncPermissions([
            'view users',
            'manage kyc',
            'approve kyc',
            'reject kyc',
            'approve deposits',
            'approve withdrawals',
            'reject transactions',
            'view loan reports',
            'manage support tickets',
            'reply support tickets',
        ]);

        // Assign permissions to Client (self-service)
        $client->syncPermissions([
            'create transactions',
            'view own transactions',
            'apply for loans',
            'subscribe savings',
            'create support tickets',
        ]);

        $this->command->info('Roles and permissions seeded successfully.');
    }
}
