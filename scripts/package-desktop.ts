import nwbuild from 'nw-builder';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, readdirSync, unlinkSync } from 'fs';
import packageJson from '../package.json' with { type: 'json' };

const version = packageJson.version;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = join(__dirname, '..');
const appDir = join(rootDir, 'dist', 'desktop', 'app');
const outDir = join(rootDir, 'dist', 'desktop');

function removeUnusedLocales(buildDir: string) {
	const localesDir = join(buildDir, 'locales');

	if (!existsSync(localesDir)) {
		return;
	}

	const keepLocales = ['en-US.pak'];
	const localeFiles = readdirSync(localesDir);
	let removed = 0;

	for (const file of localeFiles) {
		if (!keepLocales.includes(file)) {
			unlinkSync(join(localesDir, file));
			removed++;
		}
	}

	console.log(`  Removed ${removed} unused locale files`);
}

async function main() {
	console.log('Packaging desktop applications...\n');

	// Check that dist/desktop/app exists
	if (!existsSync(appDir)) {
		console.error('Error: dist/desktop/app does not exist.');
		console.error('Please run "npm run build:desktop:prepare" first.');
		process.exit(1);
	}

	console.log('✓ Found dist/desktop/app');
	console.log('Building for Linux and Windows (this may take several minutes)...\n');

	try {
		await nwbuild({
			mode: 'build',
			version: 'latest',
			flavor: 'normal',
			platform: 'linux',
			arch: 'x64',
			srcDir: appDir,
			outDir: join(outDir, 'linux'),
			zip: false,
			glob: false,
			app: {
				icon: join(appDir, 'assets', 'android-chrome-512x512.png')
			}
		});
		console.log('✓ Linux build complete');
		removeUnusedLocales(join(outDir, 'linux'));

		await nwbuild({
			mode: 'build',
			version: 'latest',
			flavor: 'normal',
			platform: 'win',
			arch: 'x64',
			srcDir: appDir,
			outDir: join(outDir, 'win32'),
			zip: false,
			glob: false,
			app: {
				icon: join(appDir, 'assets', 'android-chrome-512x512.png'),
				company: 'All or Nothing',
				fileDescription: 'All or Nothing Card Game',
				fileVersion: version,
				internalName: 'all-or-nothing',
				legalCopyright: '',
				originalFilename: 'all-or-nothing.exe',
				productName: 'All or Nothing',
				productVersion: version
			},
		});
		console.log('✓ Windows build complete');
		removeUnusedLocales(join(outDir, 'win32'));

		console.log('\n✓ Desktop packaging complete');
		console.log(`  Output directory: ${outDir}`);
		console.log('\nTo run the Linux build:');
		console.log(`  cd ${outDir}/linux*/`);
		console.log('  ./nw');
		console.log('\nTo run the Windows build:');
		console.log(`  cd ${outDir}/win*/`);
		console.log('  ./nw.exe');
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.error('\nError during packaging:', message);
		process.exit(1);
	}
}

main();
