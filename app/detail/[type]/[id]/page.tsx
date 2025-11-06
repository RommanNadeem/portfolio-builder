'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, ArrowRight, Plus, Trash2, GripVertical, Type, Image as ImageIcon,
  Grid3x3, Video, FileText, Link as LinkIcon, Heading1, Heading2, Heading3,
  Upload, Eye, Pencil, Monitor, Smartphone
} from 'lucide-react';

// Block type definitions
type BlockType = 'h1' | 'h2' | 'h3' | 'text' | 'image' | 'image-grid' | 'video' | 'embed';

interface Block {
  id: string;
  type: BlockType;
  content: string;
  metadata?: {
    url?: string;
    fileType?: 'pdf' | 'csv' | 'video' | 'figma';
    images?: string[];
    gridLayout?: '1x2' | '1x3' | '2x3';
    width?: number; // Image width in pixels (for resizing)
  };
}

const BLOCK_TYPES = [
  { type: 'h1' as BlockType, label: 'Heading 1', icon: Heading1, shortcut: '/h1' },
  { type: 'h2' as BlockType, label: 'Heading 2', icon: Heading2, shortcut: '/h2' },
  { type: 'h3' as BlockType, label: 'Heading 3', icon: Heading3, shortcut: '/h3' },
  { type: 'text' as BlockType, label: 'Text', icon: Type, shortcut: '/text' },
  { type: 'image' as BlockType, label: 'Image', icon: ImageIcon, shortcut: '/image' },
  { type: 'image-grid' as BlockType, label: 'Image Grid', icon: Grid3x3, shortcut: '/grid' },
  { type: 'video' as BlockType, label: 'Video', icon: Video, shortcut: '/video' },
  { type: 'embed' as BlockType, label: 'Embed File', icon: FileText, shortcut: '/embed' },
];

