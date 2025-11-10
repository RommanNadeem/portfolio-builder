'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, GripVertical, FileEdit, Star, ChevronDown, ChevronUp } from 'lucide-react';
import MonthYearPicker from '../../components/MonthYearPicker';
import { CareerHighlight } from './types';

interface CareerEditorProps {
  highlights: CareerHighlight[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<CareerHighlight>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  isExpanded: boolean;
  viewMode?: 'edit' | 'preview';
}

export function CareerEditor({ 
  highlights, 
  onAdd, 
  onUpdate, 
  onDelete, 
  onMove,
  isExpanded,
  viewMode = 'edit'
}: CareerEditorProps) {
  const router = useRouter();
  const [expandedAchievements, setExpandedAchievements] = useState<Set<string>>(new Set());
  
  if (!isExpanded) {
    return (
      <div className="text-sm text-gray-600">
        {highlights.length} {highlights.length === 1 ? 'highlight' : 'highlights'}
      </div>
    );
  }

  // Helper function to get featured achievements (top 3)
  const getFeaturedAchievements = (highlight: CareerHighlight): string[] => {
    // Use key_achievements if available, otherwise fall back to achievements
    const achievements = highlight.key_achievements || highlight.achievements || [];
    if (achievements.length === 0) return [];
    
    // If featured_achievements is set, use those indices
    if (highlight.featured_achievements && highlight.featured_achievements.length > 0) {
      return highlight.featured_achievements
        .filter(idx => idx < achievements.length)
        .map(idx => achievements[idx]);
    }
    
    // Otherwise, return first 3
    return achievements.slice(0, 3);
  };

  // Helper function to check if achievement is featured
  const isAchievementFeatured = (highlight: CareerHighlight, index: number): boolean => {
    if (!highlight.featured_achievements || highlight.featured_achievements.length === 0) {
      // If no featured_achievements set, first 3 are considered featured
      return index < 3;
    }
    return highlight.featured_achievements.includes(index);
  };

  // Get the achievement list to work with (key_achievements takes priority)
  const getAchievementsList = (highlight: CareerHighlight): string[] => {
    return highlight.key_achievements || highlight.achievements || [];
  };

  // Toggle featured status of an achievement
  const toggleFeatured = (id: string, index: number) => {
    const highlight = highlights.find(h => h.id === id);
    if (!highlight) return;

    let featuredAchievements = highlight.featured_achievements || [];
    
    // If not set, initialize with first 3 (or less)
    if (featuredAchievements.length === 0) {
      const count = Math.min(3, highlight.achievements.length);
      featuredAchievements = Array.from({ length: count }, (_, i) => i);
    }

    if (featuredAchievements.includes(index)) {
      // Remove from featured
      featuredAchievements = featuredAchievements.filter(i => i !== index);
    } else {
      // Add to featured (max 3)
      if (featuredAchievements.length < 3) {
        featuredAchievements = [...featuredAchievements, index];
      } else {
        // Replace the last one
        featuredAchievements = [...featuredAchievements.slice(0, 2), index];
      }
    }

    onUpdate(id, { featured_achievements: featuredAchievements });
  };

  const handleAchievementUpdate = (id: string, index: number, value: string) => {
    const highlight = highlights.find(h => h.id === id);
    if (!highlight) return;
    
    // Update key_achievements if they exist, otherwise fall back to achievements
    if (highlight.key_achievements) {
      const newKeyAchievements = [...highlight.key_achievements];
      newKeyAchievements[index] = value;
      // Also update legacy field
      const newAchievements = [...newKeyAchievements, ...(highlight.responsibilities || [])];
      onUpdate(id, { key_achievements: newKeyAchievements, achievements: newAchievements });
    } else {
      const newAchievements = [...(highlight.achievements || [])];
      newAchievements[index] = value;
      onUpdate(id, { achievements: newAchievements });
    }
  };

  const handleAddAchievement = (id: string) => {
    const highlight = highlights.find(h => h.id === id);
    if (!highlight) return;
    
    // Add to key_achievements if they exist, otherwise to achievements
    if (highlight.key_achievements || highlight.responsibilities) {
      const newKeyAchievements = [...(highlight.key_achievements || []), ''];
      const newAchievements = [...newKeyAchievements, ...(highlight.responsibilities || [])];
      onUpdate(id, { key_achievements: newKeyAchievements, achievements: newAchievements });
    } else {
      onUpdate(id, { achievements: [...(highlight.achievements || []), ''] });
    }
  };

  const handleRemoveAchievement = (id: string, index: number) => {
    const highlight = highlights.find(h => h.id === id);
    if (!highlight) return;
    
    if (highlight.key_achievements) {
      // Remove from key_achievements
      const newKeyAchievements = highlight.key_achievements.filter((_, i) => i !== index);
      const newAchievements = [...newKeyAchievements, ...(highlight.responsibilities || [])];
      
      // Update featured_achievements indices
      let newFeatured = highlight.featured_achievements || [];
      newFeatured = newFeatured
        .filter(i => i !== index)
        .map(i => i > index ? i - 1 : i);
      
      onUpdate(id, { 
        key_achievements: newKeyAchievements,
        achievements: newAchievements,
        featured_achievements: newFeatured
      });
    } else {
      // Fall back to legacy achievements
      const newAchievements = (highlight.achievements || []).filter((_, i) => i !== index);
      
      let newFeatured = highlight.featured_achievements || [];
      newFeatured = newFeatured
        .filter(i => i !== index)
        .map(i => i > index ? i - 1 : i);
      
      onUpdate(id, { 
        achievements: newAchievements,
        featured_achievements: newFeatured
      });
    }
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedAchievements);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedAchievements(newExpanded);
  };

