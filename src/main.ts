import type { PluginSettings, OnSaveCache } from "./@types"
import type { View, DataAdapter, TAbstractFile } from "obsidian"

import { Notice, Plugin } from "obsidian"
const fs = require("fs")
const path = require("path")

// setting tab
import SettingTab, { DEFAULT_SETTINGS } from "./setting"

// prettier command line
import PrettierCommandLine from "./cli"

/**
 * @desc plugin
 */
export default class extends Plugin {
  // project path
  projectPath: string = ""

  // setting
  setting: PluginSettings = { ...DEFAULT_SETTINGS }

  // busy
  execution: boolean = false

  // on save cache
  saveCache: { [key: string]: OnSaveCache } = {}

  /**
   * @desc on plugin load
   */
  async onload() {
    // load setting
    await this.loadSettings()

    // project path
    this.projectPath = (this.app.vault.adapter as DataAdapter & { basePath: string }).basePath

    // This creates an icon in the left ribbon.
    this.addRibbonIcon("dice", "Prettier Format", this.onRibbonClick.bind(this))

    // cmd
    this.addCommand({
      id: "prettier-cli",
      name: "Prettier Format",
      callback: this.onRibbonClick.bind(this),
    })

    // setting tab
    this.addSettingTab(new SettingTab(this.app, this))
  }

  /**
   * @desc prettier cmd
   */
  async onRibbonClick() {
    // busy
    if (this.execution) return new Notice("too frequently.")

    // is not md focus
    const view = this.app?.workspace?.activeLeaf?.view as View & { file: TAbstractFile }
    if (view?.getViewType() !== "markdown") return

    // call command line
    try {
      this.execution = true
      await this.onPrettier(view.file)
    } finally {
      this.execution = false
    }
  }

  /**
   * @desc on prettier
   */
  async onPrettier(file: TAbstractFile) {
    try {
      // cmd
      const msg = await PrettierCommandLine.call(this.setting, this.projectPath, file.path)
      if (this.setting.notice) new Notice(msg)
    } catch (e) {
      console.info("prettier-format.cmd", "fail", e)
      new Notice(String(e))
    }

    try {
      // cache stat
      const stat = await fs.promises.stat(path.resolve(this.projectPath, file.path))
      this.saveCache[file.path] = { size: stat.size }
    } catch (e) {
      console.info("prettier-format.cmd", "stat.fail", e)
    }
  }

  /**
   * @desc load setting
   */
  async loadSettings() {
    try {
      const cache = await this.loadData()
      this.setting = { ...DEFAULT_SETTINGS, ...cache }
    } catch (e) {
      console.error("prettier-format.load-settings", "fail", e)
    }
  }

  /**
   * @desc save setting
   */
  async saveSettings(key: keyof PluginSettings, value: string | boolean | number) {
    try {
      this.setting[key] = value as never
      await this.saveData(this.setting)
    } catch (e) {
      console.error("prettier-format.save-settings", "fail", e)
    }
  }
}
