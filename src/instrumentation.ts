import { setupMonocle } from 'monocle2ai';
import * as module_private_1 from 'module'
import Hook from 'import-in-the-middle';


export async function register() {
    console.log("hook: " + Hook);
    console.log("Registering instrumentation... NEXT_RUNTIME: " + process.env.NEXT_RUNTIME);
    // this registers monocle instrumentation
    if (process.env.NEXT_RUNTIME === "nodejs") {
        module_private_1.register('import-in-the-middle/hook.mjs', import.meta.url)
        setupMonocle("vercelai.app");
    }
}
