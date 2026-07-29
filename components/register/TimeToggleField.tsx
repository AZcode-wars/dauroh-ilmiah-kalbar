"use client";

import type { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from "react-hook-form";
import type { RegisterPesertaFormValues } from "@/lib/validations";

type TimeType = "jam_pasti" | "fleksibel";

interface TimeToggleFieldProps {
  label: string;
  typeField: "tipe_waktu_berangkat" | "tipe_waktu_kepulangan";
  fixedField: "waktu_berangkat" | "waktu_kepulangan";
  flexField: "deskripsi_berangkat" | "deskripsi_kepulangan";
  register: UseFormRegister<RegisterPesertaFormValues>;
  watch: UseFormWatch<RegisterPesertaFormValues>;
  setValue: UseFormSetValue<RegisterPesertaFormValues>;
  errors: FieldErrors<RegisterPesertaFormValues>;
}

export function TimeToggleField({
  label,
  typeField,
  fixedField,
  flexField,
  register,
  watch,
  setValue,
  errors,
}: TimeToggleFieldProps) {
  const currentType: TimeType = watch(typeField) ?? "jam_pasti";

  return (
    <section className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,53,39,0.08)] flex flex-col gap-4">
      <h2 className="text-[12px] font-sans font-semibold tracking-[0.2em] text-brown uppercase">
        {label}
      </h2>

      {/* Segmented control */}
      <div className="flex bg-cream-muted rounded-xl p-1">
        <button
          type="button"
          onClick={() => setValue(typeField, "jam_pasti")}
          className={`flex-1 py-2 rounded-lg font-sans text-sm font-semibold transition-all duration-200 ${
            currentType === "jam_pasti"
              ? "bg-gold text-emerald"
              : "text-emerald/60"
          }`}
        >
          Jam Pasti
        </button>
        <button
          type="button"
          onClick={() => setValue(typeField, "fleksibel")}
          className={`flex-1 py-2 rounded-lg font-sans text-sm font-semibold transition-all duration-200 ${
            currentType === "fleksibel"
              ? "bg-gold text-emerald"
              : "text-emerald/60"
          }`}
        >
          Fleksibel
        </button>
      </div>

      {/* Input sesuai tipe yang dipilih */}
      {currentType === "jam_pasti" ? (
        <div className="space-y-1">
          <label className="font-sans text-sm font-semibold text-emerald/80">
            Pilih Waktu
          </label>
          <input
            type="datetime-local"
            {...register(fixedField)}
            className="w-full bg-cream-muted border border-emerald/20 rounded-xl px-4 py-3 font-sans text-sm focus:border-gold focus:ring-2 focus:ring-gold/10 transition-colors"
          />
          {errors[fixedField] && (
            <p className="text-danger font-sans text-xs mt-1">{errors[fixedField]?.message}</p>
          )}
        </div>
      ) : (
        <div className="space-y-1">
          <label className="font-sans text-sm font-semibold text-emerald/80">
            Jelaskan waktu {label.toLowerCase()} Anda
          </label>
          <textarea
            {...register(flexField)}
            rows={3}
            className="w-full bg-cream-muted border border-emerald/20 rounded-xl px-4 py-3 font-sans text-sm focus:border-gold focus:ring-2 focus:ring-gold/10 transition-colors resize-none"
          />
          {errors[flexField] && (
            <p className="text-danger font-sans text-xs mt-1">{errors[flexField]?.message}</p>
          )}
        </div>
      )}
    </section>
  );
}
