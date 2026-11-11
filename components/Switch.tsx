type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

/** Interruptor encendido/apagado (accesible: role="switch"). */
export default function Switch({ checked, onChange, label }: Props) {
  return (
    <div className="inline-flex items-center gap-3 text-sm">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-lavender" : "bg-border"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : ""}`}
        />
      </button>
      <span>{label}</span>
    </div>
  );
}