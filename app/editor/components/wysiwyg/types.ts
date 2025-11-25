export interface TextStyle {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: number;
  color?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline' | 'line-through';
  lineHeight?: string;
  letterSpacing?: string;
}

export interface StyleUpdateEvent {
  field: string;
  style: TextStyle;
}






