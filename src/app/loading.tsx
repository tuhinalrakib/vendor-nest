import Image from "next/image";

export default function Loading({ fullscreen = true }: { fullscreen?: boolean }) {
  return (
    <div className={
      fullscreen
        ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-50 dark:bg-[#0a0a0a] transition-colors duration-300"
        : "w-full min-h-full flex-1 flex flex-col items-center justify-center bg-transparent py-16 relative"
    }>
      {/* Background glow effects */}
      {fullscreen && (
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none animate-pulse duration-4000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-2xl pointer-events-none animate-pulse duration-3000 delay-500"></div>
        </>
      )}

      <div className="relative flex flex-col items-center gap-6">
        {/* Logo/Icon Container with Spinning and Pulsing rings */}
        <div className="relative flex items-center justify-center w-20 h-20">
          {/* Inner pulsing circle */}
          <div className="absolute inset-0 rounded-full bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 opacity-20 animate-ping duration-1500"></div>

          {/* Outer rotating gradient ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent bg-linear-to-tr from-indigo-500 via-violet-500 to-pink-500 mask-[linear-gradient(white,transparent)] animate-spin"></div>

          {/* Double ring structure for a more complex premium feel */}
          <div className="absolute inset-2 rounded-full border border-dashed border-zinc-300 dark:border-zinc-700 animate-spin [animation-direction:reverse] duration-6000"></div>

          {/* Center brand mark */}
          <div className="absolute inset-3 rounded-full bg-white dark:bg-[#121212] shadow-sm flex items-center justify-center">
            {/* <svg 
              className="w-7 h-7 text-indigo-650 dark:text-indigo-400 animate-pulse" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth={2.5}
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg> */}
            <Image
              src="/logo.png"
              alt='Logo'
              fill
              loading="eager"
              sizes="(max-width: 768px) 120px, 180px"
              className='w-7 h-7 rounded-full text-indigo-650 dark:text-indigo-400 animate-pulse'
            />
          </div>
        </div>

        {/* Text indicators */}
        <div className="flex flex-col items-center text-center gap-1.5 px-4">
          <h2 className="text-xl font-medium tracking-tight text-zinc-800 dark:text-zinc-200">
            VendorNest
          </h2>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest animate-pulse">
              Loading Dashboard
            </span>
            <span className="flex gap-1 items-center h-2">
              <span className="w-1 h-1 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1 h-1 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1 h-1 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-bounce"></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
