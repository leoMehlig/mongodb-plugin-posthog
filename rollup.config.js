import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import pkg from './package.json'
import builtins from 'rollup-plugin-node-builtins'
import json from "@rollup/plugin-json";
const extensions = ['.js', '.jsx', '.ts', '.tsx']

// const external = Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.peerDependencies || {}))

export default [
    {
        input: './src/index.js',
        output: {
            file: pkg.main,
            format: 'cjs',
        },
        // external,
        plugins: [
            json(),
            builtins(),
            // Allows node_modules resolution
            resolve({
                // extensions,
                preferBuiltins: false,
                mainFields: ['jsnext', 'module', 'main'],
            }),
            // Allow bundling cjs modules. Rollup doesn't understand cjs
            commonjs({
                include: 'node_modules/**',
            }),
        ],
    },
]