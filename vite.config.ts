import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

function getBasePath(): '' | `/${string}` {
	if(process.env.VITE_BASE_PATH && process.env.VITE_BASE_PATH.startsWith('/')) {
		return process.env.VITE_BASE_PATH as `/${string}`;
	}
	return '';
}

export default defineConfig({
	server: {
		allowedHosts: true,
		strictPort: true,
	},
	preview: {
		strictPort: true,
	},
	ssr: {
		noExternal: true,
	},
	plugins: [
		tailwindcss(),
		sveltekit({
			paths: {
				base: getBasePath(),
			},
			experimental: {
				remoteFunctions: true
			},
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true,
				experimental: {
					async: true
				}
			},
			adapter: adapter()
		})
	]
});
