<template>
  <router-view />
  <ToastContainer />
  <ConfirmModal />
</template>

<script>
import ToastContainer from "@/components/ToastContainer.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";

export default {
  name: "App",
  components: {
    ToastContainer,
    ConfirmModal
  }
};
</script>

<style>
</style>
