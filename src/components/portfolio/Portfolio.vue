<template>
  <div class="vg-page page-portfolio" id="portfolio">
    <div class="container">
      <div class="text-center wow fadeInUp">
        <div class="badge badge-subhead">Portfolio</div>
      </div>
      <h1 class="text-center fw-normal wow fadeInUp">Mis Trabajos</h1>
      <div class="filterable-button py-3 wow fadeInUp" data-toggle="selected">
        <button :class="`btn btn-theme-outline ${currentCategory === '*' ? 'selected' : ''}`" data-filter="*" @click="setCategory('*')">Todos</button>

        <template v-if="categorias">
          <button v-for="(categoria, index) in categorias" :key="index" class="btn btn-theme-outline" @click="setCategory(categoria)">{{ categoria }}</button>
        </template>

      </div>

      <div class="gridder my-3" :id="galleryID">
        <template v-if="portfolio">
          <template v-for="value in portfolio">
            <div v-if="currentCategory === '*' || currentCategory === value.categoria" :class="`grid-item ${value.categoria} wow zoomIn`" :key="value.id">
              <div class="img-place gallery-item" :data-src="value.imagen" >
                <img :src="value.mini" :alt="value.titulo">
              </div>
              <div class="img-caption portfolio-caption">
                <h5 class="text-white">{{ value.titulo }}</h5>
                <p>{{ value.descripcion }}</p>
              </div>
            </div>
          </template>
        </template>
      </div> <!-- End gridder -->

    </div>
  </div> <!-- End Portfolio page -->
</template>

<script>
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

export default {
    name: 'SimpleGallery',
    props:{
      categorias:{
        type: Object,
        required: true
      },
      portfolio:{
        type: Object,
        required: true
      },
      galleryID: {
        type: String,
      },
    },
    data: () => ({
      currentCategory: '*',
    }),
    methods: {
      setCategory(categoria){
        this.currentCategory = categoria
      },
    },
    mounted() {
      if (!this.lightbox) {
        this.lightbox = new PhotoSwipeLightbox({
          gallery: '#' + this.$props.galleryID,
          children: 'a',
          pswpModule: () => import('photoswipe'),
        });
        this.lightbox.init();
      }
    },
    unmounted() {
      if (this.lightbox) {
        this.lightbox.destroy();
        this.lightbox = null;
      }
    },
};
</script>
<style scoped>
.portfolio-caption {
  position:relative !important;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: var(--theme-red) !important;
}
</style>