import { useState } from 'react';
import type { GraphNode, GraphEdge, FormTemplate } from '../types/graph';
import type { PrefillOption } from '../lib/dataSources';
import { PrefillModal } from './PrefillModal';

interface PrefillPanelProps {
  node: GraphNode;
  allNodes: GraphNode[];
  edges: GraphEdge[];
  forms: FormTemplate[];
}

export function PrefillPanel({ node, allNodes, edges, forms }: PrefillPanelProps) {
  const [mappings, setMappings] = useState<Record<string, PrefillOption>>({});
  const [activeField, setActiveField] = useState<{ id: string; title: string } | null>(null);

  // Find the form template for this node
  const formTemplate = forms.find((f) => f.id === node.data.component_id);

  if (!formTemplate) return <div>No form template found</div>;

  const handleSelect = (option: PrefillOption) => {
    if (!activeField) return;
    setMappings((prev) => ({ ...prev, [activeField.id]: option }));
    setActiveField(null);
  };

  const handleClear = (fieldId: string) => {
    setMappings((prev) => {
      const updated = { ...prev };
      delete updated[fieldId];
      return updated;
    });
  };

  const context = { selectedNode: node, allNodes, edges, forms };

  return (
    <div style={{ flex: 1, padding: '24px' }}>
      <h2>{node.data.name} — Prefill Configuration</h2>
      <p style={{ color: '#6b7280' }}>Click a field to configure its prefill source</p>

      {formTemplate.fields
  .filter((field) => field.type !== 'object' || field.id !== 'button')
  .map((field) => {
        const mapping = mappings[field.id];
        return (
          <div
            key={field.id}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', marginBottom: '8px', borderRadius: '6px',
              backgroundColor: mapping ? '#dbeafe' : '#f3f4f6',
              border: '1px solid #e5e7eb', cursor: 'pointer',
            }}
            onClick={() => !mapping && setActiveField({ id: field.id, title: field.title })}
          >
            <span>{mapping ? `${field.title}: ${mapping.label}` : field.title}</span>
            {mapping && (
              <button
                onClick={(e) => { e.stopPropagation(); handleClear(field.id); }}
                style={{
                  background: 'none', border: 'none',
                  cursor: 'pointer', fontSize: '16px', color: '#6b7280',
                }}
              >
                ✕
              </button>
            )}
          </div>
        );
      })}

      {activeField && (
        <PrefillModal
          fieldId={activeField.id}
          fieldTitle={activeField.title}
          context={context}
          onSelect={handleSelect}
          onClose={() => setActiveField(null)}
        />
      )}
    </div>
  );
}