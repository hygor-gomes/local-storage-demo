import { Check } from "lucide-react";
import type { ReactNode } from "react";

const STEPS = [
  "Áreas de atuação",
  "Subserviços",
  "Monte seu catálogo",
  "Resumo e publicação",
];

export function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-start justify-between gap-2 px-2 sm:px-8">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const active = n === current;
        const done = n < current;
        return (
          <div key={label} className="relative flex flex-1 flex-col items-center gap-2">
            {i > 0 && (
              <span className="absolute right-1/2 top-3.5 -z-0 h-px w-full bg-border" />
            )}
            <span
              className={[
                "relative z-10 flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : done
                    ? "border-secondary bg-secondary text-secondary-foreground"
                    : "border-border bg-card text-muted-foreground",
              ].join(" ")}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : n}
            </span>
            <span
              className={[
                "text-center text-[11px] leading-tight",
                active ? "text-foreground" : "text-muted-foreground",
              ].join(" ")}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function CheckBox({ checked }: { checked: boolean }) {
  return (
    <span
      className={[
        "flex h-5 w-5 shrink-0 items-center justify-center rounded border",
        checked ? "border-primary bg-primary text-primary-foreground" : "border-border",
      ].join(" ")}
    >
      {checked && <Check className="h-3.5 w-3.5" />}
    </span>
  );
}

export function Hint({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-card/60 px-4 py-3 text-sm text-muted-foreground">
      <span aria-hidden>💡</span>
      <span>{children}</span>
    </div>
  );
}

export function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-muted-foreground">
        {label}
        {required && <span className="text-primary">*</span>}
      </span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary";
