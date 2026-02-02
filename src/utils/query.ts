/**
 * Utility functions for parsing URL query parameters
 */

/**
 * Get a number from query params with validation and fallback
 */
export function getNumberParam(
  searchParams: URLSearchParams,
  key: string,
  fallback: number,
  min?: number,
  max?: number
): number {
  const raw = searchParams.get(key);
  if (!raw) return fallback;
  
  const num = Number(raw);
  if (!Number.isFinite(num)) return fallback;
  
  // Apply bounds if specified
  let result = num;
  if (min !== undefined) result = Math.max(min, result);
  if (max !== undefined) result = Math.min(max, result);
  
  return result;
}

/**
 * Get a boolean from query params (accepts "1", "true", "yes")
 */
export function getBooleanParam(
  searchParams: URLSearchParams,
  key: string,
  fallback: boolean
): boolean {
  const raw = searchParams.get(key);
  if (!raw) return fallback;
  
  return raw === "1" || raw === "true" || raw === "yes";
}

/**
 * Get a string from query params with allowed values validation
 */
export function getStringParam<T extends string>(
  searchParams: URLSearchParams,
  key: string,
  fallback: T,
  allowedValues?: T[]
): T {
  const raw = searchParams.get(key) as T | null;
  if (!raw) return fallback;
  
  if (allowedValues && !allowedValues.includes(raw)) {
    return fallback;
  }
  
  return raw;
}
