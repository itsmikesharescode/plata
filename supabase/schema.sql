

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."cold_start"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
END;
$$;


ALTER FUNCTION "public"."cold_start"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."helper_compute_sched_count"("subject_ids" "text"[]) RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    total_result json;
    uuid_array uuid[];
BEGIN
    -- Convert text array to UUID array
    SELECT array_agg(id::uuid)
    INTO uuid_array
    FROM (
        SELECT unnest(subject_ids) as id
    ) as ids;

    SELECT json_build_object(
        'total_unit', COALESCE(SUM(unit), 0),
        'total_lecture_hours', COALESCE(SUM(lecture_hours), 0),
        'total_lab_hours', COALESCE(SUM(lab_hours), 0)
    ) INTO total_result
    FROM subjects_tb
    WHERE id = ANY(uuid_array);
    
    RETURN total_result;
END;
$$;


ALTER FUNCTION "public"."helper_compute_sched_count"("subject_ids" "text"[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."helper_detect_sched_conflict"("sched_id" "uuid") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    current_schedule RECORD;
    current_subjects JSONB;
    other_schedule RECORD;
    other_subjects JSONB;
    current_subject JSONB;
    other_subject JSONB;
    conflict_info TEXT;
    current_subject_info TEXT;
    other_subject_info TEXT;
    current_day TEXT;
    current_start_time TEXT;
    current_end_time TEXT;
    other_day TEXT;
    other_start_time TEXT;
    other_end_time TEXT;
    current_subject_id UUID;
    other_subject_id UUID;
    current_classroom_id UUID;
    other_classroom_id UUID;
    subject_name TEXT;
    error_message TEXT := NULL;
BEGIN
    -- Get the current schedule we're checking
    SELECT * INTO current_schedule FROM schedules_tb WHERE id = sched_id;
    
    -- If schedule not found, return error message
    IF current_schedule IS NULL THEN
        RETURN 'Schedule with ID ' || sched_id || ' not found';
    END IF;
    
    current_subjects := current_schedule.assigned_subjects;
    
    -- Loop through all other schedules
    FOR other_schedule IN 
        SELECT s.*, p.program_name, f.fullname AS faculty_name 
        FROM schedules_tb s
        LEFT JOIN programs_tb p ON s.program_id = p.id
        LEFT JOIN faculties_tb f ON s.faculty_id = f.id
        WHERE s.id != sched_id
    LOOP
        other_subjects := other_schedule.assigned_subjects;
        
        -- For each subject in current schedule
        FOR i IN 0..jsonb_array_length(current_subjects) - 1 LOOP
            current_subject := current_subjects->i;
            
            -- Extract all needed values to variables first
            current_subject_id := (current_subject->>'subject_id')::UUID;
            current_day := current_subject->>'day';
            current_start_time := substring(current_subject->>'start_time', 12, 5);
            current_end_time := substring(current_subject->>'end_time', 12, 5);
            current_classroom_id := (current_subject->>'classroom_id')::UUID;
            
            -- Get subject name for better error messages
            SELECT course_name INTO subject_name
            FROM subjects_tb
            WHERE id = current_subject_id;
            
            -- Create formatted subject info
            current_subject_info := subject_name || ' (' || current_day || ', ' || 
                                   current_start_time || '-' || current_end_time || ')';
            
            -- For each subject in other schedule
            FOR j IN 0..jsonb_array_length(other_subjects) - 1 LOOP
                other_subject := other_subjects->j;
                
                -- Extract all needed values to variables first
                other_subject_id := (other_subject->>'subject_id')::UUID;
                other_day := other_subject->>'day';
                other_start_time := substring(other_subject->>'start_time', 12, 5);
                other_end_time := substring(other_subject->>'end_time', 12, 5);
                other_classroom_id := (other_subject->>'classroom_id')::UUID;
                
                -- Get subject name for better error messages
                SELECT course_name INTO subject_name
                FROM subjects_tb
                WHERE id = other_subject_id;
                
                -- Create formatted subject info
                other_subject_info := subject_name || ' (' || other_day || ', ' || 
                                     other_start_time || '-' || other_end_time || ')';
                
                -- Check room conflicts
                IF current_classroom_id = other_classroom_id THEN
                    -- Check if days overlap
                    IF (
                        (SELECT COUNT(*) FROM regexp_split_to_table(current_day, '') AS c_day
                         WHERE c_day ~ '[A-Za-z]' AND position(c_day in other_day) > 0) > 0
                    ) THEN
                        -- Check if times overlap
                        IF (
                            (current_subject->>'start_time')::timestamp <= (other_subject->>'end_time')::timestamp AND
                            (current_subject->>'end_time')::timestamp >= (other_subject->>'start_time')::timestamp
                        ) THEN
                            -- Get classroom name for error message
                            SELECT classroom_name INTO conflict_info 
                            FROM classrooms_tb 
                            WHERE id = current_classroom_id;
                            
                            error_message := 'Room conflict detected: Classroom ' || conflict_info || 
                                             ' is booked for ' || current_subject_info || 
                                             ' in ' || (SELECT program_name FROM programs_tb WHERE id = current_schedule.program_id) || 
                                             ' program and also for ' || other_subject_info || 
                                             ' in ' || other_schedule.program_name || ' program at overlapping times';
                            RETURN error_message;
                        END IF;
                    END IF;
                END IF;
                
                -- Check faculty conflicts
                IF current_schedule.faculty_id = other_schedule.faculty_id THEN
                    -- Check if days overlap
                    IF (
                        (SELECT COUNT(*) FROM regexp_split_to_table(current_day, '') AS c_day
                         WHERE c_day ~ '[A-Za-z]' AND position(c_day in other_day) > 0) > 0
                    ) THEN
                        -- Check if times overlap
                        IF (
                            (current_subject->>'start_time')::timestamp <= (other_subject->>'end_time')::timestamp AND
                            (current_subject->>'end_time')::timestamp >= (other_subject->>'start_time')::timestamp
                        ) THEN
                            error_message := 'Faculty conflict detected: ' || other_schedule.faculty_name || 
                                             ' is scheduled to teach ' || current_subject_info || 
                                             ' in ' || (SELECT program_name FROM programs_tb WHERE id = current_schedule.program_id) || 
                                             ' program and also ' || other_subject_info || 
                                             ' in ' || other_schedule.program_name || ' program at overlapping times';
                            RETURN error_message;
                        END IF;
                    END IF;
                END IF;
                
                -- Check student section conflicts (same year_and_section_id can't have overlapping classes)
                IF current_schedule.year_and_section_id = other_schedule.year_and_section_id THEN
                    -- Check if days overlap
                    IF (
                        (SELECT COUNT(*) FROM regexp_split_to_table(current_day, '') AS c_day
                         WHERE c_day ~ '[A-Za-z]' AND position(c_day in other_day) > 0) > 0
                    ) THEN
                        -- Check if times overlap
                        IF (
                            (current_subject->>'start_time')::timestamp <= (other_subject->>'end_time')::timestamp AND
                            (current_subject->>'end_time')::timestamp >= (other_subject->>'start_time')::timestamp
                        ) THEN
                            -- Get section info
                            SELECT CONCAT(year::TEXT, '-', section) INTO conflict_info
                            FROM yearlevels_and_sections_tb
                            WHERE id = current_schedule.year_and_section_id;
                            
                            error_message := 'Section conflict detected: Students in ' || conflict_info || 
                                             ' have overlapping classes: ' || current_subject_info || 
                                             ' and ' || other_subject_info;
                            RETURN error_message;
                        END IF;
                    END IF;
                END IF;
            END LOOP;
        END LOOP;
    END LOOP;
    
    -- If we got here, no conflicts were found
    RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."helper_detect_sched_conflict"("sched_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN EXISTS(
        SELECT 1 FROM roles_tb WHERE name = 'admin' AND user_id = auth.uid()
    );
END;
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_chair"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN EXISTS(
        SELECT 1 FROM roles_tb WHERE name = 'chair' AND user_id = auth.uid()
    );
END;
$$;


ALTER FUNCTION "public"."is_chair"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."listen_to_changes"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $_$
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
$_$;


ALTER FUNCTION "public"."listen_to_changes"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."listen_to_changes_dropper"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Call the main function to set up all triggers
    PERFORM listen_to_changes();
    RAISE NOTICE 'All triggers have been successfully set up!';
END;
$$;


ALTER FUNCTION "public"."listen_to_changes_dropper"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_classroom_changes"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
    $$;


ALTER FUNCTION "public"."log_classroom_changes"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_faculties_changes"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
    $$;


ALTER FUNCTION "public"."log_faculties_changes"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_programs_changes"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
    $$;


ALTER FUNCTION "public"."log_programs_changes"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_subjects_changes"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
    $$;


ALTER FUNCTION "public"."log_subjects_changes"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."on_auth_user_created"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    var_role TEXT := NEW.raw_user_meta_data ->> 'role';
    var_meta_data JSONB := NEW.raw_user_meta_data;
BEGIN

  INSERT INTO public.users_tb (user_id, user_meta_data) VALUES(NEW.id, var_meta_data);
  INSERT INTO public.roles_tb (user_id, name) VALUES(NEW.id, var_role);

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."on_auth_user_created"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."on_auth_user_updated"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  UPDATE public.users_tb
  SET
    user_meta_data = NEW.raw_user_meta_data
  WHERE user_id = NEW.id;

  UPDATE public.roles_tb
  SET
    name = NEW.raw_user_meta_data ->> 'role'
  WHERE user_id = NEW.id;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."on_auth_user_updated"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."start_engine_brum_brum"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Call the main function to set up all triggers
    PERFORM listen_to_changes();
    RAISE NOTICE 'All triggers have been successfully set up!';
END;
$$;


ALTER FUNCTION "public"."start_engine_brum_brum"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."classrooms_tb" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "department_id" "uuid" NOT NULL,
    "classroom_name" "text" NOT NULL,
    "building_name" "text" NOT NULL
);


ALTER TABLE "public"."classrooms_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."classrooms_tb" IS 'list of classrooms';



CREATE TABLE IF NOT EXISTS "public"."departments_tb" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "department_name" "text" NOT NULL,
    "department_code" character varying NOT NULL,
    "department_color" character varying NOT NULL
);


