import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { corsHeaders, handleCors, createSuccessResponse, createErrorResponse } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Get the authorization header from the request
  const authHeader = req.headers.get('Authorization');
  const apiKey = req.headers.get('apikey') || supabaseAnonKey;
  
  if (!authHeader) {
    return createErrorResponse('Missing authorization header', 401);
  }

  try {
    // Create Supabase client with the user's JWT and API key
    const supabase = createClient(supabaseUrl, apiKey, {
      global: {
        headers: {
          Authorization: authHeader,
          'apikey': apiKey,
          'Content-Type': 'application/json',
        },
      },
    });

    // Get the user ID from the JWT
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return createErrorResponse('User not authenticated', 401);
    }

    // Parse request body
    const profileData = await req.json();

    // Update the profile in the database
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select();

    if (error) {
      return createErrorResponse(`Error updating profile: ${error.message}`, 400);
    }

    // Return success response
    return createSuccessResponse({
      message: 'Profile updated successfully',
      data
    });
  } catch (error) {
    return createErrorResponse(`Server error: ${error.message}`, 500);
  }
});