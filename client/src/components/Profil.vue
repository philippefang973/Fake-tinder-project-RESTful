<template>
  <div id='profil'>
  <h1> Profil </h1>
   <button id="button-edit-infos" v-on:click="editInfos()" v-if="hidden2">{{ buttonInfo }}</button>
   <button id="button-edit-mdp" v-on:click="editMdp()" v-if="hidden1">{{ buttonMdp }}</button>

  <div id="edit-infos" v-if="!hidden1">
    <p id="err1" v-bind:style="color1">{{ error1 }}</p>
  <p>  Pseudo: {{ pseudo }} </p>
  <p v-if="sexe=='M'">  Sexe: Homme <input type='radio' name='sexe' value='M' checked v-model='sexe'>
      Femme <input type='radio' name='sexe' value='F' v-model='sexe'></p>
  <p v-else>  Sexe: Homme <input type='radio' name='sexe' value='M' v-model='sexe'>
      Femme <input type='radio' name='sexe' value='F' checked v-model='sexe'></p>
  <p>  Nom: <input id="nom" type='text' name='nom' v-model='nom'></p>
  <p>  Prenom: <input id="prenom" type='text' name='prenom' v-model='prenom'></p>
  <p>  Telephone: <input id="telephone" type='text' name='telephone' v-model='telephone' maxlength="10"></p>
  <p>  Date de naissance: <input id="naissance" v-bind:max='maxDate' type='date' name='naissance' v-model='naissance'></p>
  </div>
  <div id="edit-mdp" v-if="!hidden2">
    <p id="err2" v-bind:style="color2">{{ error2 }}</p>
  <p>  Ancien mot-de-passe: <input id="mdp1" type='password' v-model='mdp1'></p>
  <p>  Nouveau mot-de-passe: <input id="mdp2" type='password' v-model='mdp2'></p>
  <p>  Confirmer nouveau mot-de-passe: <input id="mdp3" type='password' v-model='mdp3'>
  <button id="submit-mdp" v-on:click="updateMdp()">changer</button></p>
  </div>

  <div id="infos" v-if="hidden1 && hidden2">
    <p> Pseudo:  {{ pseudo }} </p>
    <p> Nom: {{ nom }} </p>
    <p> Prenom: {{ prenom }} </p>
    <p class="sexe" v-if="sexe=='M'" > Sexe: Homme</p>
    <p class="sexe" v-else> Sexe: Femme</p>
    </p>
    <p> Telephone: {{ telephone }}</p>
    <p> Age: {{ age }}</p>
  </div>

   <h2>Description <button id="button-edit-desc" v-on:click="editDescription()">{{ buttonDesc }}</button>  </h2>
   <!-- http://localhost:8080/description -->
   <div id="edit-desc" v-if="!hidden5">
     <p style="color:red"></p>
     <textarea style="resize:none" maxlength="300" name="desc" rows=5 cols=50 resize=none v-model="description">{{ description }}</textarea>
    </div>
   <div id="desc" style="width: 450px; margin:auto; word-wrap: break-word" v-else>
       <p v-if="description==''"> (Aucune description) </p>
      <p v-else> {{ description }} </p>
    </div>

   <h2>Preferences <button id="button-edit-pref" v-on:click="editPreference()">{{ buttonPref }}</button> </h2>
  <!-- http://localhost:8080/preference -->
   <div id="edit-pref" v-if="!hidden6">
     <p>Age recherché: <p>{{ prefAge }}</p>
       <input type="range" id="slider" name='page' v-model='prefAge' min='18' max='100' step='1' autocomplete="off"></p>
     <p v-if="prefSexe == 'M' ">Interessé(e) par:
         Homme <input type='radio' name='psexe' value='M' checked v-model='prefSexe'>
         Femme <input type='radio' name='psexe' value='F' v-model='prefSexe'></p>
      <p v-else>Interessé(e) par:
           Homme <input type='radio' name='psexe' value='M' v-model='prefSexe'>
           Femme <input type='radio' name='psexe' value='F' checked v-model='prefSexe'></p>
   </div>
   <div id="pref" v-else>
     <p class='age'> Age recherché: {{ prefAge }} ans </p>
       <p class='sexe' v-if="prefSexe == 'M' "> Interessé(e) par: Homme </p>
       <p class='sexe' v-else> Interessé(e) par: Femme </p>
   </div><br>

   <button v-on:click="parcourir()" >Parcourir</button>
   <button v-on:click="matchs()"> Matchs</button>
   <button v-on:click="disconnect()">Deconnecter</button>

  </div>
