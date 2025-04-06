
DROP FUNCTION IF EXISTS cold_start();

CREATE OR REPLACE FUNCTION cold_start() RETURNS VOID AS $$
DECLARE
    admin_email TEXT := 'localadmin@gmail.com';  -- Set actual admin email
    admin_fullname TEXT := 'Admin User';      -- Set actual admin name
    admin_id UUID := '4f219c2a-7993-499b-b2b1-085a1b050474';
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

    INSERT INTO leaders_tb (univ_president, univ_registrar, program_chairperson, vp_academic_affairs) 
    VALUES ('EVA MARIE CODAMON-DUGYON, PhD', 'JOCELYN A. GUIMPATAN', 'ENGR, ZAIRAH JANE G. ORDILLO', 'MARY P. CACLINI, PhD');
END;
$$ LANGUAGE PLPGSQL SECURITY DEFINER;

select cold_start();