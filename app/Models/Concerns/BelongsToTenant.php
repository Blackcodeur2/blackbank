<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Stancl\Tenancy\Facades\Tenancy;

trait BelongsToTenant
{
    protected static function bootBelongsToTenant(): void
    {
        static::addGlobalScope('tenant', function (Builder $query) {
            if (tenancy()->initialized) {
                $tenant = tenancy()->tenant;
                
                // Only apply scope if the model has tenant_id column
                if (in_array('tenant_id', (new static())->getFillable()) || 
                    in_array('tenant_id', (new static())->getColumns())) {
                    $query->where('tenant_id', $tenant->id);
                }
            }
        });

        // Automatically set tenant_id when creating
        static::creating(function ($model) {
            if (tenancy()->initialized && 
                (in_array('tenant_id', $model->getFillable()) || 
                 in_array('tenant_id', (new static())->getColumns()))) {
                $tenant = tenancy()->tenant;
                $model->tenant_id = $tenant->id;
            }
        });
    }

    /**
     * Get the table columns for the model
     */
    protected function getColumns(): array
    {
        return \Schema::getColumnListing($this->getTable());
    }

    /**
     * Scope to ignore tenant filtering
     */
    public function scopeWithoutTenantScope(Builder $query): Builder
    {
        return $query->withoutGlobalScope('tenant');
    }
}
