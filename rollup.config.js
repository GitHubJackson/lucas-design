import babel from "rollup-plugin-babel";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import filesize from "rollup-plugin-filesize";
import { uglify } from "rollup-plugin-uglify";
const dts = require("rollup-plugin-dts");
// PostCSS plugins
// css代码压缩
import cssnano from "cssnano";

const isProd = process.env.NODE_ENV === "production";

export default [
  {
    input: "src/components/index.ts",
    output: {
      preserveModules: true,
      // exports: 'named',
      // assetFileNames: ({ name }) => {
      //   const { ext, dir, base } = path.parse(name);
      //   if (ext !== ".css") return "[name].[ext]";
      //   // 规范 style 的输出格式
      //   return path.join(dir, "style", base);
      // },
      dir: "lib",
      format: "esm",
    },
    plugins: [
      typescript({
        include: ["src/components/**/*.ts+(|x)"],
        exclude: ["*.d.ts", "**/*.stories.tsx", "**/*.test.tsx"],
      }),
      babel(),
      postcss({
        extract: true,
        plugins: [cssnano()],
        // 处理.css和.less文件
        extensions: [".css", ".less"],
      }),
      filesize(),
      isProd && uglify(),
    ],
    external: ["react", "react-dom"],
  },
  {
    // 生成 .d.ts 类型声明文件
    input: "src/components/index.ts",
    output: {
      file: "lib/index.d.ts",
      format: "esm",
    },
    plugins: [
      dts.default(),
      postcss({
        plugins: [cssnano()],
        // 处理.css和.less文件
        extensions: [".css", ".less"],
      }),
    ],
  },
];
