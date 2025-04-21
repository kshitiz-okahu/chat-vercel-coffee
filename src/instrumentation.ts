import { setupMonocle } from 'monocle2ai';
import * as module_private_1 from 'module'
// @ts-ignore
import 'import-in-the-middle/hook.mjs';


export async function register() {
    // console.log("hook: " + Hook);
    console.log("Registering instrumentation... NEXT_RUNTIME: " + process.env.NEXT_RUNTIME);
    console.log("import.meta.url: " + import.meta.url);
    // this registers monocle instrumentation
    if (process.env.NEXT_RUNTIME === "nodejs") {
        module_private_1.register('import-in-the-middle/hook.mjs', import.meta.url)
        setupMonocle("vercelai.app");
    }
}
