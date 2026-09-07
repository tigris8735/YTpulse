import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#07080C",
        surface: "#12141C",
        line: "#262B3A",
        accent: "#FF3B4E",
        pro: "#8B6CFF",
        success: "#3DDC97",
        test: "#F5C14A",
      },
      spacing: {
        sidebar: "228px",
        rail: "320px",
        bottombar: "72px",
      },
      borderRadius: {
        card: "16px",
        inner: "12px",
        small: "10px",
      },
    },
  },
  plugins: [],
};

export default config;
