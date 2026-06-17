import { Plane } from 'lucide-react';

export default function SkyboltLogo() {
  return (
    <div className="flex h-10 flex-row items-center leading-none text-white">
      <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
        <Plane className="h-6 w-6 rotate-[15deg]" />
      </div>
      <p className="text-[24px] font-bold leading-none tracking-tighter">SKYBOLT</p>
    </div>
  );
}
