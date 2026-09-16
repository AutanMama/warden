export default function Logo({ withWordmark = true, size = "md", dark = false }) {
  const mark = size === "lg" ? "w-9 h-9 text-base" : "w-7 h-7 text-sm";

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${mark} rounded-[6px] font-semibold flex items-center justify-center shrink-0 ${
          dark ? "bg-white text-[var(--color-navy)]" : "bg-[var(--color-navy)] text-white"
        }`}
      >
        W
      </div>
      {withWordmark && (
        <span
          className={`font-semibold tracking-wide text-[15px] ${
            dark ? "text-white" : "text-[var(--color-text)]"
          }`}
        >
          WARDEN
        </span>
      )}
    </div>
  );
}
