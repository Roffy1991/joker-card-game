<template>
  <Transition name="overlay">
    <div v-if="show" class="modal-overlay">
      <div class="modal-box" :class="status">
        <div class="modal-title">{{ status === 'win' ? '胜利！' : '游戏结束' }}</div>
        <div class="modal-sub">
          {{ status === 'win' ? `最终得分 ${score} 分` : `得分 ${score} / 目标 300` }}
        </div>
        <button class="btn btn-play" @click="$emit('restart')">重新开始</button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show:   { type: Boolean, required: true },
  status: { type: String,  required: true }, // 'win' | 'lose'
  score:  { type: Number,  required: true },
})
defineEmits(['restart'])
</script>

<style scoped>
.modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,.72);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  backdrop-filter: blur(6px);
}
.modal-box {
  background: #0d0d0d;
  border-radius: 16px;
  padding: 44px 56px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  min-width: 360px;
}
.modal-box.win  { border: 2px solid var(--color-gold); }
.modal-box.lose { border: 2px solid #444; }
.modal-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 34px;
  font-weight: 700;
}
.modal-box.win  .modal-title { color: var(--color-gold); }
.modal-box.lose .modal-title { color: #888; }
.modal-sub {
  font-size: 16px;
  font-family: 'JetBrains Mono', monospace;
  margin-bottom: 8px;
}
.modal-box.win  .modal-sub { color: var(--color-score); }
.modal-box.lose .modal-sub { color: rgba(255,255,255,.5); }
.btn {
  border: none;
  border-radius: var(--radius-btn);
  font-family: 'Noto Sans SC', sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  padding: 10px 28px;
  background: var(--color-accent);
  color: #fff;
  box-shadow: 0 4px 14px rgba(232,104,42,.45);
  transition: transform 150ms ease, box-shadow 150ms ease;
}
.btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(232,104,42,.6); }

/* 弹窗过渡 */
.overlay-enter-active { transition: opacity .25s ease; }
.overlay-leave-active { transition: opacity .2s ease; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }
.overlay-enter-active .modal-box {
  animation: modalIn .38s cubic-bezier(.34,1.56,.64,1) both;
}
@keyframes modalIn {
  from { opacity: 0; transform: scale(.8); }
  to   { opacity: 1; transform: scale(1); }
}
</style>
