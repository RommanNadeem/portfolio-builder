/**
 * V3 Template System - Data Flow Test Utility
 * 
 * Run these tests in the browser console to verify data flow
 * between V2 portfolio entities and V3 template blocks.
 * 
 * Usage:
 * 1. Open browser console on /editor page
 * 2. Copy and paste this file
 * 3. Run: await testV3DataFlow()
 */

import { entityDocumentManager } from '../core/EntityDocumentManager';
import { templateInitializerFactory } from '../adapters/EntityToTemplateAdapter';

export interface TestResult {
  test: string;
  passed: boolean;
  error?: string;
  data?: any;
}

/**
 * Test Suite for V3 Data Flow
 */
export async function testV3DataFlow(): Promise<TestResult[]> {
  console.log('🧪 Starting V3 Data Flow Tests...\n');
  
  const results: TestResult[] = [];
  
  // Test 1: Load existing project
  results.push(await testLoadProject());
  
  // Test 2: Load existing career
  results.push(await testLoadCareer());
  
  // Test 3: Initialize project template
  results.push(await testInitializeProjectTemplate());
  
  // Test 4: Initialize career template
  results.push(await testInitializeCareerTemplate());
  
  // Test 5: Sync project entity
  results.push(await testSyncProjectEntity());
  
  // Test 6: Sync career entity
  results.push(await testSyncCareerEntity());
  
  // Test 7: Validate document
  results.push(await testValidateDocument());
  
  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('─────────────────────────────────────');
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📋 Total: ${results.length}`);
  
  results.forEach((result, i) => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} Test ${i + 1}: ${result.test}`);
    if (!result.passed && result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });
  
  return results;
}

/**
 * Test 1: Load existing project from portfolio
 */
async function testLoadProject(): Promise<TestResult> {
  try {
    console.log('Test 1: Load existing project...');
    
    // Get first project from portfolio
    const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '{}');
    const projects = portfolioData.projects || [];
    
    if (projects.length === 0) {
      return {
        test: 'Load existing project',
        passed: false,
        error: 'No projects found in portfolio',
      };
    }
    
    const projectId = projects[0].id;
    const result = await entityDocumentManager.loadFromPortfolio(projectId, 'project');
    
    if (!result.success || !result.document) {
      return {
        test: 'Load existing project',
        passed: false,
        error: result.error || 'Failed to load',
      };
    }
    
    console.log('✅ Project loaded:', {
      id: result.document.id,
      title: result.document.entity_data.title,
      blocks: result.document.template.blocks.length,
    });
    
    return {
      test: 'Load existing project',
      passed: true,
      data: result.document,
    };
  } catch (error: any) {
    return {
      test: 'Load existing project',
      passed: false,
      error: error.message,
    };
  }
}

/**
 * Test 2: Load existing career from portfolio
 */
async function testLoadCareer(): Promise<TestResult> {
  try {
    console.log('\nTest 2: Load existing career...');
    
    // Get first career from portfolio
    const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '{}');
    const careers = portfolioData.careerHighlights || [];
    
    if (careers.length === 0) {
      return {
        test: 'Load existing career',
        passed: false,
        error: 'No career highlights found in portfolio',
      };
    }
    
    const careerId = careers[0].id;
    const result = await entityDocumentManager.loadFromPortfolio(careerId, 'career');
    
    if (!result.success || !result.document) {
      return {
        test: 'Load existing career',
        passed: false,
        error: result.error || 'Failed to load',
      };
    }
    
    console.log('✅ Career loaded:', {
      id: result.document.id,
      organization: result.document.entity_data.organization,
      role: result.document.entity_data.role,
      blocks: result.document.template.blocks.length,
    });
    
    return {
      test: 'Load existing career',
      passed: true,
      data: result.document,
    };
  } catch (error: any) {
    return {
      test: 'Load existing career',
      passed: false,
      error: error.message,
    };
  }
}

/**
 * Test 3: Initialize project template
 */
