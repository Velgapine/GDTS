# 内镜清洗消毒系统前端

## 本地开发

### 环境配置

1. 建议使用 nvm 控制 node，不会就直接安装 [Node.js](https://nodejs.org/en/)

2. 该项目使用`pnpm`进行依赖包管理

- 安装 pnpm `npm i -g pnpm`
- 设置 pnpm 下载源`pnpm config set registry https://registry.npm.taobao.org`

3. 完成 Git 的安装和配置

```
注意：关于换行符LF与CRLF

windows系统默认安装git的情况下，拉取代码时会将LF转CRLF，推送代码时会将CRLF转LF,
所以默认换行符是CRLF，但是项目配置要求的换行符为LF。
遇到eslint报错的同学请先删除本地仓库，在命令行（cmd，powershell，git bash等）输入：
git config --global core.autocrlf false
然后重新拉取代码，安装editorConfig for vscode插件
最后打开vscode，点击 设置 => 用户设置 => 文本编辑器 => 文件 => Eol => \n
```

### 项目配置

1. 拉取项目代码`git clone <git仓库地址>`
2. 安装项目依赖`pnpm install`
3. 项目运行开发`pnpm serve`
4. 项目构建打包`pnpm build`

## 项目开发

### 代码规范

Javascript 代码风格使用 [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
dev
[ESLint](https://github.com/eslint/eslint) 完成`js`代码质量检查和代码风格检查

[Prettier](https://github.com/prettier/prettier) 完成`sass,scss,css,less,html,json,md`的格式化

[EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) 完成保存时格式化行尾标注

**以上三个 VScode 插件安装后，保存时可以格式化代码，推荐安装**

### 代码提交

使用`husky`作为 Git 钩子执行检查

使用`lint-staged`缩小范围检查当前提交的代码，避免整个项目的检查

**代码提交时注释按照以下规范格式**

```
feat: 新增功能
fix: 修复功能
refactor: 代码重构；优化专项请使用 perf
perf: 优化相关，比如提升性能、体验
docs: 修改文档，如README
style: 代码格式修改，注意不是css样式代码
revert: 代码回滚
test: 测试用例，包括增加缺失用例或者修正测试用例
chore: 构建过程或辅助工具的变动或以上类型都不符合
```
