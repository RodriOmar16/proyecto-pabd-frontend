"use client";

import { useId } from "react";
import { Label } from "@/components/ui/label";
import { Switch as SwitchUI } from "@/components/ui/switch";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

/** Interruptor con texto (Switch de shadcn, encendido en lavanda). */
export default function Switch({ checked, onChange, label }: Props) {
  const id = useId();
  return (
    <div className="inline-flex items-center gap-3 text-sm">
      <SwitchUI id={id} checked={checked} onCheckedChange={onChange} className="data-checked:bg-lavender" />
      <Label htmlFor={id} className="cursor-pointer font-normal">
        {label}
      </Label>
    </div>
  );
}