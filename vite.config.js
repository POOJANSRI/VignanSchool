import { defineConfig } from "@lovable.dev/vite-tanstack-config";
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  resolve: {
    tsconfigPaths: true,
  },
  ssr: {
    // Force Vite restart
    // Firebase client SDK must never run on the server
    noExternal: [],
    external: ["firebase", "firebase/app", "firebase/firestore", "firebase/analytics"],
  },
});
