import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals: { supabase } }) => {
	const { sample } = await request.json();
	await supabase.auth.signOut();
	return json({ sample });
};
