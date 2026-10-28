import React, { useState } from 'react';
import { X, Building2, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useData } from '../context/DataContext';
import { SectorType } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOrgProposed?: (orgId: string) => void;
}

export const ProposeOrgModal: React.FC<Props> = ({ isOpen, onClose, onOrgProposed }) => {
  const { proposeOrganisation, organisations } = useData();

  const [name, setName] = useState('');
  const [acronym, setAcronym] = useState('');
  const [sector, setSector] = useState<SectorType>('public');
  const [industry, setIndustry] = useState('Civil Service & Ministries');
  const [country] = useState('Nigeria');
  const [headquarters, setHeadquarters] = useState('');
  const [website, setWebsite] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  // Realtime duplicate check
  const duplicateMatch = name.trim()
    ? organisations.find(o =>
        o.name.toLowerCase() === name.trim().toLowerCase() ||
        (acronym.trim() && o.acronym?.toLowerCase() === acronym.trim().toLowerCase())
      )
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide an organisation name.');
      return;
    }

    if (duplicateMatch) {
      setError(`"${duplicateMatch.name}" is already in the directory. You can follow it directly.`);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const created = await proposeOrganisation({
        name: name.trim(),
        acronym: acronym.trim() || undefined,
        sector,
        industry,
        country,
        headquarters: headquarters.trim() || undefined,
        website: website.trim() || undefined,
        contactEmail: contactEmail.trim() || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onOrgProposed) onOrgProposed(created.id);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to propose organisation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Propose an Organisation</h2>
              <p className="text-xs text-slate-400">Establish a new workplace tracking profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-200">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-slate-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              Proposed organisations start as <strong>Unclaimed (Employee Community Only)</strong>. Any colleague can follow and report immediately. Company representatives can apply later for official verified badge.
            </div>
          </div>

          {duplicateMatch && (
            <div className="bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs p-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Matching organisation found: <strong>{duplicateMatch.name}</strong> ({duplicateMatch.acronym}). Avoid creating duplicate entries.
              </span>
            </div>
          )}

          {error && (
            <div className="bg-red-900/30 border border-red-500/40 text-red-200 text-xs p-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-semibold text-white">Organisation Proposed Successfully!</h3>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                The community tracking profile is now active. You and your colleagues can follow and post updates.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Organisation / Ministry Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Federal Ministry of Agriculture & Food Security"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Acronym / Short Name
                  </label>
                  <input
                    type="text"
                    value={acronym}
                    onChange={(e) => setAcronym(e.target.value)}
                    placeholder="e.g. FMAFS"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Sector *
                  </label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value as SectorType)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                  >
                    <option value="public">Public Sector (Federal/State/MDA)</option>
                    <option value="private">Private Sector (Corporate/SME)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Industry / Classification *
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition-colors"
                >
                  <option value="Civil Service & Ministries">Civil Service & Ministries</option>
                  <option value="Banking & Financial Services">Banking & Financial Services</option>
                  <option value="Healthcare & Hospitals">Healthcare & Hospitals</option>
                  <option value="Higher Education & Schools">Higher Education & Schools</option>
                  <option value="Energy, Oil & Gas">Energy, Oil & Gas</option>
                  <option value="Telecommunications & Tech">Telecommunications & Tech</option>
                  <option value="Manufacturing & Consumer Goods">Manufacturing & Consumer Goods</option>
                  <option value="Security & Parastatals">Security & Parastatals</option>
                  <option value="Other">Other Workplace Category</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  City / State Headquarters
                </label>
                <input
                  type="text"
                  value={headquarters}
                  onChange={(e) => setHeadquarters(e.target.value)}
                  placeholder="e.g. Area 11, Garki, Abuja"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Official Website
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Public Contact Email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="info@..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || Boolean(duplicateMatch)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  {submitting ? 'Creating Profile...' : 'Propose Organisation'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
