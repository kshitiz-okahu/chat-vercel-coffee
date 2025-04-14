import "import-in-the-middle";

export async function register() {
    console.log("Registering instrumentation... NEXT_RUNTIME: " + process.env.NEXT_RUNTIME);
    // this registers monocle instrumentation
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const monocle = await import('monocle2ai');
        monocle.setupMonocle("vercelai.app");
    }
}