ALTER TABLE "public"."departments_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."departments_tb" IS 'list of department';



CREATE TABLE IF NOT EXISTS "public"."faculties_tb" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "department_id" "uuid" NOT NULL,
    "fullname" "text" NOT NULL,
    "academic_rank" "text" NOT NULL,
    "employment_status" "text" NOT NULL
);


ALTER TABLE "public"."faculties_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."faculties_tb" IS 'list of faculties';



CREATE TABLE IF NOT EXISTS "public"."history_tb" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "tb_location" "text" NOT NULL,
    "action_type" "text" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."history_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."history_tb" IS 'logging system to all table';



CREATE TABLE IF NOT EXISTS "public"."leaders_tb" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "univ_president" "text" NOT NULL,
    "univ_registrar" "text" NOT NULL,
    "program_chairperson" "text" NOT NULL,
    "vp_academic_affairs" "text" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."leaders_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."leaders_tb" IS 'list of leaders';



CREATE TABLE IF NOT EXISTS "public"."programs_tb" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "department_id" "uuid" NOT NULL,
    "program_name" "text" NOT NULL,
    "program_code" "text" NOT NULL
);


ALTER TABLE "public"."programs_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."programs_tb" IS 'list of programs';



CREATE TABLE IF NOT EXISTS "public"."roles_tb" (
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" character varying NOT NULL
);


