"use client";

import TrashTable from "@/components/admin/TrashTable";

// Halaman trash: mengelola peserta yang sudah di-soft-delete
export default function TrashPage() {
	return (
		<div className="flex flex-col flex-1 min-h-0 gap-6 animate-in fade-in duration-500">
			<div className="shrink-0">
				<h1 className="font-serif text-2xl font-bold text-emerald">Trash</h1>
				<p className="text-sm text-muted-foreground">
					Data peserta yang telah dihapus. Pulihkan atau hapus permanen.
				</p>
			</div>
			<TrashTable />
		</div>
	);
}
