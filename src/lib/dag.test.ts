import { describe, it, expect } from 'vitest';
import { getDirectDeps, getTransitiveDeps } from './dag';
import type { GraphEdge } from '../types/graph';

// Our test graph:
// A → B → D → F
// A → C → E → F

const edges: GraphEdge[] = [
  { source: 'form-a', target: 'form-b' },
  { source: 'form-a', target: 'form-c' },
  { source: 'form-b', target: 'form-d' },
  { source: 'form-c', target: 'form-e' },
  { source: 'form-d', target: 'form-f' },
  { source: 'form-e', target: 'form-f' },
];

describe('getDirectDeps', () => {
  it('returns direct parents of a node', () => {
    const result = getDirectDeps('form-f', edges);
    expect(result).toContain('form-d');
    expect(result).toContain('form-e');
    expect(result).toHaveLength(2);
  });

  it('returns empty array for root node', () => {
    const result = getDirectDeps('form-a', edges);
    expect(result).toHaveLength(0);
  });
});

describe('getTransitiveDeps', () => {
  it('returns all ancestors of form-f', () => {
    const result = getTransitiveDeps('form-f', edges);
    expect(result).toContain('form-d');
    expect(result).toContain('form-e');
    expect(result).toContain('form-b');
    expect(result).toContain('form-c');
    expect(result).toContain('form-a');
    expect(result).toHaveLength(5);
  });

  it('returns empty array for root node', () => {
    const result = getTransitiveDeps('form-a', edges);
    expect(result).toHaveLength(0);
  });
});