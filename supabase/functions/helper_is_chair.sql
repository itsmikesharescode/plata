DROP FUNCTION IF EXISTS is_chair();

CREATE OR REPLACE FUNCTION is_chair() RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS(
        SELECT 1 FROM roles_tb WHERE name = 'chair' AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


