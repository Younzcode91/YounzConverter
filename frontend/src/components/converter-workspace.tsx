"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { buildDemoJob, formatBytes, getApiBaseUrl, Job, validateUpload } from "@/lib/converter";

const converters = [
  { id: "image", icon: "IMG", name: "Gambar", text: "JPG, PNG, WEBP", extensions: ["jpg", "jpeg", "png", "webp", "gif"], targets: ["jpg", "png", "webp"] },
  { id: "pdf", icon: "PDF", name: "PDF", text: "PDF ke dokumen", extensions: ["pdf"], targets: ["docx", "jpg", "png"] },
  { id: "word", icon: "DOC", name: "Word", text: "DOC dan DOCX", extensions: ["doc", "docx"], targets: ["pdf", "txt"] },
  { id: "excel", icon: "XLS", name: "Excel", text: "XLSX dan CSV", extensions: ["xls", "xlsx", "csv"], targets: ["pdf", "csv", "xlsx"] },
  { id: "remove-background", icon: "CUT", name: "Hapus Latar", text: "PNG transparan", extensions: ["jpg", "jpeg", "png", "webp"], targets: ["png"] },
  { id: "sticker", icon: "STK", name: "Stiker", text: "Siap untuk chat", extensions: ["jpg", "jpeg", "png", "webp"], targets: ["webp", "png"] },
  { id: "gif", icon: "GIF", name: "GIF", text: "Animasi ringkas", extensions: ["gif", "mp4", "webm", "jpg", "jpeg", "png"], targets: ["gif", "mp4"] },
];

export default function ConverterWorkspace() {
  const [active, setActive] = useState(converters[0]);
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState("jpg");
  const [quality, setQuality] = useState(82);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [dark, setDark] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  function select(item: typeof converters[number]) { setActive(item); setTarget(item.targets[0]); setFile(null); setError(""); }
  function accept(next: File) { const issue = validateUpload(next, active.extensions); setError(issue ?? ""); if (!issue) setFile(next); }
  function pick(event: ChangeEvent<HTMLInputElement>) { if (event.target.files?.[0]) accept(event.target.files[0]); }
  function drop(event: DragEvent) { event.preventDefault(); if (event.dataTransfer.files[0]) accept(event.dataTransfer.files[0]); }

  async function convert() {
    if (!file) return setError("Pilih file terlebih dahulu.");
    setBusy(true); setError("");
    const pending: Job = { ...buildDemoJob(file.name, target), id: `pending-${Date.now()}`, size: file.size, status: "processing" };
    setJobs((old) => [pending, ...old]);
    try {
      const body = new FormData(); body.append("file", file); body.append("converter", active.id); body.append("target_format", target); body.append("options[quality]", String(quality));
      const apiBaseUrl = getApiBaseUrl(window.location.origin, process.env.NEXT_PUBLIC_API_URL);
      const response = await fetch(`${apiBaseUrl}/api/conversions`, { method: "POST", body });
      if (!response.ok) throw new Error("Backend tidak tersedia");
      const payload = await response.json(); setJobs((old) => [payload.data, ...old.filter((job) => job.id !== pending.id)]);
    } catch {
      const demo = { ...buildDemoJob(file.name, target), size: file.size };
      setJobs((old) => [demo, ...old.filter((job) => job.id !== pending.id)]);
      setError("Backend tidak terhubung. Hasil demo simulasi ditampilkan; file tidak dikonversi.");
    } finally { setBusy(false); }
  }

  return <>
    <header className="nav"><a className="brand" href="#top" aria-label="YounzConverter beranda"><span>Y</span> YounzConverter</a><nav aria-label="Navigasi utama"><a href="#converter">Converter</a><a href="#jobs">Riwayat</a><a href="#tentang">Tentang</a></nav><button className="theme" onClick={() => setDark(!dark)} aria-label="Ganti tema">{dark ? "Terang" : "Gelap"}</button></header>
    <main id="top">
      <section className="hero"><div className="eyebrow">SATU TEMPAT, SEMUA FORMAT</div><h1>Ubah file. <em>Tanpa ribet.</em></h1><p>Converter serbaguna yang cepat, privat, dan enak dipakai. Pilih alat, jatuhkan file, selesai.</p><div className="trust"><span>Tanpa akun</span><span>Maks. 25 MB</span><span>Simulasi MVP transparan</span></div></section>
      <section className="tool-shell" id="converter" aria-label="Alat konversi">
        <aside><p className="aside-title">PILIH ALAT</p>{converters.map((item) => <button key={item.id} className={active.id === item.id ? "tool active" : "tool"} onClick={() => select(item)}><b>{item.icon}</b><span><strong>{item.name}</strong><small>{item.text}</small></span></button>)}</aside>
        <div className="workspace"><div className="workspace-head"><div><span className="kicker">CONVERTER AKTIF</span><h2>{active.name}</h2></div><span className="sim-badge">SIMULASI MVP</span></div>
          <div className={file ? "dropzone has-file" : "dropzone"} onDragOver={(e) => e.preventDefault()} onDrop={drop} onClick={() => input.current?.click()} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && input.current?.click()}>
            <input ref={input} type="file" hidden onChange={pick} accept={active.extensions.map((x) => `.${x}`).join(",")} />
            <div className="upload-icon">+</div>{file ? <><h3>{file.name}</h3><p>{formatBytes(file.size)} - klik untuk mengganti</p></> : <><h3>Jatuhkan file di sini</h3><p>atau klik untuk memilih dari perangkat</p><small>{active.extensions.map((x) => x.toUpperCase()).join(" / ")} - maks. 25 MB</small></>}
          </div>
          {error && <div className="notice" role="alert">{error}</div>}
          <div className="settings"><label>Format hasil<select value={target} onChange={(e) => setTarget(e.target.value)}>{active.targets.map((x) => <option key={x}>{x}</option>)}</select></label><label>Kualitas <span>{quality}%</span><input type="range" min="40" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} /></label></div>
          <button className="convert" disabled={busy} onClick={convert}>{busy ? "Memproses..." : `Konversi ke ${target.toUpperCase()}`} <span aria-hidden>&rarr;</span></button><p className="privacy">Pada mode MVP, backend hanya menyalin file secara aman dan menandainya sebagai simulasi.</p>
        </div>
      </section>
      <section className="jobs" id="jobs"><div><span className="kicker">AKTIVITAS</span><h2>Konversi terbaru</h2></div>{jobs.length === 0 ? <div className="empty">Belum ada pekerjaan. Konversi pertamamu akan tampil di sini.</div> : <div className="job-list">{jobs.map((job) => <article key={job.id}><div className="filemark">{job.target_format.toUpperCase()}</div><div><strong>{job.source_name}</strong><small>{formatBytes(job.size)} - {job.simulated ? "Simulasi" : "Diproses server"}</small></div><span className={`status ${job.status}`}>{job.status === "processing" ? "Memproses" : "Selesai"}</span>{job.download_url ? <a href={job.download_url}>Unduh</a> : <button disabled>Demo</button>}</article>)}</div>}</section>
      <section className="about" id="tentang"><p>YounzConverter dibangun untuk alur kerja yang sederhana dan transparan.</p><strong>File masuk. Format berubah. Pekerjaan lanjut.</strong></section>
    </main><footer><span>YounzConverter / MVP 2026</span><span>Dibuat di Indonesia</span></footer>
  </>;
}