export default function DetailPage() {
  const router = useRouter();
  const params = useParams();
  const type = params.type as string;
  const id = params.id as string;
  
  // Get initial view mode from URL query params
  const [initialMode, setInitialMode] = useState<'edit' | 'preview'>('edit');
  
  const [detailData, setDetailData] = useState<any>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveTimeRef = useRef<Date>(new Date());
  const [resizingBlockId, setResizingBlockId] = useState<string | null>(null);
  const resizeStartRef = useRef<{ x: number; width: number } | null>(null);
  const [editingField, setEditingField] = useState<'title' | 'description' | 'tags' | 'link' | null>(null);

  // Check URL params for initial mode
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode') as 'edit' | 'preview' | null;
    if (mode === 'preview' || mode === 'edit') {
      setViewMode(mode);
      setInitialMode(mode);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('[Detail Page] 🔄 Loading data for type:', type, 'id:', id);
        
        // STEP 1: Try localStorage first (instant)
    const storedData = localStorage.getItem('portfolioData');
    if (storedData) {
      const data = JSON.parse(storedData);
      let item: any = null;
      
      if (type === 'highlight') {
        item = (data.careerHighlights || []).find((h: any) => h.id === id);
      } else if (type === 'strength') {
        item = (data.strengths || []).find((s: any) => s.id === id);
      } else if (type === 'project') {
        item = (data.projects || []).find((p: any) => p.id === id);
      }
      
      if (item) {
            console.log('[Detail Page] 📦 Loaded from localStorage:', item);
            console.log('[Detail Page] 📦 Blocks:', item.blocks);
        setDetailData(item);
            // Load blocks from item or create initial text block
            if (item.blocks && Array.isArray(item.blocks) && item.blocks.length > 0) {
              console.log('[Detail Page] ✅ Loading', item.blocks.length, 'blocks from cache');
              setBlocks(item.blocks);
      } else {
              console.log('[Detail Page] ⚠️ No blocks in cache, creating initial block');
              const initialBlock = { id: crypto.randomUUID(), type: 'text' as BlockType, content: '' };
              setBlocks([initialBlock]);
            }
          }
        }

        // STEP 2: Fetch fresh data from Supabase (if project)
        if (type === 'project') {
          try {
            const { getCurrentUser } = await import('@/lib/supabase');
            const { supabase } = await import('@/lib/supabase');
            const user = await getCurrentUser();
            
            if (user) {
              const { data: projectData, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', id)
                .eq('user_id', user.id)
                .single();

              if (projectData && !error) {
                console.log('[Detail Page] 🔄 Fresh data from Supabase:', projectData);
                
                // Convert DB format to app format
                const freshItem = {
                  id: projectData.id,
                  title: projectData.title,
                  description: projectData.description,
                  thumbnail: projectData.thumbnail_url,
                  tags: projectData.tags || [],
                  link: projectData.link,
                  pageContent: projectData.page_content,
                  sections: projectData.sections || [],
                  blocks: projectData.blocks || []
                };

                // Update state with fresh data
                setDetailData(freshItem);
                if (freshItem.blocks && freshItem.blocks.length > 0) {
                  console.log('[Detail Page] ✅ Loading', freshItem.blocks.length, 'blocks from Supabase');
                  setBlocks(freshItem.blocks);
                } else if (!storedData) {
                  // Only create initial block if no localStorage data
                  const initialBlock = { id: crypto.randomUUID(), type: 'text' as BlockType, content: '' };
                  setBlocks([initialBlock]);
                }

                // Update localStorage with fresh data
                if (storedData) {
                  const data = JSON.parse(storedData);
                  data.projects = (data.projects || []).map((p: any) =>
                    p.id === id ? freshItem : p
                  );
                  localStorage.setItem('portfolioData', JSON.stringify(data));
                }
              }
            }
          } catch (error) {
            console.warn('[Detail Page] ⚠️ Could not load from Supabase:', error);
          }
        }
        
        if (!storedData) {
          console.error('[Detail Page] ❌ No localStorage data');
        router.push('/editor');
      }
      } catch (error) {
        console.error('[Detail Page] ❌ Error loading:', error);
        router.push('/editor');
    }
    };
    
    loadData();
  }, [type, id, router]);

  // Debounced save to database (Notion-style)
  const debouncedSaveToDatabase = useCallback(async (data: any, itemType: 'metadata' | 'blocks', payload: any) => {
    if (type !== 'project') return;
    
    try {
      const { getCurrentUser } = await import('@/lib/supabase');
      const { saveProjectMetadata, saveProjectBlocks } = await import('@/lib/detail-page-db');
      const user = await getCurrentUser();
      
      if (user) {
        if (itemType === 'metadata') {
          const result = await saveProjectMetadata(user.id, id, payload);
          if (result.success) {
            console.log('[Detail Page] ✅ Metadata synced to Supabase');
            lastSaveTimeRef.current = new Date();
          }
        } else {
          const result = await saveProjectBlocks(user.id, id, payload);
          if (result.success) {
            console.log('[Detail Page] ✅ Blocks synced to Supabase');
            lastSaveTimeRef.current = new Date();
          }
        }
      }
    } catch (error) {
      console.warn('[Detail Page] ⚠️ Database sync failed (data saved locally):', error);
    }
  }, [type, id]);

  const updateProjectData = async (updates: any) => {
    setSaveStatus('saving');
    const storedData = localStorage.getItem('portfolioData');
    if (storedData && detailData) {
      const data = JSON.parse(storedData);
      
      // Update the project data
      if (type === 'highlight') {
        data.careerHighlights = (data.careerHighlights || []).map((h: any) =>
          h.id === id ? { ...h, ...updates } : h
        );
      } else if (type === 'strength') {
        data.strengths = (data.strengths || []).map((s: any) =>
          s.id === id ? { ...s, ...updates } : s
        );
      } else if (type === 'project') {
        data.projects = (data.projects || []).map((p: any) =>
          p.id === id ? { ...p, ...updates } : p
        );
      }
      
      // INSTANT: Save to localStorage (no delay)
      localStorage.setItem('portfolioData', JSON.stringify(data));
      setDetailData((prev: any) => ({ ...prev, ...updates }));
      console.log('[Detail Page] ⚡ Instant save to localStorage');
      
      // DEBOUNCED: Save to Supabase after 500ms of no activity
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        debouncedSaveToDatabase(data, 'metadata', updates);
        setSaveStatus('saved');
      }, 500); // Wait 500ms after last edit (Notion-style)
    }
  };

  const saveBlocks = async (newBlocks: Block[]) => {
    setSaveStatus('saving');
    const storedData = localStorage.getItem('portfolioData');
    if (storedData && detailData) {
      const data = JSON.parse(storedData);
      
      if (type === 'highlight') {
        data.careerHighlights = (data.careerHighlights || []).map((h: any) =>
          h.id === id ? { ...h, blocks: newBlocks } : h
        );
      } else if (type === 'strength') {
        data.strengths = (data.strengths || []).map((s: any) =>
          s.id === id ? { ...s, blocks: newBlocks } : s
        );
      } else if (type === 'project') {
        data.projects = (data.projects || []).map((p: any) =>
          p.id === id ? { ...p, blocks: newBlocks } : p
        );
      }
      
      // INSTANT: Save to localStorage (no delay)
      localStorage.setItem('portfolioData', JSON.stringify(data));
      setBlocks(newBlocks);
      console.log('[Detail Page] ⚡ Instant save to localStorage');
      console.log('[Detail Page] 💾 Blocks count:', newBlocks.length);
      
      // DEBOUNCED: Save to Supabase after 500ms of no activity
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        debouncedSaveToDatabase(data, 'blocks', newBlocks);
        setSaveStatus('saved');
      }, 500); // Wait 500ms after last edit (Notion-style)
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Image resize handlers (Notion-style)
  const handleResizeStart = (e: React.MouseEvent, blockId: string, currentWidth: number) => {
    e.preventDefault();
    setResizingBlockId(blockId);
    
    // If no width set, use the actual image width
    const actualWidth = currentWidth || (e.currentTarget.parentElement?.offsetWidth || 800);
    
    resizeStartRef.current = {
      x: e.clientX,
      width: actualWidth
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingBlockId || !resizeStartRef.current) return;

      const deltaX = e.clientX - resizeStartRef.current.x;
      const newWidth = Math.max(200, Math.min(1200, resizeStartRef.current.width + deltaX));
      
      const block = blocks.find(b => b.id === resizingBlockId);
      if (block) {
        updateBlock(resizingBlockId, {
          metadata: { ...block.metadata, width: newWidth }
        });
      }
    };

    const handleMouseUp = () => {
      if (resizingBlockId) {
        setResizingBlockId(null);
        resizeStartRef.current = null;
      }
    };

    if (resizingBlockId) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [resizingBlockId, blocks]);

  const handleKeyDown = (e: React.KeyboardEvent, blockId: string, blockIndex: number) => {
    // Detect forward slash
    if (e.key === '/' && (e.target as HTMLInputElement).value === '') {
      e.preventDefault();
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setSlashMenuPosition({ top: rect.bottom, left: rect.left });
      setActiveBlockId(blockId);
      setShowSlashMenu(true);
      setSearchTerm('');
    }

    // Enter key - add new text block
    if (e.key === 'Enter' && !e.shiftKey) {
      const block = blocks.find(b => b.id === blockId);
      // Only create new block if current block has content or is not a text block
      if (block && (block.content.trim() || block.type !== 'text')) {
        e.preventDefault();
        const newBlock: Block = {
          id: crypto.randomUUID(),
          type: 'text',
          content: '',
        };
        const newBlocks = [
          ...blocks.slice(0, blockIndex + 1),
          newBlock,
          ...blocks.slice(blockIndex + 1),
        ];
        saveBlocks(newBlocks);
      }
    }

    // Backspace on empty block - delete it
    if (e.key === 'Backspace' && (e.target as HTMLInputElement).value === '' && blocks.length > 1) {
      e.preventDefault();
      const newBlocks = blocks.filter(b => b.id !== blockId);
      saveBlocks(newBlocks);
    }
  };

  const addBlock = (blockType: BlockType) => {
    const blockIndex = blocks.findIndex(b => b.id === activeBlockId);
    const newBlock: Block = {
      id: crypto.randomUUID(),
      type: blockType,
      content: '',
      metadata: blockType === 'image-grid' ? { images: [] } : {},
    };
    
    // Replace the current block if it's empty, otherwise add after
    const currentBlock = blocks[blockIndex];
    if (currentBlock && currentBlock.content === '' && currentBlock.type === 'text') {
      const newBlocks = blocks.map((b, idx) => idx === blockIndex ? newBlock : b);
      saveBlocks(newBlocks);
    } else {
      const newBlocks = [
        ...blocks.slice(0, blockIndex + 1),
        newBlock,
        ...blocks.slice(blockIndex + 1),
      ];
      saveBlocks(newBlocks);
    }
    
    setShowSlashMenu(false);
    setActiveBlockId(null);
  };

  const updateBlock = (blockId: string, updates: Partial<Block>) => {
    const newBlocks = blocks.map(b => 
      b.id === blockId ? { ...b, ...updates } : b
    );
    saveBlocks(newBlocks);
  };

  const deleteBlock = (blockId: string) => {
    if (blocks.length === 1) return; // Keep at least one block
    const newBlocks = blocks.filter(b => b.id !== blockId);
    saveBlocks(newBlocks);
  };

  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === blockId);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    
    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    saveBlocks(newBlocks);
  };

  const handleFileUpload = async (blockId: string, file: File, isGridImage: boolean = false) => {
    // Convert file to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      
      if (isGridImage) {
        const block = blocks.find(b => b.id === blockId);
        const currentImages = block?.metadata?.images || [];
        updateBlock(blockId, {
          metadata: { ...block?.metadata, images: [...currentImages, base64String] }
        });
      } else {
        updateBlock(blockId, {
          metadata: { url: base64String }
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageGridUpload = async (blockId: string, files: FileList) => {
    const block = blocks.find(b => b.id === blockId);
    const currentImages = block?.metadata?.images || [];
    
    const newImages: string[] = [];
    let processed = 0;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        processed++;
        
        if (processed === files.length) {
          updateBlock(blockId, {
            metadata: { ...block?.metadata, images: [...currentImages, ...newImages] }
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePaste = async (e: React.ClipboardEvent, blockId: string, isGrid: boolean = false) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageItems = Array.from(items).filter(item => item.type.startsWith('image/'));
    if (imageItems.length === 0) return;

    e.preventDefault();

    if (isGrid) {
      // Handle paste for image grid
      const block = blocks.find(b => b.id === blockId);
      const currentImages = block?.metadata?.images || [];
      const newImages: string[] = [];
      let processed = 0;

      imageItems.forEach(item => {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            newImages.push(reader.result as string);
            processed++;

            if (processed === imageItems.length) {
              updateBlock(blockId, {
                metadata: { ...block?.metadata, images: [...currentImages, ...newImages] }
              });
            }
          };
          reader.readAsDataURL(file);
        }
      });
    } else {
      // Handle paste for single image
      const file = imageItems[0].getAsFile();
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          updateBlock(blockId, {
            metadata: { url: reader.result as string }
          });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const getTitle = () => {
    if (type === 'highlight') return detailData?.organization || 'Career Highlight';
    if (type === 'strength') return detailData?.title || 'Strength';
    if (type === 'project') return detailData?.title || 'Project';
    return 'Detail';
  };

  const filteredBlockTypes = BLOCK_TYPES.filter(bt => 
    bt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bt.shortcut.includes(searchTerm.toLowerCase())
  );

  const isMobile = previewMode === 'mobile';

  // Show content immediately, even while loading
  if (!detailData) {
    // Show minimal UI while data loads
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="border-b border-gray-100 sticky top-0 z-50 bg-white">
          <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
              <button
                onClick={() => router.push(`/editor?mode=${viewMode}`)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              </div>
            </div>
          </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Global Navigation Header */}
      <div className="border-b border-gray-100 sticky top-0 z-50 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left - Back Button and Title */}
            <div className="flex items-center gap-4">
                <button
                onClick={() => {
                  // Pass current view mode back to editor
                  router.push(`/editor?mode=${viewMode}`);
                }}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
                </button>
              <div className="border-l border-gray-200 pl-4">
                <h1 className="text-sm font-medium text-black">{getTitle()}</h1>
                <p className="text-xs text-gray-400">{blocks.length} block{blocks.length !== 1 ? 's' : ''}</p>
            </div>
            </div>

            {/* Center - Save Status */}
            <div className="flex items-center gap-2">
              {saveStatus === 'saving' ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-xs text-blue-700 font-medium">Saving...</span>
          </div>
        ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs text-green-700 font-medium">Saved</span>
                    </div>
                  )}
                </div>
                
            {/* Right - View Mode Toggle */}
            <div className="flex items-center gap-4">
              {/* Edit/Preview Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                  onClick={() => setViewMode('edit')}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded transition-all ${
                    viewMode === 'edit'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                    </button>
                    <button
                  onClick={() => setViewMode('preview')}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded transition-all ${
                    viewMode === 'preview'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Preview
                    </button>
                </div>
                
              {/* Desktop/Mobile Toggle - Only in preview mode */}
              {viewMode === 'preview' && (
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`p-2 rounded transition-all ${
                      previewMode === 'desktop'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Desktop view"
                  >
                    <Monitor className="w-4 h-4" />
                    </button>
                    <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`p-2 rounded transition-all ${
                      previewMode === 'mobile'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="Mobile view"
                  >
                    <Smartphone className="w-4 h-4" />
                    </button>
                  </div>
              )}
                </div>
                  </div>
                </div>
              </div>
              
      {/* Main Content */}
      <div className={`flex-1 min-h-screen ${viewMode === 'preview' ? 'bg-gray-100' : 'bg-white'}`}>
        <div className={viewMode === 'preview' 
          ? `min-h-[calc(100vh-80px)] ${isMobile ? 'py-8' : 'py-12'}`
          : 'max-w-6xl mx-auto px-16 py-12 min-h-[calc(100vh-80px)]'
        }>
        {viewMode === 'edit' ? (
          // Edit Mode - Block Editor
          <div className="min-h-[600px]">
            {/* Project Header in Edit Mode - Click to Edit */}
            <div className="mb-12">
              {/* Title - Click to edit */}
              <div className="mb-6 group/title">
                {editingField === 'title' ? (
                  <input
                    type="text"
                    value={detailData?.title || ''}
                    onChange={(e) => updateProjectData({ title: e.target.value })}
                    onBlur={() => setEditingField(null)}
                    placeholder="Project Title"
                    autoFocus
                    className="w-full font-bold text-black bg-transparent border-b-2 border-blue-600 focus:outline-none placeholder:text-gray-300"
                    style={{ fontSize: '60px', lineHeight: '1.1' }}
                  />
                ) : (
                  <div className="flex items-start gap-2">
                    <h1 
                      onClick={() => setEditingField('title')}
                      className="flex-1 font-bold text-black cursor-text hover:bg-gray-50 rounded px-2 -mx-2 transition-colors"
                      style={{ fontSize: '60px', lineHeight: '1.1' }}
                    >
                      {detailData?.title || 'Untitled Project'}
                    </h1>
                  <button
                      onClick={() => setEditingField('title')}
                      className="p-2 text-gray-400 hover:text-black opacity-0 group-hover/title:opacity-100 transition-opacity"
                      title="Edit title"
                    >
                      <Pencil className="w-4 h-4" />
                  </button>
                  </div>
                )}
                </div>
                
              {/* Description - Click to edit */}
              <div className="mb-6 group/desc">
                {editingField === 'description' ? (
                  <textarea
                    value={detailData?.description || ''}
                    onChange={(e) => updateProjectData({ description: e.target.value })}
                    onBlur={() => setEditingField(null)}
                    placeholder="Project description"
                    rows={3}
                    autoFocus
                    className="w-full text-gray-700 bg-transparent border-b-2 border-blue-600 focus:outline-none resize-none placeholder:text-gray-300"
                    style={{ fontSize: '30px', lineHeight: '1.4' }}
                  />
                ) : (
                  <div className="flex items-start gap-2">
                    <p 
                      onClick={() => setEditingField('description')}
                      className="flex-1 text-gray-700 cursor-text hover:bg-gray-50 rounded px-2 -mx-2 transition-colors"
                      style={{ fontSize: '30px', lineHeight: '1.4' }}
                    >
                      {detailData?.description || 'Click to add description'}
                    </p>
                    <button
                      onClick={() => setEditingField('description')}
                      className="p-2 text-gray-400 hover:text-black opacity-0 group-hover/desc:opacity-100 transition-opacity"
                      title="Edit description"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Tags - Click to edit */}
              <div className="mb-6 group/tags">
                {editingField === 'tags' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={(detailData?.tags || []).join(', ')}
                      onChange={(e) => {
                        const tags = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                        updateProjectData({ tags });
                      }}
                      onBlur={() => setEditingField(null)}
                      placeholder="React, TypeScript, Design"
                      autoFocus
                      className="w-full px-4 py-2 border-2 border-blue-600 rounded-lg focus:outline-none text-sm"
                    />
              </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {detailData?.tags && detailData.tags.length > 0 ? (
                      <div 
                        onClick={() => setEditingField('tags')}
                        className="flex flex-wrap gap-2 flex-1 cursor-pointer hover:bg-gray-50 rounded px-2 py-1 -mx-2 transition-colors"
                      >
                        {detailData.tags.map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {tag}
                          </span>
            ))}
          </div>
                    ) : (
                      <div 
                        onClick={() => setEditingField('tags')}
                        className="flex-1 text-gray-400 text-sm cursor-pointer hover:bg-gray-50 rounded px-2 py-1 -mx-2 transition-colors"
                      >
                        Click to add tags
                      </div>
                    )}
                    <button
                      onClick={() => setEditingField('tags')}
                      className="p-2 text-gray-400 hover:text-black opacity-0 group-hover/tags:opacity-100 transition-opacity"
                      title="Edit tags"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
          </div>
        )}
      </div>

              {/* Link - Click to edit */}
              <div className="mb-6 group/link">
                {editingField === 'link' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Project Link
                    </label>
            <input
                      type="url"
                      value={detailData?.link || ''}
                      onChange={(e) => updateProjectData({ link: e.target.value })}
                      onBlur={() => setEditingField(null)}
                      placeholder="https://project-link.com"
                      autoFocus
                      className="w-full px-4 py-2 border-2 border-blue-600 rounded-lg focus:outline-none text-sm"
            />
          </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {detailData?.link ? (
                      <a
                        href={detailData.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 inline-flex items-center gap-2 text-base text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <LinkIcon className="w-4 h-4" />
                        {detailData.link}
                      </a>
                    ) : (
                      <div 
                        onClick={() => setEditingField('link')}
                        className="flex-1 text-gray-400 text-sm cursor-pointer hover:bg-gray-50 rounded px-2 py-1 -mx-2 transition-colors"
                      >
                        Click to add project link
          </div>
                    )}
                    <button
                      onClick={() => setEditingField('link')}
                      className="p-2 text-gray-400 hover:text-black opacity-0 group-hover/link:opacity-100 transition-opacity"
                      title="Edit link"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
            </div>
                )}
          </div>

              {/* Separator */}
              <div className="mt-8 border-b border-gray-200" />
            </div>

            {/* Blocks */}
            <div className="space-y-2">
              {blocks.map((block, index) => (
            <div
              key={block.id}
              className="group relative"
            >
              {/* Block Controls - Show on hover */}
              <div className="absolute -left-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                <button
                  onClick={() => moveBlock(block.id, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-black disabled:opacity-20"
                  title="Move up"
                >
                  <GripVertical className="w-4 h-4" />
                </button>
            <button
                  onClick={() => deleteBlock(block.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

              {/* Block Content */}
              <div className="min-h-[40px]">
                {block.type === 'h1' && (
            <input
              type="text"
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                    onKeyDown={(e) => handleKeyDown(e, block.id, index)}
                    placeholder="Heading 1"
                    className="w-full text-4xl font-bold text-black border-0 focus:outline-none placeholder:text-gray-300"
                    autoFocus={!block.content}
                  />
                )}

                {block.type === 'h2' && (
                <input
                  type="text"
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                    onKeyDown={(e) => handleKeyDown(e, block.id, index)}
                    placeholder="Heading 2"
                    className="w-full text-3xl font-bold text-black border-0 focus:outline-none placeholder:text-gray-300"
                    autoFocus={!block.content}
                  />
                )}

                {block.type === 'h3' && (
                <input
                  type="text"
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                    onKeyDown={(e) => handleKeyDown(e, block.id, index)}
                    placeholder="Heading 3"
                    className="w-full text-2xl font-semibold text-black border-0 focus:outline-none placeholder:text-gray-300"
                    autoFocus={!block.content}
                  />
                )}

                {block.type === 'text' && (
            <textarea
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                    onKeyDown={(e) => handleKeyDown(e, block.id, index)}
                    placeholder="Type '/' for commands..."
                    rows={1}
                    className="w-full text-base text-gray-900 border-0 focus:outline-none resize-none placeholder:text-gray-400"
                    style={{ minHeight: '28px' }}
                    autoFocus={!block.content}
                    onInput={(e) => {
                      // Auto-resize textarea
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = target.scrollHeight + 'px';
                    }}
                  />
                )}

                {block.type === 'image' && (
                  <div
                    onPaste={(e) => handlePaste(e, block.id, false)}
                    tabIndex={0}
                    className="outline-none"
                  >
                    {block.metadata?.url ? (
                      <div 
                        className={`relative group inline-block ${resizingBlockId === block.id ? 'cursor-ew-resize' : ''}`}
                        style={{ width: block.metadata?.width || '100%' }}
                      >
                        {/* Image */}
                        <img 
                          src={block.metadata.url} 
                          alt="Content" 
                          className="w-full rounded-lg select-none pointer-events-none" 
                          draggable={false}
                        />
                        
                        {/* Image Management Tools - Show on hover */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                            onClick={() => fileInputRefs.current[block.id]?.click()}
                            className="px-3 py-1.5 text-xs bg-white/90 backdrop-blur-sm hover:bg-white rounded-lg shadow-sm flex items-center gap-1 transition-colors"
                            title="Replace image"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            Replace
                </button>
            <button
                            onClick={() => updateBlock(block.id, { metadata: { url: '' } })}
                            className="px-3 py-1.5 text-xs bg-red-500/90 backdrop-blur-sm hover:bg-red-600 text-white rounded-lg shadow-sm flex items-center gap-1 transition-colors"
                            title="Remove image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
            </button>
          </div>

                        {/* Quick Size Buttons - Bottom Center (Notion-style) */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm p-1">
                          <button
                            onClick={() => updateBlock(block.id, { metadata: { ...block.metadata, width: 400 } })}
                            className="px-2 py-1 text-xs hover:bg-gray-100 rounded transition-colors"
                            title="Small (400px)"
                          >
                            S
                          </button>
                          <button
                            onClick={() => updateBlock(block.id, { metadata: { ...block.metadata, width: 600 } })}
                            className="px-2 py-1 text-xs hover:bg-gray-100 rounded transition-colors"
                            title="Medium (600px)"
                          >
                            M
                          </button>
                          <button
                            onClick={() => updateBlock(block.id, { metadata: { ...block.metadata, width: 800 } })}
                            className="px-2 py-1 text-xs hover:bg-gray-100 rounded transition-colors"
                            title="Large (800px)"
                          >
                            L
                          </button>
                          <button
                            onClick={() => updateBlock(block.id, { metadata: { ...block.metadata, width: undefined } })}
                            className="px-2 py-1 text-xs hover:bg-gray-100 rounded transition-colors"
                            title="Full width"
                          >
                            Full
                          </button>
          </div>

                        {/* Resize Handle - Right Edge (Notion-style) */}
                        <div
                          onMouseDown={(e) => handleResizeStart(e, block.id, block.metadata?.width || 0)}
                          className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-blue-500 rounded-full" />
          </div>

                        {/* Width Indicator (shows while resizing) */}
                        {resizingBlockId === block.id && (
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/75 text-white text-xs rounded">
                            {block.metadata?.width || 0}px
                          </div>
                        )}
                        
                        {/* Hidden file input */}
            <input
                          ref={(el) => { fileInputRefs.current[block.id] = el; }}
                          type="file"
                          accept="image/*"
                  onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(block.id, file);
                          }}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      // Empty state - Upload prompt
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
                        <div className="text-center space-y-4">
                          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto" />
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs text-gray-400">Upload, paste, or enter URL</span>
                            <div className="flex-1 h-px bg-gray-200" />
                          </div>
                          <p className="text-xs text-gray-500">
                            Tip: Copy an image and paste it here (Ctrl/Cmd + V)
                          </p>
                          <div className="flex gap-2">
                <input
                  type="url"
                              value={block.metadata?.url || ''}
                              onChange={(e) => updateBlock(block.id, { 
                                metadata: { ...block.metadata, url: e.target.value } 
                              })}
                              placeholder="Paste image URL"
                              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded focus:border-black focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => fileInputRefs.current[block.id]?.click()}
                              className="px-4 py-2 text-sm bg-black text-white hover:bg-gray-800 rounded transition-colors flex items-center gap-2"
                            >
                              <Upload className="w-4 h-4" />
                              Upload
                            </button>
                            <input
                              ref={(el) => { fileInputRefs.current[block.id] = el; }}
                              type="file"
                              accept="image/*"
                  onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(block.id, file);
                              }}
                              className="hidden"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {block.type === 'image-grid' && (
                  <div
                    onPaste={(e) => handlePaste(e, block.id, true)}
                    tabIndex={0}
                    className="outline-none"
                  >
                    {block.metadata?.images && block.metadata.images.length > 0 ? (
                      // Grid with images
                      <div>
                        {/* Grid Layout Selector */}
                        <div className="mb-4 flex items-center gap-3">
                          <label className="text-xs font-medium text-gray-600">Grid Layout:</label>
                          <div className="flex gap-2">
                            {(['1x2', '1x3', '2x3'] as const).map((layout) => (
                <button
                                key={layout}
                                onClick={() => updateBlock(block.id, {
                                  metadata: { ...block.metadata, gridLayout: layout }
                                })}
                                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                                  (block.metadata?.gridLayout || '2x3') === layout
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {layout}
                </button>
                            ))}
                          </div>
                        </div>

                        {/* Image Grid */}
                        <div className={`grid gap-3 mb-4 ${
                          block.metadata?.gridLayout === '1x2' ? 'grid-cols-2' :
                          block.metadata?.gridLayout === '1x3' ? 'grid-cols-3' :
                          'grid-cols-3' // Default 2x3
                        }`}>
                          {block.metadata.images.map((url, idx) => (
                            <div key={idx} className="relative group aspect-square">
                              <img src={url} alt={`Grid ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                              {/* Delete button on hover */}
            <button
              onClick={() => {
                                  const newImages = block.metadata!.images!.filter((_, i) => i !== idx);
                                  updateBlock(block.id, { 
                                    metadata: { ...block.metadata, images: newImages } 
                                  });
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-red-500/90 backdrop-blur-sm hover:bg-red-600 text-white rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove image"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
                          ))}
                        </div>
                        
                        {/* Management tools below grid */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => fileInputRefs.current[`${block.id}-grid`]?.click()}
                            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add More Images
                          </button>
            <input
                            ref={(el) => { fileInputRefs.current[`${block.id}-grid`] = el; }}
                            type="file"
                            accept="image/*"
                            multiple
                  onChange={(e) => {
                              const files = e.target.files;
                              if (files && files.length > 0) {
                                handleImageGridUpload(block.id, files);
                              }
                            }}
                            className="hidden"
                          />
              </div>
                      </div>
                    ) : (
                      // Empty state
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
                        <div className="text-center space-y-4">
                          <Grid3x3 className="w-12 h-12 text-gray-300 mx-auto" />
                          <p className="text-sm text-gray-500">Upload or paste multiple images to create a grid</p>
                          <p className="text-xs text-gray-400">
                            Tip: Copy images and paste them here (Ctrl/Cmd + V)
                          </p>
            <button
                            onClick={() => fileInputRefs.current[`${block.id}-grid`]?.click()}
                            className="px-4 py-2 text-sm bg-black text-white hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2 mx-auto"
                          >
                            <Upload className="w-4 h-4" />
                            Upload Images
            </button>
                          <input
                            ref={(el) => { fileInputRefs.current[`${block.id}-grid`] = el; }}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files && files.length > 0) {
                                handleImageGridUpload(block.id, files);
                              }
                            }}
                            className="hidden"
                          />
          </div>
                      </div>
                    )}
                  </div>
                )}

                {block.type === 'video' && (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
                    <div className="text-center">
                      <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <input
              type="url"
                        value={block.metadata?.url || ''}
                        onChange={(e) => updateBlock(block.id, { 
                          metadata: { ...block.metadata, url: e.target.value, fileType: 'video' } 
                        })}
                        placeholder="YouTube, Vimeo, or Loom URL"
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:border-black focus:outline-none"
                        autoFocus
                      />
                      {block.metadata?.url && (
                        <div className="mt-4 aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                          <p className="text-sm text-gray-500">Video: {block.metadata.url}</p>
          </div>
                      )}
                    </div>
                  </div>
                )}

                {block.type === 'embed' && (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
          <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2">File Type</label>
            <select
                          value={block.metadata?.fileType || 'pdf'}
                          onChange={(e) => updateBlock(block.id, { 
                            metadata: { ...block.metadata, fileType: e.target.value as any } 
                          })}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:border-black focus:outline-none"
                        >
                          <option value="pdf">PDF</option>
                          <option value="csv">CSV</option>
                          <option value="video">Video</option>
                          <option value="figma">Figma</option>
            </select>
          </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2">Upload or Link File</label>
                        <div className="flex gap-2">
                <input
                  type="url"
                            value={block.metadata?.url?.startsWith('data:') ? '' : (block.metadata?.url || '')}
                            onChange={(e) => updateBlock(block.id, { 
                              metadata: { ...block.metadata, url: e.target.value } 
                            })}
                            placeholder="https://example.com/file.pdf"
                            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded focus:border-black focus:outline-none"
                />
                <button
                            onClick={() => fileInputRefs.current[`${block.id}-file`]?.click()}
                            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors flex items-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            Upload
                </button>
            <input
                            ref={(el) => { fileInputRefs.current[`${block.id}-file`] = el; }}
                            type="file"
                            accept=".pdf,.csv,.mp4,.mov,.avi,.fig"
                  onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(block.id, file);
                            }}
                            className="hidden"
                          />
          </div>
          </div>
                      
            <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2">Caption (optional)</label>
              <input
                type="text"
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                          placeholder="e.g., Project Proposal Document"
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:border-black focus:outline-none"
              />
            </div>
                      
                      {block.metadata?.url && (
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-3">
                          <FileText className="w-6 h-6 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{block.content || 'Embedded File'}</p>
                            <p className="text-xs text-gray-500 uppercase">{block.metadata.fileType}</p>
          </div>
                          <a
                            href={block.metadata.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            View
                          </a>
              </div>
            )}
          </div>
          </div>
            )}
          </div>
                  </div>
                ))}
              </div>
          </div>
        ) : (
          // Preview Mode - Rendered Content (Read-only)
          <div className={`bg-white shadow-lg min-h-[800px] select-text ${
            isMobile 
              ? 'w-full max-w-md mx-4 rounded-2xl overflow-hidden' 
              : 'w-full max-w-6xl mx-auto rounded-3xl overflow-hidden'
          }`}>
            <div className="px-16 py-12 pointer-events-auto">
              {/* Project Header - Always shown */}
              <div className="mb-12">
                {/* Back Link */}
                <button
                  onClick={() => router.push(`/editor?mode=${viewMode}`)}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors mb-8"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Portfolio
                </button>

                {/* Project Title - 60px */}
                <h1 className="font-bold text-gray-900 mb-6" style={{ fontSize: '60px', lineHeight: '1.1' }}>
                  {detailData?.title || getTitle()}
                </h1>

                {/* Project Description - 30px */}
                {detailData?.description && (
                  <p className="text-gray-700 mb-6" style={{ fontSize: '30px', lineHeight: '1.4' }}>
                    {detailData.description}
                  </p>
                )}

                {/* Tags */}
                {detailData?.tags && detailData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {detailData.tags.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                ))}
              </div>
                )}

                {/* Project Link */}
                {detailData?.link && (
                  <a
                    href={detailData.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-base text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" />
                    {detailData.link}
                  </a>
                )}

                {/* Separator Line */}
                <div className="mt-8 border-b border-gray-200" />
              </div>

              {/* Blocks Content */}
              <div className="space-y-6">
                {blocks.map((block) => (
                  <div key={block.id}>
                    {block.type === 'h1' && block.content && (
                      <h1 className="text-4xl font-bold text-black">{block.content}</h1>
                    )}
                    {block.type === 'h2' && block.content && (
                      <h2 className="text-3xl font-bold text-black">{block.content}</h2>
                    )}
                    {block.type === 'h3' && block.content && (
                      <h3 className="text-2xl font-semibold text-black">{block.content}</h3>
                    )}
                    {block.type === 'text' && block.content && (
                      <p className="text-base text-gray-900 whitespace-pre-wrap">{block.content}</p>
                    )}
                    {block.type === 'image' && block.metadata?.url && (
                      <div className="inline-block" style={{ width: block.metadata?.width || '100%' }}>
                        <img src={block.metadata.url} alt="Content" className="w-full rounded-lg" />
          </div>
                    )}
                    {block.type === 'image-grid' && block.metadata?.images && block.metadata.images.length > 0 && (
                      <div className={`grid gap-2 ${
                        block.metadata?.gridLayout === '1x2' ? 'grid-cols-2' :
                        block.metadata?.gridLayout === '1x3' ? 'grid-cols-3' :
                        'grid-cols-3' // Default 2x3
                      }`}>
                        {block.metadata.images.map((url: string, idx: number) => (
                          <img key={idx} src={url} alt={`Grid ${idx + 1}`} className="w-full aspect-square object-cover rounded" />
                ))}
              </div>
            )}
                    {block.type === 'video' && block.metadata?.url && (
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-sm text-gray-500">Video: {block.metadata.url}</p>
          </div>
                    )}
                    {block.type === 'embed' && block.metadata?.url && (
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-3">
                        <FileText className="w-6 h-6 text-gray-400" />
                    <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{block.content || 'Embedded File'}</p>
                          <p className="text-xs text-gray-500 uppercase">{block.metadata.fileType}</p>
                    </div>
                        <a
                          href={block.metadata.url}
                    target="_blank"
                    rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700"
                  >
                          View
                  </a>
                  </div>
                    )}
                  </div>
                ))}
              </div>
          </div>
              </div>
        )}

        {/* Add Block Button at Bottom - Edit Mode Only */}
        {viewMode === 'edit' && (
          <button
            onClick={() => {
              const newBlock: Block = { id: crypto.randomUUID(), type: 'text', content: '' };
              saveBlocks([...blocks, newBlock]);
            }}
            className="mt-2 w-full py-2 text-sm text-gray-400 hover:text-black transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add block
          </button>
            )}
          </div>
      </div>

      {/* Slash Command Menu - Only in edit mode */}
      {viewMode === 'edit' && showSlashMenu && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowSlashMenu(false)}
          />
          <div 
            className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-xl w-64"
            style={{ top: slashMenuPosition.top + 4, left: slashMenuPosition.left }}
          >
            <div className="p-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search blocks..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:border-black focus:outline-none mb-2"
                autoFocus
              />
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {filteredBlockTypes.map((bt) => (
                  <button
                    key={bt.type}
                    onClick={() => addBlock(bt.type)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-900 hover:bg-gray-50 rounded transition-colors text-left"
                  >
                    <bt.icon className="w-4 h-4 text-gray-500" />
                    <div className="flex-1">
                      <div className="font-medium">{bt.label}</div>
                      <div className="text-xs text-gray-400">{bt.shortcut}</div>
                    </div>
                  </button>
                ))}
              </div>
          </div>
              </div>
        </>
            )}
          </div>
        );
}
