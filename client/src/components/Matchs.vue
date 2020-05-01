<template>
<div>
<h1>Matchs</h1>
<span>
<h2>Mes likes </h2>
  <p v-if='cibles.length==0'> (Aucun likes) </p>
  <ul v-else>
      <li v-for='i in cibles'> {{ i.pseudo }} &#9829; </li>
    </ul>
</span>
<span>
<h2>Mes matchs </h2>
  <p v-if='matchs.length==0'> (Aucun matchs) </p>
  <ul v-else>
      <li v-for='i in matchs'> {{ i.pseudo }} &#128150;
        <span style='color:blue'> (Tel.: {{ i.telephone }} )</span>
      </li>
    </ul>
</span>
<button v-on:click="profil()">Mon Profil</button>
</div>
</template>

<script>
/* eslint-disable */
import Api from '@/services/Api'

export default {
  data() {
    return {
    cibles : [], matchs : [], show : []
    }
  },
  async beforeRouteEnter(to,from,next) {
  var res = await Api().get("/matchs")
  if (res.data=="index") next("/")
  else next(vm => vm.setData(res.data))
  },
  methods : {
    setData(res) {
      this.cibles = res.cibles
      this.matchs = res.matchs
    },

    profil(){
      this.$router.push({name: 'profil'})
      }
  }
}
</script>
