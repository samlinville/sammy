/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      sans: [
        "system",
        "-apple-system",
        "BlinkMacSystemFont",
        "Helvetica Neue",
        "Lucida Grande",
      ],
      mono: [
        "SFMono-Regular",
        "SF Mono",
        "ui-monospace",
        "DejaVu Sans Mono",
        "Menlo",
        "Consolas",
        "monospace",
      ],
    },
    extend: {
      colors: {
        red: {
          550: "#EE3F3F",
        },
      },
      typography: ({ theme }) => ({
        zinc: {
          css: {
            "--tw-prose-invert-body": theme("colors.zinc[400]"),
            "--tw-prose-invert-headings": theme("colors.zinc[200]"),
            "--tw-prose-invert-lead": theme("colors.zinc[300]"),
            "--tw-prose-invert-links": theme("colors.zinc[200]"),
            "--tw-prose-invert-bold": theme("colors.zinc[200]"),
            "--tw-prose-invert-counters": theme("colors.zinc[400]"),
            "--tw-prose-invert-bullets": theme("colors.zinc[600]"),
            "--tw-prose-invert-hr": theme("colors.zinc[700]"),
            "--tw-prose-invert-quotes": theme("colors.zinc[200]"),
            "--tw-prose-invert-quote-borders": theme("colors.zinc[700]"),
            "--tw-prose-invert-captions": theme("colors.zinc[400]"),
            "--tw-prose-invert-code": theme("colors.zinc[200]"),
            "--tw-prose-invert-pre-code": theme("colors.zinc[300]"),
            "--tw-prose-invert-pre-bg": theme("colors.zinc.800"),
            "--tw-prose-invert-th-borders": theme("colors.zinc[600]"),
            "--tw-prose-invert-td-borders": theme("colors.zinc[700]"),
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
