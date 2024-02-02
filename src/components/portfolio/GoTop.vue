<template>
    <div class="btn-back_to_top" v-show="showButton" @click="topFunction">
        <i class="fas fa-chevron-up"></i>
    </div>
</template>
  
  <script>
  export default {
    data() {
      return {
        showButton: false
      };
    },
    mounted() {
      window.addEventListener("scroll", this.scrollFunction);
    },
    beforeUnmount() {
      window.removeEventListener("scroll", this.scrollFunction);
    },
    methods: {
      scrollFunction() {
        if (document.body.scrollTop > 1000 || document.documentElement.scrollTop > 1000) {
          this.showButton = true;
        } else {
          this.showButton = false;
        }
      },
      topFunction() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
      }
    }
  };
  </script>

  <style scoped>
  /* Back to top */
.btn-back_to_top {
    position: fixed;
    bottom: 10px;
    right: 14px;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 18px;
    border-radius: 50%;
    background-color: var(--theme-red);
    color: #fff;
    cursor: pointer;
    box-shadow: 0 3px 9px rgba(0, 0, 0, 0.4);
    z-index: 99;
}
  </style>