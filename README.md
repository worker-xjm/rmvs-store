## RMVS Store

RMVS Store 是一个基于 **Astro** 构建的女装电商展示站点，部署目标为 **Cloudflare**，样式使用 **Tailwind CSS 4.x**。

### 技术栈

- **框架**：Astro（服务器渲染，Cloudflare adapter）
- **部署环境**：Cloudflare
- **样式**：Tailwind CSS 4.x + 自定义全局样式（`src/styles/global.css`）
- **语言**：TypeScript / JavaScript

### 目录结构（简要）

- `src/pages/`：页面入口（例如首页 `index.astro`）
- `src/layouts/`：页面布局（例如 `Layout.astro`）
- `src/components/`：站点组件（头部、Banner、商品列表、页脚等）
- `src/data/products.ts`：商品数据源
- `src/styles/global.css`：站点全局样式
- `astro.config.mjs`：Astro 配置（Cloudflare 适配、Tailwind 插件）
- `wrangler.jsonc`：Cloudflare Worker 配置

### 本地开发

1. 安装依赖（根据你项目当前使用的包管理工具执行，例如：）

```bash
pnpm install
# 或者
npm install
```

2. 启动开发服务器：

```bash
pnpm dev
# 或者
npm run dev
```

3. 在浏览器中访问 `http://localhost:4321`（默认 Astro 端口，如有修改请以实际端口为准）。

### 构建与部署

- 本地构建：

```bash
pnpm build
# 或者
npm run build
```

- 构建产物将输出到 `dist/`，通过 Cloudflare（`wrangler`）进行部署，配置参考 `wrangler.jsonc` 与 `astro.config.mjs`。

### 样式规范

- 页面和组件样式必须使用 **Tailwind CSS 4.x** 的原子类。
- 如需扩展样式，请优先使用 Tailwind 配置 / 工具类，其次再在 `src/styles/global.css` 中增加少量全局样式。

### 后续说明

本项目的 AI 协作规范见 `agents.md`，你可以在后续根据需要补充更多规则和提示词。

# Astro Starter Kit: Basics

```sh
deno create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `deno install`             | Installs dependencies                            |
| `deno dev`             | Starts local dev server at `localhost:4321`      |
| `deno build`           | Build your production site to `./dist/`          |
| `deno preview`         | Preview your build locally, before deploying     |
| `deno astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `deno astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
