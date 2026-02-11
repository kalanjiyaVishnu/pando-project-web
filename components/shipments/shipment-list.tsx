"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Loader2, ArrowRight } from 'lucide-react'
import { Shipment } from './types'
import { Card, CardContent } from '@/components/ui/card'

interface ShipmentListProps {
    data: Shipment[]
    loading: boolean
    onEdit: (shipment: Shipment) => void
    onDelete: (id: number) => void
}

export function ShipmentList({ data, loading, onEdit, onDelete }: ShipmentListProps) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-24 gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary/40" />
                <p className="text-muted-foreground animate-pulse font-medium">Loading shipments...</p>
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                    <p className="text-lg font-semibold">No shipments found</p>
                    <p className="text-sm">Try adjusting your filters or create a new shipment.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="rounded-md border bg-card shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/40">
                    <TableRow>
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Transporter</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Materials</TableHead>
                        <TableHead className="text-right">Weight</TableHead>
                        <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((shipment) => (
                        <TableRow key={shipment.id} className="group hover:bg-muted/50 transition-colors">
                            <TableCell className="font-mono font-medium">#{shipment.id}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="font-semibold text-muted-foreground">{shipment.fromSource}</span>
                                    <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
                                    <span className="font-semibold text-foreground">{shipment.endDestination}</span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    via {shipment.routes.length} hops
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{shipment.transporter.name}</div>
                                <div className="text-xs text-muted-foreground">{shipment.transporter.email}</div>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{shipment.vehicle.name}</div>
                                <div className="text-xs text-muted-foreground">{shipment.vehicle.weight}T Capacity</div>
                            </TableCell>
                            <TableCell className="max-w-[200px]">
                                <p className="truncate text-sm" title={shipment.materials}>
                                    {shipment.materials || '-'}
                                </p>
                            </TableCell>
                            <TableCell className="text-right font-mono font-medium">
                                {shipment.summedWeight.toLocaleString()} kg
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                                        onClick={() => onEdit(shipment)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => onDelete(shipment.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
