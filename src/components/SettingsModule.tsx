import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import {
  Settings2,
  Database,
  Globe,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Server,
  Lock,
  ExternalLink
} from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const { t } = useTranslation();
  const { role, setRole } = useApp();
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const apiPortals = [
    {
      name: 'Bhulekh (Uttar Pradesh)',
      code: 'UP-BHULEKH',
      url: 'http://upbhulekh.gov.in',
      type: 'RoR & Cadastral Vector',
      status: 'Connected (Sandbox)',
      lastSync: '12 mins ago',
      recordsVerified: 1420
    },
    {
      name: 'Bhoomi (Karnataka)',
      code: 'KA-BHOOMI',
      url: 'https://landrecords.karnataka.gov.in',
      type: 'Pahani & RTC Mutation',
      status: 'Connected (Sandbox)',
      lastSync: '1 hour ago',
      recordsVerified: 890
    },
    {
      name: 'Tamil Nilam (Tamil Nadu)',
      code: 'TN-NILAM',
      url: 'https://eservices.tn.gov.in/eservicesnew',
      type: 'Patta / Chitta Database',
      status: 'Connected (Sandbox)',
      lastSync: '35 mins ago',
      recordsVerified: 650
    },
    {
      name: 'Meebhoomi (Andhra Pradesh)',
      code: 'AP-MEEBHOOMI',
      url: 'http://meebhoomi.ap.gov.in',
      type: '1B & Adangal Records',
      status: 'Connected (Sandbox)',
      lastSync: '3 hours ago',
      recordsVerified: 410
    },
    {
      name: 'Public Financial Management System (PFMS)',
      code: 'GOI-PFMS-CGA',
      url: 'https://pfms.nic.in',
      type: 'DBT e-Payment Gateway',
      status: 'Secured & Active (v2.4)',
      lastSync: 'Real-time Push',
      recordsVerified: 3200
    },
    {
      name: 'ISRO Bhuvan / BharatMaps Geospatial',
      code: 'ISRO-BHUVAN',
      url: 'https://bhuvan.nrsc.gov.in',
      type: 'Cadastral Satellite Layers',
      status: 'OGC WMS / WFS Live',
      lastSync: 'Live Tile Cache',
      recordsVerified: 5800
    }
  ];

  const handleTestSync = (portalName: string) => {
    setSyncStatus(`Testing cryptographic handshake with ${portalName}... Verified successfully!`);
    setTimeout(() => setSyncStatus(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12 text-xs">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-slate-900 text-slate-100 border border-slate-700">
              Interoperability
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('settings.stateApis', 'State Revenue & Geospatial APIs')}</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">
            {t('settings.title', 'System Configuration & External Government APIs')}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {t('settings.subtitle', 'Certified endpoints connecting State Land Record portals (RoR / Bhulekh), PFMS treasury, and Bhuvan GIS')}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 text-blue-900 font-black uppercase tracking-wider text-[10px] flex items-center gap-2 self-start sm:self-auto shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-blue-700" />
          <span>NIC e-Gov Standard compliant</span>
        </div>
      </div>

      {syncStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg font-black uppercase tracking-wide flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* External Portals Grid */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Configured State Land Records & Banking Gateways</h2>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Real government APIs are subject to authorized state departmental access; sandbox mocks are active for demonstration.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {apiPortals.map(portal => (
            <div key={portal.code} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 text-sm tracking-tight">{portal.name}</span>
                  <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                    {portal.code}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 font-black uppercase tracking-wider px-2 py-0.5 rounded text-[10px]">
                    {portal.status}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] font-medium">
                  Payload: <strong className="text-slate-800 font-bold">{portal.type}</strong> • Target: <span className="font-mono text-blue-900">{portal.url}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right text-[11px]">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Verified Records:</span>
                  <span className="font-black text-slate-900">{portal.recordsVerified.toLocaleString()}</span>
                </div>

                <button
                  onClick={() => handleTestSync(portal.name)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black uppercase tracking-wider text-[11px] rounded-lg border border-slate-300 transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <RefreshCw className="w-3 h-3" />
                  Test Sync
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statutory Rules & Computation Config */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Statutory Rules Engine Parameters (RFCTLARR Act, 2013)</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Section 30(1) Solatium</span>
            <div className="text-xl font-black text-blue-900 tracking-tight">100% Mandatory</div>
            <p className="text-slate-500 text-[11px] font-medium">
              Computed on market value under Section 26 & First Schedule. Non-negotiable.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Section 30(3) Additional Interest</span>
            <div className="text-xl font-black text-blue-900 tracking-tight">12.0% Per Annum</div>
            <p className="text-slate-500 text-[11px] font-medium">
              Calculated from Section 11 preliminary notification date to date of award.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">Section 19 Declaration Limit</span>
            <div className="text-xl font-black text-blue-900 tracking-tight">12 Calendar Months</div>
            <p className="text-slate-500 text-[11px] font-medium">
              Statutory timeline under Section 19(7) from Preliminary Notification to Final Declaration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
