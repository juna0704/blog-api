// tests/unit/genSlug.test.ts
import { genSlug } from '../../src/utils/index';

describe('genSlug util', () => {
  it('creates a URL-friendly slug with random suffix', () => {
    const title = 'Hello World! This is Test Title';
    const slug = genSlug(title);
    
    expect(typeof slug).toBe('string');
    expect(slug.length).toBeGreaterThan(0);
    expect(slug).toBe(slug.toLowerCase());
    expect(slug).toMatch(/^[a-z0-9-]+$/);
    expect(slug).toContain('hello');
    expect(slug).toContain('world');
    expect(slug).toContain('test');
    expect(slug).toContain('title');
    
    const parts = slug.split('-');
    expect(parts.length).toBeGreaterThan(1);
    
    const lastPart = parts[parts.length - 1];
    expect(lastPart).toMatch(/^[a-z0-9]+$/);
    expect(lastPart.length).toBeGreaterThan(5);
  });

  it('handles special characters correctly', () => {
    const title = 'Test@#$%Title!!!';
    const slug = genSlug(title);
    
    expect(slug).toContain('test');
    expect(slug).toContain('title');
    expect(slug).not.toMatch(/[@#$%!]/);
    expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it('generates unique slugs for same title', () => {
    const title = 'Same Title';
    const slug1 = genSlug(title);
    const slug2 = genSlug(title);
    
    expect(slug1).not.toBe(slug2);
    expect(slug1).toContain('same');
    expect(slug1).toContain('title');
    expect(slug2).toContain('same');
    expect(slug2).toContain('title');
  });

  it('handles empty spaces and trims correctly', () => {
    const title = '   Multiple    Spaces    Here   ';
    const slug = genSlug(title);
    
    expect(slug).toContain('multiple');
    expect(slug).toContain('spaces');
    expect(slug).toContain('here');
    expect(slug).not.toContain('--');
    expect(slug).not.toMatch(/^-/);
    expect(slug).not.toMatch(/-$/);
  });

  it('handles hyphens in original title', () => {
    const title = 'This-Has-Hyphens';
    const slug = genSlug(title);
    
    expect(slug).toContain('this');
    expect(slug).toContain('has');
    expect(slug).toContain('hyphens');
    expect(slug).not.toContain('--');
  });

  it('returns different slugs on multiple calls', () => {
    const title = 'Unique Test';
    const slugs = new Set();
    
    for (let i = 0; i < 5; i++) {
      slugs.add(genSlug(title));
    }
    
    expect(slugs.size).toBe(5);
  });
});
