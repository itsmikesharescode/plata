

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
BEGIN
    -- Insert base roles
    INSERT INTO roles_tb (NAME, DESCRIPTION) VALUES 
    ('admin', 'Administrator'),
    ('chair', 'Chairperson');

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
    "name" "text" NOT NULL,
    "description" "text" NOT NULL
);


ALTER TABLE "public"."roles_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."roles_tb" IS 'list of roles';



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
    "role_name" "text" NOT NULL,
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



ALTER TABLE ONLY "public"."programs_tb"
    ADD CONSTRAINT "programs_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."roles_tb"
    ADD CONSTRAINT "roles_tb_pkey" PRIMARY KEY ("name");



ALTER TABLE ONLY "public"."subjects_tb"
    ADD CONSTRAINT "subjects_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users_tb"
    ADD CONSTRAINT "users_tb_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."yearlevels_and_sections_tb"
    ADD CONSTRAINT "yearlevels_and_sections_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."classrooms_tb"
    ADD CONSTRAINT "classrooms_tb_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."departments_tb"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."faculties_tb"
    ADD CONSTRAINT "faculties_tb_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."departments_tb"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."programs_tb"
    ADD CONSTRAINT "programs_tb_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."departments_tb"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_tb"
    ADD CONSTRAINT "users_tb_role_name_fkey" FOREIGN KEY ("role_name") REFERENCES "public"."roles_tb"("name") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_tb"
    ADD CONSTRAINT "users_tb_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE "public"."roles_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users_tb" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

















































































































































































GRANT ALL ON FUNCTION "public"."cold_start"() TO "anon";
GRANT ALL ON FUNCTION "public"."cold_start"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cold_start"() TO "service_role";


















GRANT ALL ON TABLE "public"."classrooms_tb" TO "anon";
GRANT ALL ON TABLE "public"."classrooms_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."classrooms_tb" TO "service_role";



GRANT ALL ON TABLE "public"."departments_tb" TO "anon";
GRANT ALL ON TABLE "public"."departments_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."departments_tb" TO "service_role";



GRANT ALL ON TABLE "public"."faculties_tb" TO "anon";
GRANT ALL ON TABLE "public"."faculties_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."faculties_tb" TO "service_role";



GRANT ALL ON TABLE "public"."programs_tb" TO "anon";
GRANT ALL ON TABLE "public"."programs_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."programs_tb" TO "service_role";



GRANT ALL ON TABLE "public"."roles_tb" TO "anon";
GRANT ALL ON TABLE "public"."roles_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."roles_tb" TO "service_role";



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
