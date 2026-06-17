
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';
export function CardSkeleton() {
  return (
    <div className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-6 shadow-sm min-h-[120px]`}>
      <div className="h-4 w-24 rounded-md bg-gray-200" />
      <div className="mt-4 h-8 w-16 rounded-md bg-gray-200" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <div className="h-8 w-48 rounded-md bg-gray-200" />
        <div className="h-4 w-32 rounded-md bg-gray-200" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
      </div>
      <div className="mt-6 flow-root rounded-xl bg-gray-50 p-6 min-h-[200px]" />
    </div>
  );
}
export function ManifestTableSkeleton() {
  return (
    <div className={`${shimmer} relative overflow-hidden space-y-6 p-6`}>
      <div className="flex justify-between items-center">
        <div className="h-7 w-52 bg-gray-200 rounded" />
        <div className="h-10 w-28 bg-gray-200 rounded-lg" />
      </div>
      <div className="overflow-hidden rounded-xl bg-gray-100 p-4 min-h-[350px]">

        <div className="h-10 w-full bg-gray-200 rounded mb-4" />

        <div className="space-y-3">
          <div className="h-8 w-full bg-gray-50 rounded" />
          <div className="h-8 w-full bg-gray-50 rounded" />
          <div className="h-8 w-full bg-gray-50 rounded" />
        </div>
      </div>
    </div>
  );
}
export function TrackingSkeleton() {
  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="h-8 w-60 rounded bg-gray-200" />
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="h-4 w-40 bg-gray-200 rounded mb-3" />
        <div className="flex gap-4">
          <div className="h-12 flex-1 bg-gray-100 rounded-lg" />
          <div className="h-12 w-32 bg-gray-200 rounded-lg" />
        </div>
      </div>
      <div className={`${shimmer} relative overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-8 min-h-[250px]`} />
    </div>
  );
}
export function FlightTableSkeleton() {
  return (
    <div className={`${shimmer} relative overflow-hidden space-y-6 p-6`}>

      <div className="space-y-2">
        <div className="h-8 w-56 bg-gray-200 rounded" />
        <div className="h-4 w-72 bg-gray-100 rounded" />
      </div>


      <div className="flex gap-2">
        <div className="h-8 w-24 bg-gray-200 rounded-full" />
        <div className="h-8 w-24 bg-gray-100 rounded-full" />
        <div className="h-8 w-24 bg-gray-100 rounded-full" />
      </div>


      <div className="overflow-hidden rounded-xl bg-gray-50 p-4 min-h-[300px]">

        <div className="h-10 w-full bg-gray-200 rounded mb-4" />

        <div className="space-y-3">
          <div className="h-10 w-full bg-white rounded-lg shadow-sm border border-gray-100" />
          <div className="h-10 w-full bg-white rounded-lg shadow-sm border border-gray-100" />
          <div className="h-10 w-full bg-white rounded-lg shadow-sm border border-gray-100" />
          <div className="h-10 w-full bg-white rounded-lg shadow-sm border border-gray-100" />
        </div>
      </div>
    </div>
  );
}
export function LogTableSkeleton() {
  return (
    <div className={`${shimmer} relative overflow-hidden space-y-6 p-6`}>
      <div className="space-y-2">
        <div className="h-7 w-52 rounded bg-gray-200" />
        <div className="h-4 w-72 rounded bg-gray-100" />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-3">
          <div className="h-9 w-28 rounded-full bg-gray-200" />
          <div className="h-9 w-28 rounded-full bg-gray-100" />
          <div className="h-9 w-28 rounded-full bg-gray-100" />
        </div>
        <div className="h-10 w-40 rounded-lg bg-gray-200" />
      </div>

      <div className="overflow-hidden rounded-xl bg-gray-50 p-4 min-h-[340px]">
        <div className="h-10 w-full rounded bg-gray-200 mb-4" />
        <div className="space-y-3">
          <div className="h-10 w-full rounded-lg bg-white border border-gray-100 shadow-sm" />
          <div className="h-10 w-full rounded-lg bg-white border border-gray-100 shadow-sm" />
          <div className="h-10 w-full rounded-lg bg-white border border-gray-100 shadow-sm" />
          <div className="h-10 w-full rounded-lg bg-white border border-gray-100 shadow-sm" />
        </div>
      </div>
    </div>
  );
}