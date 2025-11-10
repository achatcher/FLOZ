<!-- QR code implementation -->
<template>
  <div class="share-view">
    <qrcode-vue 
      :value="appUrl" 
      :size="300" 
      level="H"
    />
    <button @click="shareApp">
      <i class="apple-icon"></i>
      Tap to Share
    </button>
  </div>
</template>

<script setup>
import QrcodeVue from 'qrcode.vue';

const appUrl = 'https://your-floz-app.com';

const shareApp = async () => {
  if (navigator.share) {
    await navigator.share({
      title: 'FLOZ App',
      text: 'Check out the FLOZ App!',
      url: appUrl
    });
  }
};
</script>
