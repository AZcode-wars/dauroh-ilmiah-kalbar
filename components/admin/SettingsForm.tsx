"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, Clock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormData = {
  registration_open_at: string;
  registration_close_at: string;
  contact_person_wa: string;
};

// Formulir pengaturan pendaftaran: waktu buka/tutup dan nomor kontak
export default function SettingsForm() {
  const [data, setData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        // Konversi ISO ke format datetime-local (Y-m-d\TH:i)
        setData({
          registration_open_at: toDatetimeLocal(d.registration_open_at),
          registration_close_at: toDatetimeLocal(d.registration_close_at),
          contact_person_wa: d.contact_person_wa,
        });
      })
      .catch(() => setMessage({ type: "error", text: "Gagal memuat pengaturan" }))
      .finally(() => setLoading(false));
  }, []);

  function toDatetimeLocal(iso: string) {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    setMessage(null);

    try {
      const body = {
        registration_open_at: new Date(data.registration_open_at).toISOString(),
        registration_close_at: new Date(data.registration_close_at).toISOString(),
        contact_person_wa: data.contact_person_wa,
      };

      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        const detail = err.errors?.map((e: { message: string }) => e.message).join(", ") || err.message || "Gagal menyimpan";
        setMessage({ type: "error", text: detail });
        return;
      }

      setMessage({ type: "success", text: "Pengaturan berhasil disimpan" });
      setData({
        registration_open_at: toDatetimeLocal(body.registration_open_at),
        registration_close_at: toDatetimeLocal(body.registration_close_at),
        contact_person_wa: body.contact_person_wa,
      });
    } catch {
      setMessage({ type: "error", text: "Terjadi kesalahan sistem" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-6">
      {message && (
        <div
          className={`rounded-md px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-emerald/10 text-emerald"
              : "bg-red-50 text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4 rounded-lg border border-[#e2e8f0] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="space-y-2">
          <Label htmlFor="open_at" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Clock className="h-4 w-4 text-emerald" />
            Waktu Buka Pendaftaran
          </Label>
          <Input
            id="open_at"
            type="datetime-local"
            value={data?.registration_open_at ?? ""}
            onChange={(e) => setData((prev) => prev ? { ...prev, registration_open_at: e.target.value } : prev)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="close_at" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Clock className="h-4 w-4 text-emerald" />
            Waktu Tutup Pendaftaran
          </Label>
          <Input
            id="close_at"
            type="datetime-local"
            value={data?.registration_close_at ?? ""}
            onChange={(e) => setData((prev) => prev ? { ...prev, registration_close_at: e.target.value } : prev)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_wa" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Phone className="h-4 w-4 text-emerald" />
            Nomor WA Contact Person
          </Label>
          <Input
            id="contact_wa"
            type="text"
            placeholder="08xxxxxxxxxx"
            value={data?.contact_person_wa ?? ""}
            onChange={(e) => setData((prev) => prev ? { ...prev, contact_person_wa: e.target.value } : prev)}
          />
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={saving}
        className="w-full gap-2 bg-emerald hover:bg-emerald-soft sm:w-auto"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        Simpan Pengaturan
      </Button>
    </div>
  );
}
