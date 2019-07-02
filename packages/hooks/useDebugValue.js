function useDebugValue(value, formatter) {
  return formatter ? formatter(value) : value;
}

export default useDebugValue;
