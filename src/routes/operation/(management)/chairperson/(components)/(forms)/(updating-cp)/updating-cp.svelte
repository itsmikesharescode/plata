<script lang="ts" module>
	import X from 'lucide-svelte/icons/x';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { type SuperValidated } from 'sveltekit-superforms';
	import { useRowState } from '$lib/states/row-state.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import type { ChairpersonTable } from '../../(table)/schema';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { UpdateCpEmail, UpdateCpInfo, UpdateCpPassword } from './(childrens)/index';
	import type {
		UpdateChairpersonEmailSchema,
		UpdateChairpersonInfoSchema,
		UpdateChairpersonPwdSchema
	} from '../schema';
	import { buttonVariants } from '$lib/components/ui/button';
	import { untrack } from 'svelte';
	import { urlParamReducer } from '$lib/utils';
	import type { UserMeta } from '$lib/types';

	interface Props {
		updateChairpersonEmailForm: SuperValidated<UpdateChairpersonEmailSchema>;
		updateChairpersonInfoForm: SuperValidated<UpdateChairpersonInfoSchema>;
		updateChairpersonPwdForm: SuperValidated<UpdateChairpersonPwdSchema>;
	}

	const getUserById = async (id: string) => {
		if (!page.data.supabase) return;
		const { data, error } = await page.data.supabase
			.from('users_tb')
			.select('*')
			.order('created_at')
			.eq('user_id', id)
			.single();

		if (error) return null;

		return data;
	};

	type UserCredentials = Omit<UserMeta, 'role'> & {
		user_id: string;
	};
</script>

<script lang="ts">
	const { updateChairpersonEmailForm, updateChairpersonInfoForm, updateChairpersonPwdForm }: Props =
		$props();

	const rowState = useRowState();
	const activeRow = $derived(rowState.getActiveRow()) as ChairpersonTable | null;

	const id = $derived(page.url.searchParams.get('id'));
	const deletionId = $derived(page.url.searchParams.get('deletion_id'));

	let userCredentials = $state<UserCredentials | null>(null);

	$effect(() => {
		if (id) {
			untrack(async () => {
				if (activeRow) {
					userCredentials = {
						user_id: activeRow.user_id,
						department_id: activeRow.department_id,
						program_id: activeRow.program_id,
						email: activeRow.email,
						fullname: activeRow.fullname,
						academic_rank: activeRow.academic_rank,
						employment_status: activeRow.employment_status
					};
				} else {
					const data = await getUserById(id);
					if (data) {
						userCredentials = {
							user_id: data.user_id,
							department_id: data.user_meta_data.department_id,
							program_id: data.user_meta_data.program_id,
							email: data.user_meta_data.email,
							fullname: data.user_meta_data.fullname,
							academic_rank: data.user_meta_data.academic_rank,
							employment_status: data.user_meta_data.employment_status
						};
					}
				}
			});

			return () => {
				userCredentials = null;
			};
		}
	});
</script>

{#if userCredentials}
	<AlertDialog.Root
		open={!!id && !!!deletionId}
		onOpenChange={() => {
			rowState.setActiveRow(null);
		}}
	>
		<AlertDialog.Content class="flex max-h-[100dvh] flex-col p-0">
			<AlertDialog.Header class="p-6 pb-0">
				<AlertDialog.Title>Update Chairperson Details</AlertDialog.Title>
				<AlertDialog.Description>
					Fill the form below to update the chairperson details.
				</AlertDialog.Description>
			</AlertDialog.Header>

			<ScrollArea>
				<section class="max-h-[60dvh]">
					<div class="p-6">
						<UpdateCpEmail
							stateProp={{
								user_id: userCredentials.user_id,
								email: userCredentials.email
							}}
							{updateChairpersonEmailForm}
						/>
						<UpdateCpInfo
							stateProp={{
								user_id: userCredentials.user_id,
								fullname: userCredentials.fullname,
								department_id: userCredentials.department_id,
								academic_rank: userCredentials.academic_rank,
								employment_status: userCredentials.employment_status,
								program_id: userCredentials.program_id
							}}
							{updateChairpersonInfoForm}
						/>
						<UpdateCpPassword {updateChairpersonPwdForm} />
					</div>
				</section>
			</ScrollArea>

			<AlertDialog.Footer>
				<AlertDialog.Cancel
					type="button"
					onclick={async () => {
						await goto(`${page.url.pathname}?${urlParamReducer('id', page)}`);
					}}
					class={buttonVariants({
						variant: 'ghost',
						size: 'icon',
						class: 'absolute right-2 top-2'
					})}
				>
					<X />
				</AlertDialog.Cancel>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
{/if}
