<script lang="ts">
	import type { Project } from '$lib/data';

	type Props = {
		project: Project;
		index: number;
	};

	let { project, index }: Props = $props();

	function updateSpotlight(event: PointerEvent) {
		if (
			event.pointerType === 'touch' ||
			!matchMedia('(pointer: fine)').matches ||
			matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			return;
		}

		const row = event.currentTarget as HTMLElement;
		const bounds = row.getBoundingClientRect();
		row.style.setProperty('--spotlight-x', `${event.clientX - bounds.left}px`);
		row.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`);
	}

	function clearSpotlight(event: PointerEvent) {
		if (event.pointerType === 'touch') return;
		const row = event.currentTarget as HTMLElement;
		row.style.removeProperty('--spotlight-x');
		row.style.removeProperty('--spotlight-y');
	}
</script>

<div
	role="group"
	aria-label="Proyek {project.title}"
	class="ui-project-row group relative isolate flex flex-col gap-2.5 py-7"
	onpointermove={updateSpotlight}
	onpointerleave={clearSpotlight}
>
	<span class="project-spotlight" aria-hidden="true"></span>
	<div class="relative z-10 flex items-center justify-between">
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

	<h2
		class="ui-project-shift relative z-10 text-[28px] leading-[1.15] font-medium tracking-[-0.5px]"
	>
		{project.title}
	</h2>
	<p class="relative z-10 text-[15px] leading-[1.55] text-muted">{project.description}</p>
</div>

<style>
	.project-spotlight {
		position: absolute;
		z-index: 0;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(
			340px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%),
			color-mix(in srgb, var(--primary) 10%, transparent),
			transparent 72%
		);
		opacity: 0;
		transition: opacity 180ms var(--ease-out-expo);
	}

	@media (pointer: fine) and (prefers-reduced-motion: no-preference) {
		.ui-project-row:hover .project-spotlight {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.project-spotlight {
			display: none;
		}
	}
</style>
