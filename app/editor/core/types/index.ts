/**
 * Core Types Index
 * 
 * Central export point for all core types.
 */

// Base types
export type {
  BaseItem,
  DetailableItem,
  SectionType,
  BaseSection,
  SectionSettings,
  CRUDOperations,
  SaveStatus,
  ValidationResult,
  Portfolio,
  PortfolioSettings,
  DeepPartial,
  ItemType,
} from './base.types';

// Section-specific types
export type {
  ProjectItem,
  CareerItem,
  Impact,
  CareerImpacts,
  CompanyTenure,
  TestimonialItem,
  StrengthItem,
  SocialLinkItem,
  PersonalInfo,
  NavigationSettings,
  NavigationLink,
  FooterData,
  FooterLink,
} from './section.types';