async function testInitializeProjectTemplate(): Promise<TestResult> {
  try {
    console.log('\nTest 3: Initialize project template...');
    
    const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '{}');
    const projects = portfolioData.projects || [];
    
    if (projects.length === 0) {
      return {
        test: 'Initialize project template',
        passed: false,
        error: 'No projects found',
      };
    }
    
    const project = projects[0];
    const blocks = templateInitializerFactory.initializeTemplate(
      'project',
      project,
      'product-case-study'
    );
    
    if (!blocks || blocks.length === 0) {
      return {
        test: 'Initialize project template',
        passed: false,
        error: 'No blocks created',
      };
    }
    
    // Verify hero block is pre-filled
    const heroBlock = blocks[0];
    const hasTitle = heroBlock?.data?.title === project.title;
    
    console.log('✅ Template initialized:', {
      blocks: blocks.length,
      hero_prefilled: hasTitle,
    });
    
    return {
      test: 'Initialize project template',
      passed: hasTitle,
      data: { blocks, heroBlock },
    };
  } catch (error: any) {
    return {
      test: 'Initialize project template',
      passed: false,
      error: error.message,
    };
  }
}

/**
 * Test 4: Initialize career template
 */
async function testInitializeCareerTemplate(): Promise<TestResult> {
  try {
    console.log('\nTest 4: Initialize career template...');
    
    const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '{}');
    const careers = portfolioData.careerHighlights || [];
    
    if (careers.length === 0) {
      return {
        test: 'Initialize career template',
        passed: false,
        error: 'No career highlights found',
      };
    }
    
    const career = careers[0];
    const blocks = templateInitializerFactory.initializeTemplate(
      'career',
      career,
      'career-experience'
    );
    
    if (!blocks || blocks.length === 0) {
      return {
        test: 'Initialize career template',
        passed: false,
        error: 'No blocks created',
      };
    }
    
    // Verify hero block is pre-filled
    const heroBlock = blocks[0];
    const hasOrg = heroBlock?.data?.title === career.organization;
    const hasRole = heroBlock?.data?.subtitle === career.role;
    
    console.log('✅ Career template initialized:', {
      blocks: blocks.length,
      hero_organization: hasOrg,
      hero_role: hasRole,
    });
    
    return {
      test: 'Initialize career template',
      passed: hasOrg && hasRole,
      data: { blocks, heroBlock },
    };
  } catch (error: any) {
    return {
      test: 'Initialize career template',
      passed: false,
      error: error.message,
    };
  }
}

/**
 * Test 5: Sync project entity (template → entity)
 */
async function testSyncProjectEntity(): Promise<TestResult> {
  try {
    console.log('\nTest 5: Sync project entity...');
    
    const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '{}');
    const projects = portfolioData.projects || [];
    
    if (projects.length === 0) {
      return {
        test: 'Sync project entity',
        passed: false,
        error: 'No projects found',
      };
    }
    
    const projectId = projects[0].id;
    const loadResult = await entityDocumentManager.loadFromPortfolio(projectId, 'project');
    
    if (!loadResult.success || !loadResult.document) {
      return {
        test: 'Sync project entity',
        passed: false,
        error: 'Failed to load project',
      };
    }
    
    // Modify hero block
    const document = loadResult.document;
    if (document.template.blocks[0]?.type === 'hero') {
      document.template.blocks[0].data.title = 'TEST PROJECT TITLE';
      document.template.blocks[0].data.imageUrl = 'https://example.com/test.jpg';
    }
    
    // Save (this triggers sync)
    const saveResult = await entityDocumentManager.saveToPortfolio(document);
    
    if (!saveResult.success) {
      return {
        test: 'Sync project entity',
        passed: false,
        error: saveResult.error || 'Save failed',
      };
    }
    
    // Verify entity was updated
    const updatedEntity = saveResult.updated_entity;
    const titleSynced = updatedEntity.title === 'TEST PROJECT TITLE';
    const thumbnailSynced = updatedEntity.thumbnail === 'https://example.com/test.jpg';
    
    console.log('✅ Project entity synced:', {
      title_synced: titleSynced,
      thumbnail_synced: thumbnailSynced,
    });
    
    return {
      test: 'Sync project entity',
      passed: titleSynced && thumbnailSynced,
      data: updatedEntity,
    };
  } catch (error: any) {
    return {
      test: 'Sync project entity',
      passed: false,
      error: error.message,
    };
  }
}

