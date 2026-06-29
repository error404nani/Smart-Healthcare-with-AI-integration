import { Loader2, Heart } from 'lucide-react'

export default function GlobalLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
        <div className="relative p-4 bg-background border-2 border-primary/20 rounded-2xl shadow-xl">
          <Heart className="w-10 h-10 text-primary animate-bounce" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <p className="text-xl font-black text-foreground tracking-tight">Smart Healthcare</p>
        </div>
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Preparing your workspace...</p>
      </div>
    </div>
  )
}