ALTER TABLE "public"."roles_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."roles_tb" IS 'list of roles';



CREATE TABLE IF NOT EXISTS "public"."schedules_tb" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "faculty_id" "uuid" NOT NULL,
    "program_id" "uuid" NOT NULL,
    "department_id" "uuid" NOT NULL,
    "year_and_section_id" "uuid" NOT NULL,
    "semester" "text" NOT NULL,
    "assigned_subjects" "jsonb" NOT NULL
);


ALTER TABLE "public"."schedules_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."schedules_tb" IS 'list of created schedules';



CREATE TABLE IF NOT EXISTS "public"."subjects_tb" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "course_name" "text" NOT NULL,
    "course_code" character varying NOT NULL,
    "lecture_hours" numeric NOT NULL,
    "lab_hours" numeric NOT NULL,
    "unit" numeric NOT NULL
);


ALTER TABLE "public"."subjects_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."subjects_tb" IS 'list of subjects';



CREATE TABLE IF NOT EXISTS "public"."users_tb" (
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_meta_data" "jsonb" NOT NULL
);


ALTER TABLE "public"."users_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."users_tb" IS 'list of created users';



CREATE TABLE IF NOT EXISTS "public"."yearlevels_and_sections_tb" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "year" numeric NOT NULL,
    "section" character varying NOT NULL
);


ALTER TABLE "public"."yearlevels_and_sections_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."yearlevels_and_sections_tb" IS 'list of year levels with sections';



ALTER TABLE ONLY "public"."classrooms_tb"
    ADD CONSTRAINT "classrooms_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."departments_tb"
    ADD CONSTRAINT "departments_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."faculties_tb"
    ADD CONSTRAINT "faculties_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."history_tb"
    ADD CONSTRAINT "history_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."leaders_tb"
    ADD CONSTRAINT "leaders_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."programs_tb"
    ADD CONSTRAINT "programs_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."roles_tb"
    ADD CONSTRAINT "roles_tb_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."schedules_tb"
    ADD CONSTRAINT "schedules_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subjects_tb"
    ADD CONSTRAINT "subjects_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users_tb"
    ADD CONSTRAINT "users_tb_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."yearlevels_and_sections_tb"
    ADD CONSTRAINT "yearlevels_and_sections_tb_pkey" PRIMARY KEY ("id");



