<script lang="ts">
	import { untrack } from 'svelte';

	type Props = { theme: 'light' | 'dark' };
	type Star = { x: number; y: number; r: number; ph: number; sp: number; d: number };
	type Cloud = { x: number; y: number; scale: number; speed: number; sprite: number; alpha: number };

	let { theme }: Props = $props();
	let canvas: HTMLCanvasElement | undefined = $state();

	// ── warna: ubah di sini ──
	const DARK_TOP = '#040b1f';
	const DARK_BOTTOM = '#0a1c3d';
	const LIGHT_TOP = '#b9daf3';
	const LIGHT_BOTTOM = '#ffffff';
	const STAR = '#bde8f5';

	let target = untrack(() => (theme === 'light' ? 1 : 0)); // 0 = malam, 1 = siang
	let kick: (() => void) | undefined;

	$effect(() => {
		target = theme === 'light' ? 1 : 0;
		kick?.();
	});

	// awan dibuat sekali sebagai gambar, lalu hanya digeser
	function makeCloud(): HTMLCanvasElement {
		const c = document.createElement('canvas');
		c.width = 360;
		c.height = 160;
		const g = c.getContext('2d')!;
		const n = 5 + Math.floor(Math.random() * 3);
		const puffs = Array.from({ length: n }, (_, i) => ({
			x: 60 + i * (240 / (n - 1)) + (Math.random() * 30 - 15),
			y: 90 - Math.sin((i / (n - 1)) * Math.PI) * 28 + (Math.random() * 14 - 7),
			r: 36 + Math.random() * 26
		}));
		const paint = (dy: number, rgb: string, a: number) => {
			for (const p of puffs) {
				const grad = g.createRadialGradient(p.x, p.y + dy, 0, p.x, p.y + dy, p.r);
				grad.addColorStop(0, `rgba(${rgb},${a})`);
				grad.addColorStop(1, `rgba(${rgb},0)`);
				g.fillStyle = grad;
				g.beginPath();
				g.arc(p.x, p.y + dy, p.r, 0, Math.PI * 2);
				g.fill();
			}
		};
		paint(14, '150,185,225', 0.5); // bayangan biru di bawah awan
		paint(0, '255,255,255', 0.95);
		return c;
	}

	$effect(() => {
		const el = canvas;
		const ctx = el?.getContext('2d');
		if (!el || !ctx) return;

		const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		let mix = target;
		let w = 0;
		let h = 0;
		let raf = 0;
		let last = 0;
		let nextShot = 4000;
		let darkGrad: CanvasGradient;
		let lightGrad: CanvasGradient;
		const mouse = { x: 0, y: 0 };
		const goal = { x: 0, y: 0 };
		const shot = { on: false, x: 0, y: 0, dx: 0, dy: 0, born: 0 };

		const stars: Star[] = Array.from({ length: 420 }, () => ({
			x: Math.random(),
			y: Math.random(),
			r: 0.4 + Math.random() ** 3 * 1.6,
			ph: Math.random() * 6.28,
			sp: 0.0008 + Math.random() * 0.002,
			d: 0.2 + Math.random() * 0.8
		}));
		const sprites = [makeCloud(), makeCloud(), makeCloud()];
		const clouds: Cloud[] = Array.from({ length: 8 }, (_, i) => ({
			x: Math.random(),
			y: 0.05 + Math.random() * 0.75,
			scale: 0.7 + Math.random() * 1.1,
			speed: 0.005 + Math.random() * 0.012,
			sprite: i % 3,
			alpha: 0.55 + Math.random() * 0.4
		}));

		function resize() {
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			w = window.innerWidth;
			h = window.innerHeight;
			el!.width = w * dpr;
			el!.height = h * dpr;
			ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
			darkGrad = ctx!.createLinearGradient(0, 0, 0, h);
			darkGrad.addColorStop(0, DARK_TOP);
			darkGrad.addColorStop(1, DARK_BOTTOM);
			lightGrad = ctx!.createLinearGradient(0, 0, 0, h);
			lightGrad.addColorStop(0, LIGHT_TOP);
			lightGrad.addColorStop(1, LIGHT_BOTTOM);
			if (reduce) draw(0);
		}

		function draw(t: number) {
			const c = ctx!;
			const e = mix * mix * (3 - 2 * mix); // easing transisi
			c.globalAlpha = 1;

			if (e < 1) {
				c.fillStyle = darkGrad;
				c.fillRect(0, 0, w, h);

				// nebula tipis, bergeser pelan
				const nx = w * 0.75 + Math.sin(t * 0.00004) * 60;
				const ny = h * 0.28;
				const ng = c.createRadialGradient(nx, ny, 0, nx, ny, Math.max(w, h) * 0.5);
				ng.addColorStop(0, 'rgba(28,77,141,0.30)');
				ng.addColorStop(1, 'rgba(28,77,141,0)');
				c.fillStyle = ng;
				c.fillRect(0, 0, w, h);

				// bintang berkedip, dengan parallax kecil mengikuti kursor
				const n = Math.min(stars.length, Math.max(120, Math.round((w * h) / 5000)));
				c.fillStyle = STAR;
				for (let i = 0; i < n; i++) {
					const s = stars[i];
					const tw = 0.5 + 0.5 * Math.sin(t * s.sp + s.ph);
					c.globalAlpha = 0.25 + 0.75 * tw;
					c.beginPath();
					c.arc(s.x * w + mouse.x * 28 * s.d, s.y * h + mouse.y * 18 * s.d, s.r, 0, Math.PI * 2);
					c.fill();
				}

				// bintang jatuh
				if (shot.on) {
					const age = t - shot.born;
					if (age > 800) {
						shot.on = false;
					} else {
						const dist = age * 0.9;
						const hx = shot.x + shot.dx * dist;
						const hy = shot.y + shot.dy * dist;
						const tx = hx - shot.dx * 140;
						const ty = hy - shot.dy * 140;
						const g = c.createLinearGradient(tx, ty, hx, hy);
						g.addColorStop(0, 'rgba(189,232,245,0)');
						g.addColorStop(1, 'rgba(255,255,255,0.95)');
						c.globalAlpha = Math.sin((age / 800) * Math.PI);
						c.strokeStyle = g;
						c.lineWidth = 1.4;
						c.lineCap = 'round';
						c.beginPath();
						c.moveTo(tx, ty);
						c.lineTo(hx, hy);
						c.stroke();
					}
				}
				c.globalAlpha = 1;
			}

			if (e > 0) {
				c.globalAlpha = e;
				c.fillStyle = lightGrad;
				c.fillRect(0, 0, w, h);

				const k = Math.max(0.6, w / 1440);
				for (const cl of clouds) {
					const img = sprites[cl.sprite];
					const cw = img.width * cl.scale * k;
					const ch = img.height * cl.scale * k;
					const span = w + cw;
					const x = ((cl.x * span + t * cl.speed) % span) - cw;
					c.globalAlpha = e * cl.alpha;
					c.drawImage(img, x, cl.y * h, cw, ch);
				}
				c.globalAlpha = 1;
			}
		}

		function loop(t: number) {
			const dt = last ? Math.min(t - last, 64) : 16;
			last = t;
			mix += Math.sign(target - mix) * Math.min(Math.abs(target - mix), dt / 1100);
			mouse.x += (goal.x - mouse.x) * 0.06;
			mouse.y += (goal.y - mouse.y) * 0.06;

			if (!shot.on && t > nextShot && mix < 0.5) {
				const a = ((150 + Math.random() * 20) * Math.PI) / 180;
				Object.assign(shot, {
					on: true,
					x: w * (0.3 + Math.random() * 0.7),
					y: h * Math.random() * 0.35,
					dx: Math.cos(a),
					dy: Math.sin(a),
					born: t
				});
				nextShot = t + 6000 + Math.random() * 9000;
			}

			draw(t);
			raf = requestAnimationFrame(loop);
		}

		function onMove(e: PointerEvent) {
			goal.x = e.clientX / w - 0.5;
			goal.y = e.clientY / h - 0.5;
		}

		function onVisibility() {
			cancelAnimationFrame(raf);
			last = 0;
			if (!document.hidden) raf = requestAnimationFrame(loop);
		}

		kick = () => {
			if (reduce) {
				mix = target;
				draw(0);
			}
		};

		resize();
		window.addEventListener('resize', resize);
		if (!reduce) {
			window.addEventListener('pointermove', onMove);
			document.addEventListener('visibilitychange', onVisibility);
			raf = requestAnimationFrame(loop);
		}

		return () => {
			kick = undefined;
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', resize);
			window.removeEventListener('pointermove', onMove);
			document.removeEventListener('visibilitychange', onVisibility);
		};
	});
</script>

<canvas bind:this={canvas} aria-hidden="true" class="pointer-events-none fixed inset-0 -z-10 h-full w-full"></canvas>
