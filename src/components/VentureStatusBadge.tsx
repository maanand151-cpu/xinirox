import { cn } from "@/lib/utils";
import { getVentureStatus, ventureStatusMeta } from "@/lib/ventureStatus";

interface Props {
  status: string | null | undefined;
  className?: string;
  showDot?: boolean;
}

const VentureStatusBadge = ({ status, className, showDot = true }: Props) => {
  const s = getVentureStatus(status);
  const meta = ventureStatusMeta[s];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-medium uppercase tracking-wide",
        meta.badgeClass,
        className,
      )}
    >
      {showDot && <span className={cn("w-1.5 h-1.5 rounded-full", meta.dotClass)} />}
      {meta.label}
    </span>
  );
};

export default VentureStatusBadge;
