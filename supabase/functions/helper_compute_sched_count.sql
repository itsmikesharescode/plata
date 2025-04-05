DROP FUNCTION IF EXISTS helper_compute_sched_count;

CREATE OR REPLACE FUNCTION helper_compute_sched_count(
    subject_ids text[]
) RETURNS json AS $$
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
$$ LANGUAGE PLPGSQL SECURITY DEFINER;