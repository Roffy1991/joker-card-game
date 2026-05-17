<template>
  <div class="game-viewport" :style="scaleStyle">
    <HUD
      :score="state.score"
      :handsLeft="state.handsLeft"
      :discardsLeft="state.discardsLeft"
    />
    <PlayZone
      :selectedCards="selectedCards"
      :currentHand="currentHand"
    />
    <HandZone
      :hand="state.hand"
      @toggle="toggleCard"
    />
    <ActionBar
      :canPlay="canPlay"
      :canDiscard="canDiscard"
      @play="playHand"
      @discard="discardHand"
      @restart="newGame"
    />
    <GameModal
      :show="state.gameStatus !== 'playing'"
      :status="state.gameStatus"
      :score="state.score"
      @restart="newGame"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useGame } from './composables/useGame.js'
import HUD       from './components/HUD.vue'
import PlayZone  from './components/PlayZone.vue'
import HandZone  from './components/HandZone.vue'
import ActionBar from './components/ActionBar.vue'
import GameModal from './components/GameModal.vue'

const { state, selectedCards, currentHand, newGame, toggleCard, playHand, discardHand } = useGame()

const canPlay    = computed(() => state.gameStatus === 'playing' && selectedCards.value.length > 0 && state.handsLeft > 0)
const canDiscard = computed(() => state.gameStatus === 'playing' && selectedCards.value.length > 0 && state.discardsLeft > 0)

// 视口缩放
const windowW = ref(window.innerWidth)
const windowH = ref(window.innerHeight)
function onResize() {
  windowW.value = window.innerWidth
  windowH.value = window.innerHeight
}
const scaleStyle = computed(() => {
  const s = Math.min(windowW.value / 1080, windowH.value / 640, 1)
  return s < 1 ? { transform: `scale(${s})` } : {}
})

onMounted(() => {
  window.addEventListener('resize', onResize)
  newGame()
})
onUnmounted(() => window.removeEventListener('resize', onResize))
</script>

<style>
:root {
  --color-table:    #2d5a3d;
  --color-accent:   #e8682a;
  --color-discard:  #a83232;
  --color-gold:     #d4a017;
  --color-card-red: #d33f3f;
  --color-card-bg:  #fbfaf7;
  --color-score:    #5dd67a;
  --radius-card:    12px;
  --radius-btn:     999px;
  --ease-card:      200ms ease;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: #111;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Noto Sans SC', system-ui, sans-serif;
  overflow: hidden;
}
</style>

<style scoped>
.game-viewport {
  width: 1080px;
  height: 640px;
  background: var(--color-table);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 48px rgba(0,0,0,.5);
  position: relative;
  background-image:
    radial-gradient(ellipse at 50% 100%, rgba(0,0,0,.3) 0%, transparent 70%),
    repeating-linear-gradient(45deg, transparent, transparent 20px,
      rgba(255,255,255,.012) 20px, rgba(255,255,255,.012) 21px);
  transform-origin: center center;
}
</style>
