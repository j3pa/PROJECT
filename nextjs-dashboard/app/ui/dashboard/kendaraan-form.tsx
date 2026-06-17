"use client";

import { useActionState, useState } from 'react';
import Link from 'next/link';
import type { ActionState } from '@/app/lib/actions';

interface KendaraanValues {
  nama_kendaraan?: string;
  jenis_kendaraan?: string;
  kode_kendaraan?: string;
  kapasitas_muatan?: string | number;
  status_kendaraan?: string;
}

interface KendaraanFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  initialValues?: KendaraanValues;
  submitLabel: string;
}

const statusOptions = ['Aktif', 'Tersedia', 'Maintenance', 'Tidak Tersedia'];

export default function KendaraanForm({ action, initialValues = {}, submitLabel }: KendaraanFormProps) {
  const [state, formAction, isPending] = useActionState(action, { error: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  function validateField(name: string, value: FormDataEntryValue | null) {
    const textValue = String(value || '').trim();

    if (name === 'nama_kendaraan' && textValue.length < 2) return 'Nama kendaraan wajib diisi.';
    if (name === 'jenis_kendaraan' && textValue.length < 2) return 'Jenis kendaraan wajib diisi.';
    if (name === 'kode_kendaraan' && textValue.length < 3) return 'Kode kendaraan wajib diisi.';
    if (name === 'kapasitas_muatan' && Number(textValue) <= 0) return 'Kapasitas muatan harus lebih dari 0.';
    if (name === 'status_kendaraan' && !statusOptions.includes(textValue)) return 'Status kendaraan wajib dipilih.';

    return '';
  }

  function validateForm(form: HTMLFormElement) {
    const formData = new FormData(form);
    const nextErrors: Record<string, string> = {};

    ['nama_kendaraan', 'jenis_kendaraan', 'kode_kendaraan', 'kapasitas_muatan', 'status_kendaraan'].forEach((fieldName) => {
      const message = validateField(fieldName, formData.get(fieldName));
      if (message) nextErrors[fieldName] = message;
    });

    return nextErrors;
  }

  function getVisibleError(fieldName: string) {
    return touchedFields[fieldName] || submitted ? errors[fieldName] : '';
  }

  function handleFieldBlur(event: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
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

  function handleFieldChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
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
      <p id={`${fieldName}-error`} className="text-sm italic text-red-600">
        {message}
      </p>
    );
  }

  function inputClass(fieldName: string) {
    return `border rounded-md p-2 bg-gray-50 text-sm outline-none focus:ring-2 ${
      getVisibleError(fieldName) ? 'border-red-500 focus:ring-red-200' : 'focus:ring-blue-500'
    }`;
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} noValidate className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Nama Kendaraan</label>
          <input
            name="nama_kendaraan"
            type="text"
            required
            minLength={2}
            defaultValue={initialValues.nama_kendaraan || ''}
            onBlur={handleFieldBlur}
            onChange={handleFieldChange}
            aria-invalid={getVisibleError('nama_kendaraan') ? 'true' : undefined}
            aria-describedby={getVisibleError('nama_kendaraan') ? 'nama_kendaraan-error' : undefined}
            className={inputClass('nama_kendaraan')}
          />
          <ErrorText fieldName="nama_kendaraan" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Jenis Kendaraan</label>
          <input
            name="jenis_kendaraan"
            type="text"
            required
            minLength={2}
            defaultValue={initialValues.jenis_kendaraan || ''}
            onBlur={handleFieldBlur}
            onChange={handleFieldChange}
            aria-invalid={getVisibleError('jenis_kendaraan') ? 'true' : undefined}
            aria-describedby={getVisibleError('jenis_kendaraan') ? 'jenis_kendaraan-error' : undefined}
            className={inputClass('jenis_kendaraan')}
          />
          <ErrorText fieldName="jenis_kendaraan" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Kode / Plat Kendaraan</label>
          <input
            name="kode_kendaraan"
            type="text"
            required
            minLength={3}
            defaultValue={initialValues.kode_kendaraan || ''}
            onBlur={handleFieldBlur}
            onChange={handleFieldChange}
            aria-invalid={getVisibleError('kode_kendaraan') ? 'true' : undefined}
            aria-describedby={getVisibleError('kode_kendaraan') ? 'kode_kendaraan-error' : undefined}
            className={inputClass('kode_kendaraan')}
          />
          <ErrorText fieldName="kode_kendaraan" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-700">Kapasitas Muatan (Kg)</label>
          <input
            name="kapasitas_muatan"
            type="number"
            required
            min={1}
            defaultValue={initialValues.kapasitas_muatan || ''}
            onBlur={handleFieldBlur}
            onChange={handleFieldChange}
            aria-invalid={getVisibleError('kapasitas_muatan') ? 'true' : undefined}
            aria-describedby={getVisibleError('kapasitas_muatan') ? 'kapasitas_muatan-error' : undefined}
            className={inputClass('kapasitas_muatan')}
          />
          <ErrorText fieldName="kapasitas_muatan" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-gray-700">Status Kendaraan</label>
        <select
          name="status_kendaraan"
          required
          defaultValue={initialValues.status_kendaraan || 'Aktif'}
          onBlur={handleFieldBlur}
          onChange={handleFieldChange}
          aria-invalid={getVisibleError('status_kendaraan') ? 'true' : undefined}
          aria-describedby={getVisibleError('status_kendaraan') ? 'status_kendaraan-error' : undefined}
          className={inputClass('status_kendaraan')}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <ErrorText fieldName="status_kendaraan" />
      </div>

      {state.error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm italic text-red-600">
          {state.error}
        </p>
      ) : null}

      <div className="flex justify-end gap-2 mt-4 border-t pt-4">
        <Link href="/dashboard/kendaraan" className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 text-xs font-semibold transition">
          BATAL
        </Link>
        <button type="submit" disabled={isPending} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold shadow-sm transition disabled:opacity-60">
          {isPending ? 'MENYIMPAN...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
