import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Upload,
  Download,
  Eye,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Search
} from 'lucide-react';

interface RRDocumentsProps {
  selectedProjectId: string;
}

export const RRDocuments: React.FC<RRDocumentsProps> = ({ selectedProjectId }) => {
  const {
    projects,
    rrDocuments,
    addRRDocument
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: '',
    type: 'R&R Scheme Gazette Notification',
    projectId: projects[0]?.id || 'PRJ-2025-0101',
    fileSize: '3.4 MB'
  });

  const filteredDocs = rrDocuments.filter(doc => {
    if (selectedProjectId !== 'ALL' && doc.projectId !== selectedProjectId) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return doc.title.toLowerCase().includes(q) || doc.type.toLowerCase().includes(q) || doc.id.toLowerCase().includes(q);
    }
    return true;
  });

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title.trim()) return;

    await addRRDocument({
      projectId: newDoc.projectId,
      title: newDoc.title,
      type: newDoc.type,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: newDoc.fileSize,
      fileUrl: '#'
    });

    setNewDoc({
      title: '',
      type: 'R&R Scheme Gazette Notification',
      projectId: projects[0]?.id || 'PRJ-2025-0101',
      fileSize: '2.8 MB'
    });
    setIsUploading(false);
  };

  return (
    <div className="space-y-4" id="rr-documents-section">
      {/* Header & Upload Button */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search documents, gazette orders, plans..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 font-medium focus:outline-blue-600"
            />
          </div>
        </div>

        <button
          onClick={() => setIsUploading(!isUploading)}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Statutory Document</span>
        </button>
      </div>

      {/* Upload Form Box */}
      {isUploading && (
        <form onSubmit={handleUploadSubmit} className="bg-slate-50 border border-blue-200 rounded-lg p-4 space-y-3 animate-in fade-in duration-150 text-xs">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            Upload Document to Statutory Archive
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Project</label>
              <select
                value={newDoc.projectId}
                onChange={e => setNewDoc({ ...newDoc, projectId: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Document Category</label>
              <select
                value={newDoc.type}
                onChange={e => setNewDoc({ ...newDoc, type: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5"
              >
                <option value="R&R Scheme Gazette Notification">R&R Scheme Gazette Notification</option>
                <option value="Civic Amenities Master Plan">Civic Amenities Master Plan</option>
                <option value="Township Master Layout">Township Master Layout</option>
                <option value="SIA Statutory Approval">SIA Statutory Approval</option>
                <option value="Disbursement Verification Certificate">Disbursement Verification Certificate</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Document Title</label>
              <input
                type="text"
                value={newDoc.title}
                onChange={e => setNewDoc({ ...newDoc, title: e.target.value })}
                placeholder="e.g. Gazette Notification No. LA/2025/RR/104"
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsUploading(false)}
              className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 font-bold hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold transition shadow-xs cursor-pointer"
            >
              Save & Upload
            </button>
          </div>
        </form>
      )}

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map(doc => (
          <div
            key={doc.id}
            className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex items-start justify-between gap-3 hover:border-blue-300 transition"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {doc.type} • {doc.projectId}
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-0.5">{doc.title}</h4>
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500 font-medium">
                  <span>Uploaded: {doc.uploadDate}</span>
                  <span>•</span>
                  <span>{doc.fileSize}</span>
                  <span>•</span>
                  <span className="text-emerald-700 flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(doc.title + '\nProject: ' + doc.projectId + '\nStatutory RFCTLARR Compliance Document.')}`}
                download={`${doc.id}_${doc.title.replace(/\s+/g, '_')}.txt`}
                className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                title="Download Document"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
