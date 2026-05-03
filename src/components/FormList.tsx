import type { GraphNode } from '../types/graph';

interface FormListProps {
  nodes: GraphNode[];
  onSelectNode: (node: GraphNode) => void;
  selectedNodeId: string | null;
}

export function FormList({ nodes, onSelectNode, selectedNodeId }: FormListProps) {
  return (
    <div style={{ width: '250px', borderRight: '1px solid #ccc', padding: '16px' }}>
      <h2>Forms</h2>
      {nodes.map((node) => (
        <div
          key={node.id}
          onClick={() => onSelectNode(node)}
          style={{
            padding: '12px',
            marginBottom: '8px',
            cursor: 'pointer',
            borderRadius: '6px',
            backgroundColor: selectedNodeId === node.id ? '#dbeafe' : '#f3f4f6',
            border: selectedNodeId === node.id ? '2px solid #3b82f6' : '2px solid transparent',
          }}
        >
          {node.data.name}
        </div>
      ))}
    </div>
  );
}