import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const generatedRouteTreeTypeFooter =
    /\nimport type \{ getRouter \} from '[^']+'\nimport type \{ startInstance \} from '[^']+'\ndeclare module '@tanstack\/react-start' \{[\s\S]*\n\}\s*$/;

export default defineConfig({
    plugins: [
        {
            name: "javascript-route-tree",
            enforce: "pre",
            transform(code, id) {
                if (!/[\\/]src[\\/]routeTree\.gen\.js(?:\?.*)?$/.test(id)) return null;
                return code.replace(generatedRouteTreeTypeFooter, "");
            },
        },
        react(),
    ],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./src/test/setup.js"],
        include: ["src/**/*.{test,spec}.{js,jsx}"],
    },
    resolve: {
        alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
});
