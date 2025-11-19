declare module '*.css?raw' {
  const content: string
  export default content
}

interface ImportMetaEnv {
  readonly OS_MAPS_AUTH_URL?: string
  readonly OS_MAPS_VECTOR_BASE_URL?: string
  readonly STORYBOOK_OS_MAPS_API_KEY_PUBLIC_DOCS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
