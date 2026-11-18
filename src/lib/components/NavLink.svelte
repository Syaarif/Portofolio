<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		href: string;
		active?: boolean;
		onclick?: (event: MouseEvent) => void;
		children: Snippet;
	};

	let { href, active = false, onclick, children }: Props = $props();
</script>

<a
	{href}
	{onclick}
	aria-current={active ? 'location' : undefined}
	class="ui-interactive ui-nav-link min-h-11 min-w-11 text-sm text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
	class:ui-nav-link-active={active}
>
	{@render children()}
</a>