/**
 * Test 6: Sync career entity (template → entity)
 */
async function testSyncCareerEntity(): Promise<TestResult> {
  try {
    console.log('\nTest 6: Sync career entity...');
    
    const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '{}');
    const careers = portfolioData.careerHighlights || [];
    
    if (careers.length === 0) {
      return {
        test: 'Sync career entity',
        passed: false,
        error: 'No career highlights found',
      };
    }
    
    const careerId = careers[0].id;
    const loadResult = await entityDocumentManager.loadFromPortfolio(careerId, 'career');
    
    if (!loadResult.success || !loadResult.document) {
      return {
        test: 'Sync career entity',
        passed: false,
        error: 'Failed to load career',
      };
    }
    
    // Initialize template if needed
    const document = loadResult.document;
    if (document.template.blocks.length === 0) {
      const blocks = templateInitializerFactory.initializeTemplate(
        'career',
        document.entity_data,
        'career-experience'
      );
      document.template.blocks = blocks;
    }
    
    // Modify achievements block
    const achievementsBlock = document.template.blocks.find(
      (b: any, idx: number) => b.type === 'bullets' && idx === 3
    );
    
    if (achievementsBlock) {
      achievementsBlock.data.bullets = ['TEST ACHIEVEMENT 1', 'TEST ACHIEVEMENT 2'];
    }
    
    // Save (this triggers sync)
    const saveResult = await entityDocumentManager.saveToPortfolio(document);
    
    if (!saveResult.success) {
      return {
        test: 'Sync career entity',
        passed: false,
        error: saveResult.error || 'Save failed',
      };
    }
    
    // Verify achievements were synced
    const updatedEntity = saveResult.updated_entity;
    const achievementsSynced = 
      updatedEntity.achievements?.includes('TEST ACHIEVEMENT 1') &&
      updatedEntity.achievements?.includes('TEST ACHIEVEMENT 2');
    
    console.log('✅ Career entity synced:', {
      achievements_synced: achievementsSynced,
      achievements_count: updatedEntity.achievements?.length || 0,
    });
    
    return {
      test: 'Sync career entity',
      passed: achievementsSynced,
      data: updatedEntity,
    };
  } catch (error: any) {
    return {
      test: 'Sync career entity',
      passed: false,
      error: error.message,
    };
  }
}

/**
 * Test 7: Validate document
 */
async function testValidateDocument(): Promise<TestResult> {
  try {
    console.log('\nTest 7: Validate document...');
    
    const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '{}');
    const projects = portfolioData.projects || [];
    
    if (projects.length === 0) {
      return {
        test: 'Validate document',
        passed: false,
        error: 'No projects found',
      };
    }
    
    const projectId = projects[0].id;
    const loadResult = await entityDocumentManager.loadFromPortfolio(projectId, 'project');
    
    if (!loadResult.success || !loadResult.document) {
      return {
        test: 'Validate document',
        passed: false,
        error: 'Failed to load project',
      };
    }
    
    const validationResult = entityDocumentManager.validateDocument(loadResult.document);
    
    console.log('✅ Document validated:', {
      valid: validationResult.valid,
      errors: validationResult.errors.length,
      warnings: validationResult.warnings?.length || 0,
    });
    
    return {
      test: 'Validate document',
      passed: validationResult.valid,
      data: validationResult,
    };
  } catch (error: any) {
    return {
      test: 'Validate document',
      passed: false,
      error: error.message,
    };
  }
}

// Export for browser console
if (typeof window !== 'undefined') {
  (window as any).testV3DataFlow = testV3DataFlow;
  console.log('✅ V3 Test utility loaded. Run: await testV3DataFlow()');
}

