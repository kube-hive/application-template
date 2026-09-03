<script lang="ts">
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<!-- Favicons are served from static/ as raster files (Google Search does not render SVG favicons reliably) -->
	<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48" />
	<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
	<link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
</svelte:head>
{@render children()}
