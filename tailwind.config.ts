import type { Config } from "tailwindcss";

export default {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				ttFors: ['"TT Fors"', 'sans-serif'], // Add fallback
			},
			colors: {
				primaryBg: {
					light: '#ebebeb',
					DEFAULT: '#ebebeb',
					dark: '#1f2229',
				},
				secondaryBg: {
					light: '#d3deed',
					DEFAULT: '#d3deed',
					dark: '#4b5159',
				},
				accent: {
					light: '#455476',
					DEFAULT: '#455476',
					dark: '#455476',
					hover: {
						light: '#455476',
						DEFAULT: '#455476',
						dark: '#455476',
					}
				}
			},
		}
	},
	darkMode: ["class"],
	plugins: [
		require("tailwindcss-animate"),
		require("@tailwindcss/typography")
	],
} satisfies Config;
