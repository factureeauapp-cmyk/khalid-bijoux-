export default function Loading() {
  return (
    <div className="fixed inset-0 z-9998 flex items-center justify-center bg-[#050505] text-[#E7E0D3]">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-[30px] border border-[#C9A84C]/15 bg-[#0E0E0E]/95 p-8 shadow-[0_0_70px_rgba(201,168,76,0.2)] backdrop-blur-xl">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#C9A84C]/25 bg-[#111111]/95 shadow-[0_0_35px_rgba(201,168,76,0.25)]">
          <div className="h-12 w-12 animate-pulse rounded-full bg-linear-to-br from-[#C9A84C] via-[#E8C97E] to-[#F5E4A9] shadow-[0_0_20px_rgba(201,168,76,0.45)]" />
        </div>
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-[#C9A84C]">Loading</p>
          <p className="mt-2 text-sm leading-6 text-[#E7E0D3]/85">Preparing the next page...</p>
        </div>
      </div>
    </div>
  )
}
