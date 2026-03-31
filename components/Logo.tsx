export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Simbolo: tre righe ondulate */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--terracotta)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="flex-shrink-0"
      >
        <path d="M3 6h7c1 0 2 1 2 2s-1 2-2 2H6c-1 0-2 1-2 2s1 2 2 2h4" />
        <path d="M12 18h7c1 0 2-1 2-2s-1-2-2-2h-4c-1 0-2-1-2-2s1-2 2-2h4" />
      </svg>
      {/* Wordmark: "likhit" in minuscolo Georgia */}
      <span className="font-serif text-ink font-bold text-xl tracking-wide lowercase">
        likhit
      </span>
    </div>
  );
}
