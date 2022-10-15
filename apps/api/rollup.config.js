import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import pkg from './package.json' assert { type: 'json' };

export default {
	input: 'src/index.ts',
	external: [...Object.keys(pkg.dependencies)],
	plugins: [
		typescript(),
		nodeResolve(),
		generatePackageJson({
			baseContents: {
				name: 'api',
				engines: {
					node: '16',
				},
				private: true,
				main: 'index.js',
				dependencies: {},
			},
		}),
	],
	onwarn: () => {
		return;
	},
	output: {
		file: 'dist/index.js',
		format: 'es',
		sourcemap: true,
	},
};
