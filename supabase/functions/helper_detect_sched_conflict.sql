DROP FUNCTION IF EXISTS helper_detect_sched_conflict(UUID);

CREATE OR REPLACE FUNCTION helper_detect_sched_conflict(
    sched_id UUID
)
RETURNS TEXT AS $$
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
            current_start_time := TO_CHAR((current_subject->>'start_time')::timestamptz, 'HH12:MI AM');
            current_end_time := TO_CHAR((current_subject->>'end_time')::timestamptz, 'HH12:MI AM');
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
                other_start_time := TO_CHAR((other_subject->>'start_time')::timestamptz, 'HH12:MI AM');
                other_end_time := TO_CHAR((other_subject->>'end_time')::timestamptz, 'HH12:MI AM');
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
$$ LANGUAGE plpgsql;
