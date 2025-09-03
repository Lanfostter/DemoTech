import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [],
        server: {
            port: env.VITE_PORT ? parseInt(env.VITE_PORT) : 5173,
        },
    };
});
