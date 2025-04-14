export async function register() {
    // this registers monocle instrumentation
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const monocle = await import('monocle2ai');
        monocle.setupMonocle("vercelai.app");
    }
}
