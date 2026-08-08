export type Job = { id: string; source_name: string; target_format: string; status: "processing" | "completed" | "failed"; size: number; simulated: boolean; download_url?: string; created_at?: string };

export function formatBytes(bytes: number): string {
  if (bytes < 1000) return `${bytes} B`;
  if (bytes < 1_000_000) return `${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(bytes / 1000)} KB`;
  return `${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(bytes / 1_000_000)} MB`;
}

export function validateUpload(file: File, extensions: string[], maxMb = 25): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!extensions.includes(extension)) return "File ini memiliki format yang tidak didukung.";
  if (file.size > maxMb * 1024 * 1024) return `Ukuran file maksimal ${maxMb} MB.`;
  return null;
}

export function getApiBaseUrl(pageOrigin: string, configuredUrl?: string): string {
  const configured = configuredUrl?.trim();
  if (configured) return configured.replace(/\/$/, "");

  const url = new URL(pageOrigin);
  return `${url.protocol}//${url.hostname}:8765`;
}

export function buildDemoJob(name: string, target: string): Job {
  return { id: `demo-${Date.now()}`, source_name: name, target_format: target, status: "completed", size: 0, simulated: true, created_at: new Date().toISOString() };
}
