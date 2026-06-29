import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getRuns } from '../storage/runs';

export function useRuns() {
  const [runs, setRuns] = useState([]);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    try {
      setError(null);
      setRuns(await getRuns());
    } catch (e) {
      setError(e);
    }
  }, []);

  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  return { runs, reload, error };
}
