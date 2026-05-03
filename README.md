# Journey Builder: Prefill Configuration UI

A React + TypeScript app that lets admins configure prefill mappings for a DAG of forms.

## What it does

Forms in a workflow can be prefilled using data from upstream forms. This tool lets you:
- View all forms in the workflow
- Click a form to see its fields
- Configure which upstream field should prefill each field
- Clear a prefill mapping with the ✕ button

## How to run locally

### 1. Start the mock server
```bash
git clone https://github.com/mosaic-avantos/frontendchallengeserver
cd frontendchallengeserver
npm install
npm start
# Runs on http://localhost:3000
```

### 2. Start the app
```bash
git clone https://github.com/tanaya09/journey-builder
cd journey-builder
npm install
npm run dev
# Runs on http://localhost:5173
```

## Project structure

```
src/
  api/             # fetches and transforms graph data
  components/      # React UI components
    FormList       # left sidebar list of forms
    PrefillPanel   # right panel showing fields + mappings
    PrefillModal   # modal to pick a prefill source
  hooks/           # useGraph — fetches data on load
  lib/
    dag.ts         # DAG traversal (direct + transitive deps)
    dataSources.ts # pluggable data source registry
  types/           # TypeScript types for the graph
```

## Architecture — Data Source Registry

The prefill modal pulls options from a **registry of data sources**. Each source implements this interface:

```ts
interface PrefillDataSource {
  id: string;
  groupLabel: string;
  getOptions(ctx: DataSourceContext): PrefillOption[];
}
```

Currently three sources are registered:
- **Direct Dependencies** — fields from forms that directly feed into the selected form
- **Transitive Dependencies** — fields from all ancestor forms
- **Global Data** — static global values like current user email

## How to add a new data source

1. Create your source object in `src/lib/dataSources.ts`:

```ts
const myNewSource: PrefillDataSource = {
  id: 'my-source',
  groupLabel: 'My New Source',
  getOptions(ctx) {
    return [
      {
        sourceId: 'my-source',
        sourceFieldId: 'some_field',
        label: 'My Source > Some Field',
        groupLabel: 'My New Source',
      }
    ];
  },
};
```

2. Add it to the registry array at the bottom of the file:

```ts
export const DATA_SOURCES: PrefillDataSource[] = [
  directDepsSource,
  transitiveDepsSource,
  globalDataSource,
  myNewSource, // just add it here!
];
```

No other code changes needed anywhere else.

## Tech stack

- React 18
- TypeScript
- Vite
