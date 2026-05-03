import type { GraphEdge } from '../types/graph';

// Returns direct parent node IDs (one step back)
export function getDirectDeps(nodeId: string, edges: GraphEdge[]): string[] {
  return edges
    .filter((edge) => edge.target === nodeId)
    .map((edge) => edge.source);
}

// Returns ALL ancestor node IDs (all steps back)
export function getTransitiveDeps(nodeId: string, edges: GraphEdge[]): string[] {
  const visited = new Set<string>();
  const queue = [nodeId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const parents = getDirectDeps(current, edges);

    for (const parent of parents) {
      if (!visited.has(parent)) {
        visited.add(parent);
        queue.push(parent);
      }
    }
  }

  return Array.from(visited);
}