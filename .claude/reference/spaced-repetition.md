# SM-2 间隔重复算法

> 适用于 ruby-amc10 项目，实现于 `js/progress.js`

---

## 1. SM-2 算法概述

SM-2 (SuperMemo 2) 是 Piotr Wozniak 于 1987 年提出的间隔重复算法。核心思想：记住的内容以递增间隔复习，遗忘的内容立即重置。项目将其应用于 AMC10 数学子主题的复习调度。

## 2. 核心参数

| 参数 | 含义 | 项目初始值 | 范围 |
|------|------|-----------|------|
| `interval` | 下次复习间隔（天） | 1 | 1 ~ 无上限 |
| `ease` | 难易因子 (Easiness Factor, EF) | 2.5 | 1.3 ~ 3.0 |
| `repetitions` | 连续答对次数 | 0 | 0 ~ 无上限 |
| `dueDate` | 下次到期日期 | null | ISO 日期字符串 |

## 3. 核心公式

### 间隔计算

```
答对时:
  repetitions += 1
  if repetitions == 1: interval = 1 天
  if repetitions == 2: interval = 3 天
  if repetitions >= 3: interval = round(interval * ease)

答错时:
  repetitions = 0
  interval = 1 天（立即重新开始）
```

### Easiness Factor 调整

```
答对: ease = min(3.0, ease + 0.1)    // 每次答对 EF 增加 0.1
答错: ease = max(1.3, ease - 0.2)    // 每次答错 EF 减少 0.2
```

- EF 下限 1.3 防止间隔永远太短，避免过度复习
- EF 上限 3.0 防止间隔增长过快，确保定期巩固
- 初始 EF 2.5 是 SM-2 标准推荐值

### 到期日计算

```javascript
var due = new Date();
due.setDate(due.getDate() + item.interval);
item.dueDate = due.toISOString().slice(0, 10);
```

## 4. 项目实现

实现位于 `js/progress.js` 的 `updateReviewSchedule` 函数：

```javascript
function updateReviewSchedule(progress, subtopicKey, wasCorrect) {
  // 1. 在 reviewQueue 中查找该子主题
  // 2. 不存在则创建: { interval: 1, ease: 2.5, repetitions: 0 }
  // 3. 根据 wasCorrect 更新 interval、ease、repetitions
  // 4. 计算 dueDate 并写回 queue
}
```

调用时机：每次 `recordProblem` 完成后自动调用。

## 5. 复习调度逻辑

`selectNextTopic` 函数中，SM-2 队列优先级最高：

```javascript
// 1. 检查到期的复习项
var today = new Date().toISOString().slice(0, 10);
var dueItems = progress.reviewQueue.filter(function(r) {
  return r.dueDate && r.dueDate <= today;
}).sort(function(a, b) { return a.ease - b.ease; });
// ease 低的排前面 = 最难的子主题优先复习

// 2. 有到期项 → 直接返回
if (dueItems.length > 0) {
  var parts = dueItems[0].subtopic.split('.');
  return { topic: parts[0], subtopic: parts[1] };
}

// 3. 无到期项 → 按 AMC10 分布加权随机
```

## 6. 与 AMC10 题目难度的结合

项目将 SM-2 的「子主题级别」与「自适应难度」分离：

- **SM-2 (reviewQueue)**：控制「何时」复习某个子主题
- **自适应难度 (subtopic.level)**：控制「复习时出什么难度」

两者协同工作：

```
SM-2 到期 → 选中 algebra.polynomials
→ 检查 polynomials.level = 4
→ 出一道 difficulty 4 的题
→ 答对 → SM-2 interval 增长 + 可能 level 升至 5
→ 答错 → SM-2 interval 重置为 1 + 可能 level 降至 3
```

自适应难度实现（`updateDifficulty`）：

