import { useState, useCallback } from 'react';
import { useCoachProfile } from './useCoachProfile';

export function useAdGate() {
  const { profile } = useCoachProfile();
  const isPro = profile?.plan === 'pro';

  const [showAdGate, setShowAdGate] = useState(false);
  const [pendingFn, setPendingFn] = useState<(() => void) | null>(null);
  const [featureName, setFeatureName] = useState('esta función');

  // Wrap any AI function — shows AdGate for Free users, runs directly for Pro
  const withAdGate = useCallback((fn: () => void, name = 'esta función') => {
    if (isPro) {
      fn();
    } else {
      setFeatureName(name);
      setPendingFn(() => fn);
      setShowAdGate(true);
    }
  }, [isPro]);

  const handleAdComplete = useCallback(() => {
    setShowAdGate(false);
    if (pendingFn) {
      pendingFn();
      setPendingFn(null);
    }
  }, [pendingFn]);

  const handleAdCancel = useCallback(() => {
    setShowAdGate(false);
    setPendingFn(null);
  }, []);

  return {
    isPro,
    withAdGate,
    showAdGate,
    featureName,
    handleAdComplete,
    handleAdCancel,
  };
}
