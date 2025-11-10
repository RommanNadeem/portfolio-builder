'use client';

import { TemplateBlock } from './types';
import {
  HeroBlock,
  CalloutBlock,
  RichTextBlock,
  BulletsBlock,
  StepsBlock,
  FeatureGridBlock,
  GalleryBlock,
  MetricsBlock,
  EmbedBlock,
} from './blocks';

interface TemplateRendererProps {
  blocks: TemplateBlock[];
  onChange: (blocks: TemplateBlock[]) => void;
  mode: 'edit' | 'preview';
  entityType?: 'project' | 'career'; // Optional entity type for block customization
}

export function TemplateRenderer({ blocks, onChange, mode, entityType }: TemplateRendererProps) {
  const updateBlock = (index: number, updatedBlock: TemplateBlock) => {
    const newBlocks = [...blocks];
    newBlocks[index] = updatedBlock;
    onChange(newBlocks);
  };

  const renderBlock = (block: TemplateBlock, index: number) => {
    const commonProps = {
      mode,
      onChange: (updatedBlock: TemplateBlock) => updateBlock(index, updatedBlock),
    };

    switch (block.type) {
      case 'hero':
        return <HeroBlock key={block.id} block={block} {...commonProps} entityType={entityType} />;
      case 'callout':
        return <CalloutBlock key={block.id} block={block} {...commonProps} />;
      case 'richtext':
        return <RichTextBlock key={block.id} block={block} {...commonProps} />;
      case 'bullets':
        return <BulletsBlock key={block.id} block={block} {...commonProps} />;
      case 'steps':
        return <StepsBlock key={block.id} block={block} {...commonProps} />;
      case 'feature_grid':
        return <FeatureGridBlock key={block.id} block={block} {...commonProps} />;
      case 'gallery':
        return <GalleryBlock key={block.id} block={block} {...commonProps} />;
      case 'metrics':
        return <MetricsBlock key={block.id} block={block} {...commonProps} />;
      case 'embed':
        return <EmbedBlock key={block.id} block={block} {...commonProps} />;
      default:
        return null;
    }
  };

  if (mode === 'preview') {
    return (
      <div className="space-y-16">
        {blocks.map((block, index) => renderBlock(block, index))}
      </div>
    );
  }

  // Edit mode - render blocks without extra container (parent handles spacing)
  return (
    <>
      {blocks.map((block, index) => renderBlock(block, index))}
    </>
  );
}

