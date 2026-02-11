'use client'

import { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { crud } from '@/lib/api-client'
import { Plus, Search, Filter, Loader2, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { Combobox } from './shipments/combobox'
import { toast } from 'sonner'

interface Field {
    name: string
    label: string
    type: 'text' | 'email' | 'number' | 'select'
    model?: string
    displayKey?: string
    createLink?: string
}

interface CrudPageProps {
    title: string
    model: string
    fields: Field[]
}

const getValue = (obj: any, path: string) => {
    if (!path) return undefined
    return path.split('.').reduce((o, i) => (o ? o[i] : undefined), obj)
}

export function CrudPage({ title, model, fields }: CrudPageProps) {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [filterOpen, setFilterOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<any>(null)
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState<Record<string, string>>({})
    const [optionsData, setOptionsData] = useState<Record<string, any[]>>({})

    const fetchData = async (searchQuery?: string, activeFilters?: Record<string, string>) => {
        setLoading(true)
        try {
            const params = {
                ...(searchQuery ? { search: searchQuery } : {}),
                ...(activeFilters || {}),
            }
            const result = await crud.getAll(model, params)
            setData(result.data || [])
        } catch (error: any) {
            toast.error(error.message || `Failed to fetch ${title.toLowerCase()}`)
        } finally {
            setLoading(false)
        }
    }

    const fetchOptions = async () => {
        const selectFields = fields.filter(f => f.type === 'select' && f.model)
        for (const field of selectFields) {
            try {
                const result = await crud.getAll(field.model!)
                setOptionsData(prev => ({ ...prev, [field.name]: result.data || [] }))
            } catch (error) {
                console.error(`Failed to fetch options for ${field.name}`, error)
            }
        }
    }

    useEffect(() => {
        fetchOptions()
    }, [model])

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData(search, filters)
        }, 400)
        return () => clearTimeout(timer)
    }, [search, filters, model])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const payload: any = Object.fromEntries(formData.entries())

        fields.forEach(field => {
            if (field.type === 'number' || field.type === 'select') {
                payload[field.name] = Number(payload[field.name])
            }
        })

        try {
            if (editingItem?.id) {
                await crud.update(model, editingItem.id, payload)
                toast.success(`${title} updated successfully`)
            } else {
                await crud.create(model, payload)
                toast.success(`${title} created successfully`)
            }
            setIsOpen(false)
            setEditingItem(null)
            fetchData(search, filters)
        } catch (error: any) {
            toast.error(error.message || `Failed to save ${title.toLowerCase()}`)
        }
    }

    const handleDelete = async (id: number) => {
        toast('Are you sure you want to delete this record?', {
            action: {
                label: 'Delete',
                onClick: async () => {
                    try {
                        await crud.delete(model, id)
                        toast.success(`${title} deleted successfully`)
                        fetchData(search, filters)
                    } catch (error: any) {
                        toast.error(error.message || `Failed to delete ${title.toLowerCase()}`)
                    }
                },
            },
        })
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    const handleFilterChange = (name: string, value: string) => {
        const newFilters = { ...filters, [name]: value }
        if (!value) delete newFilters[name]
        setFilters(newFilters)
    }

    const applyFilters = () => setFilterOpen(false)

    const resetFilters = () => {
        setFilters({})
        setFilterOpen(false)
    }

    const filteredData = data

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    {title}
                </h1>
                <Dialog open={isOpen} onOpenChange={(v) => {
                    setIsOpen(v)
                    if (!v) setEditingItem(null)
                }}>
                    <DialogTrigger asChild>
                        <Button className="font-semibold shadow-lg shadow-primary/20 active:scale-95 transition-all h-11 px-6">
                            <Plus className="mr-2 h-5 w-5" /> Add {title}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="text-2xl">{editingItem?.id ? 'Edit' : 'Add'} {title}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 pt-6">
                            <div className="grid gap-4">
                                {fields.map((field) => (
                                    <div key={field.name} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor={field.name} className="text-sm font-medium">
                                                {field.label}
                                            </Label>
                                            <div className="flex items-center gap-2">
                                                {field.type === 'select' && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-5 px-1.5 text-xs text-muted-foreground hover:text-primary"
                                                        onClick={() => {
                                                            crud.getAll(field.model!)
                                                                .then(res => setOptionsData(prev => ({ ...prev, [field.name]: res.data || [] })))
                                                                .catch(err => toast.error("Failed to refresh options"))
                                                        }}
                                                        title="Refresh options"
                                                    >
                                                        <Loader2 className="h-3 w-3" />
                                                    </Button>
                                                )}
                                                {field.type === 'select' && field.createLink && (
                                                    <a href={field.createLink} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                                                        <Plus className="h-3 w-3" /> Add New
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        {field.type === 'select' ? (
                                            <Combobox
                                                options={(optionsData[field.name] || []).map((opt: any) => ({
                                                    label: getValue(opt, field.displayKey?.replace(field.name + '.', '') || 'name') || opt.name || opt.label || String(opt.id),
                                                    value: String(opt.id)
                                                }))}
                                                value={editingItem ? String(getValue(editingItem, field.name)) : undefined}
                                                onChange={(val) => {
                                                    setEditingItem((prev: any) => ({ ...prev, [field.name]: val }))
                                                }}
                                                placeholder={`Select ${field.label}`}
                                            />
                                        ) : (
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                type={field.type}
                                                defaultValue={editingItem ? getValue(editingItem, field.name) : ''}
                                                required
                                                className="h-11 bg-muted/20 border-muted-foreground/20 focus:border-primary/50 transition-colors"
                                            />
                                        )}
                                        {field.type === 'select' && (
                                            <input type="hidden" name={field.name} value={editingItem?.[field.name] || ''} />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="min-w-[120px]">
                                    {editingItem?.id ? 'Save Changes' : 'Create Record'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border shadow-2xl bg-card overflow-hidden rounded-xl">
                <CardHeader className="pb-4 pt-6 px-6 border-b bg-muted/5">
                    <div className="flex items-center gap-4 w-full">
                        <div className="relative flex-1 group min-w-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder={`Search through ${title.toLowerCase()}...`}
                                className="pl-10 bg-muted/40 border-muted-foreground/10 focus:bg-background transition-all h-11 rounded-lg w-full"
                                value={search}
                                onChange={handleSearch}
                            />
                        </div>
                        <div className="shrink-0">
                            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="h-11 px-5 border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all relative">
                                        <Filter className="mr-2 h-4 w-4" />
                                        <span className="font-medium">Filter</span>
                                        {Object.keys(filters).length > 0 && (
                                            <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-background animate-in zoom-in">
                                                {Object.keys(filters).length}
                                            </span>
                                        )}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="p-0 flex flex-col w-[400px] sm:w-[500px]">
                                    <SheetHeader className="p-6 border-b shrink-0">
                                        <SheetTitle className="text-2xl font-bold">Advanced Filters</SheetTitle>
                                    </SheetHeader>

                                    <div className="flex-1 overflow-y-auto p-6">
                                        <div className="grid gap-8">
                                            {fields.map((field) => (
                                                <div key={field.name} className="space-y-3">
                                                    <Label htmlFor={`filter-${field.name}`} className="text-sm font-bold tracking-tight uppercase opacity-70">
                                                        {field.label}
                                                    </Label>
                                                    <Input
                                                        id={`filter-${field.name}`}
                                                        placeholder={`Filter by ${field.label.toLowerCase()}...`}
                                                        value={filters[field.name] || ''}
                                                        onChange={(e) => handleFilterChange(field.name, e.target.value)}
                                                        className="h-12 bg-muted/20 focus:bg-background transition-all border-none focus:ring-1"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6 border-t bg-muted/10 shrink-0 flex flex-col gap-3">
                                        <Button onClick={applyFilters} className="w-full h-12 text-base font-bold shadow-lg shadow-primary/10">
                                            Apply Active Filters
                                        </Button>
                                        <Button variant="ghost" onClick={resetFilters} className="w-full h-11 text-muted-foreground hover:text-foreground">
                                            Clear and Reset All
                                        </Button>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-24 gap-4">
                            <Loader2 className="h-12 w-12 animate-spin text-primary/40" />
                            <p className="text-muted-foreground animate-pulse font-medium">Fetching data...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="hover:bg-transparent border-muted/20">
                                        <TableHead className="w-24 pl-8 h-12 uppercase text-[11px] font-bold tracking-wider opacity-70">ID</TableHead>
                                        {fields.map((field) => (
                                            <TableHead key={field.name} className="h-12 uppercase text-[11px] font-bold tracking-wider opacity-70">
                                                {field.label}
                                            </TableHead>
                                        ))}
                                        <TableHead className="text-right pr-8 h-12 uppercase text-[11px] font-bold tracking-wider opacity-70">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={fields.length + 2} className="text-center py-32 text-muted-foreground">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="bg-muted rounded-full p-4">
                                                        <Search className="h-10 w-10 opacity-20" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-lg font-semibold text-foreground">No matches found</p>
                                                        <p className="text-sm">Try adjusting your filters or search terms.</p>
                                                    </div>
                                                    <Button variant="outline" size="sm" onClick={resetFilters} className="mt-2">
                                                        Clear all filters
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredData.map((item) => (
                                            <TableRow key={item.id} className="hover:bg-muted/20 transition-all border-muted/10 group">
                                                <TableCell className="font-mono text-sm pl-8 group-hover:text-primary transition-colors">
                                                    #{item.id}
                                                </TableCell>
                                                {fields.map((field) => (
                                                    <TableCell key={field.name} className="py-4">
                                                        <span className="font-medium text-foreground/90">{getValue(item, field.displayKey || field.name)}</span>
                                                    </TableCell>
                                                ))}
                                                <TableCell className="text-right pr-8">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            variant="secondary"
                                                            size="icon"
                                                            className="h-9 w-9 border shadow-sm hover:bg-background hover:text-primary transition-all"
                                                            onClick={() => {
                                                                setEditingItem(item)
                                                                setIsOpen(true)
                                                            }}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="secondary"
                                                            size="icon"
                                                            className="h-9 w-9 border shadow-sm text-destructive hover:bg-destructive/10 transition-all"
                                                            onClick={() => handleDelete(item.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

    )
}

