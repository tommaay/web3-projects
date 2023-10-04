export default function Loading() {
  return (
    <div className="container py-sm md:py-md">
      <div className="min-h-[300px] rounded blur-sm bg-white/10 animate-pulse" />

      <div className="grid grid-cols-1 gap-4 pt-12 md:gap-8 sm:grid-cols-3">
        <div className="rounded h-[240px] blur-sm bg-white/10 animate-pulse" />
        <div className="rounded h-[240px] blur-sm bg-white/10 animate-pulse" />
        <div className="rounded h-[240px] blur-sm bg-white/10 animate-pulse" />
      </div>
    </div>
  );
}
