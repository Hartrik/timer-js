import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import svg from 'rollup-plugin-svg';
import pkg from './package.json';
import terser from '@rollup/plugin-terser';

export default [

    // app
    {
        input: 'src/app/main.js',
        plugins: [
            resolve(), // so Rollup can find libraries
            commonjs(), // so Rollup can convert libraries to an ES modules
            svg()
        ],
        output: [
            {
                // browser-friendly UMD build
                name: 'TimerJS',
                file: 'dist/timer-js.umd.js',
                banner: pkg.copyright,
                format: 'umd',
                sourcemap: true,
            },
            {
                // browser-friendly UMD build, MINIMIZED
                name: 'TimerJS',
                file: 'dist/timer-js.umd.min.js',
                format: 'umd',
                sourcemap: true,
                plugins: [
                    terser({
                        sourceMap: true,
                        format: {
                            preamble: pkg.copyright,
                            comments: false
                        }
                    })
                ]
            }
        ]
    }

];
