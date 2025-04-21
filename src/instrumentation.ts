import { setupMonocle } from 'monocle2ai';
import * as module_private_1 from 'module'
import * as fs from 'fs';

export async function register() {
    // console.log("hook: " + Hook);
    console.log("Registering instrumentation... NEXT_RUNTIME: " + process.env.NEXT_RUNTIME);
    // this registers monocle instrumentation
    if (process.env.NEXT_RUNTIME === "nodejs") {
        // @ts-ignore
        import('import-in-the-middle/hook.mjs')

        // read a directory and list all the folders
        for(const dir of ["/var/task/node_modules", "/var/task/", "/var/task/node_modules/import-in-the-middle"]) {
            // const dir = '/var/task/node_modules';
            console.log(`Reading directory: ${dir}`);
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
        }
        
        module_private_1.register('import-in-the-middle/hook.mjs',"file:///var/task/node_modules")
        console.log("registered import-in-the-middle/hook.mjs");
        try {   
            setupMonocle("vercelai.app");
        } catch (error) {
            console.error("Error setting up Monocle:", error);
        }
    }
}
