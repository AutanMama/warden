export function Bar({ className = "" }) {
  return <div className={`bg-slate-100 rounded-[4px] animate-pulse ${className}`} />;
}

export function DetailSkeleton() {
  return (
    <div className="max-w-3xl">
      <Bar className="h-4 w-32 mb-6" />
      <div className="flex items-start justify-between mb-8">
        <div>
          <Bar className="h-3 w-20 mb-2" />
          <Bar className="h-7 w-64 mb-2" />
          <Bar className="h-4 w-24" />
        </div>
        <Bar className="h-6 w-20 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-1 space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <Bar key={i} className="h-4 w-24" />
          ))}
        </div>
        <div className="col-span-2 space-y-4">
          <Bar className="h-28 w-full rounded-[8px]" />
          <Bar className="h-20 w-full rounded-[8px]" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-6 px-4 py-3.5">
          <Bar className="h-3.5 w-1/3" />
          <Bar className="h-3.5 w-1/5" />
          <Bar className="h-3.5 w-16" />
          <Bar className="h-3.5 w-20 ml-auto" />
        </div>
      ))}
    </div>
  );
}
