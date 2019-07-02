import useMemo from './useMemo';

function useCallback(callback, args) {
  return useMemo(() => callback, args);
}

export default useCallback;
