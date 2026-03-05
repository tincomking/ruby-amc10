# KaTeX 数学渲染最佳实践

> 适用于 ruby-amc10 项目，KaTeX 0.16.11，CDN 加载

---

## 1. 加载配置

项目通过 jsdelivr CDN 加载 KaTeX，`defer` 确保不阻塞页面渲染：

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"></script>
```

## 2. auto-render 配置

项目使用 `renderMathInElement` 自动扫描 DOM 并渲染公式。推荐的 delimiters 配置：

```javascript
renderMathInElement(element, {
  delimiters: [
    { left: '$$', right: '$$', display: true },   // 块级公式
    { left: '$', right: '$', display: false },      // 行内公式
    { left: '\\(', right: '\\)', display: false },  // 行内备选
    { left: '\\[', right: '\\]', display: true }    // 块级备选
  ],
  throwOnError: false,        // 渲染失败不抛异常，显示原始文本
  errorColor: '#cc0000',      // 错误公式用红色标记
  strict: false               // 宽松模式，兼容更多 LaTeX 写法
});
```

关键点：`$...$` delimiters 必须放在 `$$...$$` 之后，否则 `$$` 会被误匹配为两个空的 `$`。

## 3. 局部渲染函数

项目定义了 `renderMathIn(element)` 用于对指定 DOM 元素渲染，避免全页扫描：

```javascript
function renderMathIn(el) {
  if (typeof renderMathInElement === 'function') {
    renderMathInElement(el, { delimiters: [...], throwOnError: false });
  }
}
```

使用场景：Mametchi 对话框打字完成后、渐进提示展开后、考试题目切换后。

## 4. AMC10 常用数学符号速查

### 代数 (Algebra)

| 符号 | LaTeX | 渲染效果 |
|------|-------|---------|
| 分式 | `$\frac{a}{b}$` | a/b |
| 根号 | `$\sqrt{x}$`, `$\sqrt[3]{x}$` | 平方根、立方根 |
| 绝对值 | `$\lvert x \rvert$` | 竖线绝对值 |
| 求和 | `$\sum_{i=1}^{n} i$` | 求和符号 |
| 不等号 | `$\leq$`, `$\geq$`, `$\neq$` | 小于等于、大于等于、不等于 |
| 对数 | `$\log_2 x$`, `$\ln x$` | 以2为底、自然对数 |

### 几何 (Geometry)

| 符号 | LaTeX | 说明 |
|------|-------|------|
| 角度 | `$\angle ABC$` | 角 ABC |
| 度数 | `$90^\circ$` | 90 度 |
| 三角形 | `$\triangle ABC$` | 三角形 ABC |
| 平行 | `$AB \parallel CD$` | 平行线 |
| 垂直 | `$AB \perp CD$` | 垂直线 |
| 圆 | `$\odot O$` | 圆 O |
| 弧 | `$\overset{\frown}{AB}$` | 弧 AB |
| pi | `$\pi r^2$` | 圆面积公式 |

### 数论 (Number Theory)

| 符号 | LaTeX | 说明 |
|------|-------|------|
| 整除 | `$a \mid b$` | a 整除 b |
| 不整除 | `$a \nmid b$` | a 不整除 b |
| 同余 | `$a \equiv b \pmod{n}$` | 模同余 |
| 取模 | `$a \bmod n$` | 取模运算 |
| 下取整 | `$\lfloor x \rfloor$` | floor 函数 |
| 上取整 | `$\lceil x \rceil$` | ceiling 函数 |

### 组合数学 (Combinatorics)

| 符号 | LaTeX | 说明 |
|------|-------|------|
| 组合数 | `$\binom{n}{k}$` | C(n,k) |
| 排列 | `$P(n,k) = \frac{n!}{(n-k)!}$` | 排列公式 |
| 阶乘 | `$n!$` | n 的阶乘 |
| 概率 | `$P(A \cup B)$`, `$P(A \cap B)$` | 并集、交集概率 |
| 容斥 | `$\lvert A \cup B \rvert = \lvert A \rvert + \lvert B \rvert - \lvert A \cap B \rvert$` | 容斥原理 |

## 5. 公式编写规范

### 行内公式 vs 块级公式

- **行内**：嵌入文本中的短公式，用 `$...$`。例：The answer is $\frac{3}{4}$.
- **块级**：独立展示的重要公式，用 `$$...$$`。例：勾股定理 $$a^2 + b^2 = c^2$$

### AMC10 选项格式

选项中的公式必须用 `$` 包裹，与选项字母分开：

```javascript
choices: [
  "(A) $\\frac{1}{2}$",
  "(B) $\\frac{3}{4}$",
  "(C) $\\sqrt{2}$",
  "(D) $\\pi$",
  "(E) $2\\sqrt{3}$"
]
```

注意：JS 字符串中反斜杠需要转义为 `\\`。

## 6. 性能优化

1. **defer 加载**：KaTeX JS 使用 `defer`，不阻塞首屏
2. **局部渲染**：只对变化的 DOM 元素调用 `renderMathIn`，不做全页 re-render
3. **CSS 预加载**：`katex.min.css` 在 `<head>` 同步加载，避免公式 FOUC (Flash of Unstyled Content)
4. **字体缓存**：KaTeX 字体通过 CDN 加载后浏览器会缓存，后续访问无延迟
5. **打字机完成后渲染**：`typeDialog` 函数在打字完毕后才调用 `renderMathIn`，避免逐字渲染

## 7. 错误处理与 Fallback

```javascript
// throwOnError: false 确保渲染失败时显示原始 LaTeX 文本
// 常见错误：未闭合的 $ 符号、不支持的 LaTeX 命令
renderMathInElement(el, {
  throwOnError: false,
  errorColor: '#cc0000'
});
```

AI 生成的题目可能包含 KaTeX 不支持的 LaTeX 命令（如 `\text{}`、`\cancel{}`）。
项目的 `throwOnError: false` 保证这些情况下页面不会崩溃，用户仍可看到原始 LaTeX 代码。

## 8. 移动端适配

- 块级公式在小屏幕上可能溢出，需要 CSS 处理：

```css
.katex-display {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 4px 0;
}
.katex {
  font-size: 1.1em;  /* 移动端略微放大确保可读 */
}
```

- iPad 触控场景下，长公式允许左右滑动查看
- KaTeX `font-size` 继承父元素，项目中 body 使用 `DM Sans` 16px 基准，公式比例协调

## 9. 暗色模式

KaTeX 默认使用黑色文字。暗色模式下需覆盖：

```css
@media (prefers-color-scheme: dark) {
  .katex { color: var(--text-primary); }
}
```

项目已通过 CSS 变量系统处理暗色模式，KaTeX 自动继承。