CREATE OR REPLACE TRIGGER "classroom_changes" AFTER INSERT OR DELETE OR UPDATE ON "public"."classrooms_tb" FOR EACH ROW EXECUTE FUNCTION "public"."log_classroom_changes"();



CREATE OR REPLACE TRIGGER "faculties_changes" AFTER INSERT OR DELETE OR UPDATE ON "public"."faculties_tb" FOR EACH ROW EXECUTE FUNCTION "public"."log_faculties_changes"();



CREATE OR REPLACE TRIGGER "programs_changes" AFTER INSERT OR DELETE OR UPDATE ON "public"."programs_tb" FOR EACH ROW EXECUTE FUNCTION "public"."log_programs_changes"();



CREATE OR REPLACE TRIGGER "subjects_changes" AFTER INSERT OR DELETE OR UPDATE ON "public"."subjects_tb" FOR EACH ROW EXECUTE FUNCTION "public"."log_subjects_changes"();



ALTER TABLE ONLY "public"."classrooms_tb"
    ADD CONSTRAINT "classrooms_tb_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."departments_tb"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."faculties_tb"
    ADD CONSTRAINT "faculties_tb_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."departments_tb"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."programs_tb"
    ADD CONSTRAINT "programs_tb_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."departments_tb"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."roles_tb"
    ADD CONSTRAINT "roles_tb_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schedules_tb"
    ADD CONSTRAINT "schedules_tb_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."departments_tb"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schedules_tb"
    ADD CONSTRAINT "schedules_tb_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculties_tb"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schedules_tb"
    ADD CONSTRAINT "schedules_tb_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "public"."programs_tb"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schedules_tb"
    ADD CONSTRAINT "schedules_tb_year_and_section_id_fkey" FOREIGN KEY ("year_and_section_id") REFERENCES "public"."yearlevels_and_sections_tb"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_tb"
    ADD CONSTRAINT "users_tb_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "All for admin" ON "public"."history_tb" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "All for admin" ON "public"."users_tb" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "All for admin" ON "public"."yearlevels_and_sections_tb" TO "authenticated" USING (("public"."is_admin"() OR "public"."is_chair"())) WITH CHECK (("public"."is_admin"() OR "public"."is_chair"()));



CREATE POLICY "All for both" ON "public"."programs_tb" TO "authenticated" USING (("public"."is_admin"() OR "public"."is_chair"())) WITH CHECK (("public"."is_admin"() OR "public"."is_chair"()));



CREATE POLICY "All for both" ON "public"."subjects_tb" TO "authenticated" USING (("public"."is_admin"() OR "public"."is_chair"())) WITH CHECK (("public"."is_admin"() OR "public"."is_chair"()));



CREATE POLICY "Allow all" ON "public"."classrooms_tb" TO "authenticated" USING (("public"."is_admin"() OR "public"."is_chair"())) WITH CHECK (("public"."is_admin"() OR "public"."is_chair"()));



CREATE POLICY "Allow all for both" ON "public"."faculties_tb" TO "authenticated" USING (("public"."is_admin"() OR "public"."is_chair"())) WITH CHECK (("public"."is_admin"() OR "public"."is_chair"()));



CREATE POLICY "Allow all if admin" ON "public"."departments_tb" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Allow all if admin" ON "public"."leaders_tb" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Allow all if admin or chair" ON "public"."schedules_tb" TO "authenticated" USING (("public"."is_admin"() OR "public"."is_chair"())) WITH CHECK (("public"."is_admin"() OR "public"."is_chair"()));



CREATE POLICY "Allow select if chair" ON "public"."departments_tb" FOR SELECT TO "authenticated" USING ("public"."is_chair"());



CREATE POLICY "Allow select if chair" ON "public"."leaders_tb" FOR SELECT TO "authenticated" USING ("public"."is_chair"());



CREATE POLICY "Select for chair" ON "public"."history_tb" FOR SELECT TO "authenticated" USING ("public"."is_chair"());



CREATE POLICY "Select for chair" ON "public"."users_tb" FOR SELECT TO "authenticated" USING ("public"."is_chair"());



ALTER TABLE "public"."classrooms_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."departments_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."faculties_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."history_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."leaders_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."programs_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."roles_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schedules_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."subjects_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."yearlevels_and_sections_tb" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

















































































































































































