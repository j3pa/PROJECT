export default function StatusBar() {
  return (
    <div className="h-[36px] bg-white border-t border-gray-200 flex items-center justify-between px-6 flex-shrink-0 text-[11px]">
      <div className="flex items-center gap-1.5 text-gray-500">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span>Data diperbarui secara real-time</span>
        <span className="mx-2 text-gray-300">|</span>
        <span>Gudang Bandara Sudirman</span>
      </div>
      <span className="text-gray-400">Ekspedisi Petir V1 &nbsp;|&nbsp; Sistem Cargo Udara</span>
    </div>
  )
}