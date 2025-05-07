import { extend } from "lodash";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["NunitoSans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
