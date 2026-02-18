/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

declare global {
  function generateCVFromData(data: Record<string, unknown>): string
  function prepareCVContainer(data: Record<string, unknown>): void
}
export {}