  return (
    <div className="space-y-3">
      {highlights.map((highlight, index) => {
        // Check if career has template content
        const achievementsList = getAchievementsList(highlight);
        const isNewCareer = !highlight.description && achievementsList.length === 0;
        const featuredAchievements = getFeaturedAchievements(highlight);
        const totalAchievements = achievementsList.length;
        const hasMoreAchievements = totalAchievements > 3;
        const isExpanded = expandedAchievements.has(highlight.id);
        
        return (
          <div key={highlight.id} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
          {/* Header with drag, edit detail page, and delete */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <button
                onClick={() => onMove(highlight.id, 'up')}
                disabled={index === 0}
                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                title="Move up"
              >
                <GripVertical className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <input
                value={highlight.organization}
                onChange={(e) => onUpdate(highlight.id, { organization: e.target.value })}
                placeholder="Google, Meta, Startup Inc"
                className="w-full px-2 py-1 text-sm font-medium border-0 bg-transparent focus:outline-none focus:ring-0 placeholder:text-gray-500"
              />
            </div>
            <button
              onClick={() => router.push(`/detail/career-editor/${highlight.id}?mode=${viewMode}`)}
              className="p-1 text-blue-600 hover:text-blue-700"
              title="Edit detailed page"
            >
              <FileEdit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(highlight.id)}
              className="p-1 text-red-500 hover:text-red-700"
              title="Delete career highlight"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Role */}
          <input
            value={highlight.role}
            onChange={(e) => onUpdate(highlight.id, { role: e.target.value })}
            placeholder="Senior Product Designer, Engineering Manager, etc."
            className="w-full px-2 py-1 text-sm text-gray-600 border-0 bg-transparent focus:outline-none focus:ring-0 placeholder:text-gray-500"
          />

          {/* Description */}
          <textarea
            value={highlight.description}
            onChange={(e) => onUpdate(highlight.id, { description: e.target.value })}
            placeholder="Brief description of what this company does or what you worked on..."
            rows={2}
            className="w-full px-2 py-1 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none placeholder:text-gray-500"
          />

          {/* Dates - Compact inline display */}
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <MonthYearPicker
              value={highlight.startDate || ''}
              onChange={(value) => onUpdate(highlight.id, { startDate: value })}
              placeholder="Start date"
            />
            <span>—</span>
            <MonthYearPicker
              value={highlight.current || highlight.endDate === 'Present' ? 'Present' : (highlight.endDate || '')}
              onChange={(value) => onUpdate(highlight.id, { 
                endDate: value,
                current: value === 'Present'
              })}
              placeholder={highlight.current ? 'Present' : 'End date'}
              disabled={highlight.current}
            />
            <label className="flex items-center gap-1 ml-2 cursor-pointer">
              <input
                type="checkbox"
                checked={highlight.current}
                onChange={(e) => onUpdate(highlight.id, { 
                  current: e.target.checked,
                  endDate: e.target.checked ? 'Present' : ''
                })}
                className="rounded border-gray-300 w-3 h-3"
              />
              <span className="text-xs">Current</span>
            </label>
          </div>

          {/* Featured Achievements Section */}
          {totalAchievements > 0 && (
            <div className="bg-white border border-gray-200 rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-gray-700">
                    {highlight.key_achievements ? 'Key Achievements' : 'Featured Achievements'}
                  </h4>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {featuredAchievements.length} of {totalAchievements}
                  </span>
                </div>
                {hasMoreAchievements && (
                  <button
                    onClick={() => toggleExpanded(highlight.id)}
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-3 h-3" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" />
                        Show All
                      </>
                    )}
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-500">
                {highlight.key_achievements 
                  ? 'Select up to 3 impact-focused achievements with metrics to show on your portfolio card'
                  : 'Select up to 3 achievements to show on your portfolio card'
                }
              </p>

              {/* Achievement List */}
              <div className="space-y-2">
                {achievementsList.slice(0, isExpanded ? undefined : 3).map((achievement, achIndex) => {
                  const isFeatured = isAchievementFeatured(highlight, achIndex);
                  const featuredCount = (highlight.featured_achievements || []).length;
                  const canFeature = featuredCount < 3 || isFeatured;

                  return (
                    <div key={achIndex} className="flex items-start gap-2">
                      <button
                        onClick={() => toggleFeatured(highlight.id, achIndex)}
                        disabled={!canFeature && !isFeatured}
                        className={`flex-shrink-0 mt-1 ${
                          isFeatured 
                            ? 'text-yellow-500 hover:text-yellow-600' 
                            : canFeature
                            ? 'text-gray-300 hover:text-yellow-400'
                            : 'text-gray-200 cursor-not-allowed'
                        }`}
                        title={isFeatured ? 'Remove from featured' : canFeature ? 'Mark as featured' : 'Max 3 featured achievements'}
                      >
                        <Star className="w-4 h-4" fill={isFeatured ? 'currentColor' : 'none'} />
                      </button>
                      <div className="flex-1">
                        <textarea
                          value={achievement}
                          onChange={(e) => handleAchievementUpdate(highlight.id, achIndex, e.target.value)}
                          placeholder="Describe a key achievement..."
                          rows={2}
                          className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveAchievement(highlight.id, achIndex)}
                        className="flex-shrink-0 mt-1 p-1 text-gray-400 hover:text-red-500"
                        title="Delete achievement"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}

                {!isExpanded && hasMoreAchievements && (
                  <div className="text-xs text-gray-500 pl-6">
                    +{totalAchievements - 3} more achievement{totalAchievements - 3 > 1 ? 's' : ''}
                  </div>
                )}
              </div>

              {/* Add Achievement Button */}
              <button
                onClick={() => handleAddAchievement(highlight.id)}
                className="w-full flex items-center justify-center gap-1 px-2 py-1.5 border border-dashed border-gray-300 text-gray-600 text-xs rounded hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add Achievement
              </button>
            </div>
          )}

          {/* Add/Edit Detail Page Button */}
          {isNewCareer ? (
            <button
              onClick={() => router.push(`/detail/career-editor/${highlight.id}?mode=${viewMode}`)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              Create Detailed Career Page
            </button>
          ) : (
            <button
              onClick={() => router.push(`/detail/career-editor/${highlight.id}?mode=${viewMode}`)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-100 transition-all"
            >
              <FileEdit className="w-4 h-4" />
              {highlight.template_type ? 'Continue Editing Career Page' : 'Create Detailed Career Page'}
            </button>
          )}
        </div>
        );
      })}

      {/* Add Button */}
      <button
        onClick={onAdd}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border-2 border-dashed border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
      >
        <Plus className="w-4 h-4" />
        <span>Add Career Highlight</span>
      </button>
    </div>
  );
}
