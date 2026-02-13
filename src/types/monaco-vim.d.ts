declare module "monaco-vim" {
  import type { editor } from "monaco-editor";

  export function initVimMode(
    editor: editor.IStandaloneCodeEditor,
    statusBarNode: HTMLElement
  ): { dispose: () => void };
}
