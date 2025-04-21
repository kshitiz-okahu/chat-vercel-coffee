import { setupMonocle } from 'monocle2ai';
import * as module_private_1 from 'module'
import * as fs from 'fs';
import * as path from 'path';

export async function register() {
    // console.log("hook: " + Hook);
    console.log("Registering instrumentation... NEXT_RUNTIME: " + process.env.NEXT_RUNTIME);
    console.log("import.meta.url: " + import.meta.url);
    // this registers monocle instrumentation
    if (process.env.NEXT_RUNTIME === "nodejs") {
        function findFile(dir: string, filename: string): string | null {
            try {
                const items = fs.readdirSync(dir, { withFileTypes: true });

                for (const item of items) {
                    const fullPath = path.join(dir, item.name);

                    if (item.isFile() && item.name === filename) {
                        return fullPath;
                    }

                    if (item.isDirectory()) {
                        const found = findFile(fullPath, filename);
                        if (found) {
                            return found;
                        }
                    }
                }

                return null;
            }
            catch (error) {
                console.error("Error reading directory: ", error);
                return null;
            }

        }

        // Example usage
        const directoryToSearch = '/'; // Change this to your base path
        const fileToFind = 'monocle-black.svg'; // Change this to the filename you're looking for

        const result = findFile(directoryToSearch, fileToFind);

        console.log("File found at: " + result);


        module_private_1.register('import-in-the-middle/hook.mjs', "file:///vercel/path0/node_modules")
        console.log("registered import-in-the-middle/hook.mjs");
        setupMonocle("vercelai.app");
    }
}
