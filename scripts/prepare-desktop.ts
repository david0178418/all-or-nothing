import { existsSync, mkdirSync, cpSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = join(__dirname, '..');
const webDistDir = join(rootDir, 'dist', 'web');
const desktopDir = join(rootDir, 'dist', 'desktop');
const appDir = join(desktopDir, 'app');

function main() {
	console.log('Preparing desktop build...\n');

	// Check that dist/web exists
	if (!existsSync(webDistDir)) {
		console.error('Error: dist/web does not exist.');
		console.error('Please run "npm run build" first to create the web build.');
		process.exit(1);
	}

	console.log('✓ Found dist/web');

	// Create dist/desktop/app directory
	if (existsSync(appDir)) {
		console.log('✓ Cleaning existing dist/desktop/app');
	}
	mkdirSync(appDir, { recursive: true });
	console.log('✓ Created dist/desktop/app');

	// Copy all files from dist/web to dist/desktop/app
	console.log('Copying files from dist/web to dist/desktop/app...');
	cpSync(webDistDir, appDir, { recursive: true });
	console.log('✓ Copied web build files');

	// Read version from root package.json
	const rootPackageJson = JSON.parse(
		readFileSync(join(rootDir, 'package.json'), 'utf-8')
	);

	// Generate NW.js package.json configuration
	const nwPackageJson = {
		name: 'all-or-nothing',
		main: 'index.html',
		version: rootPackageJson.version,
		window: {
			title: 'All or Nothing',
			width: 1024,
			height: 768,
			min_width: 800,
			min_height: 600,
			resizable: true,
			frame: true,
			position: 'center'
		},
		'chromium-args': '--disable-dev-shm-usage'
	};

	// Write package.json to dist/desktop/app
	writeFileSync(
		join(appDir, 'package.json'),
		JSON.stringify(nwPackageJson, null, '\t')
	);
	console.log('✓ Created NW.js package.json configuration');

	console.log('\n✓ Desktop build preparation complete');
	console.log(`  Output: ${appDir}`);
}

main();
