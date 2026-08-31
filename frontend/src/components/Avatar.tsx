import { hueFromString, initials } from "@/lib/format";

export function Avatar({
  name,
  size = 40,
  ring = false,
}: {
  name: string;
  size?: number;
  ring?: boolean;
}) {
  const hue = hueFromString(name);
  const background = `linear-gradient(135deg, hsl(${hue} 80% 55%), hsl(${(hue + 42) % 360} 85% 45%))`;

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-display font-bold text-black/80 ${
        ring ? "ring-2 ring-lime/70 ring-offset-2 ring-offset-background" : ""
      }`}
      style={{
        width: size,
        height: size,
        background,
        fontSize: size * 0.38,
      }}
      aria-hidden
    >
      {initials(name)}
    </div>
  );
}
