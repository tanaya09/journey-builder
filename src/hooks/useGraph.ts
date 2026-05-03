import { useState, useEffect } from 'react';
import type { BlueprintGraph } from '../types/graph';
import { fetchGraph } from '../api/fetchGraph';

export function useGraph() {
  const [graph, setGraph] = useState<BlueprintGraph | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGraph()
      .then((data) => {
        setGraph(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { graph, loading, error };
}