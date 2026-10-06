const FONT: Record<string, string[]> = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11111", "00010", "00100", "00010", "00001", "10001", "01110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
};

/** Dot-matrix digits, in the spirit of an old split-flap counter. */
export function DotNumber({ value, digits = 2, className = "" }: { value: number; digits?: number; className?: string }) {
  const text = String(Math.max(0, Math.floor(value))).padStart(digits, "0");
  return (
    <span className={`inline-flex gap-[6px] ${className}`} role="img" aria-label={String(value)}>
      {text.split("").map((ch, i) => (
        <span key={i} className="grid grid-cols-5 gap-[2px]" aria-hidden>
          {(FONT[ch] ?? FONT["0"]).flatMap((row, r) =>
            row.split("").map((bit, c) => <span key={`${r}-${c}`} className={`h-[4px] w-[4px] rounded-full ${bit === "1" ? "bg-current" : "bg-transparent"}`} />),
          )}
        </span>
      ))}
    </span>
  );
}
