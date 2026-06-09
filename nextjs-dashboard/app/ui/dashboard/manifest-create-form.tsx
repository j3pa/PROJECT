"use client";

import { useState } from 'react';
import Link from 'next/link';
import { createTransaksi } from '@/app/lib/actions';

interface ManifestCreateFormProps {
  kendaraanList: any[];
  tanggalHariIni: string;
}

export default function ManifestCreateForm({ kendaraanList, tanggalHariIni }: ManifestCreateFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  function validateField(name: string, value: FormDataEntryValue | null) {
    const textValue = String(value || '').trim();

    if (name === 'tanggal_kirim' && !textValue) return 'Tanggal kirim wajib diisi.';
    if (name === 'no_telepon' && textValue.length < 12) return 'No telepon minimal 12 karakter.';
    if (name === 'no_telepon' && !/^[0-9]+$/.test(textValue)) return 'No telepon hanya boleh berisi angka.';
    if (name === 'nama_pengirim' && textValue.length < 2) return 'Nama pengirim wajib diisi.';
    if (name === 'nama_penerima' && textValue.length < 2) return 'Nama penerima wajib diisi.';
    if (name === 'kota_asal' && textValue.length < 2) return 'Kota asal wajib diisi.';
    if (name === 'kota_tujuan' && textValue.length < 2) return 'Kota tujuan wajib diisi.';
    if (name === 'jenis_barang' && textValue.length < 2) return 'Jenis barang wajib diisi.';
    if (name === 'kendaraan_id' && !textValue) return 'Kendaraan wajib dipilih.';
    if (name === 'berat_barang' && Number(textValue) <= 0) return 'Berat barang harus lebih dari 0.';
    if (name === 'tarif' && (!textValue || Number(textValue) < 0)) return 'Tarif pengiriman harus angka valid.';
    if (name === 'catatan' && textValue.length < 5) return 'Deskripsi barang wajib diisi minimal 5 karakter.';

    return '';
  }

  function validateForm(form: HTMLFormElement) {
    const formData = new FormData(form);
    const fieldNames = [
      'tanggal_kirim',
      'no_telepon',
      'nama_pengirim',
      'nama_penerima',
      'kota_asal',
      'kota_tujuan',
      'jenis_barang',
      'kendaraan_id',
      'berat_barang',
      'tarif',
      'catatan',
    ];
    const nextErrors: Record<string, string> = {};

    fieldNames.forEach((fieldName) => {
      const message = validateField(fieldName, formData.get(fieldName));
      if (message) nextErrors[fieldName] = message;
    });

    return nextErrors;
  }

  function getVisibleError(fieldName: string) {
    return touchedFields[fieldName] || submitted ? errors[fieldName] : '';
  }

  function handleFieldBlur(event: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.currentTarget;
    const message = validateField(name, value);

    setTouchedFields((current) => ({ ...current, [name]: true }));
    setErrors((current) => {
      const nextErrors = { ...current };

      if (message) {
        nextErrors[name] = message;
      } else {
        delete nextErrors[name];
      }

      return nextErrors;
    });
  }

  function handleFieldChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.currentTarget;

    if (!touchedFields[name] && !submitted) return;

    const message = validateField(name, value);
    setErrors((current) => {
      const nextErrors = { ...current };

      if (message) {
        nextErrors[name] = message;
      } else {
        delete nextErrors[name];
      }

      return nextErrors;
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const nextErrors = validateForm(event.currentTarget);

    setSubmitted(true);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      event.preventDefault();
    }
  }

  function ErrorText({ fieldName }: { fieldName: string }) {
    const message = getVisibleError(fieldName);

    if (!message) return null;

    return (
      <p id={`${fieldName}-error`} className="text-red-600 italic text-sm mt-1">
        {message}
      </p>
    );
  }

  return (
    <form action={createTransaksi} onSubmit={handleSubmit} noValidate className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-gray-400 uppercase">No AWB / Resi</label>
        <input
          type="text"
          value="Auto Generated Setelah Submit"
          disabled
          className="border rounded-md p-2 bg-gray-100 font-mono text-gray-500 cursor-not-allowed text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Tanggal Kirim</label>
          <ErrorText fieldName="tanggal_kirim" />
          <input
            name="tanggal_kirim"
            type="date"
            defaultValue={tanggalHariIni}
            required
            onBlur={handleFieldBlur}
            onChange={handleFieldChange}
            aria-invalid={getVisibleError('tanggal_kirim') ? 'true' : undefined}
            aria-describedby={getVisibleError('tanggal_kirim') ? 'tanggal_kirim-error' : undefined}
            className="border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700" htmlFor="no-telepon">No Telepon</label>
          <ErrorText fieldName="no_telepon" />
          <input
            id="no-telepon"
            name="no_telepon"
            type="text"
            inputMode="numeric"
            maxLength={12}
            onBlur={handleFieldBlur}
            onChange={handleFieldChange}
            aria-invalid={getVisibleError('no_telepon') ? 'true' : undefined}
            aria-describedby={getVisibleError('no_telepon') ? 'no_telepon-error' : undefined}
            placeholder="081234567890"
            className={`border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 outline-none ${
              getVisibleError('no_telepon')
                ? 'border-red-500 focus:ring-red-200'
                : 'focus:ring-blue-500'
            }`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Nama Pengirim</label>
          <ErrorText fieldName="nama_pengirim" />
          <input
            name="nama_pengirim"
            type="text"
            required
            minLength={2}
            onBlur={handleFieldBlur}
            onChange={handleFieldChange}
            aria-invalid={getVisibleError('nama_pengirim') ? 'true' : undefined}
            aria-describedby={getVisibleError('nama_pengirim') ? 'nama_pengirim-error' : undefined}
            className="border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Nama Penerima</label>
          <ErrorText fieldName="nama_penerima" />
          <input
            name="nama_penerima"
            type="text"
            required
            minLength={2}
            onBlur={handleFieldBlur}
            onChange={handleFieldChange}
            aria-invalid={getVisibleError('nama_penerima') ? 'true' : undefined}
            aria-describedby={getVisibleError('nama_penerima') ? 'nama_penerima-error' : undefined}
            className="border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Kota Asal</label>
          <ErrorText fieldName="kota_asal" />
          <input
            name="kota_asal"
            type="text"
            required
            minLength={2}
            onBlur={handleFieldBlur}
            onChange={handleFieldChange}
            aria-invalid={getVisibleError('kota_asal') ? 'true' : undefined}
            aria-describedby={getVisibleError('kota_asal') ? 'kota_asal-error' : undefined}
            className="border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Kota Tujuan</label>
          <ErrorText fieldName="kota_tujuan" />
          <input
            name="kota_tujuan"
            type="text"
            required
            minLength={2}
            onBlur={handleFieldBlur}
            onChange={handleFieldChange}
            aria-invalid={getVisibleError('kota_tujuan') ? 'true' : undefined}
            aria-describedby={getVisibleError('kota_tujuan') ? 'kota_tujuan-error' : undefined}
            className="border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Jenis Barang</label>
          <ErrorText fieldName="jenis_barang" />
          <input
            name="jenis_barang"
            type="text"
            required
            minLength={2}
            onBlur={handleFieldBlur}
            onChange={handleFieldChange}
            aria-invalid={getVisibleError('jenis_barang') ? 'true' : undefined}
            aria-describedby={getVisibleError('jenis_barang') ? 'jenis_barang-error' : undefined}
            className="border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Jenis Pengiriman</label>
          <select
            name="jenis_pengiriman"
            defaultValue="Biasa"
            required
            className="border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Biasa">Biasa</option>
            <option value="Cepat">Cepat</option>
            <option value="Vvip">Vvip</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Berat Barang (Kg)</label>
          <ErrorText fieldName="berat_barang" />
          <input
            name="berat_barang"
            type="number"
            min="0"
            step="0.01"
            required
            onBlur={handleFieldBlur}
            onChange={handleFieldChange}
            aria-invalid={getVisibleError('berat_barang') ? 'true' : undefined}
            aria-describedby={getVisibleError('berat_barang') ? 'berat_barang-error' : undefined}
            className="border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Harga / Tarif Pengiriman (Rp)</label>
          <ErrorText fieldName="tarif" />
          <input
            name="tarif"
            type="number"
            min="0"
            required
            onBlur={handleFieldBlur}
            onChange={handleFieldChange}
            aria-invalid={getVisibleError('tarif') ? 'true' : undefined}
            aria-describedby={getVisibleError('tarif') ? 'tarif-error' : undefined}
            className="border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Pilih Kendaraan</label>
          <ErrorText fieldName="kendaraan_id" />
          <select
            name="kendaraan_id"
            required
            defaultValue=""
            disabled={kendaraanList.length === 0}
            onBlur={handleFieldBlur}
            onChange={handleFieldChange}
            aria-invalid={getVisibleError('kendaraan_id') ? 'true' : undefined}
            aria-describedby={getVisibleError('kendaraan_id') ? 'kendaraan_id-error' : undefined}
            className="border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="" disabled>-- Pilih Kendaraan --</option>
            {kendaraanList.map((kendaraan) => (
              <option key={kendaraan.id} value={kendaraan.id}>
                {kendaraan.nama_kendaraan} ({kendaraan.kode_kendaraan}) - {kendaraan.jenis_kendaraan} [{kendaraan.status_kendaraan}]
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Status Pengiriman</label>
          <select
            name="status_pengiriman"
            defaultValue="Pending"
            required
            className="border rounded-md p-2 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Pending">Pending</option>
            <option value="Diproses">Diproses</option>
            <option value="Dalam Pengiriman">Dalam Pengiriman</option>
            <option value="Sampai Tujuan">Sampai Tujuan</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Deskripsi / Catatan Barang</label>
        <ErrorText fieldName="catatan" />
        <textarea
          name="catatan"
          rows={4}
          required
          minLength={5}
          onBlur={handleFieldBlur}
          onChange={handleFieldChange}
          aria-invalid={getVisibleError('catatan') ? 'true' : undefined}
          aria-describedby={getVisibleError('catatan') ? 'catatan-error' : undefined}
          placeholder="Contoh: barang pecah belah, jangan tertindih, prioritas cepat, dll."
          className="border rounded-md p-3 bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        />
      </div>

      <div className="flex justify-end gap-2 mt-4 border-t pt-4">
        <Link
          href="/dashboard/manifest"
          className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 text-xs font-semibold transition"
        >
          BATAL
        </Link>
        <button
          type="submit"
          disabled={kendaraanList.length === 0}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold shadow-sm transition"
        >
          SIMPAN DATA
        </button>
      </div>
    </form>
  );
}
