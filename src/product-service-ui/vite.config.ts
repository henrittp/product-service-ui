import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { cjsInterop } from "vite-plugin-cjs-interop";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    cjsInterop({
      dependencies: [
        "@material-tailwind/react",
        // Se precisar, adicione caminhos mais específicos ou globs, por exemplo:
        // "@material-tailwind/react/*"
      ],
    }),
  ],
  server: {
    host: true, // Permite acesso a partir de outros dispositivos na rede local
    port: 4000, // Ou a porta que você desejar
  },
  legacy: { proxySsrExternalModules: true },
});
