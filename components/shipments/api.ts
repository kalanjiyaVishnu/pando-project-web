import { crud } from '@/lib/api-client'
import { Shipment, ShipmentFilters } from './types'

export const shipmentApi = {
    getAll: async (filters: ShipmentFilters) => {
        return crud.getAll('shipments', filters)
    },
    getHelpers: async () => {
        const [transporters, vehicles, materials, edges] = await Promise.all([
            crud.getAll('transporters'),
            crud.getAll('vehicle-types'), 
            crud.getAll('materials'),
            crud.getAll('edges'),
        ])
        return {
            transporters: transporters.data || [],
            vehicles: vehicles.data || [],
            materials: materials.data || [],
            edges: edges.data || [],
        }
    },
    create: async (data: any) => {
        return crud.create('shipments', data)
    },
    update: async (id: number, data: any) => {
        return crud.update('shipments', id, data)
    },
    delete: async (id: number) => {
        return crud.delete('shipments', id)
    }
}
