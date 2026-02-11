'use client'

import { CrudPage } from '@/components/crud-page'

export default function TransportersPage() {
    return (
        <CrudPage
            title="Transporters"
            model="transporters"
            fields={[
                { name: 'name', label: 'Name', type: 'text' },
                { name: 'gstno', label: 'GST No', type: 'text' },
                { name: 'email', label: 'Email', type: 'email' },
                { name: 'address', label: 'Address', type: 'text' },
            ]}
        />
    )
}
