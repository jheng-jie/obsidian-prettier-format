import type { PluginSettings } from "./@types"

import { spawn } from "child_process"
const path = require("path")
const fs = require("fs")

/**
 * @desc prettier command line
 */
export default async function (this: PluginSettings, projectPath: string, filePath: string): Promise<string> {
  const command: string[] = ["prettier", "--write", filePath]

  // config
  if (this.config) {
    const configPath = /^\.\//.test(this.config) ? path.resolve(projectPath, this.config) : this.config
    const exist = fs.promises
      .access(configPath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false)
    if (exist) command.push("--config", configPath)
  }

  // exec
  const shell = spawn(command.join(" "), {
    cwd: projectPath,
    shell: true,
    env: {
      PATH: `$PATH:${this.prettier}:${this.node}`,
    },
  })

  // stream
  const stream: { stdout: Uint8Array[]; stderr: Uint8Array[] } = { stdout: [], stderr: [] }
  shell.stdout.on("data", (data: Uint8Array) => stream.stdout.push(data))
  shell.stderr.on("data", (data: Uint8Array) => stream.stderr.push(data))

  // on exit
  return new Promise((resolve, reject) =>
    shell.on("exit", () => {
      // fail
      if (stream.stderr.length) return reject(String(stream.stderr))

      // success
      console.info("prettier-format.cmd", "success", String(stream.stdout))
      return resolve("prettier finish.")
    }),
  )
}

/**
 * @desc get cmd version
 */
export const getVersion = function (cmd: "node" | "prettier", path: string): Promise<string> {
  const command: string[] = [cmd, "-v"]

  // exec
  const shell = spawn(command.join(" "), {
    shell: true,
    env: {
      PATH: `$PATH:${path}`,
    },
  })

  // stream
  const stream: { stdout: Uint8Array[]; stderr: Uint8Array[] } = { stdout: [], stderr: [] }
  shell.stdout.on("data", (data: Uint8Array) => stream.stdout.push(data))
  shell.stderr.on("data", (data: Uint8Array) => stream.stderr.push(data))

  // on exit
  return new Promise((resolve, reject) =>
    shell.on("exit", () => {
      // fail
      if (stream.stderr.length) return reject(String(stream.stderr))
      // success
      return resolve(String(stream.stdout))
    }),
  )
}
