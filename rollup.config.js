import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import svg from 'rollup-plugin-svg';
import pkg from './package.json';

export default [

    // browser-friendly UMD build - for public use
    {
        input: 'src/dist-public/main.js',
        output: {
            name: 'TimerJS',
            file: pkg.browser_public,
            format: 'umd'
        },
        plugins: [
            resolve(), // so Rollup can find libraries
            commonjs(), // so Rollup can convert libraries to an ES modules
            svg()
        ]
    },

    // browser-friendly UMD build - for private use (logged users)
    {
        input: 'src/dist-private/main.js',
        output: {
            name: 'TimerJS',
            file: pkg.browser_private,
            format: 'umd'
        },
        plugins: [
            resolve(), // so Rollup can find libraries
            commonjs(), // so Rollup can convert libraries to an ES modules
            svg()
        ]
    }
];
