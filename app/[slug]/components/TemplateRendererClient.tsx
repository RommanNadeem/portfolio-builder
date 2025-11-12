/**
 * Client Component Wrapper for TemplateRenderer
 * 
 * Allows Server Components to use TemplateRenderer in read-only mode
 */

'use client';

import { TemplateRenderer } from '@/app/editor/templates/TemplateRenderer';

interface TemplateRendererClientProps {
  blocks: any[];
  entityType: 'project' | 'career';
}

export function TemplateRendererClient({ blocks, entityType }: TemplateRendererClientProps) {
  return (
    <TemplateRenderer
      blocks={blocks}
      onChange={() => {}} // Read-only mode
      mode="preview"
      entityType={entityType}
    />
  );
}


