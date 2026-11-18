<script lang="ts">
	import type { Education, TechItem } from '$lib/data';

	type Props = { education: Education[]; techStack: TechItem[] };

	let { education, techStack }: Props = $props();

	const groups = $derived([...new Set(techStack.map((t) => t.group))]);
</script>

<!-- pendidikan -->
<section id="pendidikan" class="scroll-reveal border-t border-line">
	<div class="mx-auto max-w-[1440px] px-6 pt-5 pb-14 lg:px-24 lg:pb-24">
		<p class="font-mono text-[11px] tracking-[1.1px]">PENDIDIKAN</p>

		<div class="mt-7 flex flex-col divide-y divide-line lg:mt-10">
			{#each education as item (item.school)}
				<div class="ui-project-row flex flex-col gap-4 py-7 lg:flex-row lg:items-center lg:gap-10">
					<img
						src={item.logo}
						alt=""
						class="ui-project-shift h-[50px] w-20 shrink-0 border border-line object-contain"
					/>
					<div class="ui-project-shift flex flex-1 flex-col gap-1.5">
						<h2 class="text-[22px] leading-[1.2] font-medium tracking-[-0.3px]">{item.school}</h2>
						<p class="text-[15px] leading-[1.55] text-muted">{item.major}</p>
					</div>
					<span class="font-mono text-[11px] tracking-[1.1px]">{item.period}</span>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- tech stack -->
<section id="stack" class="scroll-reveal border-t border-line">
	<div class="mx-auto max-w-[1440px] px-6 pt-5 pb-14 lg:px-24 lg:pb-24">
		<p class="font-mono text-[11px] tracking-[1.1px]">TECH STACK</p>

		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<div
			class="-mx-6 mt-7 flex snap-x snap-mandatory scroll-px-6 gap-5 overflow-x-auto px-6 pb-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:mx-0 lg:mt-10 lg:flex-col lg:gap-10 lg:overflow-visible lg:px-0 lg:pb-0"
			role="region"
			aria-label="Daftar kategori tech stack"
			tabindex="0"
			data-lenis-prevent-touch
		>
			{#each groups as group (group)}
				<div
					class="flex w-[min(85vw,300px)] shrink-0 snap-start flex-col gap-4 lg:w-full lg:shrink lg:snap-none"
				>
					<span class="font-mono text-[11px] tracking-[1.1px] text-muted">{group}</span>
					<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
						{#each techStack.filter((t) => t.group === group) as tech (tech.name)}
							<div class="tech-tile flex flex-col items-start gap-4 border border-line p-4">
								<img src={tech.icon} alt="" class="tech-icon h-10 w-10" />
								<span class="text-[15px]">{tech.name}</span>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.tech-tile {
		transition:
			transform 200ms ease-out,
			border-color 200ms ease-out,
			background-color 200ms ease-out;
	}

	.tech-icon {
		opacity: 0.6;
		filter: grayscale(1);
		transition:
			opacity 200ms ease-out,
			filter 200ms ease-out;
	}

	@media (hover: hover) {
		.tech-tile:hover {
			border-color: var(--primary);
			background-color: var(--surface);
			transform: translateY(-4px);
		}

		.tech-tile:hover .tech-icon {
			opacity: 1;
			filter: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.tech-tile,
		.tech-icon {
			transition: none;
		}

		.tech-tile:hover {
			transform: none;
		}
	}
</style>
