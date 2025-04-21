import { setupMonocle } from 'monocle2ai';
import * as module_private_1 from 'module'
import * as fs from 'fs';

export async function register() {
    // console.log("hook: " + Hook);
    console.log("Registering instrumentation... NEXT_RUNTIME: " + process.env.NEXT_RUNTIME);
    console.log("import.meta.url: " + import.meta.url);
    // this registers monocle instrumentation
    if (process.env.NEXT_RUNTIME === "nodejs") {
        // read a directory and list all the folders
        const dir = '/vercel/path0/node_modules';
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = `${dir}/${file}`;
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                console.log(`Directory: ${file}`);
            } else {
                console.log(`File: ${file}`);
            }
        });
        module_private_1.register('import-in-the-middle/hook.mjs',"file:///vercel/path0/node_modules")
        console.log("registered import-in-the-middle/hook.mjs");
        setupMonocle("vercelai.app");
    }
}
