"use client"

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Plus, RefreshCw } from 'lucide-react'
import { Combobox, ComboboxOption } from './combobox'
import { ShipmentFilters } from './types'

interface FilterBarProps {
    filters: ShipmentFilters
    transporters: ComboboxOption[]
    vehicles: ComboboxOption[]
    materials: ComboboxOption[]
    onFilterChange: (filters: ShipmentFilters) => void
    onAddClick: () => void
    onReset: () => void
    loading?: boolean
}

export function FilterBar({
    filters,
    transporters,
    vehicles,
    materials,
    onFilterChange,
    onAddClick,
    onReset,
    loading
}: FilterBarProps) {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange({ ...filters, search: e.target.value })
    }

    const handleSelectChange = (key: keyof ShipmentFilters, value: string) => {
        const newFilters = { ...filters, [key]: value }
        if (!value) delete newFilters[key]
        onFilterChange(newFilters)
    }

    return (
        <div className="flex flex-col gap-4 p-4 border rounded-lg bg-card shadow-sm sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <div className="relative flex-1 group min-w-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search via ID, Transporter, Vehicle..."
                        className="pl-10 h-10 w-full"
                        value={filters.search || ''}
                        onChange={handleSearchChange}
                    />
                </div>
                <Button onClick={onAddClick} className="h-10 px-6 shadow-md shadow-primary/20 hover:shadow-lg transition-all active:scale-95">
                    <Plus className="mr-2 h-4 w-4" /> Add Shipment
                </Button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div className="w-[200px]">
                    <Combobox
                        options={transporters}
                        value={filters.transporterId}
                        onChange={(val) => handleSelectChange('transporterId', val)}
                        placeholder="Filter Transporter"
                        className="h-9"
                    />
                </div>
                <div className="w-[200px]">
                    <Combobox
                        options={vehicles}
                        value={filters.vehicleId}
                        onChange={(val) => handleSelectChange('vehicleId', val)}
                        placeholder="Filter Vehicle"
                        className="h-9"
                    />
                </div>
                <div className="w-[200px]">
                    <Combobox
                        options={materials}
                        value={filters.materialId}
                        onChange={(val) => handleSelectChange('materialId', val)}
                        placeholder="Filter Material"
                        className="h-9"
                    />
                </div>
                <Button variant="ghost" size="sm" onClick={onReset} disabled={loading} className="ml-auto h-9 text-muted-foreground hover:text-foreground">
                    <RefreshCw className={`mr-2 h-3 w-3 ${loading ? 'animate-spin' : ''}`} /> Reset Filters
                </Button>
            </div>
        </div>
    )
}
