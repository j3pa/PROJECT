"use client";

import { useMemo, useState } from 'react';

interface MonthlyBookingChartProps {
  transactions: any[];
}

interface CargoItem {
  resi: string;
  jenisBarang: string;
  asal: string;
  tujuan: string;
  berat: string;
  status: string;
}

interface ChartPoint {
  key: string;
  label: string;
  shortLabel: string;
  total: number;
  cargo: CargoItem[];
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getDateKeyFromValue(value: string | Date | null | undefined) {
  if (!value) return '';

  if (typeof value === 'string') {
    const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (dateOnly) return `${dateOnly[1]}-${dateOnly[2]}-${dateOnly[3]}`;
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return '';

  return toDateKey(parsedDate);
}

function formatDayLabel(date: Date) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
  }).format(date);
}

function formatCargo(transaction: any): CargoItem {
  const beratValue = transaction.berat_barang ?? transaction.berat ?? 0;
  const berat = typeof beratValue === 'number' ? `${beratValue} kg` : `${beratValue || 0} kg`;

  return {
    resi: transaction.resi || transaction.awb || '-',
    jenisBarang: transaction.jenis_barang || 'Kargo umum',
    asal: transaction.kota_asal || 'Gudang Udara',
    tujuan: transaction.kota_tujuan || transaction.tujuan || '-',
    berat,
    status: transaction.status_pengiriman || transaction.status || 'Pending',
  };
}

function buildChartData(transactions: any[]): ChartPoint[] {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 29);
  startDate.setHours(0, 0, 0, 0);

  const cargoByDate = new Map<string, CargoItem[]>();

  transactions.forEach((transaction) => {
    const dateKey = getDateKeyFromValue(transaction.tanggal_kirim || transaction.created_at);
    if (!dateKey) return;

    const currentCargo = cargoByDate.get(dateKey) || [];
    cargoByDate.set(dateKey, [...currentCargo, formatCargo(transaction)]);
  });

  return Array.from({ length: 30 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    const key = toDateKey(date);
    const cargo = cargoByDate.get(key) || [];

    return {
      key,
      label: formatDayLabel(date),
      shortLabel: String(date.getDate()).padStart(2, '0'),
      total: cargo.length,
      cargo,
    };
  });
}

export default function MonthlyBookingChart({ transactions }: MonthlyBookingChartProps) {
  const chartData = useMemo(() => buildChartData(transactions), [transactions]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const maxValue = Math.max(...chartData.map((item) => item.total), 1);
  const totalBookings = chartData.reduce((sum, item) => sum + item.total, 0);
  const activePoint = activeIndex === null ? null : chartData[activeIndex];

  const chartWidth = 760;
  const chartHeight = 170;
  const leftPadding = 34;
  const rightPadding = 24;
  const topPadding = 22;
  const bottomPadding = 34;
  const innerWidth = chartWidth - leftPadding - rightPadding;
  const innerHeight = chartHeight - topPadding - bottomPadding;
  const stepWidth = innerWidth / (chartData.length - 1);

  const points = chartData.map((item, index) => {
    const x = leftPadding + index * stepWidth;
    const y = topPadding + innerHeight - (item.total / maxValue) * (innerHeight - 12);
    return { ...item, x, y };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ');
  const activeSvgPoint = activeIndex === null ? null : points[activeIndex];

  return (
    <section className="relative mb-4 rounded-xl border border-gray-200 bg-white px-5 py-4 text-[#0d1a4a] shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[15px] font-bold">Grafik Pemesanan 30 Hari</h2>
          <p className="mt-0.5 text-[11px] text-gray-500">
            Hover titik untuk melihat kargo yang diantar.
          </p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5 text-right">
          <p className="text-[10px] text-gray-400">Total</p>
          <p className="text-[17px] font-bold text-blue-700">{totalBookings}</p>
        </div>
      </div>

      <div className="rounded-lg bg-gray-50/70 px-2 py-1">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-[170px] w-full"
          role="img"
          aria-label="Line chart pemesanan kargo selama 30 hari terakhir"
          onMouseLeave={() => setActiveIndex(null)}
        >
          <defs>
            <linearGradient id="bookingLineStroke" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#0891b2" />
              <stop offset="55%" stopColor="#fdc00b" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
          </defs>

          {[0, 1, 2].map((line) => {
            const y = topPadding + (innerHeight / 2) * line;
            return (
              <line
                key={line}
                x1={leftPadding}
                x2={chartWidth - rightPadding}
                y1={y}
                y2={y}
                stroke="#e5e7eb"
                strokeDasharray="4 7"
              />
            );
          })}

          <path
            d={linePath}
            fill="none"
            stroke="url(#bookingLineStroke)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {activeSvgPoint && (
            <line
              x1={activeSvgPoint.x}
              x2={activeSvgPoint.x}
              y1={topPadding}
              y2={topPadding + innerHeight}
              stroke="#fdc00b"
              strokeDasharray="4 5"
              opacity="0.7"
            />
          )}

          {points.map((point, index) => (
            <g key={point.key}>
              {(index % 6 === 0 || index === points.length - 1) && (
                <text x={point.x} y={chartHeight - 9} textAnchor="middle" fill="#6b7280" fontSize="10">
                  {point.shortLabel}
                </text>
              )}
              <circle
                cx={point.x}
                cy={point.y}
                r={index === activeIndex ? 7 : 4.5}
                fill={index === activeIndex ? '#fdc00b' : '#ffffff'}
                stroke={point.total > 0 ? '#0891b2' : '#d1d5db'}
                strokeWidth={index === activeIndex ? 3 : 2}
              />
              {point.total > 0 && (
                <text x={point.x} y={point.y - 9} textAnchor="middle" fill="#0d1a4a" fontSize="9" fontWeight="700">
                  {point.total}
                </text>
              )}
              <rect
                x={point.x - stepWidth / 2}
                y={topPadding}
                width={stepWidth}
                height={innerHeight + 18}
                fill="transparent"
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                tabIndex={0}
                role="button"
                aria-label={`${point.label}, ${point.total} kargo`}
              />
            </g>
          ))}
        </svg>
      </div>

      {activePoint && (
        <div className="absolute right-5 top-16 z-10 w-72 rounded-lg border border-gray-200 bg-white p-3 text-left shadow-xl">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">{activePoint.label}</p>
              <p className="text-[13px] font-bold text-[#0d1a4a]">{activePoint.total} kargo</p>
            </div>
            <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700">
              Detail
            </span>
          </div>

          {activePoint.cargo.length > 0 ? (
            <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
              {activePoint.cargo.map((cargo) => (
                <div key={cargo.resi} className="rounded-md border border-gray-100 bg-gray-50 px-2.5 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-[10px] font-bold text-blue-700">{cargo.resi}</p>
                    <p className="text-[10px] font-semibold text-gray-500">{cargo.status}</p>
                  </div>
                  <p className="mt-1 text-[11px] font-bold text-[#0d1a4a]">{cargo.jenisBarang}</p>
                  <p className="mt-0.5 text-[10px] text-gray-500">
                    {cargo.asal} ke {cargo.tujuan} - {cargo.berat}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-md bg-gray-50 px-3 py-4 text-center text-[11px] text-gray-500">
              Tidak ada kargo pada tanggal ini.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
