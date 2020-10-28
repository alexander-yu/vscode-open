import * as path from 'path';
import * as Mocha from 'mocha';
import * as glob from 'glob';

function setupCoverage() {
	const NYC = require('nyc');
	const nyc = new NYC({
		cwd: path.resolve(__dirname, '../../../'),
		reporter: ['lcov', 'text', 'html'],
		extension: [
			'.ts',
			'.tsx'
		],
		exclude: [
			'**/test/**',
			'**/*.d.ts',
		],
		all: true,
		instrument: true,
		hookRequire: true,
		hookRunInContext: true,
		hookRunInThisContext: true,
	});

	nyc.reset();
	nyc.wrap();

	return nyc;
  }


export function run(): Promise<void> {
	const nyc = setupCoverage();
	// Create the mocha test
	const mocha = new Mocha({
		ui: 'tdd',
		color: true,
	});

	const testsRoot = path.resolve(__dirname, '..');

	return new Promise((c, e) => {
		glob('**/**.test.js', { cwd: testsRoot }, (err, files) => {
			if (err) {
				return e(err);
			}

			// Add files to the test suite
			files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

			try {
				// Run the mocha test
				mocha.run(failures => {
					if (failures > 0) {
						e(new Error(`${failures} tests failed.`));
					} else {
						c();
					}
				});
			} catch (err) {
				console.error(err);
				e(err);
			} finally {
				nyc.writeCoverageFile();
				nyc.report();
			}
		});
	});
}
