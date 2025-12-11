import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync, writeFileSync, existsSync, cpSync, chmodSync } from 'fs';
import packageJson from '../package.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = join(__dirname, '..');
const outDir = join(rootDir, 'dist', 'desktop');
const linuxDir = join(outDir, 'linux');
const appImageDir = join(outDir, 'AppImage');

function createAppImage() {
	if (!existsSync(linuxDir)) {
		console.error('Linux build not found. Run build:desktop first.');
		process.exit(1);
	}

	console.log('Creating AppImage...\n');

	// Create AppDir structure
	mkdirSync(appImageDir, { recursive: true });

	// Copy application files
	cpSync(linuxDir, join(appImageDir, 'usr', 'bin', 'all-or-nothing'), {
		recursive: true
	});

	// Create desktop entry
	const desktopEntry = `[Desktop Entry]
Name=All or Nothing
Exec=all-or-nothing/all-or-nothing
Icon=all-or-nothing
Type=Application
Categories=Game;
`;

	writeFileSync(join(appImageDir, 'all-or-nothing.desktop'), desktopEntry);

	// Copy icon (use the 512x512 PNG)
	cpSync(
		join(linuxDir, 'package.nw', 'assets', 'android-chrome-512x512.png'),
		join(appImageDir, 'all-or-nothing.png')
	);

	// Create AppRun script
	const appRunScript = `#!/bin/bash
SELF=$(readlink -f "$0")
HERE=\${SELF%/*}
export PATH="\${HERE}/usr/bin/all-or-nothing:\${PATH}"
exec "\${HERE}/usr/bin/all-or-nothing/all-or-nothing" "$@"
`;

	const appRunPath = join(appImageDir, 'AppRun');
	writeFileSync(appRunPath, appRunScript);
	chmodSync(appRunPath, 0o755);

	console.log('✓ Created AppDir structure');

	// Download appimagetool if not present
	const appimagetoolPath = join(outDir, 'appimagetool-x86_64.AppImage');

	if (!existsSync(appimagetoolPath)) {
		console.log('Downloading appimagetool...');
		execSync(
			`wget -O "${appimagetoolPath}" https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage`,
			{ stdio: 'inherit' }
		);
		chmodSync(appimagetoolPath, 0o755);
	}

	// Build AppImage
	console.log('Building AppImage (this may take a minute)...');

	const appImageOutput = join(
		outDir,
		`all-or-nothing-${packageJson.version}-x86_64.AppImage`
	);

	try {
		execSync(
			`ARCH=x86_64 "${appimagetoolPath}" "${appImageDir}" "${appImageOutput}"`,
			{ stdio: 'inherit' }
		);

		console.log(`\n✓ AppImage created: ${appImageOutput}`);
		console.log(`  Size: ${(execSync(`du -h "${appImageOutput}"`).toString().split('\t')[0])}`);
		console.log('\nTo run:');
		console.log(`  chmod +x "${appImageOutput}"`);
		console.log(`  ./"${appImageOutput.split('/').pop()}"`);
	} catch (error) {
		console.error('Failed to create AppImage');
		const message = error instanceof Error ? error.message : String(error);
		console.error(message);
		process.exit(1);
	}
}

createAppImage();
