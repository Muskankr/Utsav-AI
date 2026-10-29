'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Phone,
  Mail,
  Edit2,
  CheckCircle2,
  Clock,
  Info,
  X,
  Check,
  IndianRupee,
  MessageSquare,
} from 'lucide-react';
import { FullEvent, VendorItem, VendorStatus } from '@/types';
import { formatINR } from '@/lib/currencies';

interface VendorsViewProps {
  event: FullEvent;
  onUpdateVendors: (vendors: VendorItem[]) => void;
}

const VENDOR_CATEGORIES = [
  'Venue',
  'Catering',
  'Decoration & Florals',
  'Photography & Cinematography',
  'Music & DJ',
  'Pandit / Officiant',
  'Makeup & Styling',
  'Invitations & Favors',
  'Transport & Logistics',
  'Security & Bouncers',
  'Other Services',
];

const STATUS_METAS: Record<VendorStatus, { label: string; bg: string; text: string; border: string }> = {
  confirmed: {
    label: 'Confirmed Booking',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
  },
  negotiating: {
    label: 'Negotiating Terms',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
  },
  shortlisted: {
    label: 'Shortlisted Candidate',
    bg: 'bg-indigo-50',
    text: 'text-indigo-800',
    border: 'border-indigo-200',
  },
  prospective: {
    label: 'Prospective Lead',
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
  },
  declined: {
    label: 'Declined / Passed',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
  },
};

