import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = join(__dirname, '..');
const outDir = join(rootDir, 'dist', 'desktop');

function createWindowsPortable() {
	const win32Dir = join(outDir, 'win32');

	if (!existsSync(win32Dir)) {
		console.error('Windows build not found. Run build:desktop first.');
		process.exit(1);
	}

	console.log('Creating Windows portable executable...');

	// Create 7z archive
	try {
		execSync(`7z a -t7z "${outDir}/app.7z" "${win32Dir}/*" -mx=9`, {
			stdio: 'inherit'
		});

		// Create config for SFX
		const sfxConfig = `;!@Install@!UTF-8!
RunProgram="all-or-nothing.exe"
;!@InstallEnd@!`;

		writeFileSync(join(outDir, 'config.txt'), sfxConfig);

		// Combine SFX module + config + archive
		// Requires 7z SFX module (7zSD.sfx) in the same directory
		execSync(
			`cat 7zSD.sfx config.txt app.7z > all-or-nothing-portable.exe`,
			{ cwd: outDir, stdio: 'inherit' }
		);

		console.log('✓ Created all-or-nothing-portable.exe');
	} catch (error) {
		console.error('7-Zip not found. Install p7zip-full or 7-Zip');
	}
}

createWindowsPortable();