```javascript
// 看该子主题最近 5 题正确率
var recent = progress.recentProblems.filter(...)  .slice(-5);
var accuracy = correctCount / recent.length;
if (accuracy > 0.8 && st.level < 5) st.level++;   // 升级
if (accuracy < 0.4 && st.level > 1) st.level--;   // 降级
```

## 7. 弱项加权机制

在 Auto/Smart Pick 模式中，SM-2 队列为空时采用弱项加权：

```javascript
// AMC10 官方题型分布
var baseWeights = {
  algebra: 42,        // 42%
  geometry: 16,       // 16%
  number_theory: 22,  // 22%
  combinatorics: 20   // 20%
};

// 弱项加权: 正确率越低，权重越高
var weight = baseWeights[topic] * (1.5 - accuracy);
// accuracy=0.3 (弱) → weight = base * 1.2
// accuracy=0.9 (强) → weight = base * 0.6
```

效果：弱项被选中的概率是强项的 2 倍。

## 8. localStorage 持久化方案

### 数据结构

```javascript
// reviewQueue 存储在 progress 对象内
progress.reviewQueue = [
  {
    subtopic: "algebra.polynomials",  // "topic.subtopic" 格式
    interval: 6,                       // 当前间隔天数
    ease: 2.7,                         // 当前 EF 值
    repetitions: 3,                    // 连续答对次数
    dueDate: "2026-03-08"             // 下次到期日期
  }
];
```

### 存储策略

1. **每次答题后保存**：`recordProblem` → `saveProgress` → `localStorage.setItem`
2. **数据清理**：`recentProblems` 保留最近 90 天，防止 localStorage 膨胀
3. **云端同步**：保存后延迟 2 秒异步推送到 Cloudflare KV
4. **合并策略**：加载时用 `mergeDeep` 将 localStorage 数据与默认结构合并，确保新字段不丢失

### localStorage 容量管理

- 单条进度数据约 5-15KB（取决于 recentProblems 数量）
- 考试成绩单独存储在 `ruby_amc10_exam_results`（约 2-5KB）
- localStorage 总限制 5-10MB，远超项目需求
- 90 天清理机制防止无限增长

## 9. 典型场景模拟

```
Day 1: Ruby 做 polynomials 题，答对
  → interval=1, ease=2.6, rep=1, due=Day 2

Day 2: 到期，做 polynomials 题，答对
  → interval=3, ease=2.7, rep=2, due=Day 5

Day 5: 到期，做 polynomials 题，答对
  → interval=round(3*2.7)=8, ease=2.8, rep=3, due=Day 13

Day 13: 到期，做 polynomials 题，答错!
  → interval=1, ease=2.6, rep=0, due=Day 14（立即重来）

Day 14: 到期，做 polynomials 题，答对
  → interval=1, ease=2.7, rep=1, due=Day 15
  （从头开始攀升，但 ease 保留了之前的积累）
```

## 10. 与标准 SM-2 的差异

| 特性 | 标准 SM-2 | 本项目实现 |
|------|----------|-----------|
| 评分 | 0-5 六级 | 二元（对/错） |
| EF 计算 | EF' = EF + (0.1 - (5-q)*(0.08+(5-q)*0.02)) | 对 +0.1，错 -0.2 |
| 调度粒度 | 单卡片 | 子主题级别 |
| 初始间隔 | 1, 6 天 | 1, 3 天（更紧凑） |
| 结合难度 | 无 | 与 5 级自适应难度联动 |

简化原因：AMC10 训练以子主题为单位（非单题），二元判定更适合数学竞赛场景。

## 11. 注意事项

- **时区**：`toISOString().slice(0,10)` 使用 UTC 日期。新加坡 (UTC+8) 用户在晚间可能出现到期判定偏差。如需精确，应使用本地日期。
- **首次使用**：所有子主题初始 level=3（中等难度），无 reviewQueue 条目。首次做题后才进入 SM-2 调度。
- **数据迁移**：`mergeDeep` 确保旧版 localStorage 数据加载新版代码时不丢失新字段。
