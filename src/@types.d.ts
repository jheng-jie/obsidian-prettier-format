export type PluginSettings = {
  // node bin path
  node: string
  // prettier bin path
  prettier: string
  // prettier rc options path
  config: string
  // show notice
  notice: boolean
}

export type CustomPlugin = import("obsidian").Plugin & {
  // project path
  projectPath: string
  // setting attribute
  setting: PluginSettings
  // save setting
  saveSettings: (key: keyof PluginSettings, value: string | boolean | number) => void
}

export type OnSaveCache = {
  // delay handler
  timout?: NodeJS.Timer
  // file size
  size: number
}
