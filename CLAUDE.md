# CLAUDE.md — 小丑牌 Web V1.0.0

## 项目定位

课堂演示项目：通过实现一款扑克牌数值游戏，让零基础学员体验「AI 全流程开发」第一课。  
技术栈：纯静态 HTML/CSS/JS，单文件，无构建工具，无依赖。

## 目录约定

```
game.html       主游戏文件，全量逻辑和样式内联在单个 HTML 文件中
PRD.html        产品需求文档（只读参考，不要修改）
DESIGN.html     UI 设计规范（只读参考，不要修改）
agents/         自定义 Claude Agent 角色（.md 格式）
slash/          自定义 Claude 斜杠命令（.md 格式）
```

## 核心游戏状态（game.html）

```
state.deck          剩余牌堆 Card[]
state.hand          当前手牌 Card[]（含 selected 标记）
state.score         累计得分
state.handsLeft     剩余出牌次数（初始 4）
state.discardsLeft  剩余弃牌次数（初始 3）
state.gameStatus    'playing' | 'win' | 'lose'
```

Card 结构：`{ suit, rank, value, id, selected }`

## 设计 Token（来自 DESIGN.html）

```css
--color-table:    #2d5a3d   /* 桌面绿 */
--color-accent:   #e8682a   /* 强调橙，出牌按钮/选中描边 */
--color-discard:  #a83232   /* 弃牌红 */
--color-gold:     #d4a017   /* 金色，目标分/胜利边框 */
--color-card-red: #d33f3f   /* 红花色 ♥♦ */
--color-score:    #5dd67a   /* 当前分绿 */
```

## 计分公式

```
得分 = (牌型基础分 + 所有选中牌点数之和) × 倍数
点数：A=11, K/Q/J=10, 2-10 按面值
```

## 常用命令

```bash
# 打开游戏
open game.html

# 本轮范围（V1.0.0 明确排除）
# - 小丑牌/星球牌/增益系统
# - 动画/音效/粒子特效
# - 移动端适配（用 transform:scale 缩放即可）
```

## 修改建议

- 所有改动只需编辑 `game.html` 单文件
- 牌型/分值调整：修改 `HAND_TYPES` 数组（文件顶部常量区）
- 规则数字调整：修改 `newGame()` 中的 `handsLeft/discardsLeft` 和 `score>=300` 判定
- 新增视觉：在 `<style>` 块内追加 CSS，不要破坏已有 token 变量
