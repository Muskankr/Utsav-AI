'use client';

import React, { useState } from 'react';
import {
  IndianRupee,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Info,
  Edit2,
  Check,
  X,
  PieChart,
} from 'lucide-react';
import { FullEvent, BudgetItem, BudgetCategoryKey } from '@/types';
import { formatINR, formatINRCompact } from '@/lib/currencies';

interface BudgetViewProps {
  event: FullEvent;
  onUpdateBudgetItems: (items: BudgetItem[]) => void;
  onUpdateTotalBudget: (newBudget: number) => void;
}

const CATEGORY_NAMES: Record<BudgetCategoryKey, string> = {
  venue: 'Venue & Facilities',
  catering: 'Catering & Beverages',
  decoration: 'Decor & Florals',
  photography: 'Photo & Cinematic Video',
  entertainment: 'Music, DJ & Artists',
  transport: 'Transport & Logistics',
  contingency: 'Contingency & Reserve',
  attire_beauty: 'Attire & Makeup',
  gifts_favors: 'Favors & Shagun',
};

export function BudgetView({
  event,
  onUpdateBudgetItems,
  onUpdateTotalBudget,
}: BudgetViewProps) {
  const { details, budgetItems } = event;
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editAllocated, setEditAllocated] = useState<number>(0);
  const [editSpent, setEditSpent] = useState<number>(0);
  const [editNotes, setEditNotes] = useState<string>('');

  // Add Item Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<BudgetCategoryKey>('venue');
  const [newName, setNewName] = useState('');
  const [newAllocated, setNewAllocated] = useState<number>(50000);
  const [newSpent, setNewSpent] = useState<number>(0);
  const [newNotes, setNewNotes] = useState('');

  // Budget editing state
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(details.budget);

  // Totals calculations
  const totalBudget = details.budget;
  const totalAllocated = budgetItems.reduce((acc, item) => acc + (Number(item.allocated) || 0), 0);
  const totalSpent = budgetItems.reduce((acc, item) => acc + (Number(item.spent) || 0), 0);
  const remainingBudget = totalBudget - totalSpent;
  const isOverBudget = remainingBudget < 0;

  const handleStartEdit = (item: BudgetItem) => {
    setEditingItemId(item.id);
    setEditAllocated(item.allocated);
    setEditSpent(item.spent);
    setEditNotes(item.notes || '');
  };

  const handleSaveEdit = (id: string) => {
    const updated = budgetItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          allocated: Number(editAllocated) || 0,
          spent: Number(editSpent) || 0,
          notes: editNotes.trim(),
        };
      }
      return item;
    });
    onUpdateBudgetItems(updated);
    setEditingItemId(null);
  };

  const handleDeleteItem = (id: string) => {
    const updated = budgetItems.filter((item) => item.id !== id);
    onUpdateBudgetItems(updated);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: BudgetItem = {
      id: `budget-${Date.now()}`,
      category: newCategory,
      name: newName.trim(),
      allocated: Number(newAllocated) || 0,
      spent: Number(newSpent) || 0,
      notes: newNotes.trim(),
    };

    onUpdateBudgetItems([...budgetItems, newItem]);
    setIsAddOpen(false);
    setNewName('');
    setNewAllocated(50000);
    setNewSpent(0);
    setNewNotes('');
  };

  const handleSaveBudget = () => {
    if (tempBudget > 0) {
      onUpdateTotalBudget(tempBudget);
      setIsEditingBudget(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Disclaimer */}
      <div className="rounded-xl bg-amber-50/80 border border-amber-200/80 p-3.5 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 leading-relaxed">
          <strong className="font-semibold">Planning Cost Disclaimer:</strong> All figures presented are approximate cost estimates based on typical Indian market norms. They are intended for budgeting and feasibility analysis, and do not represent guaranteed quotations or legal vendor bindings.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Target Budget */}
        <div className="bg-white rounded-2xl p-5 border border-ivory-300 shadow-soft">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            <span>Overall Target Budget</span>
            <button
              onClick={() => {
                setTempBudget(details.budget);
                setIsEditingBudget(!isEditingBudget);
              }}
              className="text-rose-600 hover:text-rose-700 text-xs font-medium flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" />
              <span>{isEditingBudget ? 'Cancel' : 'Change'}</span>
            </button>
          </div>

          {isEditingBudget ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                value={tempBudget}
                onChange={(e) => setTempBudget(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-ivory-300 text-sm font-bold text-indigo-950 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
              <button
                onClick={handleSaveBudget}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold"
              >
                Save
              </button>
            </div>
          ) : (
            <div>
              <p className="font-serif text-2xl font-bold text-indigo-950">
                {formatINR(totalBudget)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Allocated across categories: {formatINR(totalAllocated)}
              </p>
            </div>
          )}
        </div>

        {/* Total Committed / Spent */}
        <div className="bg-white rounded-2xl p-5 border border-ivory-300 shadow-soft">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Total Committed / Spent
          </div>
          <p className="font-serif text-2xl font-bold text-slate-800">
            {formatINR(totalSpent)}
          </p>
          <div className="w-full h-2 rounded-full bg-ivory-200 overflow-hidden mt-2">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isOverBudget ? 'bg-rose-500' : 'bg-festive-saffron'
              }`}
              style={{
                width: `${totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Remaining Contingency / Balance */}
        <div className={`rounded-2xl p-5 border shadow-soft ${
          isOverBudget
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : 'bg-emerald-50 border-emerald-200 text-emerald-950'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider mb-2">
            <span>{isOverBudget ? 'Budget Deficit / Overspend' : 'Available Unspent Balance'}</span>
            {isOverBudget ? (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            )}
          </div>
          <p className={`font-serif text-2xl font-bold ${isOverBudget ? 'text-rose-700' : 'text-emerald-700'}`}>
            {formatINR(Math.abs(remainingBudget))}
          </p>
          <p className="text-xs mt-1 opacity-80">
            {isOverBudget
              ? 'Warning: Total spent exceeds overall budget cap.'
              : `${formatINR(totalBudget - totalAllocated)} unallocated in plans.`}
          </p>
        </div>
      </div>

      {/* Main Budget Items Table */}
      <div className="bg-white rounded-2xl border border-ivory-300 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-ivory-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-indigo-950">
              Celebration Expense Allocations
            </h3>
            <p className="text-xs text-slate-500">
              {budgetItems.length} categories tracked in Indian Rupees (₹)
            </p>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense Item</span>
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-ivory-100 text-slate-600 uppercase text-[11px] font-semibold border-b border-ivory-200 tracking-wider">
              <tr>
                <th className="px-5 py-3">Category & Item</th>
                <th className="px-5 py-3 text-right">Allocated (₹)</th>
                <th className="px-5 py-3 text-right">Spent / Committed (₹)</th>
                <th className="px-5 py-3 text-right">Balance (₹)</th>
                <th className="px-5 py-3">Notes & Details</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {budgetItems.map((item) => {
                const isEditing = editingItemId === item.id;
                const balance = item.allocated - item.spent;
                const isItemOver = balance < 0;

                return (
                  <tr key={item.id} className="hover:bg-ivory-50/70 transition-colors">
                    {/* Category & Name */}
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-indigo-950">
                        {item.name}
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                        {CATEGORY_NAMES[item.category] || item.category}
                      </span>
                    </td>

                    {/* Allocated */}
                    <td className="px-5 py-3.5 text-right font-medium text-slate-800">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editAllocated}
                          onChange={(e) => setEditAllocated(Number(e.target.value))}
                          className="w-24 px-2 py-1 text-right text-xs rounded border border-ivory-300 focus:ring-1 focus:ring-rose-500"
                        />
                      ) : (
                        formatINR(item.allocated)
                      )}
                    </td>

                    {/* Spent */}
                    <td className="px-5 py-3.5 text-right font-medium text-slate-800">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editSpent}
                          onChange={(e) => setEditSpent(Number(e.target.value))}
                          className="w-24 px-2 py-1 text-right text-xs rounded border border-ivory-300 focus:ring-1 focus:ring-rose-500"
                        />
                      ) : (
                        formatINR(item.spent)
                      )}
                    </td>

                    {/* Balance */}
                    <td className="px-5 py-3.5 text-right font-semibold">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                          isItemOver
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {formatINR(balance)}
                      </span>
                    </td>

                    {/* Notes */}
                    <td className="px-5 py-3.5 max-w-xs truncate text-xs text-slate-500">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          className="w-full px-2 py-1 text-xs rounded border border-ivory-300 focus:ring-1 focus:ring-rose-500"
                        />
                      ) : (
                        item.notes || <span className="text-slate-300">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleSaveEdit(item.id)}
                            className="p-1 rounded text-emerald-600 hover:bg-emerald-50"
                            title="Save changes"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingItemId(null)}
                            className="p-1 rounded text-slate-400 hover:bg-ivory-200"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="p-1 rounded text-slate-500 hover:text-indigo-950 hover:bg-ivory-200 transition-colors"
                            title="Edit allocation"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-ivory-100/90 font-bold text-xs sm:text-sm border-t-2 border-ivory-300 text-indigo-950">
              <tr>
                <td className="px-5 py-3.5">Grand Total ({budgetItems.length} Categories)</td>
                <td className="px-5 py-3.5 text-right font-serif text-sm sm:text-base">
                  {formatINR(totalAllocated)}
                </td>
                <td className="px-5 py-3.5 text-right font-serif text-sm sm:text-base">
                  {formatINR(totalSpent)}
                </td>
                <td className="px-5 py-3.5 text-right font-serif text-sm sm:text-base">
                  <span className={isOverBudget ? 'text-rose-600' : 'text-emerald-700'}>
                    {formatINR(totalAllocated - totalSpent)}
                  </span>
                </td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-indigo-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-elevated border border-ivory-300 w-full max-w-md overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-ivory-200">
              <h3 className="font-serif text-lg font-bold text-indigo-950">
                Add Expense Category
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Budget Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as BudgetCategoryKey)}
                  className="w-full px-3 py-2 rounded-xl border border-ivory-300 bg-ivory-50 text-indigo-950 text-xs font-medium focus:ring-1 focus:ring-rose-500"
                >
                  {Object.entries(CATEGORY_NAMES).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Item Description / Vendor Purpose
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Traditional Dhol Players, Silver Shagun Coins"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Allocated Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={newAllocated}
                    onChange={(e) => setNewAllocated(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs font-semibold focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Already Spent / Paid (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={newSpent}
                    onChange={(e) => setNewSpent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-ivory-300 text-xs font-semibold focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Notes & Terms
                </label>
                <input
                  type="text"
                  placeholder="e.g. Includes 18% GST and night transport allowance"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
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
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

