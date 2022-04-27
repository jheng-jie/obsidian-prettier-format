import type { App } from "obsidian"
import type { CustomPlugin, PluginSettings } from "./@types"

import { PluginSettingTab, Setting } from "obsidian"
import { getVersion } from "./cli"

const debounce = require("lodash/debounce")
const path = require("path")
const fs = require("fs")

/**
 * @desc default setting
 */
export const DEFAULT_SETTINGS: PluginSettings = {
  node: "/usr/local/bin",
  prettier: "/usr/local/bin",
  config: "./.prettierrc",
  formatOnSave: false,
  notice: false,
}

/**
 * @desc setting tab
 */
export default class extends PluginSettingTab {
  // main plugin
  plugin: CustomPlugin

  constructor(app: App, plugin: CustomPlugin) {
    super(app, plugin)
    this.plugin = plugin
  }

  display(): void {
    const { containerEl } = this

    // title
    containerEl.empty()
    containerEl.createEl("h2", { text: "Prettier Format Setting" })
    containerEl.addClass("prettier-format")

    // node path
    this.createNodeSetting()

    // prettier cmd path
    this.createPrettierSetting()

    // prettier config path
    this.createPrettierConfigSetting()

    // on save
    this.createOnSave()

    // show notice
    this.createShowNotice()
  }

  /**
   * @desc create show notice
   */
  createShowNotice() {
    const setting = new Setting(this.containerEl)

    // set label
    setting.setName("Prettier Notice").setDesc("notice on prettier run finish")

    // toggle button
    setting.addToggle(btn => btn.setValue(this.plugin.setting.notice).onChange((value: boolean) => this.plugin.saveSettings("notice", value)))
  }

  /**
   * @desc create on save
   */
  createOnSave() {
    const setting = new Setting(this.containerEl)

    // set label
    setting.setName("Format On Save").setDesc("format a file on save")

    // toggle button
    setting.addToggle(btn => btn.setValue(this.plugin.setting.formatOnSave).onChange((value: boolean) => this.plugin.saveSettings("formatOnSave", value)))
  }

  /**
   * @desc create prettier config
   */
  createPrettierConfigSetting() {
    const setting = new Setting(this.containerEl)
    const desc = ".prettierrc path"

    // set label
    setting.setName("Config").setDesc(desc)

    // check exist
    const verifyPath = debounce(async (filePath: string) => {
      try {
        const realPath = /^\.\//.test(filePath) ? path.resolve(this.plugin.projectPath, filePath) : filePath
        await fs.promises.access(realPath, fs.constants.F_OK)
        setting.setDesc(desc)
        setting.settingEl.removeClass("setting-error")
      } catch (e) {
        setting.setDesc(`${desc} ( path error )`)
        setting.settingEl.addClass("setting-error")
      }
    }, 500)
    verifyPath(this.plugin.setting.config)

    // input
    setting.addText(text => {
      text
        .setPlaceholder("Enter your config path.")
        .setValue(this.plugin.setting.config)
        .onChange(value => {
          if (path.basename(value).replace(/^\./g, "")) verifyPath(value)
          this.plugin.saveSettings("config", value)
        })
    })
  }

  /**
   * @desc create prettier
   */
  createPrettierSetting() {
    const setting = new Setting(this.containerEl)
    const desc = "prettier bin path"

    // set label
    setting.setName("Prettier").setDesc(desc)

    // check exist
    const verifyPath = debounce(async (bin: string) => {
      try {
        await fs.promises.access(path.resolve(bin, "prettier"), fs.constants.F_OK)
        const version = await getVersion("prettier", bin)
        setting.setDesc(`${desc} ( ${version} )`)
        setting.settingEl.removeClass("setting-error")
      } catch (e) {
        console.error("prettier-format.setting", "prettier.error", e)
        setting.setDesc(`${desc} ( path error )`)
        setting.settingEl.addClass("setting-error")
      }
    }, 500)
    verifyPath(this.plugin.setting.prettier)

    // input
    setting.addText(text => {
      text
        .setPlaceholder("Enter your prettier path.")
        .setValue(this.plugin.setting.prettier)
        .onChange(value => {
          value = value.replace(/\/prettier$/, "/")
          if (path.basename(value).replace(/^\./g, "")) verifyPath(value)
          this.plugin.saveSettings("prettier", value)
        })
    })
  }

  /**
   * @desc create node
   */
  createNodeSetting() {
    const setting = new Setting(this.containerEl)
    const desc = "node bin path"

    // set label
    setting.setName("Node").setDesc(desc)

    // check exist
    const verifyPath = debounce(async (bin: string) => {
      try {
        await fs.promises.access(path.resolve(bin, "node"), fs.constants.F_OK)
        const version = await getVersion("node", bin)
        setting.setDesc(`${desc} ( ${version} )`)
        setting.settingEl.removeClass("setting-error")
      } catch (e) {
        console.error("prettier-format.setting", "node.error", e)
        setting.setDesc(`${desc} ( path error )`)
        setting.settingEl.addClass("setting-error")
      }
    }, 500)
    verifyPath(this.plugin.setting.node)

    // input
    setting.addText(text => {
      text
        .setPlaceholder("Enter your prettier path.")
        .setValue(this.plugin.setting.node)
        .onChange(value => {
          value = value.replace(/\/node$/, "/")
          if (path.basename(value).replace(/^\./g, "")) verifyPath(value)
          this.plugin.saveSettings("node", value)
        })
    })
  }
}
