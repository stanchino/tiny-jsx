import useMemo from './useMemo';

export default function useCallback(callback, args) {
  return useMemo(() => callback, args);
}
