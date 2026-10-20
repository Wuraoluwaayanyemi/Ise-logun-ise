// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const generatedRouteTreeTypeFooter =
    /\nimport type \{ getRouter \} from '[^']+'\nimport type \{ startInstance \} from '[^']+'\ndeclare module '@tanstack\/react-start' \{[\s\S]*\n\}\s*$/;

export default defineConfig({
    tanstackStart: {
        // Redirect TanStack Start's bundled server entry to src/server.js (our SSR error wrapper).
        server: { entry: "server" },
        router: {
            generatedRouteTree: "routeTree.gen.js",
            disableTypes: true,
        },
    },
    vite: {
        optimizeDeps: { noDiscovery: true },
        plugins: [
            {
              name: "javascript-route-tree",
              enforce: "pre",
              transform(code, id) {
                if (!/[\\/]src[\\/]routeTree\.gen\.js(?:\?.*)?$/.test(id)) return null;
                return code.replace(generatedRouteTreeTypeFooter, "");
              },
            },
        ],
    },
});
