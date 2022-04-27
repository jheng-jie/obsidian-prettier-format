export type PluginSettings = {
  // node bin path
  node: string
  // prettier bin path
  prettier: string
  // prettier rc options path
  config: string
  // format on save
  formatOnSave: boolean
  // show notice
  notice: boolean
}

export type CustomPlugin = import("obsidian").Plugin & {
  // project path
  projectPath: string
  // setting attribute
  setting: PluginSettings
  // save setting
  saveSettings: (key: keyof PluginSettings, value: string | boolean) => void
}

export type OnSaveCache = {
  // delay handler
  timout?: NodeJS.Timer
  // file size
  size: number
}
