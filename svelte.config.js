import adapter from '@sveltejs/adapter-cloudflare-workers';

export default {
	kit: {
		adapter: adapter({
			// see below for options that can be set here
		})
	}
};