export function VendorsView({ event, onUpdateVendors }: VendorsViewProps) {
  const { vendors } = event;
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Edit vendor state
  const [editingVendor, setEditingVendor] = useState<VendorItem | null>(null);

  // Form states
  const [category, setCategory] = useState(VENDOR_CATEGORIES[0]);
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState<number>(50000);
  const [status, setStatus] = useState<VendorStatus>('prospective');
  const [notes, setNotes] = useState('');

  // Computations
  const totalVendors = vendors.length;
  const confirmedVendors = vendors.filter((v) => v.status === 'confirmed');
  const totalConfirmedSpend = confirmedVendors.reduce((acc, v) => acc + (v.estimatedPrice || 0), 0);
  const totalPipelineSpend = vendors.reduce((acc, v) => acc + (v.estimatedPrice || 0), 0);

  const filteredVendors = vendors.filter((v) => {
    if (filterStatus === 'all') return true;
    return v.status === filterStatus;
  });

  const handleOpenAdd = () => {
    setEditingVendor(null);
    setCategory(VENDOR_CATEGORIES[0]);
    setName('');
    setContactPerson('');
    setPhone('');
    setEmail('');
    setEstimatedPrice(50000);
    setStatus('prospective');
    setNotes('');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (v: VendorItem) => {
    setEditingVendor(v);
    setCategory(v.category);
    setName(v.name);
    setContactPerson(v.contactPerson);
    setPhone(v.phone);
    setEmail(v.email);
    setEstimatedPrice(v.estimatedPrice);
    setStatus(v.status);
    setNotes(v.notes || '');
    setIsAddOpen(true);
  };

  const handleSaveVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingVendor) {
      const updated = vendors.map((v) =>
        v.id === editingVendor.id
          ? {
              ...v,
              category,
              name: name.trim(),
              contactPerson: contactPerson.trim(),
              phone: phone.trim(),
              email: email.trim(),
              estimatedPrice: Number(estimatedPrice) || 0,
              status,
              notes: notes.trim(),
            }
          : v
      );
      onUpdateVendors(updated);
    } else {
      const newV: VendorItem = {
        id: `vendor-${Date.now()}`,
        category,
        name: name.trim(),
        contactPerson: contactPerson.trim(),
        phone: phone.trim(),
        email: email.trim(),
        estimatedPrice: Number(estimatedPrice) || 0,
        status,
        notes: notes.trim(),
      };
      onUpdateVendors([...vendors, newV]);
    }

    setIsAddOpen(false);
  };

  const handleDeleteVendor = (id: string) => {
    onUpdateVendors(vendors.filter((v) => v.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="rounded-xl bg-ivory-100 border border-ivory-300 p-3.5 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 leading-relaxed">
          <strong className="font-semibold text-indigo-950">Vendor Directory:</strong> Keep track of your own prospective leads and booked partners. Utsav AI provides tracking and vetting tools, but does not claim live external vendor booking or automated payment integration.
        </p>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-ivory-300 shadow-soft">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
            Confirmed Vendor Spend
          </span>
          <p className="font-serif text-2xl font-bold text-emerald-700">
            {formatINR(totalConfirmedSpend)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {confirmedVendors.length} of {totalVendors} vendors locked in
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-ivory-300 shadow-soft">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
            Total Pipeline Quotes
          </span>
          <p className="font-serif text-2xl font-bold text-indigo-950">
            {formatINR(totalPipelineSpend)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Sum of all prospective and confirmed quotes
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-ivory-300 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1 block">
              Negotiation Pipeline
            </span>
            <p className="font-serif text-2xl font-bold text-amber-600">
              {vendors.filter((v) => v.status === 'negotiating' || v.status === 'shortlisted').length}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Active vendor discussions
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vendor</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-ivory-300 shadow-soft">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: `All (${totalVendors})` },
            { id: 'confirmed', label: `Confirmed (${confirmedVendors.length})` },
            { id: 'negotiating', label: 'Negotiating' },
            { id: 'shortlisted', label: 'Shortlisted' },
            { id: 'prospective', label: 'Prospective' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterStatus(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                filterStatus === item.id
                  ? 'bg-indigo-950 text-white font-semibold'
                  : 'text-slate-600 hover:bg-ivory-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVendors.map((vendor) => {
          const statusMeta = STATUS_METAS[vendor.status] || STATUS_METAS.prospective;

          return (
            <div
              key={vendor.id}
              className="bg-white rounded-2xl p-5 border border-ivory-300 shadow-soft flex flex-col justify-between hover:border-ivory-400 transition-all space-y-4"
            >
              <div>
                {/* Header: Category & Status */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-ivory-100 px-2 py-0.5 rounded">
                    {vendor.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
                  >
                    {statusMeta.label}
                  </span>
                </div>

                {/* Vendor Name & Price */}
                <h4 className="font-serif text-base font-bold text-indigo-950 line-clamp-1">
                  {vendor.name}
                </h4>
                <div className="text-sm font-semibold text-rose-700 mt-1">
                  {formatINR(vendor.estimatedPrice)}
                </div>

                {/* Contact info */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600 border-t border-ivory-200 pt-3">
                  {vendor.contactPerson && (
                    <p className="font-medium text-slate-800">
                      Contact: {vendor.contactPerson}
                    </p>
                  )}

                  {vendor.phone && (
                    <div className="flex items-center justify-between">
                      <a
                        href={`tel:${vendor.phone}`}
                        className="inline-flex items-center gap-1.5 text-slate-600 hover:text-indigo-900"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{vendor.phone}</span>
                      </a>

                      <a
                        href={`https://wa.me/${vendor.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:underline"
                        title="Open WhatsApp"
                      >
                        <MessageSquare className="w-3 h-3" />
                        WhatsApp
                      </a>
                    </div>
                  )}

                  {vendor.email && (
                    <a
                      href={`mailto:${vendor.email}`}
                      className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-900 truncate"
                    >
                      <Mail className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{vendor.email}</span>
                    </a>
                  )}
                </div>

                {/* Notes */}
                {vendor.notes && (
                  <p className="mt-2.5 text-xs text-slate-500 italic bg-ivory-50 p-2 rounded-lg border border-ivory-200 line-clamp-2">
                    "{vendor.notes}"
                  </p>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-ivory-200">
                <button
                  onClick={() => handleOpenEdit(vendor)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-950 hover:bg-ivory-200 transition-colors"
                  title="Edit details"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteVendor(vendor.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Remove vendor"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVendors.length === 0 && (
        <div className="bg-white rounded-2xl p-10 text-center border border-ivory-300">
          <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500">
            No vendors found in this category.
          </p>
        </div>
      )}

      {/* Add / Edit Vendor Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-indigo-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-elevated border border-ivory-300 w-full max-w-md overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
              <h3 className="font-serif text-lg font-bold text-indigo-950">
                {editingVendor ? 'Edit Vendor Details' : 'Add New Vendor'}
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVendor} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Service Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs bg-ivory-50 focus:ring-1 focus:ring-rose-500"
                  >
                    {VENDOR_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Booking Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as VendorStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs bg-ivory-50 focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="prospective">Prospective Lead</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="negotiating">Negotiating Terms</option>
                    <option value="confirmed">Confirmed Booking</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Vendor / Business Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Marwar Caterers, Jaipur Florals"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vikram Singh"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="bookings@vendor.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Estimated / Quoted Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={estimatedPrice}
                    onChange={(e) => setEstimatedPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs font-semibold focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Contract Terms & Payment Milestones
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. ₹50,000 advance paid, balance due after reception. Includes 4K drone videography."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-ivory-200">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-ivory-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm"
                >
                  {editingVendor ? 'Save Changes' : 'Add Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

