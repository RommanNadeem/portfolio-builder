import { supabase } from './supabase';

export async function saveProjectBlocks(userId: string, projectId: string, blocks: any[]) {
  try {
    console.log('[Detail DB] 💾 Saving blocks directly to Supabase...');
    console.log('[Detail DB] Project ID:', projectId);
    console.log('[Detail DB] Blocks count:', blocks.length);

    const { data, error } = await supabase
      .from('projects')
      .update({ blocks })
      .eq('id', projectId)
      .eq('user_id', userId)
      .select();

    if (error) {
      console.error('[Detail DB] ❌ Error saving blocks:', error);
      return { error: error.message };
    }

    console.log('[Detail DB] ✅ Blocks saved successfully:', data);
    return { success: true, data };
  } catch (err) {
    console.error('[Detail DB] ❌ Exception saving blocks:', err);
    return { error: (err as Error).message };
  }
}

export async function saveProjectMetadata(
  userId: string,
  projectId: string,
  updates: { title?: string; description?: string; tags?: string[]; link?: string }
) {
  try {
    console.log('[Detail DB] 💾 Saving project metadata to Supabase...');
    
    const updateData: any = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.tags !== undefined) updateData.tags = updates.tags;
    if (updates.link !== undefined) updateData.link = updates.link;

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', projectId)
      .eq('user_id', userId)
      .select();

    if (error) {
      console.error('[Detail DB] ❌ Error saving metadata:', error);
      return { error: error.message };
    }

    console.log('[Detail DB] ✅ Metadata saved successfully');
    return { success: true, data };
  } catch (err) {
    console.error('[Detail DB] ❌ Exception saving metadata:', err);
    return { error: (err as Error).message };
  }
}

