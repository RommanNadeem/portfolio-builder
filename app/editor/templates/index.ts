// Export all template components and utilities
export * from './types';
export * from './configs';
export * from './shared-utils';

// Components
export { TemplateSelector } from './TemplateSelector';
export { TemplateRenderer } from './TemplateRenderer';
export { TemplateSectionEditor } from './TemplateSectionEditor';
export { TemplateCustomizer } from './TemplateCustomizer';
export { SlashCommandMenu } from './SlashCommandMenu';
export { FocusMode, InlineFocusWrapper, useFocusMode } from './FocusMode';
export { DragHandle, EnhancedDragHandle, FloatingDragHandle } from './DragHandle';
export { BlockSelector } from './BlockSelector';
export { BaseTemplateEditor } from './BaseTemplateEditor';
export { NotionStyleSection } from './NotionStyleSection';

// Hooks
export { useTemplateState } from './hooks/useTemplateState';
export { useTemplatePersistence } from './hooks/useTemplatePersistence';

// Blocks (components only, types are from ./types)
export { HeroBlock, CalloutBlock, RichTextBlock, BulletsBlock, StepsBlock, FeatureGridBlock, GalleryBlock, MetricsBlock, EmbedBlock } from './blocks';
export { ImagePlaceholder, GalleryPlaceholder, LogoPlaceholder } from './blocks/ImagePlaceholder';

