export interface FormField {
  id: string;
  title: string;
  type: string;
}

export interface FormTemplate {
  id: string;
  name: string;
  fields: FormField[];
}

export interface GraphNode {
  id: string;
  type: string;
  data: {
    name: string;
    component_id: string;
    prerequisites: string[];
  };
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface BlueprintGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  forms: FormTemplate[];
}