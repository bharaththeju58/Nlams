import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { CompensationRecord } from '../types';
import {
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  RefreshCw,
  Search,
  Filter,
  CreditCard,
  Building,
  CheckCircle,
  FileText,
  Eye
} from 'lucide-react';
import { canPerformAction } from '../utils/rbacPermissions';

export const CompensationModule: React.FC = () => {
  const { t } = useTranslation();
  const {
    compensations,
    disburseCompensation,
    parcels,
    role,
    portalUserType
  } = useApp();

  const canDisburse = canPerformAction(role, portalUserType, 'canAuthorizePFMS');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [simulatingRecordId, setSimulatingRecordId] = useState<string | null>(null);
  const [pfmsReceiptModal, setPfmsReceiptModal] = useState<CompensationRecord | null>(null);

  const filteredCompensations = compensations.filter(c => {
    const matchStatus = filterStatus === 'All' || c.status === filterStatus;
    const matchSearch =
      c.beneficiaryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.parcelId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.utrNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalApproved = compensations.reduce((acc, c) => acc + c.amount, 0);
  const totalDisbursed = compensations
    .filter(c => c.status === 'Disbursed')
    .reduce((acc, c) => acc + c.amount, 0);
  const totalPending = compensations
    .filter(c => c.status === 'Initiated' || c.status === 'Processing')
    .reduce((acc, c) => acc + c.amount, 0);
  const totalDisputed = compensations
    .filter(c => c.status === 'On Hold' || c.status === 'Failed')
    .reduce((acc, c) => acc + c.amount, 0);

  const handleDisburseClick = (record: CompensationRecord) => {
    setSimulatingRecordId(record.id);

    // Simulate PFMS / e-Kuber gateway handshake
    setTimeout(() => {
      disburseCompensation(record.id);
      setSimulatingRecordId(null);
      // Open PFMS digital receipt
      setPfmsReceiptModal({
        ...record,
        status: 'Disbursed',
        disbursedDate: new Date().toISOString().split('T')[0],
        utrNumber: `PFMS${Date.now().toString().slice(-8)}IN`
      });
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-900 border border-emerald-200">
              PFMS / RBI e-Kuber Sandbox
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('compensation.dbt', 'Direct Benefit Transfer (DBT)')}</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">
            {t('compensation.title', 'Compensation Tracking & PFMS Direct Payment Gateway')}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            {t('compensation.subtitle', 'Real-time tracking of statutory land acquisition compensations, Aadhaar verification, and Treasury bank transfers')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {role === 'Central Sponsoring Ministry' && (
            <div className="bg-purple-50 border border-purple-300 rounded-lg px-3 py-1.5 text-xs text-purple-900 flex items-center gap-2 font-black tracking-tight shadow-2xs">
              <Eye className="w-4 h-4 text-purple-700 flex-shrink-0" />
              <span>National Read-Only Monitoring Mode</span>
            </div>
          )}
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 flex items-center gap-2 font-black uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>PFMS Gateway v2.4 <strong className="text-emerald-700">Connected</strong></span>
          </div>
        </div>
      </div>

      {/* Financial Overview 4-Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border-l-4 border-slate-900 border-y border-r border-slate-200 rounded-lg p-4 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">{t('compensation.totalApproved', 'Total Approved Compensation')}</span>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            ₹{(totalApproved / 10000000).toFixed(2)} Cr
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1 block">{compensations.length} total awards</span>
        </div>

        <div className="bg-white border-l-4 border-emerald-600 border-y border-r border-slate-200 rounded-lg p-4 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 block mb-1">{t('compensation.disbursed', 'Successfully Disbursed')}</span>
          <div className="text-2xl font-black text-emerald-800 tracking-tight">
            ₹{(totalDisbursed / 10000000).toFixed(2)} Cr
          </div>
          <span className="text-[10px] text-emerald-600 font-black uppercase tracking-wider mt-1 block">
            {Math.round((totalDisbursed / (totalApproved || 1)) * 100)}% Settled via PFMS
          </span>
        </div>

        <div className="bg-white border-l-4 border-amber-500 border-y border-r border-slate-200 rounded-lg p-4 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 block mb-1">{t('compensation.pending', 'In Payment Pipeline')}</span>
          <div className="text-2xl font-black text-amber-800 tracking-tight">
            ₹{(totalPending / 10000000).toFixed(2)} Cr
          </div>
          <span className="text-[10px] text-amber-600 font-black uppercase tracking-wider mt-1 block">Awaiting Treasury release</span>
        </div>

        <div className="bg-white border-l-4 border-red-600 border-y border-r border-slate-200 rounded-lg p-4 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-widest text-red-700 block mb-1">{t('compensation.disputed', 'Disputed / Escrow Held')}</span>
          <div className="text-2xl font-black text-red-800 tracking-tight">
            ₹{(totalDisputed / 10000000).toFixed(2)} Cr
          </div>
          <span className="text-[10px] text-red-600 font-black uppercase tracking-wider mt-1 block">Court / Title dispute stay</span>
        </div>
      </div>

      {/* Payees / Beneficiaries Ledger */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">Beneficiary Payment Ledger (Section 77/78)</h2>
            <span className="bg-slate-100 text-slate-800 text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
              {filteredCompensations.length} Beneficiaries
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="Search beneficiary or UTR..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-2.5 py-1 text-slate-800 font-bold focus:outline-blue-600 shadow-2xs"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-bold shadow-2xs"
            >
              <option value="All">All Statuses</option>
              <option value="Disbursed">Disbursed (Paid)</option>
              <option value="Processing">Under Processing</option>
              <option value="Initiated">Initiated</option>
              <option value="On Hold">On Hold (Court Stay)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Beneficiary ID</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Landowner Name & Parcel</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Bank & Account</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Aadhaar Verification</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Compensation (₹)</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">PFMS Status</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">UTR Reference</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-right">PFMS Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCompensations.map(record => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-black text-blue-900">
                    {record.beneficiaryId}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900 block">{record.beneficiaryName}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">{record.parcelId}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    <span className="font-bold block text-slate-800">{record.bankName}</span>
                    <span className="font-mono text-[10px] text-slate-400 font-medium">
                      {record.bankAccountNumberMasked} • {record.ifscMasked}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                      record.aadhaarVerified
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-amber-50 text-amber-800'
                    }`}>
                      <ShieldCheck className="w-3 h-3" />
                      {record.aadhaarVerified ? 'UIDAI Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-black text-slate-900">
                    ₹{(record.amount / 100000).toFixed(2)} Lakhs
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      record.status === 'Disbursed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : record.status === 'Processing'
                        ? 'bg-blue-100 text-blue-800'
                        : record.status === 'On Hold'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[10px] font-bold text-slate-600">
                    {record.utrNumber}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {record.status === 'Disbursed' ? (
                      <button
                        onClick={() => setPfmsReceiptModal(record)}
                        className="text-xs font-black uppercase tracking-wider text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Receipt
                      </button>
                    ) : record.status === 'On Hold' ? (
                      <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded">
                        Dispute Hold
                      </span>
                    ) : !canDisburse ? (
                      <span
                        className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded inline-block"
                        title="Section 77(2) PFMS payment authorization is restricted to Competent Authority (CALA)"
                      >
                        Read-Only (CALA Req.)
                      </span>
                    ) : (
                      <button
                        disabled={simulatingRecordId === record.id}
                        onClick={() => handleDisburseClick(record)}
                        className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-black uppercase tracking-wider text-[10px] rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
                      >
                        {simulatingRecordId === record.id ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Send className="w-3 h-3" />
                            Initiate PFMS
                          </>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PFMS Digital Transaction Receipt Modal */}
      {pfmsReceiptModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4 text-xs">
            <div className="text-center border-b border-slate-200 pb-3">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">PFMS / e-Kuber Payment Voucher</h3>
              <p className="text-[11px] text-slate-500">Government of India — Public Financial Management System</p>
            </div>

            <div className="space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction Reference (UTR):</span>
                <span className="font-mono font-bold text-blue-900">{pfmsReceiptModal.utrNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Beneficiary:</span>
                <span className="font-bold text-slate-900">{pfmsReceiptModal.beneficiaryName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Land Parcel ID:</span>
                <span className="font-mono text-slate-700">{pfmsReceiptModal.parcelId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Destination Account:</span>
                <span className="font-mono text-slate-700">
                  {pfmsReceiptModal.bankName} ({pfmsReceiptModal.bankAccountNumberMasked})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Channel:</span>
                <span className="text-slate-700 font-semibold">NEFT / RBI e-Kuber Settlement</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-black">
                <span className="text-slate-900">Amount Disbursed:</span>
                <span className="text-emerald-800">₹{(pfmsReceiptModal.amount / 100000).toFixed(2)} Lakhs</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 italic text-center">
              Verified electronically with UIDAI Aadhaar Vault and State Treasury Single Account (TSA).
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPfmsReceiptModal(null)}
                className="w-full px-4 py-2 bg-blue-800 text-white font-bold rounded shadow-xs"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
