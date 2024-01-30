<template>
 <div class="container pt-5">
    <div class="row">
      <div class="col-md-6 wow fadeInRight" v-if="educacion_t">
        <h2 class="fg-dark">Educación</h2>
        <ul class="timeline mt-4 pr-md-5">
          <li v-for="(value, key) in educacion_t" :key="key">
            <div class="title">{{ educacion_a[key] }}</div>
            <div class="details">
              <h5>{{ value }}</h5>
              <small class="fg-theme">{{ educacion_i[key] }}</small>
              <p>{{ educacion_d[key] }}</p>
            </div>
          </li>	
        </ul>
      </div>
    
      <div class="col-md-6 wow fadeInRight" data-wow-delay="200ms" v-if="experiencia_t">
        <h2 class="fg-dark">Experiencia</h2>
        <ul class="timeline mt-4 pr-md-5">
          <li v-for="(value, key) in experiencia_t" :key="key">
            <div class="title">{{ experiencia_a[key] }}</div>
            <div class="details">
              <h5>{{ value }}</h5>
              <small class="fg-theme">{{ experiencia_s[key]}}</small>
              <p>{{ experiencia_d[key] }}</p>
            </div>
          </li>	
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    educacion_a:{
      type: Object,
      required: true
    },
    educacion_i:{
      type: Object,
      required: true
    },
    educacion_t:{
      type: Object,
      required: true
    },
    educacion_d:{
      type: Object,
      required: true
    },
    experiencia_a:{
      type: Object,
      required: true
    },
    experiencia_t:{
      type: Object,
      required: true
    },
    experiencia_s:{
      type: Object,
      required: true
    },
    experiencia_d:{
      type: Object,
      required: true
    }
  }
}
</script>

<style>

</style>
  