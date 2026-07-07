<?php

namespace Database\Seeders;

use App\Models\Currency;
use App\Models\ExchangeRate;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CurrencySeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing data
        ExchangeRate::truncate();
        Currency::truncate();

        $currenciesData = [
            ['code' => 'XAF', 'name' => 'Franc CFA BEAC', 'symbol' => 'FCFA', 'decimal_places' => 0],
            ['code' => 'EUR', 'name' => 'Euro', 'symbol' => '€', 'decimal_places' => 2],
            ['code' => 'USD', 'name' => 'US Dollar', 'symbol' => '$', 'decimal_places' => 2],
            ['code' => 'GBP', 'name' => 'British Pound', 'symbol' => '£', 'decimal_places' => 2],
            ['code' => 'NGN', 'name' => 'Nigerian Naira', 'symbol' => '₦', 'decimal_places' => 2],
        ];

        $currencies = [];
        foreach ($currenciesData as $currencyData) {
            $currencies[$currencyData['code']] = Currency::create($currencyData);
        }

        // Create exchange rates (base: XAF)
        $xaf = $currencies['XAF'];
        $eur = $currencies['EUR'];
        $usd = $currencies['USD'];
        $gbp = $currencies['GBP'];
        $ngn = $currencies['NGN'];

        $rates = [
            ['from' => $xaf, 'to' => $eur, 'rate' => 0.0015],
            ['from' => $xaf, 'to' => $usd, 'rate' => 0.0016],
            ['from' => $xaf, 'to' => $gbp, 'rate' => 0.0013],
            ['from' => $xaf, 'to' => $ngn, 'rate' => 1.25],
            ['from' => $eur, 'to' => $xaf, 'rate' => 655.96],
            ['from' => $usd, 'to' => $xaf, 'rate' => 615.00],
            ['from' => $gbp, 'to' => $xaf, 'rate' => 780.00],
            ['from' => $ngn, 'to' => $xaf, 'rate' => 0.80],
        ];

        foreach ($rates as $rate) {
            ExchangeRate::create([
                'from_currency_id' => $rate['from']->id,
                'to_currency_id' => $rate['to']->id,
                'rate' => $rate['rate'],
                'effective_date' => now(),
                'is_default' => true,
            ]);
        }

        $this->command->info('Currencies and exchange rates seeded successfully.');
    }
}
