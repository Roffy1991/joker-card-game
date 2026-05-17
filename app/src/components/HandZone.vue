<template>
  <div class="hand-zone">
    <div class="hand-zone-label">手牌</div>
    <div class="hand-cards">
      <PokerCard
        v-for="card in hand"
        :key="card.id"
        :card="card"
        :selected="card.selected"
        @click="$emit('toggle', card.id)"
      />
    </div>
  </div>
</template>

<script setup>
import PokerCard from './PokerCard.vue'

defineProps({
  hand: { type: Array, required: true },
})
defineEmits(['toggle'])
</script>

<style scoped>
.hand-zone {
  padding: 14px 24px 12px;
  background: rgba(0,0,0,.2);
  border-top: 1px solid rgba(255,255,255,.06);
  flex-shrink: 0;
}
.hand-zone-label {
  font-size: 10px;
  color: rgba(255,255,255,.4);
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 12px;
}
.hand-cards {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: flex-end;
  height: 130px;
}
</style>
