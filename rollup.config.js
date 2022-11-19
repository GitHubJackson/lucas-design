import babel from "rollup-plugin-babel";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import filesize from "rollup-plugin-filesize";
import { uglify } from "rollup-plugin-uglify";

const isProd = process.env.NODE_ENV === "production";

export default {
  input: "src/main.ts",
  output: {
    file: "./lib/main.js",
    format: "esm",
  },
  plugins: [
    typescript({
      include: ["src/stories/**/*.ts+(|x)", "src/main.ts"],
      exclude: ["*.d.ts", "**/*.stories.tsx", "**/*.test.tsx"],
    }),
    babel(),
    postcss(),
    filesize(),
    isProd && uglify(),
  ],
  external: ["react"],
};
