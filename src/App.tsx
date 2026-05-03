import { useState } from 'react';
import { useGraph } from './hooks/useGraph';
import { FormList } from './components/FormList';
import { PrefillPanel } from './components/PrefillPanel';
import type { GraphNode } from './types/graph';

export default function App() {
  const { graph, loading, error } = useGraph();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  if (loading) return <div style={{ padding: '24px' }}>Loading forms...</div>;
  if (error) return <div style={{ padding: '24px' }}>Error: {error}</div>;
  if (!graph) return null;

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      <FormList
        nodes={graph.nodes}
        onSelectNode={setSelectedNode}
        selectedNodeId={selectedNode?.id ?? null}
      />
      <div style={{ flex: 1 }}>
        {selectedNode ? (
          <PrefillPanel
            node={selectedNode}
            allNodes={graph.nodes}
            edges={graph.edges}
            forms={graph.forms}
          />
        ) : (
          <div style={{ padding: '24px', color: '#6b7280' }}>
            👈 Select a form on the left to configure prefill
          </div>
        )}
      </div>
    </div>
  );
}