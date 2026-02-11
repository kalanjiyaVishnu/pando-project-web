    "use client"

    import { useState, useEffect, useMemo } from 'react'
    import {
        Sheet,
        SheetContent,
        SheetHeader,
        SheetTitle,
        SheetFooter,
    } from '@/components/ui/sheet'
    import { Button } from '@/components/ui/button'
    import { Label } from '@/components/ui/label'
    import { Input } from '@/components/ui/input'
    import { Separator } from '@/components/ui/separator'
    import { Plus, Trash2, Calculator } from 'lucide-react'
    import { Combobox, ComboboxOption } from './combobox'
    import { Shipment, Route, Material } from './types'
    import { toast } from 'sonner'

    interface ShipmentPanelProps {
        open: boolean
        onOpenChange: (open: boolean) => void
        shipment?: Shipment | null
        transporters: ComboboxOption[]
        vehicles: ComboboxOption[]
        materials: ComboboxOption[]
        edges: ComboboxOption[]
        onSave: (data: any) => Promise<void>
    }

    export function ShipmentPanel({
        open,
        onOpenChange,
        shipment,
        transporters,
        vehicles,
        materials,
        edges,
        onSave
    }: ShipmentPanelProps) {
        const [transporterId, setTransporterId] = useState('')
        const [vehicleId, setVehicleId] = useState('')
        const [routes, setRoutes] = useState<Route[]>([])
        const [loading, setLoading] = useState(false)

        useEffect(() => {
            if (open) {
                if (shipment) {
                    setTransporterId(shipment.transporter.id.toString())
                    setVehicleId(shipment.vehicle.id.toString())
                    const mappedRoutes = (shipment.routes || []).map((r, idx) => ({
                        id: r.id,
                        sourceId: r.sourceId,
                        destId: r.destId,
                        
                        
                        source: r.source,
                        destination: r.destination,
                        materials: (r.materials || []).map(m => ({
                            id: m.id,
                            name: m.name,
                            quantity: m.quantity
                        })),
                        tempId: `route-${idx}-${Date.now()}`
                    }))
                    setRoutes(mappedRoutes)
                } else {
                    setTransporterId('')
                    setVehicleId('')
                    setRoutes([{
                        sourceId: 0,
                        destId: 0,
                        materials: [],
                        tempId: `route-0-${Date.now()}`
                    }])
                }
            }
        }, [open, shipment])

        const totalWeight = useMemo(() => {
            return routes.reduce((total, route) => {
                const routeWeight = route.materials.reduce((w, m) => w + (Number(m.quantity) || 0), 0)
                return total + routeWeight
            }, 0)
        }, [routes])

        const handleAddRoute = () => {
            setRoutes([...routes, {
                sourceId: 0,
                destId: 0,
                materials: [],
                tempId: `route-${routes.length}-${Date.now()}`
            }])
        }

        const handleRemoveRoute = (index: number) => {
            if (routes.length > 1) {
                const newRoutes = [...routes]
                newRoutes.splice(index, 1)
                setRoutes(newRoutes)
            } else {
                toast.error("At least one route pair is required")
            }
        }

        const updateRoute = (index: number, field: keyof Route, value: any) => {
            const newRoutes = [...routes]
            newRoutes[index] = { ...newRoutes[index], [field]: value }
            setRoutes(newRoutes)
        }

        const addMaterialToRoute = (routeIndex: number, materialId: string) => {
            const route = routes[routeIndex]
            const materialOption = materials.find(m => m.value === materialId)
            if (!materialOption) return

            const newMaterial: Material = {
                id: Number(materialId),
                name: materialOption.label,
                quantity: 1 
            }

            const newRoutes = [...routes]
            newRoutes[routeIndex] = {
                ...route,
                materials: [...route.materials, newMaterial]
            }
            setRoutes(newRoutes)

            
        }

        const updateMaterialQuantity = (routeIndex: number, materialIndex: number, quantity: string) => {
            const newRoutes = [...routes]
            const mat = newRoutes[routeIndex].materials[materialIndex]
            newRoutes[routeIndex].materials[materialIndex] = { ...mat, quantity: Number(quantity) }
            setRoutes(newRoutes)
        }

        const removeMaterialFromRoute = (routeIndex: number, materialIndex: number) => {
            const newRoutes = [...routes]
            newRoutes[routeIndex].materials.splice(materialIndex, 1)
            setRoutes(newRoutes)
        }

        const handleSubmit = async () => {
            if (!transporterId || !vehicleId) {
                toast.error("Please select transporter and vehicle")
                return
            }

            if (routes.some(r => !r.sourceId || !r.destId)) {
                toast.error("Please select source and destination for all routes")
                return
            }

            if (routes.some(r => r.materials.length === 0)) {
                toast.error("Please add at least one material for all routes")
                return
            }

            setLoading(true)
            try {
                const payload = {
                    transporterId: Number(transporterId),
                    vehicleId: Number(vehicleId),
                    routePairs: routes.map(r => ({
                        sourceId: Number(r.sourceId),
                        destId: Number(r.destId),
                        materials: r.materials.map(m => ({
                            materialId: m.id,
                            quantity: Number(m.quantity)
                        }))
                    }))
                }
                await onSave(payload)
                onOpenChange(false)
            } catch (error) {
                console.error(error)
                toast.error("Failed to save shipment")
            } finally {
                setLoading(false)
            }
        }

        return (
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="w-[600px] sm:w-[800px] flex flex-col p-0 gap-0">
                    <SheetHeader className="p-6 border-b">
                        <SheetTitle>{shipment ? 'Edit Shipment' : 'Add New Shipment'}</SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Transporter</Label>
                                <Combobox
                                    options={transporters}
                                    value={transporterId}
                                    onChange={setTransporterId}
                                    placeholder="Select Transporter"
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Vehicle</Label>
                                <Combobox
                                    options={vehicles}
                                    value={vehicleId}
                                    onChange={setVehicleId}
                                    placeholder="Select Vehicle"
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold tracking-tight">Route Pairs</h3>
                                <Button size="sm" variant="outline" onClick={(e) => { e.preventDefault(); handleAddRoute() }} className="h-8" type="button">
                                    <Plus className="mr-2 h-4 w-4" /> Add Route
                                </Button>
                            </div>

                            {routes.map((route, rIndex) => (
                                <div key={route.tempId || rIndex} className="rounded-lg border bg-card p-4 shadow-sm space-y-4 relative group">
                                    <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                            onClick={(e) => { e.preventDefault(); handleRemoveRoute(rIndex) }}
                                            disabled={routes.length === 1}
                                            type="button"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pr-10">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold uppercase text-muted-foreground">Source</Label>
                                            <Combobox
                                                options={edges}
                                                value={route.sourceId ? route.sourceId.toString() : ''}
                                                onChange={(val) => updateRoute(rIndex, 'sourceId', Number(val))}
                                                placeholder="Select Source"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold uppercase text-muted-foreground">Destination</Label>
                                            <Combobox
                                                options={edges}
                                                value={route.destId ? route.destId.toString() : ''}
                                                onChange={(val) => updateRoute(rIndex, 'destId', Number(val))}
                                                placeholder="Select Destination"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs font-bold uppercase text-primary">Materials</Label>
                                            <div className="w-[200px]">
                                                <Combobox
                                                    options={materials}
                                                    value="" 
                                                    onChange={(val) => val && addMaterialToRoute(rIndex, val)}
                                                    placeholder="+ Add Material"
                                                    className="h-7 text-xs"
                                                />
                                            </div>
                                        </div>

                                        {route.materials.length === 0 ? (
                                            <div className="text-center py-4 bg-muted/20 border border-dashed rounded text-xs text-muted-foreground">
                                                No materials added
                                            </div>
                                        ) : (
                                            <div className="grid gap-2">
                                                {route.materials.map((mat, mIndex) => (
                                                    <div key={`${mat.id}-${mIndex}`} className="flex items-center gap-2 bg-muted/50 p-2 rounded border">
                                                        <span className="flex-1 text-sm font-medium">{mat.name}</span>
                                                        <div className="flex items-center gap-2">
                                                            <Label className="text-xs whitespace-nowrap">Qty:</Label>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                className="h-7 w-20 text-right"
                                                                value={mat.quantity}
                                                                onChange={(e) => updateMaterialQuantity(rIndex, mIndex, e.target.value)}
                                                            />
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                                            onClick={() => removeMaterialFromRoute(rIndex, mIndex)}
                                                            type="button"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <SheetFooter className="p-6 border-t bg-background">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calculator className="h-4 w-4" />
                                <span className="text-sm font-medium">Total Weight: <span className="text-foreground font-bold">{totalWeight.toFixed(2)}</span></span>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                                <Button onClick={handleSubmit} disabled={loading}>
                                    {loading && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>}
                                    {shipment ? 'Save Changes' : 'Create Shipment'}
                                </Button>
                            </div>
                        </div>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        )
    }
