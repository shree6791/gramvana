export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
};

/**
 * Handles CORS preflight requests (OPTIONS)
 * Returns a Response for OPTIONS requests, or null for other methods
 * so they can continue processing
 */
export const handleCors = (req: Request): Response | null => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  // For other methods, return null to continue processing
  // The corsHeaders should be added to the final response
  return null;
};

/**
 * Adds CORS headers to any existing headers object
 * Use this for all HTTP methods (GET, POST, etc.) to ensure
 * CORS headers are included in the response
 */
export const addCorsHeaders = (headers: Record<string, string> = {}): Record<string, string> => {
  return {
    ...headers,
    ...corsHeaders,
  };
};

/**
 * Creates a standard error response with CORS headers
 */
export const createErrorResponse = (message: string, status: number = 400): Response => {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    }
  );
};

/**
 * Creates a standard success response with CORS headers
 */
export const createSuccessResponse = (data: any, status: number = 200): Response => {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    }
  );
};