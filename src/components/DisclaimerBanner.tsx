import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Info, X } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-50/90 border-b border-amber-200 px-4 py-2 text-xs text-amber-950 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 flex-1">
          <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-amber-200/90 text-amber-950 uppercase tracking-widest border border-amber-300">
            {t('disclaimer.notice', 'Notice')}
          </span>
          <p className="line-clamp-1 md:line-clamp-none text-slate-800 text-xs font-semibold">
            <strong className="font-black text-amber-900 uppercase tracking-wide mr-1.5">
              {t('disclaimer.demoTitle', 'DEMO ENVIRONMENT — DATA IS NOT OFFICIAL GOVERNMENT DATA:')}
            </strong>
            {t('disclaimer.demoText', 'This portal prototype is for demonstration purposes under the RFCTLARR Act, 2013 framework. OpenStreetMap geospatial data is live; all land parcels, project alignments, and survey records are simulated.')}
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-800 hover:text-amber-950 p-1 rounded hover:bg-amber-200/60 transition-colors flex-shrink-0 cursor-pointer"
          title={t('common.dismiss', 'Dismiss')}
          aria-label={t('common.dismiss', 'Dismiss')}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
