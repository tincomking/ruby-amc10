# Mametchi's Math Academy (ruby-amc10)

AMC10 数学竞赛互动训练平台，以拓麻歌子角色 Mametchi 为导师，为 Ruby 设计。

## 技术栈

- 纯静态站点：HTML + Vanilla JS + CSS，零框架依赖
- 数学渲染：KaTeX 0.16.11（CDN）
- AI 后端：Cloudflare Worker 代理 Claude Haiku 4.5
- 数据存储：localStorage + Cloudflare KV 云同步
- 部署：GitHub Pages（自动部署），网址 https://tincomking.github.io/ruby-amc10/

## 核心数据

- 本地练习题库：69+ 道（4 主题 x 5 子主题）
- 真题考试库：1123 道真题（2000-2025，51 套 AMC 10 试卷）
- JS 模块：11 个文件，全局 IIFE，按依赖顺序加载

## 目录结构

```
index.html          主页面
css/style.css       全部样式
js/app.js           主应用逻辑/状态机
js/ai.js            Claude API 集成
js/progress.js      进度追踪 + SM-2 间隔重复
js/mametchi.js      Mametchi SVG 角色 + 对话系统
js/examMode.js      考试模式管理器
js/problemBank.js   本地题库
js/problems.js      ProblemManager
js/whiteboard.js    Canvas 草稿板
js/geoDiagram.js    几何图示 SVG 生成
js/hintDetailsBank.js  预制深层提示库
js/countdown.js     AMC 10 倒计时
data/exams.json     真题数据 (3.2MB)
worker/             Cloudflare Worker 源码
```

## 技术 Reference 索引

| 文档 | 路径 | 内容 |
|------|------|------|
| KaTeX 数学渲染 | [.claude/reference/katex-math-rendering.md](.claude/reference/katex-math-rendering.md) | 公式语法、auto-render 配置、AMC10 常用符号、性能优化、移动端适配 |
| SM-2 间隔重复 | [.claude/reference/spaced-repetition.md](.claude/reference/spaced-repetition.md) | 核心公式、EF 调整、自适应难度联动、localStorage 持久化 |
| SVG 角色动画 | [.claude/reference/svg-animation.md](.claude/reference/svg-animation.md) | Mametchi 5 状态实现、CSS animation、对话气泡、过渡效果 |

## 产品需求文档

完整 PRD 位于 [.claude/PRD.md](.claude/PRD.md)，包含功能详情、数据结构、AI 集成、UI/UX 设计规范。

## 开发注意事项

- 所有界面和题目为英文（与 AMC 10 考试一致）
- 修改后直接 commit 并 push，无需确认
- Cloudflare Worker secrets 不可硬编码，通过 `wrangler secret put` 设置
- KaTeX 公式在 JS 字符串中反斜杠需转义为 `\\`
- exams.json 体积 3.2MB，修改后注意 git push 耗时
