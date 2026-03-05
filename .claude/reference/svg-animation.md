# SVG 角色动画

> 适用于 ruby-amc10 项目，Mametchi 角色系统，实现于 `js/mametchi.js`

---

## 1. 架构概述

Mametchi 角色使用纯内联 SVG 实现，无外部图片依赖。5 种状态的 SVG 存储在 `MametchiSVGs` 对象中，通过 `setMametchiState` 函数切换。

```javascript
var MametchiSVGs = {
  normal:    '<svg>...</svg>',
  happy:     '<svg>...</svg>',
  thinking:  '<svg>...</svg>',
  teaching:  '<svg>...</svg>',
  encourage: '<svg>...</svg>'
};
```

## 2. 五种状态实现

### 2.1 Normal（默认）

- **触发**：页面加载、展示题目
- **viewBox**：`0 0 140 150`
- **视觉**：标准表情，大圆眼（`ellipse rx=7 ry=8`），弧形微笑，双臂自然下垂
- **动画**：无

```svg
<!-- 眼睛 - 标准圆形 -->
<ellipse cx="52" cy="52" rx="7" ry="8" fill="#1B2A4A"/>
<!-- 嘴巴 - 简单弧线 -->
<path d="M60 70 Q70 78 80 70" stroke="#1B2A4A" stroke-width="2" fill="none"/>
```

### 2.2 Happy（开心）

- **触发**：答对题目
- **viewBox**：`0 0 140 150`
- **视觉**：眯眼笑 `^ ^`、大嘴笑、双臂高举、4 颗金星
- **动画**：星星闪烁 `m-twinkle`

```svg
<style>
  .m-star { animation: m-twinkle 0.6s ease-in-out infinite alternate; }
  @keyframes m-twinkle {
    from { opacity: 0.3; transform: scale(0.8); }
    to   { opacity: 1;   transform: scale(1.1); }
  }
</style>
<!-- 4 颗星星，通过 animation-delay 错开节奏 -->
<g class="m-star"><polygon points="..." fill="#FFD700"/></g>
<g class="m-star" style="animation-delay:0.2s">...</g>
<g class="m-star" style="animation-delay:0.4s">...</g>
<g class="m-star" style="animation-delay:0.3s">...</g>
<!-- 眼睛 - 弧形眯眼 -->
<path d="M44 52 Q52 44 60 52" stroke="#1B2A4A" stroke-width="2.5" fill="none"/>
<!-- 双臂高举 -->
<path d="M38 95 Q20 75 18 60" .../>   <!-- 左臂向上 -->
<path d="M102 95 Q120 75 122 60" .../> <!-- 右臂向上 -->
```

### 2.3 Thinking（思考）

- **触发**：加载题目、AI 生成中
- **viewBox**：`0 0 140 150`
- **视觉**：头部歪斜 5 度、左手托下巴、问号气泡
- **动画**：无内置动画（CSS 中可添加弹跳）

```svg
<!-- 问号气泡 - 三级递减圆 -->
<circle cx="115" cy="12" r="10" fill="#E8F4FD" stroke="#B0D4E8"/>
<text x="115" y="17" font-size="14" fill="#1B2A4A" text-anchor="middle">?</text>
<circle cx="105" cy="26" r="4" fill="#E8F4FD"/>
<circle cx="100" cy="32" r="2.5" fill="#E8F4FD"/>
<!-- 头部歪斜 -->
<g transform="rotate(-5 70 55)">
  <rect x="25" y="20" width="90" height="70" rx="28" ry="28" fill="#FFE566"/>
  <!-- 眼睛 - 向上看 -->
  <ellipse cx="55" cy="47" rx="2.5" ry="3" fill="white"/>  <!-- 高光偏上 -->
  <!-- 嘴巴 - 小 O 形 -->
  <ellipse cx="70" cy="72" rx="4" ry="3.5" fill="#1B2A4A" opacity="0.4"/>
</g>
```

### 2.4 Teaching（教学）

- **触发**：展示解题步骤
- **viewBox**：`0 0 150 150`（比其他状态宽 10px，容纳小白板）
- **视觉**：右手指向小白板（显示 a^2+b^2=c^2）、嘴巴张开讲解
- **动画**：无

```svg
<!-- 迷你白板 -->
<rect x="100" y="5" width="42" height="32" rx="3" fill="#FFFFFF" stroke="#1B2A4A"/>
<text x="121" y="22" font-size="9" text-anchor="middle">a²+b²</text>
<text x="121" y="31" font-size="8" text-anchor="middle">=c²</text>
<!-- 嘴巴 - 椭圆形张嘴 -->
<ellipse cx="64" cy="77" rx="6" ry="4" fill="#FF9999" stroke="#1B2A4A"/>
<!-- 右臂指向白板 -->
<path d="M96 95 Q115 70 112 45" stroke="#1B2A4A" stroke-width="2"/>
```

### 2.5 Encourage（鼓励）

- **触发**：答错、需要鼓励
- **viewBox**：`0 0 140 150`
- **视觉**：温柔弧形眼（比 happy 更柔和）、双臂张开拥抱、浮动爱心
- **动画**：爱心浮动 `m-float`

```svg
<style>
  .m-heart { animation: m-float 1.2s ease-in-out infinite alternate; }
  @keyframes m-float {
    from { transform: translateY(0); }
    to   { transform: translateY(-4px); }
  }
</style>
<!-- 爱心 -->
<g class="m-heart">
  <path d="M108 18 C108 12 102 8 97 12 C92 8 86 12 86 18 C86 26 97 34 97 34..."
        fill="#FF6B8A" opacity="0.8"/>
</g>
<!-- 双臂张开拥抱 -->
<path d="M38 95 Q14 92 12 102" .../>   <!-- 左臂外展 -->
<path d="M102 95 Q126 92 128 102" .../> <!-- 右臂外展 -->
```

