<template>
  <div class="vg-page page-contact" id="contact">
    <Toaster richColors position="bottom-right" />
    <h1 class="text-center fg-dark wow fadeInUp">Contacto</h1>
    <div class="container-fluid">
      <div class="row py-5">

        
          <form class="vg-contact-form" method="post" @submit.prevent="handleSubmit">
            <div class="form-row">
              <div class="col-12 wow fadeInUp">
                <input class="form-control" type="text" name="nombre" v-model="form.nombre" placeholder="Tu nombre" required />
              </div>
              <div class="col-6 wow fadeInUp">
                <input class="form-control" type="email" name="email" v-model="form.email" placeholder="E-mail" required />
              </div>
              <div class="col-6 wow fadeInUp">
                <input name="telefono" type="tel" class="form-control" v-model="form.telefono" placeholder="Teléfono" required />
              </div>
              <div class="col-12 wow fadeInUp">
                <textarea class="form-control" name="mensaje" v-model="form.mensaje" rows="6" placeholder="Enviame un mensaje..."></textarea>
              </div>
              <button type="submit" class="btn btn-theme mt-3 wow fadeInUp ml-1 w-100" :style="`background-color:${colorDarken} !important`">Enviar Mensaje</button>
            </div>
          </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Toaster, toast } from 'vue-sonner'
</script>

<script>
import axios from 'axios';

export default {
    props:{
      colorDarken:{
        type: String,
        required: true
      },
      myEmail:{
        type: String,
        required: true
      }
    },
    data(){
      return {
        form:{
            send_mail: 1,
            para: this.myEmail,
            nombre: '',
            email: '',
            telefono: '',
            mensaje: '',
            action: 'subscribe_newsletter',
            token: ''
        }
      }
    },
    methods:{
        
        resetForm(){
            this.form=  {
                send_mail: 1,
                para: this.myEmail,
                nombre: '',
                email: '',
                telefono: '',
                mensaje: '',
                action: 'subscribe_newsletter',
                token: ''
            }
            
        },
        handleSubmit(){
            var self = this;
            grecaptcha.ready(function() {
                grecaptcha.execute('6Le7RCgcAAAAADiRK_NZ3EtONMmj7UqKbq0S3w26', { action: 'subscribe_newsletter' }).then(function(token) {
                    self.form.token = token;
                    //console.log(self.form)
                    self.sendForm();
                });
            });
        },
        sendForm(){
            var self = this;
            axios.post('https://manejoweb.com.ar/api.php', self.form, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                toast.success('Tu mensaje fue enviado correctamente')
                self.resetForm()
            })
            .catch(error => {
                console.error(error)
                toast.error('No se pudo enviar el mensaje vuelva a intentarlo más tarde.')
            })
        }
    }
}
</script>

<style>

</style>