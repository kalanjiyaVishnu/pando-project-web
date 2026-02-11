"use client"

import { useState, useEffect, useCallback } from 'react'
import { FilterBar } from '@/components/shipments/filter-bar'
import { ShipmentList } from '@/components/shipments/shipment-list'
import { ShipmentPanel } from '@/components/shipments/shipment-panel'
import { shipmentApi } from '@/components/shipments/api'
import { Shipment, ShipmentFilters } from '@/components/shipments/types'
import { ComboboxOption } from '@/components/shipments/combobox'
import { toast } from 'sonner'

export default function ShipmentsPage() {
    const [data, setData] = useState<Shipment[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingHelpers, setLoadingHelpers] = useState(true)
    const [filters, setFilters] = useState<ShipmentFilters>({})
    const [isPanelOpen, setIsPanelOpen] = useState(false)
    const [editingShipment, setEditingShipment] = useState<Shipment | null>(null)

    const [transporters, setTransporters] = useState<ComboboxOption[]>([])
    const [vehicles, setVehicles] = useState<ComboboxOption[]>([])
    const [materials, setMaterials] = useState<ComboboxOption[]>([])
    const [edges, setEdges] = useState<ComboboxOption[]>([])

    const fetchHelpers = useCallback(async () => {
        try {
            const helpers = await shipmentApi.getHelpers()
            setTransporters(helpers.transporters.map((t: any) => ({ label: t.name, value: t.id.toString() })))
            setVehicles(helpers.vehicles.map((v: any) => ({ label: v.name, value: v.id.toString() })))
            setMaterials(helpers.materials.map((m: any) => ({ label: m.name, value: m.id.toString() })))
            setEdges(helpers.edges.map((e: any) => ({ label: e.name, value: e.id.toString() })))
        } catch (error) {
            console.error("Failed to fetch helpers", error)
            toast.error("Failed to load helper data")
        } finally {
            setLoadingHelpers(false)
        }
    }, [])

    const fetchShipments = useCallback(async () => {
        setLoading(true)
        try {
            const result = await shipmentApi.getAll(filters)
            setData(result.data || [])
        } catch (error) {
            console.error("Failed to fetch shipments", error)
            toast.error("Failed to load shipments")
        } finally {
            setLoading(false)
        }
    }, [filters])

    useEffect(() => {
        fetchHelpers()
    }, [fetchHelpers])

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchShipments()
        }, 300)
        return () => clearTimeout(timer)
    }, [fetchShipments])

    const handleFilterChange = (newFilters: ShipmentFilters) => {
        setFilters(newFilters)
    }

    const handleResetFilters = () => {
        setFilters({})
    }

    const handleAddClick = () => {
        setEditingShipment(null)
        setIsPanelOpen(true)
    }

    const handleEditClick = (shipment: Shipment) => {
        setEditingShipment(shipment)
        setIsPanelOpen(true)
    }

    const handleDeleteClick = async (id: number) => {
        if (confirm("Are you sure you want to delete this shipment?")) {
            try {
                await shipmentApi.delete(id)
                toast.success("Shipment deleted")
                fetchShipments()
            } catch (error) {
                toast.error("Failed to delete shipment")
            }
        }
    }

    const handleSave = async (payload: any) => {
        try {
            if (editingShipment) {
                await shipmentApi.update(editingShipment.id, payload)
                toast.success("Shipment updated")
            } else {
                await shipmentApi.create(payload)
                toast.success("Shipment created")
            }
            fetchShipments()
        } catch (error) {
            console.error(error)
            throw error 
        }
    }

    if (loadingHelpers) {
        return <div className="p-8 flex items-center justify-center">Loading configuration...</div>
    }

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Shipment Management</h1>
                <p className="text-muted-foreground">Manage shipments, routes, and transporters.</p>
            </div>

            <FilterBar
                filters={filters}
                transporters={transporters}
                vehicles={vehicles}
                materials={materials}
                onFilterChange={handleFilterChange}
                onAddClick={handleAddClick}
                onReset={handleResetFilters}
                loading={loading}
            />

            <ShipmentList
                data={data}
                loading={loading}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
            />

            <ShipmentPanel
                open={isPanelOpen}
                onOpenChange={setIsPanelOpen}
                shipment={editingShipment}
                transporters={transporters}
                vehicles={vehicles}
                materials={materials}
                edges={edges}
                onSave={handleSave}
            />
        </div>
    )
}
