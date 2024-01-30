<template>
  <div class="vg-page page-service" id="services" :style="`background-color:${colorDark} !important`">
  <h1 class="text-center wow fadeInUp" style="color:white !important;">Servicios</h1>
  <div class="container">
    <div class="row">


      <div v-for="servicio in servicios" :key="servicio.id" class="col-md-6 col-lg-4 wow fadeInUp">
        <div class="card card-body" :style="`background-color:${colorDarken} !important`">
          <div class="iconic">
            <i :class="servicio.icono"></i>
          </div>
          <h4 class="fg-theme">{{ servicio.titulo}}</h4>
          <p style="color:white !important;">{{ servicio.descripcion }}</p>
        </div>
      </div>

    </div>
  </div>
</div>
</template>

<script>
export default {
  props:{
    colorDark:{
      type: String,
      required: true
    },
    colorDarken:{
      type: String,
      required: true
    },
    servicios:{
      type: Object,
      required: true
    }
  }
}
</script>

<style>

</style>

