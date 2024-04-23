<template>
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';
import { useWalletStore } from '@/stores';

const walletStore = useWalletStore();

onMounted(() => {
  const isAPLink = window.navigator.userAgent.toLowerCase().includes('aplink');

  document.addEventListener('scatterLoaded', scatterExtension => {
    walletStore.init(window.scatter);
  });
});
</script>

<style scoped lang="scss"></style>
