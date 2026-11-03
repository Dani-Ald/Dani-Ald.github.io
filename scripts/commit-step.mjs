import { execFileSync } from 'node:child_process';
execFileSync(process.execPath, ['scripts/build.mjs'], { stdio: 'inherit' });
execFileSync('git', ['add', '.'], { stdio: 'inherit' });
execFileSync('git', ['commit', '-m', process.argv[2]], { stdio: 'inherit' });
