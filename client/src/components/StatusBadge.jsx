const STYLES = {
  pending: { bg: "var(--color-warning-bg)", text: "var(--color-warning)", label: "Pending" },
  approved: { bg: "var(--color-success-bg)", text: "var(--color-success)", label: "Approved" },
  rejected: { bg: "var(--color-danger-bg)", text: "var(--color-danger)", label: "Rejected" },
  success: { bg: "var(--color-success-bg)", text: "var(--color-success)", label: "Success" },
  failed: { bg: "var(--color-danger-bg)", text: "var(--color-danger)", label: "Failed" },
  info: { bg: "var(--color-info-bg)", text: "var(--color-info)", label: "Info" },
};

export default function StatusBadge({ status, label }) {
  const style = STYLES[status] || STYLES.info;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-xs font-medium"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.text }} />
      {label || style.label}
    </span>
  );
}
