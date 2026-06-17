"use client";

import { useMemo, useState } from 'react';
import { INDONESIA_TIME_ZONE } from '@/app/lib/time';

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
  fullDate: string;
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
    timeZone: INDONESIA_TIME_ZONE,
    day: '2-digit',
    month: 'short',
  }).format(date);
}

function formatFullDate(date: Date) {
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: INDONESIA_TIME_ZONE,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
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
      shortLabel: index % 3 === 0 || index === 29 ? formatDayLabel(date) : '',
      fullDate: formatFullDate(date),
      total: cargo.length,
      cargo,
    };
  });
}

function buildYAxisTicks(maxDataValue: number) {
  if (maxDataValue <= 0) return { axisMax: 1, ticks: [1, 0] };
  if (maxDataValue <= 6) {
    const ticks = Array.from({ length: maxDataValue + 1 }, (_, index) => maxDataValue - index);
    return { axisMax: maxDataValue, ticks };
  }

  const step = Math.ceil(maxDataValue / 4);
  const axisMax = step * 4;
  const ticks = Array.from({ length: 5 }, (_, index) => axisMax - step * index);

  return { axisMax, ticks };
}

function SummaryCard({
  label,
  value,
  sub,
  tone,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub: string;
  tone: 'blue' | 'purple' | 'green' | 'orange';
  icon: 'bars' | 'trend' | 'calendar';
  accent?: string;
}) {
  const style = {
    blue: {
      card: 'from-blue-50 text-blue-700',
      icon: 'bg-blue-100 text-blue-600',
    },
    purple: {
      card: 'from-purple-50 text-purple-700',
      icon: 'bg-purple-100 text-purple-600',
    },
    green: {
      card: 'from-green-50 text-green-700',
      icon: 'bg-green-100 text-green-600',
    },
    orange: {
      card: 'from-orange-50 text-orange-600',
      icon: 'bg-orange-100 text-orange-500',
    },
  }[tone];

  const iconNode = {
    bars: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 20V10M12 20V4M19 20v-7" strokeLinecap="round" />
        <path d="M3 20h18" strokeLinecap="round" />
      </svg>
    ),
    trend: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m4 16 5-5 4 4 7-8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    calendar: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18" strokeLinecap="round" />
      </svg>
    ),
  }[icon];

  return (
    <div className={`flex items-center justify-between gap-5 rounded-2xl border border-gray-200 bg-gradient-to-br ${style.card} to-white px-5 py-5`}>
      <div className="min-w-0">
        <p className="text-[15px] font-semibold text-gray-500">{label}</p>
        <div className="mt-2 flex items-baseline gap-2.5">
          <p className="truncate text-3xl font-bold">{value}</p>
          {accent ? <span className="text-[14px] font-bold text-green-600">{accent}</span> : null}
        </div>
        <p className="mt-1 text-[14px] text-gray-500">{sub}</p>
      </div>
      <div className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl ${style.icon}`}>
        {iconNode}
      </div>
    </div>
  );
}

export default function MonthlyBookingChart({ transactions }: MonthlyBookingChartProps) {
  const chartData = useMemo(() => buildChartData(transactions), [transactions]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const maxDataValue = Math.max(...chartData.map((item) => item.total), 0);
  const { axisMax, ticks: yAxisTicks } = buildYAxisTicks(maxDataValue);
  const totalBookings = chartData.reduce((sum, item) => sum + item.total, 0);
  const averageBookings = (totalBookings / chartData.length).toLocaleString('id-ID', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const activePoint = activeIndex === null ? null : chartData[activeIndex];
  const highestDay = chartData.reduce((highest, item) => (item.total > highest.total ? item : highest), chartData[0]);
  const lowestDay = chartData.reduce((lowest, item) => (item.total < lowest.total ? item : lowest), chartData[0]);

  const chartWidth = 1180;
  const chartHeight = 610;
  const leftPadding = 64;
  const rightPadding = 42;
  const topPadding = 58;
  const bottomPadding = 54;
  const innerWidth = chartWidth - leftPadding - rightPadding;
  const innerHeight = chartHeight - topPadding - bottomPadding;
  const stepWidth = innerWidth / (chartData.length - 1);

  const points = chartData.map((item, index) => {
    const x = leftPadding + index * stepWidth;
    const y = topPadding + innerHeight - (item.total / axisMax) * innerHeight;
    return { ...item, x, y };
  });

  const baselineY = topPadding + innerHeight;
  const activeSvgPoint = activeIndex === null ? null : points[activeIndex];

  return (
    <section className="relative mb-7 rounded-2xl border border-gray-200 bg-white p-8 text-[#0d1a4a] shadow-sm">
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-[28px] font-bold">Grafik Pemesanan 30 Hari</h2>
          <p className="mt-2 text-[16px] text-gray-500">
            Hover titik untuk melihat kargo yang diantar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-2xl bg-blue-50 px-7 py-4 text-center">
            <p className="text-[15px] font-bold text-blue-700">Total</p>
            <p className="text-4xl font-bold text-blue-700">{totalBookings}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white px-3 py-5 shadow-inner shadow-gray-100/70">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-[610px] w-full"
          role="img"
          aria-label="Line chart pemesanan kargo selama 30 hari terakhir"
          onMouseLeave={() => setActiveIndex(null)}
        >
          <defs>
            <linearGradient id="bookingLineStrokeLarge" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#0891b2" />
              <stop offset="40%" stopColor="#22c55e" />
              <stop offset="68%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#0b74e8" />
            </linearGradient>
            <linearGradient id="bookingAreaLarge" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#0b74e8" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#0b74e8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="bookingPeakGreen" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="bookingPeakOrange" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="bookingPeakBlue" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#0b74e8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0b74e8" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          <text x={leftPadding} y="18" fill="#6b7280" fontSize="15" fontWeight="700">
            Jumlah Pesanan
          </text>

          {yAxisTicks.map((labelValue) => {
            const y = topPadding + innerHeight - (labelValue / axisMax) * innerHeight;
            return (
              <g key={labelValue}>
                <line
                  x1={leftPadding}
                  x2={chartWidth - rightPadding}
                  y1={y}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeDasharray="5 7"
                />
                <text x={leftPadding - 10} y={y + 5} textAnchor="end" fill="#64748b" fontSize="15" fontWeight="600">
                  {labelValue}
                </text>
              </g>
            );
          })}

          <line
            x1={leftPadding}
            x2={chartWidth - rightPadding}
            y1={baselineY}
            y2={baselineY}
            stroke="#cfd8e3"
            strokeWidth="1.5"
          />

          {activeSvgPoint && (
            <line
              x1={activeSvgPoint.x}
              x2={activeSvgPoint.x}
              y1={topPadding}
              y2={baselineY}
              stroke="#fdc00b"
              strokeDasharray="4 5"
              opacity="0.7"
            />
          )}

          {points.map((point, index) => {
            const peakColors = [
              { stroke: '#22c55e', fill: 'url(#bookingPeakGreen)' },
              { stroke: '#f59e0b', fill: 'url(#bookingPeakOrange)' },
              { stroke: '#0b74e8', fill: 'url(#bookingPeakBlue)' },
            ];
            const color = point.total > 0 ? peakColors[index % peakColors.length] : { stroke: '#94a3b8', fill: 'transparent' };
            const peakWidth = Math.min(stepWidth * 0.95, 58);
            const startX = Math.max(leftPadding, point.x - peakWidth);
            const endX = Math.min(chartWidth - rightPadding, point.x + peakWidth);
            const curvePath = `M ${startX.toFixed(2)} ${baselineY.toFixed(2)} C ${(point.x - peakWidth * 0.55).toFixed(2)} ${baselineY.toFixed(2)}, ${(point.x - peakWidth * 0.34).toFixed(2)} ${point.y.toFixed(2)}, ${point.x.toFixed(2)} ${point.y.toFixed(2)} C ${(point.x + peakWidth * 0.34).toFixed(2)} ${point.y.toFixed(2)}, ${(point.x + peakWidth * 0.55).toFixed(2)} ${baselineY.toFixed(2)}, ${endX.toFixed(2)} ${baselineY.toFixed(2)}`;
            const areaPath = `${curvePath} L ${endX.toFixed(2)} ${baselineY.toFixed(2)} L ${startX.toFixed(2)} ${baselineY.toFixed(2)} Z`;

            return (
              <g key={point.key}>
                {point.shortLabel && (
                  <text x={point.x} y={chartHeight - 18} textAnchor="middle" fill="#64748b" fontSize="15" fontWeight="600">
                    {point.shortLabel}
                  </text>
                )}
                {point.total > 0 && (
                  <>
                    <path d={areaPath} fill={color.fill} />
                    <path
                      d={curvePath}
                      fill="none"
                      stroke={color.stroke}
                      strokeWidth={index === activeIndex ? 4 : 3}
                      strokeLinecap="round"
                    />
                  </>
                )}
                <circle
                  cx={point.x}
                  cy={point.total > 0 ? point.y : baselineY}
                  r={index === activeIndex ? 7 : 5}
                  fill="#ffffff"
                  stroke={color.stroke}
                  strokeWidth={index === activeIndex ? 3 : 2}
                />
                {point.total > 0 && (
                  <>
                    <circle cx={point.x} cy={point.y - 20} r="12" fill={color.stroke} />
                    <text x={point.x} y={point.y - 15.5} textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="800">
                      {point.total}
                    </text>
                  </>
                )}
                <rect
                  x={point.x - stepWidth / 2}
                  y={topPadding}
                  width={stepWidth}
                  height={innerHeight + 30}
                  fill="transparent"
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${point.label}, ${point.total} kargo`}
                />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total Pesanan"
          value={totalBookings}
          accent="+50%"
          sub="Dibanding 30 hari lalu"
          tone="blue"
          icon="bars"
        />
        <SummaryCard
          label="Rata-rata per Hari"
          value={averageBookings}
          sub="Pesanan per hari"
          tone="purple"
          icon="trend"
        />
        <SummaryCard
          label="Hari Tertinggi"
          value={highestDay.fullDate}
          sub={`${highestDay.total} pesanan`}
          tone="green"
          icon="calendar"
        />
        <SummaryCard
          label="Hari Terendah"
          value={lowestDay.total}
          sub={lowestDay.total === 0 ? 'Tidak ada pesanan' : `${lowestDay.total} pesanan`}
          tone="orange"
          icon="bars"
        />
      </div>

      {activePoint && (
        <div className="absolute right-7 top-32 z-10 w-80 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-xl">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-gray-400">{activePoint.fullDate}</p>
              <p className="text-[16px] font-bold text-[#0d1a4a]">{activePoint.total} kargo</p>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-[12px] font-semibold text-blue-700">
              Detail
            </span>
          </div>

          {activePoint.cargo.length > 0 ? (
            <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
              {activePoint.cargo.map((cargo) => (
                <div key={cargo.resi} className="rounded-md border border-gray-100 bg-gray-50 px-3 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-[12px] font-bold text-blue-700">{cargo.resi}</p>
                    <p className="text-[12px] font-semibold text-gray-500">{cargo.status}</p>
                  </div>
                  <p className="mt-1 text-[14px] font-bold text-[#0d1a4a]">{cargo.jenisBarang}</p>
                  <p className="mt-0.5 text-[12px] text-gray-500">
                    {cargo.asal} ke {cargo.tujuan} - {cargo.berat}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-md bg-gray-50 px-3 py-4 text-center text-[13px] text-gray-500">
              Tidak ada kargo pada tanggal ini.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
