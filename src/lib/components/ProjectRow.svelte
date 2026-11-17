<script lang="ts">
	import type { Project } from '$lib/data';

	type Props = {
		project: Project;
		index: number;
	};

	let { project, index }: Props = $props();
</script>

<div class="ui-project-row group flex flex-col gap-2.5 py-7">
	<div class="flex items-center justify-between">
		<span class="ui-project-shift font-mono text-[11px] tracking-[1.1px]">
			{String(index + 1).padStart(2, '0')}
		</span>

		<div class="flex items-center gap-5">
			<span class="font-mono text-[11px] tracking-[1.1px] uppercase">{project.stack}</span>
			<span class="font-mono text-[11px] tracking-[1.1px]">{project.year}</span>

			{#if project.href}
				<a
					href={project.href}
					aria-label="Buka {project.title}"
					class="ui-project-arrow ui-interactive flex min-h-11 min-w-11 items-center justify-center text-primary opacity-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M7 17 17 7M9 7h8v8" />
					</svg>
				</a>
			{/if}
		</div>
	</div>

	<h2 class="ui-project-shift text-[28px] leading-[1.15] font-medium tracking-[-0.5px]">
		{project.title}
	</h2>
	<p class="text-[15px] leading-[1.55] text-muted">{project.description}</p>
</div>
