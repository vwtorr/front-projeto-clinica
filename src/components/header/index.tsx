import Image from 'next/image';
import LabSysLogo from '@/assets/LabSys.png';

export default function Header() {
  return (
    <div className="bg-white flex justify-between px-4">
      <figure className="flex items-center gap-4 mt-2">
        <Image
          id="logo"
          src={LabSysLogo}
          alt="LabSys"
          title="LabSys"
          width={150}
          height={150}
          className="rounded-full"
        />
      </figure>
    </div>
  );
}
