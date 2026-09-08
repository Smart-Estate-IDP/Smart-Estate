export default function Loading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#DCE5EC] px-4">
      <div className="rounded-[32px] neu-raised p-8 sm:p-12 text-center space-y-6 max-w-sm w-full border border-white/90">
        
        {/* Pulsing Soft Neumorphic Shield */}
        <div className="w-20 h-20 rounded-[24px] neu-inset flex items-center justify-center mx-auto p-1.5 animate-pulse">
          <div className="w-full h-full rounded-[18px] bg-gradient-to-br from-[#3155FF] to-[#287BFF] flex items-center justify-center shadow-[0_8px_20px_rgba(49,85,255,0.4)]">
            <svg
              className="w-9 h-9 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
        </div>

        {/* Text & Status */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">
            Smart<span className="text-[#3155FF]">Estate</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Loading Verified Due Diligence...
          </p>
        </div>

        {/* Inset Animated Progress Bar */}
        <div className="w-full h-2.5 neu-inset rounded-full overflow-hidden p-0.5">
          <div className="h-full rounded-full bg-gradient-to-r from-[#3155FF] via-[#287BFF] to-emerald-400 animate-pulse w-3/4 shadow-[0_2px_8px_rgba(49,85,255,0.4)]" />
        </div>

        <div className="flex items-center justify-center gap-2 pt-1 text-[11px] font-bold text-emerald-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Encrypted Legal Verification</span>
        </div>

      </div>
    </div>
  );
}
