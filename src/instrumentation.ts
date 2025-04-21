import { setupMonocle } from 'monocle2ai';

export async function register() {
    console.log("Registering instrumentation...");
    
    // this registers monocle instrumentation
    if (process.env.NEXT_RUNTIME === "nodejs") {
        try {   
            setupMonocle("vercelai.app");
        } catch (error) {
            console.error("Error setting up Monocle:", error);
        }
    }
}
