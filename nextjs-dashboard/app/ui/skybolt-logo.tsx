import { Plane } from 'lucide-react';

export default function SkyboltLogo() {
  return (
    <div className="flex flex-row items-center leading-none text-white">
      <div className="bg-blue-600 p-2 rounded-full mr-2">
        <Plane className="h-6 w-6 rotate-[15deg]" />
      </div>
      <p className="text-[24px] font-bold tracking-tighter">SKYBOLT</p>
    </div>
  );
}