<template>
  <div class="topbar-nav fixed-top">
    <div class="brand">
      <img src="../../images/faviconx64.png" alt="" width="30" height="30">
    </div>
    <h3 class="ml-1">Menú</h3>
    <button @click="handleShowMinibar" class="btn-fab toggle-menu mr-3"><i :class="{'fas fa-times': showMinibar, 'fas fa-bars': !showMinibar}"></i></button>
  </div>
  <div class="minibar" v-show="showMinibar" :style="styles">
    <div class="header">
      <div class="brand"></div>
    </div>
    <div class="content">
      <ul class="main-menu">
        <li :class="{ 'menu-item': true, 'active': activeItem === 'inicio' || activeItem === '' }">
          <a href="#inicio" class="menu-link" @click="updateUrl('inicio')">
            <i class="icon fas fa-home"></i>
            <span class="caption">Inicio</span>
          </a>
        </li>
        <li :class="{ 'menu-item': true, 'active': activeItem === 'perfil' }">
          <a href="#perfil" class="menu-link" @click="updateUrl('perfil')">
            <i class="icon fas fa-user"></i>
            <span class="caption">Perfil</span>
          </a>
        </li>
        <li :class="{ 'menu-item': true, 'active': activeItem === 'services' }">
          <a href="#services" class="menu-link" @click="updateUrl('services')">
            <i class="icon fas fa-tools"></i>
            <span class="caption">Servicios</span>
          </a>
        </li>
        <li :class="{ 'menu-item': true, 'active': activeItem === 'portfolio' }">
          <a href="#portfolio" class="menu-link" @click="updateUrl('portfolio')">
            <i class="icon fas fa-briefcase"></i>
            <span class="caption">Portfolio</span>
          </a>
        </li>
        <li :class="{ 'menu-item': true, 'active': activeItem === 'contact' }">
          <a href="#contact" class="menu-link" @click="updateUrl('contact')">
            <i class="icon fas fa-envelope"></i>
            <span class="caption">Contacto</span>
          </a>
        </li>
        <li v-if="whatsapp" :class="{ 'menu-item': true, }">
          <a rel="nofollow noopener noreferrer" :href="`https://wa.me/54${whatsapp}`" target="_blank" class="menu-link" @click="handleShowMinibar()">
            <i class="icon fab fa-whatsapp"></i>
            <span class="caption">WhatsApp</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    whatsapp: String,
  },
  data() {
    return {
      currentURL: window.location.hash.substring(1),
      showMinibar: true,
      styles: {
        display: 'block',
      }
    }
  },
  mounted() {
    if (window.innerWidth <= 600) {
      this.showMinibar = false
      this.styles.display = 'none'
    } 
  },
  methods: {
    updateUrl(url) {
      this.currentURL = url;
      this.handleShowMinibar()
    },
    handleShowMinibar() {
      if (window.innerWidth <= 600) {
        this.showMinibar = !this.showMinibar
        this.styles.display = this.showMinibarStyle
      }
    }
  },
  computed: {
    activeItem() {
      return this.currentURL;
    },
    showMinibarStyle() {
      return this.showMinibar ? 'block' : 'none';
    }
  },
};
</script>