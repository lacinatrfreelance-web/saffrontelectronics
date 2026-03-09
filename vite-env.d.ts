/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // Ajoutez ici vos autres variables VITE_*
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}