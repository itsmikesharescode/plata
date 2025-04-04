

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
    "year" character varying NOT NULL,
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



CREATE POLICY "Allow all if admin or chair" ON "public"."schedules_tb" TO "authenticated" USING (("public"."is_admin"() OR "public"."is_chair"())) WITH CHECK (("public"."is_admin"() OR "public"."is_chair"()));



CREATE POLICY "Allow select if chair" ON "public"."departments_tb" FOR SELECT TO "authenticated" USING ("public"."is_chair"());



CREATE POLICY "Select for chair" ON "public"."history_tb" FOR SELECT TO "authenticated" USING ("public"."is_chair"());



CREATE POLICY "Select for chair" ON "public"."users_tb" FOR SELECT TO "authenticated" USING ("public"."is_chair"());



ALTER TABLE "public"."classrooms_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."departments_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."faculties_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."history_tb" ENABLE ROW LEVEL SECURITY;


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
