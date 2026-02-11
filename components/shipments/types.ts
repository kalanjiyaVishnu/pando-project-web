export interface Material {
    id: number
    name: string
    quantity: number
}

export interface Route {
    id?: number 
    sourceId: number
    destId: number
    source?: string
    destination?: string
    materials: Material[]
    tempId?: string 
}

export interface Shipment {
    id: number
    fromSource: string
    endDestination: string
    transporter: {
        id: number
        name: string
        email: string
        gstno: string
    }
    vehicle: {
        id: number
        name: string
        weight: number
    }
    materials: string
    summedWeight: number
    routes: Route[]
    createdAt: string
}

export interface ShipmentFilters {
    search?: string
    transporterId?: string
    vehicleId?: string
    materialId?: string
    [key: string]: string | undefined
}
