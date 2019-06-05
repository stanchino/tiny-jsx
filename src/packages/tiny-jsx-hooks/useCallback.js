import { useMemo } from './useMemo';

export function useCallback(callback, args) {
  return useMemo(() => callback, args);
}
