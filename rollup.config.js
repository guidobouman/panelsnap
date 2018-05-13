import babel from 'rollup-plugin-babel';
import license from 'rollup-plugin-license';
import uglify from 'rollup-plugin-uglify';
import resolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';

const banner = `/**
 * PanelSnap.js v${pkg.version}
 * Copyright (c) 2013-present, Guido Bouman
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */`;

const plugins = [
  babel({
    exclude: ['node_modules/**'],
  }),
  uglify(),
  license({
    banner,
  }),
];

export default [
  {
    input: 'src/panelsnap.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
    external: ['tweezer.js'],
    plugins,
  },
  {
    input: 'src/panelsnap.js',
    output: [
      { file: pkg.browser, format: 'umd', name: 'PanelSnap' },
      { file: 'docs/panelsnap.js', format: 'umd', name: 'PanelSnap' },
    ],
    plugins: [...plugins, resolve()],
  },
];
