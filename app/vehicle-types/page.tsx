'use client'

import { CrudPage } from '@/components/crud-page'

export default function VehicleTypesPage() {
    return (
        <CrudPage
            title="Vehicle Types"
            model="vehicle-types"
            fields={[
                { name: 'name', label: 'Name', type: 'text' },
                { name: 'weight', label: 'Weight', type: 'number' },
            ]}
        />
    )
}
