import { supabase } from './supabase';

export async function saveProjectBlocks(userId: string, projectId: string, blocks: any[]) {
  try {
    console.log('[Detail DB] 💾 Saving blocks directly to Supabase...');
    console.log('[Detail DB] Project ID:', projectId);
    console.log('[Detail DB] Blocks count:', blocks.length);
    console.log('[Detail DB] Sample blocks data:', blocks.slice(0, 2)); // Log first 2 blocks for debugging

    const { data, error } = await supabase
      .from('projects')
      .update({ blocks })
      .eq('id', projectId)
      .eq('user_id', userId)
      .select();

    if (error) {
      console.error('[Detail DB] ❌ Error saving blocks:');
      console.error('  - Message:', error.message);
      console.error('  - Details:', error.details);
      console.error('  - Hint:', error.hint);
      console.error('  - Code:', error.code);
      console.error('  - Full error:', JSON.stringify(error, null, 2));
      
      // Provide helpful error messages
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        console.error('  ⚠️  SOLUTION: Run FIX_PROJECTS_TABLE.sql in Supabase SQL Editor');
      }
      
      return { error: error.message };
    }

    console.log('[Detail DB] ✅ Blocks saved successfully to database');
    console.log('[Detail DB] Saved project data:', data);
    return { success: true, data };
  } catch (err) {
    console.error('[Detail DB] ❌ Exception saving blocks:', err);
    return { error: (err as Error).message };
  }
}

export async function saveProjectMetadata(
  userId: string,
  projectId: string,
  updates: { 
    title?: string; 
    description?: string; 
    tags?: string[]; 
    link?: string;
    role?: string;
    template_type?: string;
    thumbnail_url?: string | null;  // ⭐ Added thumbnail support
    published?: boolean;
    published_at?: string;
  }
) {
  try {
    console.log('[Detail DB] 💾 Saving project metadata to Supabase...');
    console.log('[Detail DB] Project ID:', projectId);
    console.log('[Detail DB] Updates:', updates);
    
    const updateData: any = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.tags !== undefined) updateData.tags = updates.tags;
    if (updates.link !== undefined) updateData.link = updates.link;
    if (updates.role !== undefined) updateData.role = updates.role;
    if (updates.template_type !== undefined) updateData.template_type = updates.template_type;
    if (updates.thumbnail_url !== undefined) updateData.thumbnail_url = updates.thumbnail_url;  // ⭐ Save thumbnail
    if (updates.published !== undefined) updateData.published = updates.published;
    if (updates.published_at !== undefined) updateData.published_at = updates.published_at;

    console.log('[Detail DB] Prepared update data:', updateData);

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', projectId)
      .eq('user_id', userId)
      .select();

    if (error) {
      console.error('[Detail DB] ❌ Error saving metadata:');
      console.error('  - Message:', error.message);
      console.error('  - Details:', error.details);
      console.error('  - Hint:', error.hint);
      console.error('  - Code:', error.code);
      console.error('  - Full error:', JSON.stringify(error, null, 2));
      
      // Provide helpful error messages for common issues
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        console.error('  ⚠️  SOLUTION: Run FIX_PROJECTS_TABLE.sql in Supabase SQL Editor');
        console.error('  📁 File location: FIX_PROJECTS_TABLE.sql in your project root');
      }
      if (error.message.includes('violates row-level security')) {
        console.error('  ⚠️  SOLUTION: Check RLS policies in Supabase dashboard');
      }
      
      return { error: error.message };
    }

    console.log('[Detail DB] ✅ Metadata saved successfully to database');
    console.log('[Detail DB] Updated project:', data);
    
    // Log template-specific fields if they were updated
    if (updates.template_type) {
      console.log('[Detail DB] ✨ Template type saved:', updates.template_type);
    }
    if (updates.role) {
      console.log('[Detail DB] ✨ Role saved:', updates.role);
    }
    
    return { success: true, data };
  } catch (err) {
    console.error('[Detail DB] ❌ Exception saving metadata:', err);
    return { error: (err as Error).message };
  }
}

// ============================================
// CAREER HIGHLIGHTS FUNCTIONS
// ============================================

export async function saveCareerBlocks(userId: string, careerId: string, blocks: any[]) {
  try {
    console.log('[Detail DB] 💾 Saving career blocks directly to Supabase...');
    console.log('[Detail DB] Career ID:', careerId);
    console.log('[Detail DB] Blocks count:', blocks.length);

    const { data, error } = await supabase
      .from('career_highlights')
      .update({ blocks })
      .eq('id', careerId)
      .eq('user_id', userId)
      .select();

    if (error) {
      console.error('[Detail DB] ❌ Error saving career blocks:', error);
      return { error: error.message };
    }

    console.log('[Detail DB] ✅ Career blocks saved successfully:', data);
    return { success: true, data };
  } catch (err) {
    console.error('[Detail DB] ❌ Exception saving career blocks:', err);
    return { error: (err as Error).message };
  }
}

export async function saveCareerMetadata(
  userId: string,
  careerId: string,
  updates: { 
    organization?: string;
    role?: string;
    description?: string;
    link?: string;
    start_date?: string;
    end_date?: string;
    is_current?: boolean;
    achievements?: string[];
    template_type?: string;
    published?: boolean;
    published_at?: string;
  }
) {
  try {
    console.log('[Detail DB] 💾 Saving career metadata to Supabase...');
    console.log('[Detail DB] Updates:', updates);
    
    const updateData: any = {};
    if (updates.organization !== undefined) updateData.organization = updates.organization;
    if (updates.role !== undefined) updateData.role = updates.role;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.link !== undefined) updateData.link = updates.link;
    if (updates.start_date !== undefined) updateData.start_date = updates.start_date;
    if (updates.end_date !== undefined) updateData.end_date = updates.end_date;
    if (updates.is_current !== undefined) updateData.is_current = updates.is_current;
    if (updates.achievements !== undefined) updateData.achievements = updates.achievements;
    if (updates.template_type !== undefined) updateData.template_type = updates.template_type;
    if (updates.published !== undefined) updateData.published = updates.published;
    if (updates.published_at !== undefined) updateData.published_at = updates.published_at;

    const { data, error } = await supabase
      .from('career_highlights')
      .update(updateData)
      .eq('id', careerId)
      .eq('user_id', userId)
      .select();

    if (error) {
      console.error('[Detail DB] ❌ Error saving career metadata:', error);
      return { error: error.message };
    }

    console.log('[Detail DB] ✅ Career metadata saved successfully:', data);
    return { success: true, data };
  } catch (err) {
    console.error('[Detail DB] ❌ Exception saving career metadata:', err);
    return { error: (err as Error).message };
  }
}

