import { readdirSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';

const clean = (dir) => {
    let entries;
    try {
        entries = readdirSync(dir);
    } catch {
        return;
    }

    entries.forEach((name) => {
        const path = join(dir, name);

        if (statSync(path).isDirectory()) {
            clean(path);
            if (readdirSync(path).length === 0) rmSync(path, { recursive: true });
        } else if (name.endsWith('.d.ts')) {
            rmSync(path);
        }
    });
};

clean('types');
