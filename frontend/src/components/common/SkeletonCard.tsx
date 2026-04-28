export default function SkeletonCard() {
  return (
    <div className="bg-navy-800 rounded-xl p-5 border border-navy-700 space-y-3">
      <div className="flex items-center justify-between">
        <div className="skeleton h-4 w-32" />
        <div className="skeleton h-5 w-16 rounded-full" />
      </div>
      <div className="skeleton h-3 w-24" />
      <div className="skeleton h-3 w-40" />
      <div className="flex gap-2 pt-1">
        <div className="skeleton h-8 w-20 rounded-lg" />
        <div className="skeleton h-8 w-20 rounded-lg" />
      </div>
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-3 px-4">
      <div className="skeleton h-8 w-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="skeleton h-3.5 w-40" />
        <div className="skeleton h-3 w-24" />
      </div>
      <div className="skeleton h-5 w-16 rounded-full" />
      <div className="skeleton h-8 w-20 rounded-lg" />
    </div>
  )
}
