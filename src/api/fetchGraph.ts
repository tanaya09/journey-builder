import type { BlueprintGraph } from '../types/graph';

interface RawField {
  title?: string;
  type: string;
}

interface RawForm {
  id: string;
  name: string;
  field_schema: {
    properties: Record<string, RawField>;
  };
}

export async function fetchGraph(): Promise<BlueprintGraph> {
  const response = await fetch(
    'http://localhost:3000/api/v1/123/actions/blueprints/bp_456/graph'
  );

  if (!response.ok) {
    throw new Error('Failed to fetch graph');
  }

  const data = await response.json();

  return {
    nodes: data.nodes,
    edges: data.edges,
    forms: data.forms.map((form: RawForm) => ({
      id: form.id,
      name: form.name,
      fields: Object.entries(form.field_schema.properties).map(
        ([fieldId, fieldData]: [string, RawField]) => ({
          id: fieldId,
          title: fieldData.title || fieldId,
          type: fieldData.type,
        })
      ),
    })),
  };
}