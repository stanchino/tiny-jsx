export default function useDebugValue(value, formatter) {
  return formatter ? formatter(value) : value;
}