</template>
<script>
  /* eslint-disable */
  import EditProfil from '@/services/EditProfil'
  import Api from '@/services/Api'

  export default {
    data() {
      return {
      hidden1 : true, hidden2 : true, hidden5 : true, hidden6 : true,
      open2 : false, open3 : false, open4 : false, open5 : false,
      error1 : '', error2: '',
      color1 : 'color: red', color2 : 'color : red',
      buttonInfo : 'modifier infos persos',
      buttonMdp : 'modifier mot de passe',
      buttonImage : 'modifier', buttonDesc : 'modifier', buttonPref : 'modifier',
      mdp1 : '',mdp2: '',mdp3 : '',
      pseudo: '', tmpPseudo : '',
      nom : '',  tmpNom : '',
      prenom : '', tmpPrenom : '',
      telephone : '', tmpTelephone : '',
      sexe : '', tmpSexe : '',
      age : '', tmpAge : '',
      naissance : '', tmpNaissance : '',
      prefSexe : '',
      prefAge : 0,
      description : '',
      maxDate : ''
      }
    },
    async beforeRouteEnter(to,from,next) {
      var k = Api()
      var res = await k.get("/profil")
      if (res.data=="index") next("/")
      else next(vm => vm.setData(res))

    },
    watch : {
      telephone : function(val) {
      this.telephone = val.replace(/[^0-9]/g, '');
      }
    },
    methods : {
      setData(res) {
      this.pseudo = res.data.infos.pseudo
      this.nom = res.data.infos.nom
      this.prenom = res.data.infos.prenom
      this.sexe = res.data.infos.sexe
      this.telephone = res.data.infos.telephone
      this.naissance = res.data.infos.ddn
      this.prefAge = res.data.preference.age
      this.prefSexe = res.data.preference.sexe
      this.description = res.data.description
      this.tmpPseudo = res.data.infos.pseudo
      this.tmpNom = res.data.infos.nom
      this.tmpPrenom = res.data.infos.prenom
      this.tmpSexe = res.data.infos.sexe
      this.tmpTelephone = res.data.infos.telephone
      this.tmpNaissance = res.data.infos.ddn
      var d = new Date();
      this.maxDate = new Date(d.getFullYear()-18,d.getMonth(),d.getDay()).toISOString().split("T")[0];
      var age = new Date(Date.now()-new Date(this.naissance).getTime()).getUTCFullYear()-1970;
      this.age = age;
      },

      safeHTML(s) { return s.replace(/</g, "&lt;").replace(/>/g, "&gt;") },

      async parcourir () {
        await Api().get("/parcourir/new");
        this.$router.push({ name : 'parcourir'})
      },

      async matchs () {
        this.$router.push({ name : 'matchs'})
      },

      async disconnect () {
          await Api().get("/deconnect");
          this.$router.push({ name : 'index'})
      },

      async editDescription(){
      if (!this.open2) {
      this.buttonDesc = 'OK';
      this.hidden5 = false;
      this.open2 = true;
      }
      else {
        const res = await EditProfil.editDescription({desc:this.safeHTML(this.description)});
        this.buttonDesc = 'modifier';
        this.hidden5 = true;
        this.open2 = false;
        }
      },

      async editPreference() {
      if (!this.open3) {
      this.buttonPref = 'OK';
      this.hidden6 = false;
      this.open3 = true;
    }else{
      const res = await EditProfil.editPreference({sexe:this.prefSexe,age:this.prefAge});
      this.buttonPref = 'modifier';
      this.hidden6 = true;
      this.open3 = false;
    }
      },

      async editInfos() {
      if (!this.open4) {
      this.buttonInfo = 'OK';
      this.hidden1 = false;
        this.open4 = true;
      }
      else {
      var err = "";
            this.error1 = "";
      this.color1 = "color : red"
      var age = new Date(Date.now()-new Date(this.naissance).getTime()).getUTCFullYear()-1970;
      var nom = this.tmpNom, prenom = this.tmpPrenom, naissance = this.tmpNaissance, sexe = this.tmpSexe, telephone = this.tmpTelephone
      if (this.nom.trim()!="" && this.nom.trim()!=nom) nom = this.safeHTML(this.nom.trim());
      else this.nom = nom;
      if (this.prenom.trim()!="" && this.prenom.trim()!=prenom) prenom = this.safeHTML(this.prenom.trim());
      else this.prenom = prenom
      if (this.sexe!=sexe) sexe = this.sexe;
      else this.sexe = sexe
      if (this.naissance.trim()!="" && this.naissance.trim()!=naissance && age>=18) naissance = this.naissance;
      else this.naissance = naissance
      if (this.telephone.trim()!="" && this.telephone.trim()!=telephone && this.telephone.trim().length==10) telephone = this.safeHTML(this.telephone.trim());
      else this.telephone = telephone
      if (age<18) err = "*Date de naissance non modifié car non valide";
      if (err!="") this.error1 = err;
      else {
        const res = await EditProfil.editInfos({nom:nom,prenom:prenom,naissance:naissance,sexe:sexe,telephone});
        if (res.data=="") {
          var age = new Date(Date.now()-new Date(naissance).getTime()).getUTCFullYear()-1970;
          this.age = age;
          this.color1 = "color : green";
          this.error1 = '*Infos persos changé"'
        }
        this.buttonInfo = 'modifier infos persos';
        this.hidden1 = true;
          this.open4 = false;
      }
      }
    },

      editMdp() {
      if (!this.open5) {
      this.buttonMdp = 'OK';
      this.hidden2 = false;
        this.open5 = true;
      }
      else {
      this.buttonMdp = 'modifier mot de passe';
      this.hidden2 = true
        this.open5 = false;
        this.mdp1 = ""; this.mdp2 = ""; this.mdp3 = ""; this.error2 = "";
        }
      },

      async updateMdp() {
      var err = "";
      this.error2 = "";
      this.color2 = "color : red";
      var mdp1 = this.safeHTML(this.mdp1.trim());
      var mdp2 = this.safeHTML(this.mdp2.trim());
      var mdp3 = this.safeHTML(this.mdp3.trim());
      if (mdp1=="") err = "*Veuillez saisir votre ancien mot de passe";
      else if (mdp2=="") err = "*Veuillez saisir un nouveau mot de passe";
      else if (mdp3=="") err = "*Veuillez confirmer le nouveau mot de passe";
      else if (mdp1==mdp2) err = "*Ancien et nouveau mots de passe idendiques";
      else if (mdp2.length<5)
      err = "*Le nouveau mot de passe doit être composé d'au moins 5 caractères";
      else if (mdp2!=mdp3) err = "*Mot de passe mal confirmé\n";
      if (err!="") this.error2 = err
      else {
      const res = await EditProfil.updateMdp({mdp1:mdp1,mdp2:mdp2});
      if (res.data=="") {
            this.color2 = "color : green";
            this.error2 = '*Mot de passe changé"'
            this.mdp1 = ""; this.mdp2 = ""; this.mdp3 = "";
          } else this.error2 = res.data;
        }
      }
      }}

</script>
