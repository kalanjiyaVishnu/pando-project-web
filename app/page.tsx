import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SIDEBAR_TABS } from '@/lib/config'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Admin Dashboard</h1>
        <p className="text-xl text-muted-foreground">
          Manage your transporters, materials, and vehicle types easily.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {SIDEBAR_TABS.map((tab) => (
          <Card key={tab.name}>
            <CardHeader>
              <CardTitle>{tab.name}</CardTitle>
              <CardDescription>Manage {tab.name.toLowerCase()} records</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={tab.href}>Go to {tab.name}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
