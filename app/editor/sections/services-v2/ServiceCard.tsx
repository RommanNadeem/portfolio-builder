/**
 * ServiceCard Component (V2)
 * 
 * Card component for displaying and editing a single service.
 */

'use client';

import { X, Plus, Trash2, Star } from 'lucide-react';
import { ItemCard } from '@/app/editor/core/components';
import EmojiPicker from '../../components/EmojiPicker';
import { ServiceItem } from './types';

interface ServiceCardProps {
  service: ServiceItem;
  onUpdate: (id: string, updates: Partial<ServiceItem>) => void;
  onDelete: (id: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export function ServiceCard({
  service,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: ServiceCardProps) {
  
  const handleUpdate = (field: keyof ServiceItem, value: any) => {
    onUpdate(service.id, { [field]: value });
  };

  const handleAddFeature = () => {
    const features = service.features || [];
    handleUpdate('features', [...features, '']);
  };

  const handleUpdateFeature = (index: number, value: string) => {
    const features = [...(service.features || [])];
    features[index] = value;
    handleUpdate('features', features);
  };

  const handleRemoveFeature = (index: number) => {
    const features = [...(service.features || [])];
    features.splice(index, 1);
    handleUpdate('features', features);
  };

  return (
    <ItemCard
      id={service.id}
      onDelete={() => onDelete(service.id)}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
      isDraggable={true}
      className={`bg-gradient-to-br ${service.is_featured ? 'from-yellow-50 to-orange-50 border-2 border-orange-300' : 'from-white to-purple-50'}`}
    >
      <div className="space-y-3">
        {/* Icon and Title Row */}
        <div className="flex items-center gap-3">
          {/* Emoji Picker */}
          <div className="relative flex-shrink-0">
            <EmojiPicker
              value={service.icon || ''}
              onChange={(icon) => handleUpdate('icon', icon)}
            />
            {/* Remove emoji button */}
            {service.icon && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdate('icon', '');
                }}
                className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm z-10"
                title="Remove emoji"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div>

          {/* Title Input */}
          <input
            type="text"
            value={service.title}
            onChange={(e) => handleUpdate('title', e.target.value)}
            placeholder="UX Design & Consultation"
            className="flex-1 px-3 py-2 text-sm font-semibold text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-500"
          />

          {/* Featured Toggle */}
          <button
            onClick={() => handleUpdate('is_featured', !service.is_featured)}
            className={`p-2 rounded-lg transition-all ${
              service.is_featured 
                ? 'bg-yellow-400 text-white' 
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
            title={service.is_featured ? 'Featured service' : 'Mark as featured'}
          >
            <Star className={`w-4 h-4 ${service.is_featured ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Description
          </label>
          <textarea
            value={service.description}
            onChange={(e) => handleUpdate('description', e.target.value)}
            placeholder="End-to-end UX design services including research, wireframing, prototyping..."
            rows={3}
            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none placeholder:text-gray-500"
          />
        </div>

        {/* Price and Duration Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Price (Optional)
            </label>
            <input
              type="text"
              value={service.price || ''}
              onChange={(e) => handleUpdate('price', e.target.value)}
              placeholder="$500"
              className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Duration (Optional)
            </label>
            <input
              type="text"
              value={service.duration || ''}
              onChange={(e) => handleUpdate('duration', e.target.value)}
              placeholder="2 weeks"
              className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Features (Optional)
          </label>
          <div className="space-y-2">
            {(service.features || []).map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleUpdateFeature(index, e.target.value)}
                  placeholder="Feature or benefit..."
                  className="flex-1 px-3 py-1.5 text-sm text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-500"
                />
                <button
                  onClick={() => handleRemoveFeature(index)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove feature"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={handleAddFeature}
              className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-dashed border-gray-300 text-gray-600 text-xs rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              <Plus className="w-3 h-3" />
              <span>Add Feature</span>
            </button>
          </div>
        </div>

        {/* CTA Button */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Button Text (Optional)
            </label>
            <input
              type="text"
              value={service.cta_text || ''}
              onChange={(e) => handleUpdate('cta_text', e.target.value)}
              placeholder="Book Now"
              className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Button URL (Optional)
            </label>
            <input
              type="url"
              value={service.cta_url || ''}
              onChange={(e) => handleUpdate('cta_url', e.target.value)}
              placeholder="https://calendly.com/..."
              className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>
    </ItemCard>
  );
}

