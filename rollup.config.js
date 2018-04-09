import babel from 'rollup-plugin-babel';
import license from 'rollup-plugin-license';
import uglify from 'rollup-plugin-uglify';
import pkg from './package.json';

const banner = `/**
 * panelSnap.js v${pkg.version}
 * Copyright (c) 2013-present, Guido Bouman
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */`;

export default {
  input: 'src/jquery.panelSnap.js',
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' },
    { file: pkg.browser, format: 'umd' },
    { file: 'docs/jquery.panelSnap.js', format: 'umd' },
  ],
  plugins: [
    babel({
      exclude: ['node_modules/**'],
    }),
    uglify(),
    license({
      banner,
    }),
  ],
};
