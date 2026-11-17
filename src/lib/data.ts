export type Project = {
	title: string;
	description: string;
	stack: string;
	year: number;
	href?: string;
};

export const projects: Project[] = [
	{
		title: 'Go Finance',
		description: 'Aplikasi pencatatan keuangan pribadi untuk Android dengan sinkronisasi cloud.',
		stack: 'Flutter, Dart',
		year: 2026,
		href: 'https://github.com/Syaarif/Go-Finance-'
	},
	{
		title: 'Smile Photobooth',
		description: 'Aplikasi photobooth untuk acara, dengan fitur pengambilan foto, filter, dan cetak.',
		stack: 'Vite',
		year: 2026,
		href: 'https://github.com/Syaarif/SmilePhotobooth'
	},
	{
		title: 'Student Violation System',
		description: 'Sistem informasi pelanggaran siswa untuk sekolah, dengan fitur manajemen data dan laporan.',
		stack: 'Python',
		year: 2026,
		href: 'https://github.com/Syaarif/STUDENT-VIOLATION-SYSTEM'
	}
];

export const profile = {
	bio: 'Saya suka membangun hal yang berguna dan terlihat rapi. Saat ini belajar SvelteKit dan TypeScript, sambil mengerjakan proyek kecil untuk sekolah dan komunitas.',
	facts: [
		{ label: 'FOKUS', value: 'UI/UX dan Analisis sistem' },
		{ label: 'STACK', value: 'SvelteKit · TypeScript · Tailwind' },
		{ label: 'LOKASI', value: 'Indonesia' },
		{ label: 'STATUS', value: 'Terbuka untuk kolaborasi' }
	],
	skills: ['HTML', 'CSS', 'JavaScript', 'SvelteKit', 'Tailwind', 'Git']
};

// TEMPEL ke bawah isi src/lib/data.ts (jangan hapus yang lama).
// Semua path gambar masih placeholder. Saat foto asli siap, ganti file dengan
// nama yang sama atau ubah ekstensinya di sini.

export type Education = {
	school: string;
	major: string;
	period: string;
	logo: string;
};

export type TechItem = {
	name: string;
	group: string;
	icon: string;
};

const PH = '/images/portfolio';

export const folderPhotos = [
	{ src: `${PH}/folder/Certificatel - CODEPOLITAN.webp`, alt: 'Foto kegiatan 1' },
	{ src: `${PH}/folder/photo-02.svg`, alt: 'Foto kegiatan 2' },
	{ src: `${PH}/folder/photo-03.svg`, alt: 'Foto kegiatan 3' },
	{ src: `${PH}/folder/photo-04.svg`, alt: 'Foto kegiatan 4' }
];

// ISI sendiri: nama sekolah dan tahunnya
export const education: Education[] = [
	{
		school: 'SMKN 8 SEMARANG',
		major: 'Pengembangan Perangkat Lunak dan Gim (PPLG)',
		period: '2025 - Sekarang',
		logo: `${PH}/edu/edu-01.png`
	}
];

export const techStack: TechItem[] = [
	{ name: 'HTML & CSS', group: 'WEB', icon: `${PH}/stack/stack-01.svg` },
	{ name: 'JavaScript', group: 'WEB', icon: `${PH}/stack/stack-02.svg` },
	{ name: 'TypeScript', group: 'WEB', icon: `${PH}/stack/stack-03.svg` },
	{ name: 'SvelteKit', group: 'WEB', icon: `${PH}/stack/stack-04.svg` },
	{ name: 'Tailwind', group: 'WEB', icon: `${PH}/stack/stack-05.svg` },
	{ name: 'Flutter', group: 'MOBILE', icon: `${PH}/stack/stack-06.svg` },
	{ name: 'Python', group: 'BACKEND', icon: `${PH}/stack/stack-07.svg` },
	{ name: 'PHP', group: 'BACKEND', icon: `${PH}/stack/stack-09.svg`},
	{ name: 'MySQL', group: 'BACKEND', icon: `${PH}/stack/stack-10.svg`},
	{ name: 'Git', group: 'ALAT', icon: `${PH}/stack/stack-08.svg` },
	{ name: 'Vercel', group: 'ALAT', icon: `${PH}/stack/stack-08.svg` },
	{ name: 'Metered', group: 'ALAT', icon: `${PH}/stack/stack-08.svg` },
];