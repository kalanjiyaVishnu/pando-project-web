'use client'

import { CrudPage } from '@/components/crud-page'

export default function MaterialCategoriesPage() {
    return (
        <CrudPage
            title="Material Categories"
            model="material-categories"
            fields={[
                { name: 'name', label: 'Name', type: 'text' },
            ]}
        />
    )
}