GRANT ALL ON FUNCTION "public"."cold_start"() TO "anon";
GRANT ALL ON FUNCTION "public"."cold_start"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cold_start"() TO "service_role";



GRANT ALL ON FUNCTION "public"."helper_compute_sched_count"("subject_ids" "text"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."helper_compute_sched_count"("subject_ids" "text"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."helper_compute_sched_count"("subject_ids" "text"[]) TO "service_role";



GRANT ALL ON FUNCTION "public"."helper_detect_sched_conflict"("sched_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."helper_detect_sched_conflict"("sched_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."helper_detect_sched_conflict"("sched_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_chair"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_chair"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_chair"() TO "service_role";



GRANT ALL ON FUNCTION "public"."listen_to_changes"() TO "anon";
GRANT ALL ON FUNCTION "public"."listen_to_changes"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."listen_to_changes"() TO "service_role";



GRANT ALL ON FUNCTION "public"."listen_to_changes_dropper"() TO "anon";
GRANT ALL ON FUNCTION "public"."listen_to_changes_dropper"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."listen_to_changes_dropper"() TO "service_role";



GRANT ALL ON FUNCTION "public"."log_classroom_changes"() TO "anon";
GRANT ALL ON FUNCTION "public"."log_classroom_changes"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_classroom_changes"() TO "service_role";



GRANT ALL ON FUNCTION "public"."log_faculties_changes"() TO "anon";
GRANT ALL ON FUNCTION "public"."log_faculties_changes"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_faculties_changes"() TO "service_role";



GRANT ALL ON FUNCTION "public"."log_programs_changes"() TO "anon";
GRANT ALL ON FUNCTION "public"."log_programs_changes"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_programs_changes"() TO "service_role";



GRANT ALL ON FUNCTION "public"."log_subjects_changes"() TO "anon";
GRANT ALL ON FUNCTION "public"."log_subjects_changes"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_subjects_changes"() TO "service_role";



GRANT ALL ON FUNCTION "public"."on_auth_user_created"() TO "anon";
GRANT ALL ON FUNCTION "public"."on_auth_user_created"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."on_auth_user_created"() TO "service_role";



GRANT ALL ON FUNCTION "public"."on_auth_user_updated"() TO "anon";
GRANT ALL ON FUNCTION "public"."on_auth_user_updated"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."on_auth_user_updated"() TO "service_role";



GRANT ALL ON FUNCTION "public"."start_engine_brum_brum"() TO "anon";
GRANT ALL ON FUNCTION "public"."start_engine_brum_brum"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."start_engine_brum_brum"() TO "service_role";


















GRANT ALL ON TABLE "public"."classrooms_tb" TO "anon";
GRANT ALL ON TABLE "public"."classrooms_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."classrooms_tb" TO "service_role";



GRANT ALL ON TABLE "public"."departments_tb" TO "anon";
GRANT ALL ON TABLE "public"."departments_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."departments_tb" TO "service_role";



GRANT ALL ON TABLE "public"."faculties_tb" TO "anon";
GRANT ALL ON TABLE "public"."faculties_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."faculties_tb" TO "service_role";



GRANT ALL ON TABLE "public"."history_tb" TO "anon";
GRANT ALL ON TABLE "public"."history_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."history_tb" TO "service_role";



GRANT ALL ON TABLE "public"."leaders_tb" TO "anon";
GRANT ALL ON TABLE "public"."leaders_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."leaders_tb" TO "service_role";



GRANT ALL ON TABLE "public"."programs_tb" TO "anon";
GRANT ALL ON TABLE "public"."programs_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."programs_tb" TO "service_role";



GRANT ALL ON TABLE "public"."roles_tb" TO "anon";
GRANT ALL ON TABLE "public"."roles_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."roles_tb" TO "service_role";



GRANT ALL ON TABLE "public"."schedules_tb" TO "anon";
GRANT ALL ON TABLE "public"."schedules_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."schedules_tb" TO "service_role";



GRANT ALL ON TABLE "public"."subjects_tb" TO "anon";
GRANT ALL ON TABLE "public"."subjects_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."subjects_tb" TO "service_role";



GRANT ALL ON TABLE "public"."users_tb" TO "anon";
GRANT ALL ON TABLE "public"."users_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."users_tb" TO "service_role";



GRANT ALL ON TABLE "public"."yearlevels_and_sections_tb" TO "anon";
GRANT ALL ON TABLE "public"."yearlevels_and_sections_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."yearlevels_and_sections_tb" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
