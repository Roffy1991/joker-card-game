import { reactive, computed } from 'vue'

// ── 常量 ────────────────────────────────────────────────────
const SUITS = ['♥', '♦', '♣', '♠']
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const VALUES = { A: 11, J: 10, Q: 10, K: 10 }
for (let i = 2; i <= 10; i++) VALUES[String(i)] = i

const RANK_ORDER = { A: 14, J: 11, Q: 12, K: 13 }
for (let i = 2; i <= 10; i++) RANK_ORDER[String(i)] = i

const HAND_TYPES = [
  { name: '皇家同花顺', base: 100, mult: 8,  test: isRoyalFlush },
  { name: '同花顺',     base: 100, mult: 8,  test: isStraightFlush },
  { name: '四条',       base: 60,  mult: 7,  test: isFourOfAKind },
  { name: '葫芦',       base: 40,  mult: 4,  test: isFullHouse },
  { name: '同花',       base: 35,  mult: 4,  test: isFlush },
  { name: '顺子',       base: 30,  mult: 4,  test: isStraight },
  { name: '三条',       base: 30,  mult: 3,  test: isThreeOfAKind },
  { name: '两对',       base: 20,  mult: 2,  test: isTwoPair },
  { name: '对子',       base: 10,  mult: 2,  test: isPair },
  { name: '高牌',       base: 5,   mult: 1,  test: () => true },
]

// ── 牌型判断 ─────────────────────────────────────────────────
function rankCounts(cards) {
  const c = {}
  for (const card of cards) c[card.rank] = (c[card.rank] || 0) + 1
  return Object.values(c).sort((a, b) => b - a)
}
function sortedOrders(cards) {
  return cards.map(c => RANK_ORDER[c.rank]).sort((a, b) => a - b)
}
function hasFlush(cards) {
  return cards.length === 5 && cards.every(c => c.suit === cards[0].suit)
}
function hasStraight(cards) {
  if (cards.length !== 5) return false
  const v = sortedOrders(cards)
  if (JSON.stringify(v) === '[2,3,4,5,14]') return true
  for (let i = 1; i < v.length; i++) if (v[i] !== v[i - 1] + 1) return false
  return true
}
function isRoyalFlush(cards)    { return hasFlush(cards) && JSON.stringify(sortedOrders(cards)) === '[10,11,12,13,14]' }
function isStraightFlush(cards) { return hasFlush(cards) && hasStraight(cards) }
function isFourOfAKind(cards)   { return rankCounts(cards)[0] === 4 }
function isFullHouse(cards)     { const c = rankCounts(cards); return c[0] === 3 && c[1] === 2 }
function isFlush(cards)         { return hasFlush(cards) }
function isStraight(cards)      { return hasStraight(cards) }
function isThreeOfAKind(cards)  { return rankCounts(cards)[0] === 3 }
function isTwoPair(cards)       { const c = rankCounts(cards); return c[0] === 2 && c[1] === 2 }
function isPair(cards)          { return rankCounts(cards)[0] === 2 }

export function detectHand(cards) {
  if (!cards || !cards.length) return null
  for (const ht of HAND_TYPES) if (ht.test(cards)) return ht
  return HAND_TYPES[HAND_TYPES.length - 1]
}
export function calcScore(cards) {
  const ht = detectHand(cards)
  if (!ht) return 0
  return (ht.base + cards.reduce((s, c) => s + c.value, 0)) * ht.mult
}

// ── 工具 ────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

let _uid = 0
function buildDeck() {
  return SUITS.flatMap(suit => RANKS.map(rank => ({ suit, rank, value: VALUES[rank] })))
}
function toHandCard(c) {
  return { ...c, id: ++_uid, selected: false, isNew: false }
}

// ── Composable ───────────────────────────────────────────────
export function useGame() {
  const state = reactive({
    deck:         [],
    hand:         [],
    score:        0,
    handsLeft:    4,
    discardsLeft: 3,
    gameStatus:   'playing', // 'playing' | 'win' | 'lose'
  })

  const selectedCards = computed(() => state.hand.filter(c => c.selected))

  const currentHand = computed(() => detectHand(selectedCards.value))

  function newGame() {
    const deck = shuffle(buildDeck())
    state.deck         = deck.slice(8)
    state.hand         = deck.slice(0, 8).map(c => ({ ...toHandCard(c), isNew: true }))
    state.score        = 0
    state.handsLeft    = 4
    state.discardsLeft = 3
    state.gameStatus   = 'playing'
  }

  function toggleCard(id) {
    if (state.gameStatus !== 'playing') return
    const card = state.hand.find(c => c.id === id)
    if (!card) return
    if (card.selected) {
      card.selected = false
    } else {
      if (selectedCards.value.length >= 5) return
      card.selected = true
    }
  }

  function removeAndDraw() {
    state.hand = state.hand.filter(c => !c.selected)
    const needed = 8 - state.hand.length
    const drawn = state.deck.splice(0, needed).map(c => ({ ...toHandCard(c), isNew: true }))
    state.hand.push(...drawn)
  }

  function playHand() {
    if (state.gameStatus !== 'playing') return null
    const sel = selectedCards.value
    if (!sel.length || state.handsLeft <= 0) return null

    const gained = calcScore(sel)
    const ht     = detectHand(sel)
    state.score += gained
    state.handsLeft--
    removeAndDraw()

    if (state.score >= 300)        state.gameStatus = 'win'
    else if (state.handsLeft <= 0) state.gameStatus = 'lose'

    return { gained, handName: ht?.name ?? '高牌' }
  }

  function discardHand() {
    if (state.gameStatus !== 'playing') return false
    const sel = selectedCards.value
    if (!sel.length || state.discardsLeft <= 0) return false

    state.discardsLeft--
    removeAndDraw()
    return true
  }

  function clearNewFlags() {
    state.hand.forEach(c => { c.isNew = false })
  }

  return {
    state,
    selectedCards,
    currentHand,
    newGame,
    toggleCard,
    playHand,
    discardHand,
    clearNewFlags,
  }
}
