'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { ChangeEvent } from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div className="flex items-center gap-1 bg-white/50 backdrop-blur px-2 py-1 rounded-full border border-primary-200 shadow-sm">
      <Globe className="w-4 h-4 text-primary-500" />
      <select
        defaultValue={locale}
        onChange={onSelectChange}
        className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer appearance-none pr-1 focus:ring-0"
      >
        <option value="ja">JP</option>
        <option value="en">EN</option>
        <option value="th">TH</option>
      </select>
    </div>
  );
}
