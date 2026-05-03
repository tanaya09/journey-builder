import { getAllPrefillOptions } from '../lib/dataSources';
import type { DataSourceContext, PrefillOption } from '../lib/dataSources';

interface PrefillModalProps {
  fieldId: string;
  fieldTitle: string;
  context: DataSourceContext;
  onSelect: (option: PrefillOption) => void;
  onClose: () => void;
}

export function PrefillModal({ fieldTitle, context, onSelect, onClose }: PrefillModalProps) {
  const allOptions = getAllPrefillOptions(context);

  // Group options by their groupLabel
  const grouped = allOptions.reduce<Record<string, PrefillOption[]>>((acc, option) => {
    if (!acc[option.groupLabel]) acc[option.groupLabel] = [];
    acc[option.groupLabel].push(option);
    return acc;
  }, {});

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '8px',
        padding: '24px', width: '400px', maxHeight: '500px',
        overflowY: 'auto',
      }}>
        <h3>Pick a value for: {fieldTitle}</h3>

        {Object.entries(grouped).map(([groupLabel, options]) => (
          <div key={groupLabel} style={{ marginBottom: '16px' }}>
            <div style={{ fontWeight: 'bold', color: '#6b7280', marginBottom: '8px' }}>
              {groupLabel}
            </div>
            {options.map((option) => (
              <div
                key={`${option.sourceId}-${option.sourceFieldId}`}
                onClick={() => onSelect(option)}
                style={{
                  padding: '8px 12px', marginBottom: '4px',
                  cursor: 'pointer', borderRadius: '4px',
                  backgroundColor: '#f3f4f6',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#dbeafe')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
              >
                {option.label}
              </div>
            ))}
          </div>
        ))}

        <button onClick={onClose} style={{ marginTop: '16px', padding: '8px 16px' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}