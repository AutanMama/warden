function Bar({ className }) {
  return <div className={`bg-slate-100 rounded-[4px] animate-pulse ${className}`} />;
}

export default function PageSkeleton() {
  return (
    <div>
      <div className="mb-6">
        <Bar className="h-6 w-40 mb-2" />
        <Bar className="h-4 w-64" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <Bar className="sm:col-span-2 h-20" />
        <Bar className="h-20" />
      </div>

      <div className="bg-white border border-slate-200/80 rounded-[8px] p-5">
        <Bar className="h-4 w-32 mb-5" />
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <Bar key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
