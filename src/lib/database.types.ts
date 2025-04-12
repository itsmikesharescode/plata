import type { UserMeta, AssignedSubject, HelperComputeSched } from './types';

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					operationName?: string;
					query?: string;
					variables?: Json;
					extensions?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			classrooms_tb: {
				Row: {
					building_name: string;
					classroom_name: string;
					created_at: string;
					department_id: string;
					id: string;
				};
				Insert: {
					building_name: string;
					classroom_name: string;
					created_at?: string;
					department_id: string;
					id?: string;
				};
				Update: {
					building_name?: string;
					classroom_name?: string;
					created_at?: string;
					department_id?: string;
					id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'classrooms_tb_department_id_fkey';
						columns: ['department_id'];
						isOneToOne: false;
						referencedRelation: 'departments_tb';
						referencedColumns: ['id'];
					}
				];
			};
			departments_tb: {
				Row: {
					created_at: string;
					department_code: string;
					department_color: string;
					department_name: string;
					id: string;
				};
				Insert: {
					created_at?: string;
					department_code: string;
					department_color: string;
					department_name: string;
					id?: string;
				};
				Update: {
					created_at?: string;
					department_code?: string;
					department_color?: string;
					department_name?: string;
					id?: string;
				};
				Relationships: [];
			};
			faculties_tb: {
				Row: {
					academic_rank: string;
					created_at: string;
					department_id: string;
					employment_status: string;
					fullname: string;
					id: string;
				};
				Insert: {
					academic_rank: string;
					created_at?: string;
					department_id: string;
					employment_status: string;
					fullname: string;
					id?: string;
				};
				Update: {
					academic_rank?: string;
					created_at?: string;
					department_id?: string;
					employment_status?: string;
					fullname?: string;
					id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'faculties_tb_department_id_fkey';
						columns: ['department_id'];
						isOneToOne: false;
						referencedRelation: 'departments_tb';
						referencedColumns: ['id'];
					}
				];
			};
			history_tb: {
				Row: {
					action_type: string;
					created_at: string;
					id: string;
					tb_location: string;
					user_id: string;
				};
				Insert: {
					action_type: string;
					created_at?: string;
					id?: string;
					tb_location: string;
					user_id: string;
				};
				Update: {
					action_type?: string;
					created_at?: string;
					id?: string;
					tb_location?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			leaders_tb: {
				Row: {
					created_at: string;
					id: string;
					program_chairperson: string;
					univ_president: string;
					univ_registrar: string;
					vp_academic_affairs: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					program_chairperson: string;
					univ_president: string;
					univ_registrar: string;
					vp_academic_affairs: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					program_chairperson?: string;
					univ_president?: string;
					univ_registrar?: string;
					vp_academic_affairs?: string;
				};
				Relationships: [];
			};
			programs_tb: {
				Row: {
					created_at: string;
					department_id: string;
					id: string;
					program_code: string;
					program_name: string;
				};
				Insert: {
					created_at?: string;
					department_id: string;
					id?: string;
					program_code: string;
					program_name: string;
				};
				Update: {
					created_at?: string;
					department_id?: string;
					id?: string;
					program_code?: string;
					program_name?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'programs_tb_department_id_fkey';
						columns: ['department_id'];
						isOneToOne: false;
						referencedRelation: 'departments_tb';
						referencedColumns: ['id'];
					}
				];
			};
			roles_tb: {
				Row: {
					created_at: string;
					name: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					name: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					name?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			schedules_tb: {
				Row: {
					assigned_subjects: AssignedSubject[];
					created_at: string;
					department_id: string;
					faculty_id: string;
					id: string;
					program_id: string;
					semester: string;
					year_and_section_id: string;
				};
				Insert: {
					assigned_subjects: AssignedSubject[];
					created_at?: string;
					department_id: string;
					faculty_id: string;
					id?: string;
					program_id: string;
					semester: string;
					year_and_section_id: string;
				};
				Update: {
					assigned_subjects?: AssignedSubject[];
					created_at?: string;
					department_id?: string;
					faculty_id?: string;
					id?: string;
					program_id?: string;
					semester?: string;
					year_and_section_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'schedules_tb_department_id_fkey';
						columns: ['department_id'];
						isOneToOne: false;
						referencedRelation: 'departments_tb';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'schedules_tb_faculty_id_fkey';
						columns: ['faculty_id'];
						isOneToOne: false;
						referencedRelation: 'faculties_tb';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'schedules_tb_program_id_fkey';
						columns: ['program_id'];
						isOneToOne: false;
						referencedRelation: 'programs_tb';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'schedules_tb_year_and_section_id_fkey';
						columns: ['year_and_section_id'];
						isOneToOne: false;
						referencedRelation: 'yearlevels_and_sections_tb';
						referencedColumns: ['id'];
					}
				];
			};
			subjects_tb: {
				Row: {
					course_code: string;
					course_name: string;
					created_at: string;
					id: string;
					lab_hours: number;
					lecture_hours: number;
					unit: number;
				};
				Insert: {
					course_code: string;
					course_name: string;
					created_at?: string;
					id?: string;
					lab_hours: number;
					lecture_hours: number;
					unit: number;
				};
				Update: {
					course_code?: string;
					course_name?: string;
					created_at?: string;
					id?: string;
					lab_hours?: number;
					lecture_hours?: number;
					unit?: number;
				};
				Relationships: [];
			};
			users_tb: {
				Row: {
					created_at: string;
					user_id: string;
					user_meta_data: UserMeta;
				};
				Insert: {
					created_at?: string;
					user_id: string;
					user_meta_data: UserMeta;
				};
				Update: {
					created_at?: string;
					user_id?: string;
					user_meta_data?: UserMeta;
				};
				Relationships: [];
			};
			yearlevels_and_sections_tb: {
				Row: {
					created_at: string;
					id: string;
					section: string;
					year: number;
				};
				Insert: {
					created_at?: string;
					id?: string;
					section: string;
					year: number;
				};
				Update: {
					created_at?: string;
					id?: string;
					section?: string;
					year?: number;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			cold_start: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			helper_compute_sched_count: {
				Args: {
					subject_ids: string[];
				};
				Returns: HelperComputeSched;
			};
			helper_detect_sched_conflict: {
				Args: {
					sched_id: string;
				};
				Returns: string;
			};
			is_admin: {
				Args: Record<PropertyKey, never>;
				Returns: boolean;
			};
			is_chair: {
				Args: Record<PropertyKey, never>;
				Returns: boolean;
			};
			listen_to_changes: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			listen_to_changes_dropper: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			start_engine_brum_brum: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
				Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
			Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof Database },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
		: never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
		? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema['CompositeTypes']
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
		? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	graphql_public: {
		Enums: {}
	},
	public: {
		Enums: {}
	}
} as const;
