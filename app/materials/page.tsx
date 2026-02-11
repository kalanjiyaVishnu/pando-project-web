'use client'

import { CrudPage } from '@/components/crud-page'

export default function MaterialsPage() {
    return (
        <CrudPage
            title="Materials"
            model="materials"
            fields={[
                { name: 'name', label: 'Name', type: 'text' },
                { name: 'code', label: 'Code', type: 'text' },
                { name: 'desc', label: 'Description', type: 'text' },
                { name: 'categoryId', label: 'Category', type: 'select', model: 'material-categories', displayKey: 'category.name', createLink: '/material-categories' },
            ]}
        />
    )
}
