export default function Card({ children, className = "", padded = false }) {
  return (
    <div
      className={`bg-white border border-slate-200/80 rounded-[8px] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_1px_rgba(15,23,42,0.03)] ${
        padded ? "p-5" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
