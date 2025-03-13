-- Create a stored procedure to update profiles
-- This avoids CORS issues with PATCH requests by using RPC (POST) instead
CREATE OR REPLACE FUNCTION public.update_profile(
    profile_data JSONB  -- Accepting a single JSONB parameter
)
RETURNS VOID AS $$
DECLARE
    p_id UUID;
    p_allergies TEXT[];
    p_bodyWeight INT;
    p_dietaryPreferences TEXT[];
    p_enableMealPlanning BOOLEAN;
    p_healthGoals TEXT;
    p_updated_at TIMESTAMP;
BEGIN
    -- Extract values from JSON (fixed keys & structure)
    p_id := (profile_data->>'p_id')::UUID;
    p_allergies := ARRAY(SELECT jsonb_array_elements_text(profile_data->'allergies'));
    p_bodyWeight := (profile_data->>'bodyWeight')::INT;
    p_dietaryPreferences := ARRAY(SELECT jsonb_array_elements_text(profile_data->'dietaryPreferences'));
    p_enableMealPlanning := (profile_data->>'enableMealPlanning')::BOOLEAN;
    p_healthGoals := profile_data->>'healthGoals';
    p_updated_at := (profile_data->>'updated_at')::TIMESTAMP;

    -- Update table (fixed column names)
    UPDATE profiles
    SET allergies = p_allergies,
        "bodyWeight" = p_bodyWeight,
        "dietaryPreferences" = p_dietaryPreferences,
        "enableMealPlanning" = p_enableMealPlanning,
        "healthGoals" = p_healthGoals,
        updated_at = p_updated_at
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;


-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_profile(JSONB) TO authenticated;