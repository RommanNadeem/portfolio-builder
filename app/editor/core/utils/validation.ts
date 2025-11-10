/**
 * Validation Utilities
 * 
 * Common validation functions for portfolio data
 */

import { ValidationResult } from '../types';

/**
 * Validate required fields
 */
export function validateRequired(
  data: Record<string, any>,
  requiredFields: string[]
): ValidationResult {
  const errors: string[] = [];
  
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors.push(`${field} is required`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Validate URL format
 */
export function validateUrl(url: string): boolean {
  if (!url) return true; // Empty is valid (optional field)
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  if (!email) return true; // Empty is valid (optional field)
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate date format (YYYY-MM-DD or "Present" or month/year)
 */
export function validateDate(date: string): boolean {
  if (!date) return true;
  if (date.toLowerCase() === 'present') return true;
  
  // Check various formats
  const formats = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{4}-\d{2}$/, // YYYY-MM
    /^[A-Za-z]{3}\s\d{4}$/, // Jan 2020
    /^[A-Za-z]+\s\d{4}$/, // January 2020
  ];
  
  return formats.some(format => format.test(date));
}

