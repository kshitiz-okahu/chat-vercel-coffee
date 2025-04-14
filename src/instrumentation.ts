import { setupMonocle } from 'monocle2ai';

export async function register() {
    console.log("Registering instrumentation... NEXT_RUNTIME: " + process.env.NEXT_RUNTIME);
    // this registers monocle instrumentation
    if (process.env.NEXT_RUNTIME === "nodejs") {
        setupMonocle("vercelai.app");
    }
}
