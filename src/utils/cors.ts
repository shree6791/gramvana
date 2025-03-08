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

/**
 * Utility function to make fetch requests with CORS handling
 * This is useful for making requests to APIs that might have CORS restrictions
 */
export const fetchWithCors = async (url: string, options: RequestInit = {}) => {
  // Get API key from environment variables
  const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  
  // First, try the request as is
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        'apikey': apiKey,
      },
    });
    
    return response;
  } catch (error) {
    // If the error is a CORS error, try to work around it
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.warn('CORS error detected, attempting workaround...');
      
      // For PATCH requests, try using POST with a _method parameter
      if (options.method === 'PATCH') {
        const newOptions = { 
          ...options, 
          method: 'POST',
          headers: {
            ...options.headers,
            'Content-Type': 'application/json',
            'apikey': apiKey,
          }
        };
        const newUrl = new URL(url);
        newUrl.searchParams.append('_method', 'PATCH');
        
        return fetch(newUrl.toString(), newOptions);
      }
    }
    
    // Re-throw the error if we can't handle it
    throw error;
  }
};