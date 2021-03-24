// import resolve from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';
// import pkg from './package.json';
// import json from "@rollup/plugin-json";


// export default [
// 	// browser-friendly UMD build
// 	{
// 		input: 'src/main.js',
//         output: {
//             file: 'dist/index.js',
//             format: 'iife', // immediately-invoked function expression — suitable for <script> tags
//             sourcemap: true
//         },
// 		plugins: [
// 			resolve(), // so Rollup can find `ms`
// 			commonjs(), // so Rollup can convert `ms` to an ES module
//             json()
// 		]
// 	},

// 	// CommonJS (for Node) and ES module (for bundlers) build.
// 	// (We could have three entries in the configuration array
// 	// instead of two, but it's quicker to generate multiple
// 	// builds from a single configuration where possible, using
// 	// an array for the `output` option, where we can specify
// 	// `file` and `format` for each target)
// 	{
// 		input: 'src/main.js',
// 		external: ['ms'],
// 		output: [
// 			{ file: pkg.main, format: 'cjs' },
// 			{ file: pkg.module, format: 'es' }
// 		]
// 	}
// ];


import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from "@rollup/plugin-json";

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/index.js',
	output: {
		file: 'public/bundle.js',
		format: 'cjs', // immediately-invoked function expression — suitable for <script> tags
		// sourcemap: true
	},
	plugins: [
		resolve(), // tells Rollup how to find date-fns in node_modules
		commonjs(), // converts date-fns to ES modules
        json() // minify, but only in production
	]
};