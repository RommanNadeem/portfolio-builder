'use client';

import { useState } from 'react';
import { Plus, X, Edit2, Check, Building2 } from 'lucide-react';

interface CompaniesEditorProps {
  companies: string[];
  onAdd: (company: string) => void;
  onRemove: (company: string) => void;
  onUpdate?: (oldCompany: string, newCompany: string) => void;
  isExpanded: boolean;
}

export function CompaniesEditor({ companies, onAdd, onRemove, onUpdate, isExpanded }: CompaniesEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAddCompany = () => {
    if (newCompany.trim()) {
      onAdd(newCompany.trim());
      setNewCompany('');
      setIsAdding(false);
    }
  };

  const startEdit = (index: number, company: string) => {
    setEditingIndex(index);
    setEditValue(company);
  };

  const saveEdit = (oldCompany: string) => {
    if (editValue.trim() && editValue !== oldCompany && onUpdate) {
      onUpdate(oldCompany, editValue.trim());
    }
    setEditingIndex(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  if (!isExpanded) {
    return (
      <div className="text-sm text-gray-600">
        {companies.length} {companies.length === 1 ? 'company' : 'companies'}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2 text-xs text-gray-500 mb-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
        <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-gray-700 mb-1">Company Slider</p>
          <p>Companies appear as a scrolling slider at the top of your portfolio. Click to edit inline.</p>
        </div>
      </div>

      {/* Company Chips */}
      <div className="flex flex-wrap gap-2">
        {companies.map((company, index) => (
          <div
            key={index}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              editingIndex === index
                ? 'bg-blue-50 border-2 border-blue-500 ring-2 ring-blue-100'
                : 'bg-gray-50 border border-gray-300 hover:border-gray-400 hover:shadow-sm'
            }`}
          >
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(company);
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  className="bg-white border-none outline-none focus:ring-0 px-2 py-0.5 text-sm font-medium min-w-[120px] rounded"
                  autoFocus
                  placeholder="Company name"
                />
                <button
                  onClick={() => saveEdit(company)}
                  className="text-green-600 hover:text-green-700 transition-colors"
                  title="Save (Enter)"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={cancelEdit}
                  className="text-gray-500 hover:text-red-600 transition-colors"
                  title="Cancel (Esc)"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                <span className="text-gray-700">{company}</span>
                <button
                  onClick={() => startEdit(index, company)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Edit company name"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onRemove(company)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  title="Remove company"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add New Company */}
      {isAdding ? (
        <div className="flex items-center gap-2 p-3 bg-gray-50 border-2 border-gray-300 rounded-lg">
          <input
            type="text"
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddCompany();
              if (e.key === 'Escape') {
                setIsAdding(false);
                setNewCompany('');
              }
            }}
            placeholder="e.g., Google, Meta, Apple..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            onClick={handleAddCompany}
            disabled={!newCompany.trim()}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
          <button
            onClick={() => {
              setIsAdding(false);
              setNewCompany('');
            }}
            className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white border-2 border-dashed border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Company</span>
        </button>
      )}
    </div>
  );
}

