import { Suspense } from 'react'
import { DataTable } from '../Component/datatable'
import { fetchDomains } from '@/lib/data'
import { Skeleton } from '@/components/ui/skeleton'

function LoadingTable() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-[250px]" />
      <div className="rounded-md border">
        <Skeleton className="h-[400px] w-full" />
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  const domains = await fetchDomains()

  return (
    <main className="container mx-auto p-6">
      <Suspense fallback={<LoadingTable />}>
        <DataTable data={domains} />
      </Suspense>
    </main>
  )
}

