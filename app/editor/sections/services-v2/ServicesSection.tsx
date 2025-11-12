/**
 * ServicesSection Component (Controlled Version)
 * 
 * Fully controlled component with no internal state.
 * Real-time sync between editor and preview.
 */

'use client';

import { useMemo, useCallback } from 'react';
import { Plus, Package, ExternalLink, Star } from 'lucide-react';
import { useSectionManagerControlled } from '@/app/editor/core/hooks';
import { ItemList } from '@/app/editor/core/components';
import { ServiceItem, convertFromLegacy, convertToLegacy, Service } from './types';
import { ServiceCard } from './ServiceCard';

interface ServicesSectionProps {
  data: any;
  onChange: (updater: (prev: any) => any) => void;
  viewMode?: 'edit' | 'preview';
  previewMode?: 'desktop' | 'mobile';
  renderMode?: 'editor' | 'preview';
  userId?: string;
  onScrollToSection?: (sectionId: string) => void;
}

export function ServicesSection({
  data,
  onChange,
  viewMode = 'edit',
  previewMode = 'desktop',
  renderMode = 'editor',
  userId,
  onScrollToSection,
}: ServicesSectionProps) {
  
  // Convert legacy data to new format (memoized)
  const services = useMemo(() => {
    const legacyServices = data.services || [];
    return legacyServices.map((s: Service) => convertFromLegacy(s));
  }, [data.services]);

  // Handle changes - update parent immediately
  const handleServicesChange = useCallback((newServices: ServiceItem[]) => {
    const legacy = newServices.map(convertToLegacy);
    onChange(prev => ({
      ...prev,
      services: legacy,
    }));
  }, [onChange]);

  // Use controlled hook
  const {
    items: currentServices,
    add,
    update,
    remove,
    reorder,
    reorderByIndex,
    itemCount,
  } = useSectionManagerControlled<ServiceItem>({
    items: services,
    onChange: handleServicesChange,
  });

  const handleAdd = () => {
    // Check if there's already an empty service
    const hasEmptyService = currentServices.some(s => 
      s.title.trim().length === 0 || s.description.trim().length === 0
    );
    
    if (hasEmptyService) {
      console.log('[ServicesSection] Empty service already exists, not adding new one');
      return; // Don't add new one, user should fill existing
    }
    
    add({
      title: '',
      description: '',
      icon: '',
      price: '',
      duration: '',
      features: [],
      cta_text: '',
      cta_url: '',
      is_featured: false,
    });
  };

  // In preview renderMode, render the preview component
  if (renderMode === 'preview' || viewMode === 'preview') {
    // Filter out empty services (title required)
    const validServices = currentServices.filter(s => 
      s.title.trim().length > 0
    );
    
    const isMobile = previewMode === 'mobile';
    
    // Show empty state only in Edit mode (right preview), hide in Preview mode
    if (validServices.length === 0) {
      // Hide in Preview mode or published site
      if (viewMode === 'preview') {
        return null;
      }
      
      // Show helpful empty state in Edit mode (right side)
      return (
        <div id="services" className={`w-full ${isMobile ? 'mb-6' : 'mb-12 sm:mb-16 lg:mb-20'}`}>
          {/* Section Header */}
          <div className={`flex items-center gap-3 ${isMobile ? 'mb-4' : 'mb-8'}`}>
            <div className={`rounded-lg bg-cyan-100 flex items-center justify-center ${
              isMobile ? 'w-6 h-6' : 'w-8 h-8'
            }`}>
              <Package className={isMobile ? 'w-3.5 h-3.5 text-cyan-600' : 'w-5 h-5 text-cyan-600'} />
            </div>
            <h2 className={`font-bold text-gray-900 ${
              isMobile ? 'text-lg' : 'text-3xl'
            }`}>Services</h2>
          </div>
          
          {/* Empty State */}
          <div className={`bg-cyan-50 border-2 border-dashed border-cyan-200 rounded-xl flex flex-col items-center justify-center ${
            isMobile ? 'p-6' : 'p-8'
          }`}>
            <Package className={`text-cyan-300 ${isMobile ? 'w-10 h-10 mb-2' : 'w-12 h-12 mb-3'}`} />
            <p className={`text-gray-600 mb-3 text-center ${isMobile ? 'text-sm' : 'text-base'}`}>
              No services added yet
            </p>
            <button
              onClick={() => {
                handleAdd();
                onScrollToSection?.('services');
              }}
              className={`flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 transition-colors ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}
            >
              <Plus className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
              <span>Add Your First Service</span>
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div id="services" className={`w-full ${isMobile ? 'mb-6' : 'mb-12 sm:mb-16 lg:mb-20'}`}>
        {/* Section Header */}
        <div className={`flex items-center gap-3 ${isMobile ? 'mb-4' : 'mb-8'}`}>
          <div className={`rounded-lg bg-cyan-100 flex items-center justify-center ${
            isMobile ? 'w-6 h-6' : 'w-8 h-8'
          }`}>
            <Package className={isMobile ? 'w-3.5 h-3.5 text-cyan-600' : 'w-5 h-5 text-cyan-600'} />
          </div>
          <h2 className={`font-bold text-gray-900 ${
            isMobile ? 'text-lg' : 'text-3xl'
          }`}>Services</h2>
        </div>
        
        <div className={`grid gap-4 ${
          isMobile ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3 gap-6'
        }`}>
          {validServices.map((service) => (
            <div
              key={service.id}
              className={`bg-white rounded-2xl shadow-sm border transition-shadow relative ${
                isMobile ? 'p-4' : 'p-6'
              } ${
                service.is_featured 
                  ? 'border-yellow-400 shadow-md ring-2 ring-yellow-200' 
                  : 'border-gray-200 hover:shadow-md'
              }`}
            >
              {/* Featured Badge */}
              {service.is_featured && (
                <div className="absolute top-3 right-3">
                  <div className="bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Featured</span>
                  </div>
                </div>
              )}

              {/* Icon */}
              {service.icon && (
                <div className={isMobile ? 'text-2xl mb-2' : 'text-3xl mb-3'}>{service.icon}</div>
              )}

              {/* Title */}
              <h3 className={`font-semibold text-gray-900 ${
                isMobile ? 'text-sm mb-1.5' : 'text-base mb-2'
              }`}>{service.title}</h3>

              {/* Price and Duration */}
              {(service.price || service.duration) && (
                <div className={`flex items-center gap-2 text-cyan-600 font-medium ${
                  isMobile ? 'text-xs mb-2' : 'text-sm mb-3'
                }`}>
                  {service.price && <span>{service.price}</span>}
                  {service.price && service.duration && <span>•</span>}
                  {service.duration && <span>{service.duration}</span>}
                </div>
              )}

              {/* Description */}
              <p className={`text-gray-600 leading-relaxed ${
                isMobile ? 'text-xs mb-3' : 'text-sm mb-4'
              }`}>{service.description}</p>

              {/* Features */}
              {service.features && service.features.length > 0 && (
                <ul className={`space-y-1.5 ${isMobile ? 'mb-3' : 'mb-4'}`}>
                  {service.features.map((feature, idx) => (
                    <li key={idx} className={`flex items-start gap-2 text-gray-700 ${
                      isMobile ? 'text-xs' : 'text-sm'
                    }`}>
                      <span className="flex-shrink-0 text-cyan-500 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* CTA Button */}
              {service.cta_text && service.cta_url && (
                <a
                  href={service.cta_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium ${
                    isMobile ? 'text-xs' : 'text-sm'
                  }`}
                >
                  <span>{service.cta_text}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Editor mode - render content only (wrapper handles header)
  return (
    <div className="space-y-3">
      <ItemList
        items={currentServices}
        onReorder={reorderByIndex}
        renderItem={(service, index) => (
          <ServiceCard
            service={service}
            onUpdate={update}
            onDelete={remove}
            onMoveUp={() => reorder(service.id, 'up')}
            onMoveDown={() => reorder(service.id, 'down')}
            canMoveUp={index > 0}
            canMoveDown={index < currentServices.length - 1}
          />
        )}
      />
      
      {/* Add button - Always visible */}
      {currentServices.length === 0 ? (
        <button
          onClick={handleAdd}
          className="w-full flex flex-col items-center justify-center gap-2 px-4 py-8 bg-white border-2 border-dashed border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 transition-all"
        >
          <Package className="w-12 h-12 text-cyan-300 mb-1" />
          <div className="text-center">
            <p className="font-medium">No services yet</p>
            <p className="text-sm text-gray-500">Click to add your first service</p>
          </div>
        </button>
      ) : (
        <button
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white border-2 border-dashed border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      )}
    </div>
  );
}

