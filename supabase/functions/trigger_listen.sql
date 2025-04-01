CREATE OR REPLACE FUNCTION listen_to_changes() RETURNS VOID AS $$
DECLARE
    var_channel_name TEXT := 'public.users_tb';
    var_event_name TEXT := 'channel_insert';
BEGIN
    -- Create triggers for each table we want to monitor
    -- classrooms_tb trigger
    CREATE OR REPLACE FUNCTION log_classroom_changes() RETURNS TRIGGER AS $classroom_trigger$
    BEGIN
        IF TG_OP = 'INSERT' THEN
            INSERT INTO history_tb (created_at, user_id, tb_location, action_type)
            VALUES (now(), auth.uid(), 'classrooms_tb', 'CREATE');
        ELSIF TG_OP = 'UPDATE' THEN
            INSERT INTO history_tb (created_at, user_id, tb_location, action_type)
            VALUES (now(), auth.uid(), 'classrooms_tb', 'UPDATE');
        ELSIF TG_OP = 'DELETE' THEN
            INSERT INTO history_tb (created_at, user_id, tb_location, action_type)
            VALUES (now(), auth.uid(), 'classrooms_tb', 'DELETE');
        END IF;
        RETURN NULL;
    END;
    $classroom_trigger$ LANGUAGE plpgsql SECURITY DEFINER;

    -- faculties_tb trigger
    CREATE OR REPLACE FUNCTION log_faculties_changes() RETURNS TRIGGER AS $faculties_trigger$
    BEGIN
        IF TG_OP = 'INSERT' THEN
            INSERT INTO history_tb (created_at, user_id, tb_location, action_type)
            VALUES (now(), auth.uid(), 'faculties_tb', 'CREATE');
        ELSIF TG_OP = 'UPDATE' THEN
            INSERT INTO history_tb (created_at, user_id, tb_location, action_type)
            VALUES (now(), auth.uid(), 'faculties_tb', 'UPDATE');
        ELSIF TG_OP = 'DELETE' THEN
            INSERT INTO history_tb (created_at, user_id, tb_location, action_type)
            VALUES (now(), auth.uid(), 'faculties_tb', 'DELETE');
        END IF;
        RETURN NULL;
    END;
    $faculties_trigger$ LANGUAGE plpgsql SECURITY DEFINER;

    -- programs_tb trigger
    CREATE OR REPLACE FUNCTION log_programs_changes() RETURNS TRIGGER AS $programs_trigger$
    BEGIN
        IF TG_OP = 'INSERT' THEN
            INSERT INTO history_tb (created_at, user_id, tb_location, action_type)
            VALUES (now(), auth.uid(), 'programs_tb', 'CREATE');
        ELSIF TG_OP = 'UPDATE' THEN
            INSERT INTO history_tb (created_at, user_id, tb_location, action_type)
            VALUES (now(), auth.uid(), 'programs_tb', 'UPDATE');
        ELSIF TG_OP = 'DELETE' THEN
            INSERT INTO history_tb (created_at, user_id, tb_location, action_type)
            VALUES (now(), auth.uid(), 'programs_tb', 'DELETE');
        END IF;
        RETURN NULL;
    END;
    $programs_trigger$ LANGUAGE plpgsql SECURITY DEFINER;

    -- subjects_tb trigger
    CREATE OR REPLACE FUNCTION log_subjects_changes() RETURNS TRIGGER AS $subjects_trigger$
    BEGIN
        IF TG_OP = 'INSERT' THEN
            INSERT INTO history_tb (created_at, user_id, tb_location, action_type)
            VALUES (now(), auth.uid(), 'subjects_tb', 'CREATE');
        ELSIF TG_OP = 'UPDATE' THEN
            INSERT INTO history_tb (created_at, user_id, tb_location, action_type)
            VALUES (now(), auth.uid(), 'subjects_tb', 'UPDATE');
        ELSIF TG_OP = 'DELETE' THEN
            INSERT INTO history_tb (created_at, user_id, tb_location, action_type)
            VALUES (now(), auth.uid(), 'subjects_tb', 'DELETE');
        END IF;
        RETURN NULL;
    END;
    $subjects_trigger$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Create actual triggers for each table
    DROP TRIGGER IF EXISTS classroom_changes ON classrooms_tb;
    CREATE TRIGGER classroom_changes
    AFTER INSERT OR UPDATE OR DELETE ON classrooms_tb
    FOR EACH ROW EXECUTE FUNCTION log_classroom_changes();

    DROP TRIGGER IF EXISTS faculties_changes ON faculties_tb;
    CREATE TRIGGER faculties_changes
    AFTER INSERT OR UPDATE OR DELETE ON faculties_tb
    FOR EACH ROW EXECUTE FUNCTION log_faculties_changes();

    DROP TRIGGER IF EXISTS programs_changes ON programs_tb;
    CREATE TRIGGER programs_changes
    AFTER INSERT OR UPDATE OR DELETE ON programs_tb
    FOR EACH ROW EXECUTE FUNCTION log_programs_changes();

    DROP TRIGGER IF EXISTS subjects_changes ON subjects_tb;
    CREATE TRIGGER subjects_changes
    AFTER INSERT OR UPDATE OR DELETE ON subjects_tb
    FOR EACH ROW EXECUTE FUNCTION log_subjects_changes();
END;
$$ LANGUAGE plpgsql;

-- Drop function if exists to allow for easy re-running
DROP FUNCTION IF EXISTS start_engine_brum_brum();

-- Create a simple function to call the main function
CREATE OR REPLACE FUNCTION start_engine_brum_brum() RETURNS VOID AS $$
BEGIN
    -- Call the main function to set up all triggers
    PERFORM listen_to_changes();
    RAISE NOTICE 'All triggers have been successfully set up!';
END;
$$ LANGUAGE plpgsql;

-- Execute the dropper function to set up all triggers
-- Uncomment the next line to execute immediately
SELECT start_engine_brum_brum();
