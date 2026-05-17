<template>
  <div class="play-zone">
    <div class="hand-type-badge" :class="{ empty: !selectedCards.length }">
      {{ selectedCards.length ? (currentHand?.name ?? '高牌') : '请选择 1–5 张牌' }}
    </div>

    <div class="play-cards">
      <template v-for="i in 5" :key="i">
        <PokerCard
          v-if="selectedCards[i - 1]"
          :card="selectedCards[i - 1]"
          :selected="false"
        />
        <div v-else class="play-placeholder">+</div>
      </template>
    </div>

    <div class="zone-hint">选中 1–5 张牌后点击「出牌」</div>
  </div>
</template>

<script setup>
import PokerCard from './PokerCard.vue'

defineProps({
  selectedCards: { type: Array, required: true },
  currentHand:   { type: Object, default: null },
})
</script>

<style scoped>
.play-zone {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,.15);
  border-bottom: 1px solid rgba(255,255,255,.06);
  gap: 12px;
  position: relative;
}
.hand-type-badge {
  background: rgba(232,104,42,.85);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  padding: 6px 20px;
  border-radius: 999px;
  letter-spacing: .5px;
  box-shadow: 0 2px 8px rgba(232,104,42,.4);
}
.hand-type-badge.empty {
  background: rgba(255,255,255,.08);
  color: rgba(255,255,255,.35);
  box-shadow: none;
  font-weight: 400;
  font-size: 13px;
}
.play-cards { display: flex; gap: 12px; align-items: center; }
.play-placeholder {
  width: 88px;
  height: 128px;
  border-radius: var(--radius-card);
  border: 2px dashed rgba(255,255,255,.18);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,.2);
  font-size: 22px;
}
/* 出牌区的牌稍大 */
.play-zone :deep(.poker-card) {
  width: 88px;
  height: 128px;
  cursor: default;
}
.play-zone :deep(.poker-card .rank)       { font-size: 16px; }
.play-zone :deep(.poker-card .suit)       { font-size: 13px; }
.play-zone :deep(.poker-card .center-suit){ font-size: 48px; }
.play-zone :deep(.poker-card:hover)       { transform: none; box-shadow: 0 2px 8px rgba(0,0,0,.18), 0 0 0 1px rgba(0,0,0,.08); }
.zone-hint { font-size: 12px; color: rgba(255,255,255,.3); letter-spacing: .5px; }
</style>
