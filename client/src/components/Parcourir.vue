<template>
<div>
  <h1>Parcourir</h1>
  <div id="infos">
  <h3> {{ prenom }},<br> {{ age }} ans / {{ sexe }} </h3>
  </div>
  <hr>
  <div id="desc">
    <p v-if="description==''"> (Aucune description) </p>
    <p v-else> {{ description }} </p>
  </div>
<br>
<button v-on:click="like()" >Aimer</button>
<button v-on:click="pass()">Passer</button><br>
<button v-on:click="profil()">Mon Profil</button>
</div>
</template>

<script>
/* eslint-disable */
import LikePass from '@/services/LikePass'
import Api from '@/services/Api'
  export default {
    data() {
      return {
        prenom : '', age : '', sexe : '', description : ''
      }
    },
    async beforeRouteEnter(to,from,next) {
      var res = await Api().get("/parcourir")
      if (res.data=="index") next("/")
      else next(vm => vm.setData(res.data))
    },
    methods : {
      setData(res) {
        console.log(res)
        this.prenom = res.infos.prenom
        this.age = res.infos.age
        this.sexe = res.infos.sexe
        this.description = res.description
        },
        async like(){
          var res = await LikePass.like()
          if (res.data=='redirect1') this.$router.push({name: 'index'})
          else if (res.data=='redirect2') this.$router.push({name: 'profil'})
          else this.setData(res.data)
        },
        async pass(){
          var res = await LikePass.pass()
          if (res.data=='redirect1') this.$router.push({name: 'index'})
          else if (res.data=='redirect2') this.$router.push({name: 'profil'})
          else this.setData(res.data)
        },
        profil(){
          this.$router.push({name: 'profil'})
        }
    }

  }
</script>
