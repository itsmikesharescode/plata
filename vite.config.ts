import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	// This ensures your environment variables are properly replaced
	define: {
		'process.env.VITE_PUBLIC_SUPABASE_URL': JSON.stringify(process.env.PUBLIC_SUPABASE_URL),
		'process.env.VITE_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(
			process.env.PUBLIC_SUPABASE_ANON_KEY
		)
		// Don't expose private keys in client-side code
	}
});
