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

	interface Props {
		updateChairpersonEmailForm: SuperValidated<UpdateChairpersonEmailSchema>;
		updateChairpersonInfoForm: SuperValidated<UpdateChairpersonInfoSchema>;
		updateChairpersonPwdForm: SuperValidated<UpdateChairpersonPwdSchema>;
	}
</script>

<script lang="ts">
	const { updateChairpersonEmailForm, updateChairpersonInfoForm, updateChairpersonPwdForm }: Props =
		$props();

	const rowState = useRowState();

	const id = $derived(page.url.searchParams.get('id'));
	const deletionId = $derived(page.url.searchParams.get('deletion_id'));
	const activeRow = $derived(rowState.getActiveRow()) as ChairpersonTable | null;

	let userCredentials = $state(null);

	$effect(() => {
		if (id) {
			if (!activeRow) {
				// TODO: fetch initial datas here store to userCredentials
			}
		}
	});
</script>

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
			<section class="max-h-[60dvh] px-6">
				<UpdateCpEmail
					stateProp={{
						user_id: activeRow?.user_id,
						email: activeRow?.email
					}}
					{updateChairpersonEmailForm}
				/>
				<UpdateCpInfo
					stateProp={{
						user_id: activeRow?.user_id,
						fullname: activeRow?.fullname,
						department_id: activeRow?.department_id,
						academic_rank: activeRow?.academic_rank,
						employment_status: activeRow?.employment_status,
						program_id: activeRow?.program_id
					}}
					{updateChairpersonInfoForm}
				/>
				<UpdateCpPassword {updateChairpersonPwdForm} />
			</section>
		</ScrollArea>

		<AlertDialog.Footer>
			<AlertDialog.Cancel
				type="button"
				onclick={async () => {
					await goto('/operation/chairperson');
				}}
				class={buttonVariants({ variant: 'ghost', size: 'icon', class: 'absolute right-2 top-2' })}
			>
				<X />
			</AlertDialog.Cancel>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
