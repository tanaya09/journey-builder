import type { GraphNode, GraphEdge, FormTemplate } from '../types/graph';
import { getDirectDeps, getTransitiveDeps } from './dag';

// This is the context every data source gets access to
export interface DataSourceContext {
  selectedNode: GraphNode;
  allNodes: GraphNode[];
  edges: GraphEdge[];
  forms: FormTemplate[];
}

// This is what each option in the modal looks like
export interface PrefillOption {
  sourceId: string;
  sourceFormId?: string;
  sourceFieldId: string;
  label: string;
  groupLabel: string;
}

// This is the interface every data source must implement
export interface PrefillDataSource {
  id: string;
  groupLabel: string;
  getOptions(ctx: DataSourceContext): PrefillOption[];
}

// helper to find form template from a node
function getFormForNode(node: GraphNode, forms: FormTemplate[]) {
  return forms.find((f) => f.id === node.data.component_id);
}

// Data Source 1 — Direct dependencies
const directDepsSource: PrefillDataSource = {
  id: 'direct',
  groupLabel: 'Direct Dependencies',
  getOptions(ctx) {
    const directIds = getDirectDeps(ctx.selectedNode.id, ctx.edges);
    const options: PrefillOption[] = [];

    for (const nodeId of directIds) {
      const node = ctx.allNodes.find((n) => n.id === nodeId);
      if (!node) continue;
      const form = getFormForNode(node, ctx.forms);
      if (!form) continue;

      for (const field of form.fields) {
        options.push({
          sourceId: 'direct',
          sourceFormId: node.id,
          sourceFieldId: field.id,
          label: `${node.data.name} > ${field.title}`,
          groupLabel: 'Direct Dependencies',
        });
      }
    }
    return options;
  },
};

// Data Source 2 — Transitive dependencies
const transitiveDepsSource: PrefillDataSource = {
  id: 'transitive',
  groupLabel: 'Transitive Dependencies',
  getOptions(ctx) {
    const directIds = new Set(getDirectDeps(ctx.selectedNode.id, ctx.edges));
    const allIds = getTransitiveDeps(ctx.selectedNode.id, ctx.edges);
    const transitiveOnly = allIds.filter((id) => !directIds.has(id));
    const options: PrefillOption[] = [];

    for (const nodeId of transitiveOnly) {
      const node = ctx.allNodes.find((n) => n.id === nodeId);
      if (!node) continue;
      const form = getFormForNode(node, ctx.forms);
      if (!form) continue;

      for (const field of form.fields) {
        options.push({
          sourceId: 'transitive',
          sourceFormId: node.id,
          sourceFieldId: field.id,
          label: `${node.data.name} > ${field.title}`,
          groupLabel: 'Transitive Dependencies',
        });
      }
    }
    return options;
  },
};

// Data Source 3 — Global data
const globalDataSource: PrefillDataSource = {
  id: 'global',
  groupLabel: 'Global Data',
  getOptions() {
    return [
      {
        sourceId: 'global',
        sourceFieldId: 'current_user.email',
        label: 'Current User > Email',
        groupLabel: 'Global Data',
      },
      {
        sourceId: 'global',
        sourceFieldId: 'current_user.name',
        label: 'Current User > Name',
        groupLabel: 'Global Data',
      },
      {
        sourceId: 'global',
        sourceFieldId: 'org.name',
        label: 'Organization > Name',
        groupLabel: 'Global Data',
      },
    ];
  },
};

// THIS is the registry — add a new source here to extend
export const DATA_SOURCES: PrefillDataSource[] = [
  directDepsSource,
  transitiveDepsSource,
  globalDataSource,
];

// Main function components will call
export function getAllPrefillOptions(ctx: DataSourceContext): PrefillOption[] {
  return DATA_SOURCES.flatMap((source) => source.getOptions(ctx));
}