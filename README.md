## Obsidian Prettier Format Plugin

<br>

#### 用途

- 使用系統終端指令自動排版

<br>

#### 安裝

```shell
yarn install
```

<br>

#### 打包

```shell
yarn run build
```

- output: `./dist`

<br>

#### Obsidian 新增外掛

- 複製 `styles.css` `manifest.json` `main.js` 到筆記專案 `/.obsidian/plugins`

  ```shell
  cp -r dist/ ${ObsidianProject}/.obsidian/plugins/prettier-format/
  ```

<br>

#### Obsidian Prettier 設定

- `node` bin 路徑

  ```shell
  # example
  ~/.nvm/versions/node/v17.0.1/bin/node
  ```

- `prettier` bin 路徑

  ```shell
  # example
  /opt/homebrew/bin/
  ```

- `.prettierrc` 設定檔位置

  ```json5
  // .prettierrc
  {
    printWidth: 300,
    tabWidth: 2,
    useTabs: false,
    semi: false,
    singleQuote: false,
    jsxSingleQuote: false,
    trailingComma: "all",
    bracketSpacing: true,
    jsxBracketSameLine: false,
    arrowParens: "avoid",
    endOfLine: "auto",
  }
  ```
  
- `Format On Save` 存檔時自動執行

#### 使用方式

1. 點擊 Ribbon 功能列 Prettier Format 按扭

2. 勾選 Format On Save，存檔時自動執行