## 3. 状态切换 API

```javascript
// 切换角色状态
setMametchiState('problemMametchi', 'happy');
setMametchiState('welcomeMametchi', 'thinking');

// 实现: 替换容器 innerHTML + 更新 CSS class
function setMametchiState(containerId, stateName) {
  var container = document.getElementById(containerId);
  container.innerHTML = MametchiSVGs[stateName] || MametchiSVGs.normal;
  container.className = 'mametchi-container mametchi-' + stateName;
}
```

项目中有两个 Mametchi 容器：
- `welcomeMametchi`：欢迎界面的大角色
- `problemMametchi`：做题界面的小角色

## 4. 对话气泡系统

### 打字机效果

```javascript
// 返回 Promise，打字完成后 resolve
typeDialog("Great job! The answer uses Vieta's formulas: $ax^2+bx+c=0$", 25);
```

实现要点：
1. 逐字追加到 `dialogText` 元素
2. 打字过程中显示闪烁光标（`.typing-cursor` CSS）
3. 打字完成后移除光标
4. 完成后调用 `renderMathIn(el)` 渲染 KaTeX 公式
5. 全局 `_mametchiTypingTimer` 保证同一时刻只有一个打字动画

### 即时显示

```javascript
setDialog("Loading next problem...");  // 无动画，直接显示
```

### 取消机制

新的 `typeDialog` 调用会自动取消进行中的打字：

```javascript
if (window._mametchiTypingTimer) {
  clearTimeout(window._mametchiTypingTimer);
  window._mametchiTypingTimer = null;
}
```

## 5. CSS 动画控制

### SVG 内嵌 `<style>`

每个有动画的状态在 SVG 内部定义 `<style>` 标签，确保动画样式跟随 SVG 生命周期：
- Happy: `.m-star` + `@keyframes m-twinkle`
- Encourage: `.m-heart` + `@keyframes m-float`

优势：切换状态时旧 SVG 被替换，旧动画自动停止，无内存泄漏。

### 外部 CSS 补充动画

`css/style.css` 中为 Mametchi 容器添加额外效果：

```css
.mametchi-container {
  transition: transform 0.3s ease;
}
.mametchi-happy {
  animation: bounce 0.5s ease;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

### animation-delay 错开

Happy 状态的 4 颗星星使用不同的 `animation-delay`，避免同步闪烁的机械感：

```
星 1: delay 0s     (立即开始)
星 2: delay 0.2s
星 3: delay 0.4s
星 4: delay 0.3s
```

## 6. 过渡效果

状态切换时，`innerHTML` 替换是瞬间完成的。为了平滑过渡：

1. **CSS transition**：容器的 `transform` 有 0.3s 过渡
2. **对话配合**：先切换状态 SVG，然后开始打字机效果，视觉上感觉连贯
3. **app.js 中的典型调用模式**：

```javascript
// 答对时的状态切换流程
setMametchiState('problemMametchi', 'happy');
await typeDialog("Excellent! You got it right! " + explanation);
// 展示步骤时切换
setMametchiState('problemMametchi', 'teaching');
await typeDialog("Let me walk you through the solution...");
```

## 7. 视觉规格速查

| 属性 | 值 | 说明 |
|------|-----|------|
| 身体色 | `#FFE566` | 黄色（Mametchi 标准色） |
| 深色 | `#1B2A4A` | 海军蓝（耳朵、眼睛、脚） |
| 腮红 | `#FFB5B5` opacity 0.6 | 粉红半透明 |
| 爱心 | `#FF6B8A` opacity 0.8 | 珊瑚粉 |
| 星星 | `#FFD700` | 金色 |
| 描边 | `#1B2A4A` 2px | 统一深色描边 |
| 身体形状 | `rect rx=28 ry=28` | 方形圆角 |
| 耳朵 | `ellipse rx=14 ry=20` | 椭圆形，各旋转 10 度 |
| 手掌 | `circle r=5` | 圆形小手 |

## 8. 性能注意事项

1. **SVG 字符串拼接**：使用数组 `.join('\n')` 而非模板字符串，兼容旧浏览器
2. **innerHTML 替换**：每次状态切换重建整个 SVG DOM。在现代浏览器上性能无问题，140x150 viewBox 的简单 SVG 渲染开销极小
3. **CSS 动画 vs JS 动画**：项目优先使用 CSS `@keyframes`，由浏览器 GPU 加速，不占用 JS 主线程
4. **内存管理**：SVG 内嵌的 `<style>` 随 innerHTML 替换自动清理，不会累积
5. **避免频繁切换**：app.js 中状态机确保状态切换有序，不会在短时间内快速来回切换造成闪烁

## 9. 扩展新状态

添加新状态只需三步：

```javascript
// 1. 在 MametchiSVGs 中添加 SVG
MametchiSVGs.excited = [
  '<svg viewBox="0 0 140 150" xmlns="http://www.w3.org/2000/svg">',
  '  <!-- 新状态的 SVG 内容 -->',
  '</svg>'
].join('\n');

// 2. 可选: 在 style.css 中添加容器级动画
// .mametchi-excited { animation: shake 0.3s ease; }

// 3. 在 app.js 中调用
setMametchiState('problemMametchi', 'excited');
```

保持 viewBox 尺寸一致（140x150），除非新状态需要额外空间（如 teaching 用 150x150）。
