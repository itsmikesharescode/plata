
DROP FUNCTION IF EXISTS cold_start();

CREATE OR REPLACE FUNCTION cold_start() RETURNS VOID AS $$
DECLARE
    admin_email TEXT := 'localadmin@gmail.com';  -- Set actual admin email
    admin_fullname TEXT := 'Admin User';      -- Set actual admin name
    admin_id UUID := '0df249f9-3ae7-4370-96c6-75ddbb8cc7b7';
BEGIN
    -- Insert base roles
    INSERT INTO roles_tb (user_id, name) VALUES (admin_id, 'admin');

    -- Update admin user metadata
    UPDATE auth.users
    SET raw_user_meta_data = jsonb_build_object(
        'role', 'admin',
        'fullname', admin_fullname
    )
    WHERE email = admin_email;
END;
$$ LANGUAGE PLPGSQL SECURITY DEFINER;

select cold_start();