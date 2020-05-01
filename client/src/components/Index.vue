<template>
  <div id='homepage'>
  <h1>Bienvenue</h1>
  <p>Ceci est un site de rencontre pour les +18 ans</p>
  <button v-on:click="showLogin()">Se connecter</button><br>
  <button v-on:click="showSignUp()">Créer un compte</button><br>

  <div id="login" v-if="!hiddenLogin">
    <fieldset style="display: inline-block">
  <legend><h2>Connexion</h2></legend>
    <p id='error1' style="color: red">{{ error1 }}</p>
    Pseudo: <input class='pseudo' type='text' name='pseudo' v-model='pseudoLogin'><br>
    Mot-de-passe: <input class='mdp' type='password' name='mdp1' v-model='mdpLogin'><br>
    <button v-on:click="checkInputConnexion()">Envoyer</button>
  </fieldset>
  </div>
  <div id="signup" v-if="!hiddenSignUp">
    <fieldset style="display: inline-block">
    <legend><h2>Creer un compte</h2></legend>
    <p id='error2' style="color: red">{{ error2 }}</p>
    Pseudo: <input id='pseudo' type='text' name='pseudo' v-model='pseudoSignUp'><br>
    Mot-de-passe: <input id='mdp1' type='password' name='mdp1' v-model='mdpSignUp'><br>
    Confirmer nouveau mot-de-passe: <input id='mdp2' type='password' name='mdp2' v-model='mdp2'><br>
    Sexe: Homme <input type='radio' name='sexe' value='M' v-model='sexe'>
    Femme <input type='radio' name='sexe' value='F' v-model='sexe'><br>
    Nom: <input id='nom' type='text' name='nom' v-model='nom'/><br>
    Prenom: <input id='prenom' type='text' name='prenom' v-model='prenom'/><br>
    Numero de telephone: <input type="text" id="telephone" name="telephone" maxlength="10" v-model='telephone'><br>
    Date de naissance: <input id='naissance' type='date' name='naissance' min="1945-01-01" v-model='naissance'><br>
    <button v-on:click="checkInputSignUp()">Envoyer</button>
  </fieldset>
  </div>

  </div>
</template>
<script>
  /* eslint-disable */
  import Authentification from '@/services/Authentification'
  import Api from '@/services/Api'

  export default {
    data() {
      return {
        hiddenLogin : true,
        hiddenSignUp : true,
        error1 : '',
        error2 : '',
        pseudoLogin : '',
        pseudoSignUp: '',
        mdpLogin : '',
        mdpSignUp : '',
        mdp2 : '',
        nom : '',
        prenom : '',
        telephone : '',
        sexe : '',
        naissance : ''
      }
    },
    async beforeRouteEnter(to,from,next) {
      var k = Api()
      var res = await k.get("/")
      if (res.data=="index") next()
      else next("/profil")
    },
    watch : {
      telephone : function(val) {
      this.telephone = val.replace(/[^0-9]/g, '');
      }
    },

    methods : {
      showLogin() { this.hiddenSignUp = true; this.hiddenLogin = !this.hiddenLogin},
      showSignUp() { this.hiddenLogin = true; this.hiddenSignUp = !this.hiddenSignUp},
      safeHTML(s) { return s.replace(/</g, "&lt;").replace(/>/g, "&gt;") },

      async login() {
        const res = await Authentification.signIn({
          pseudo:this.pseudoLogin,
          mdp:this.mdpLogin
        });
        if (res.data.uid) {
          this.$router.push({name: 'profil'});
          }
        else this.error1 = res.data;
      }
      ,
      async signup() {
        const res = await Authentification.signUp({
          pseudo:this.pseudoSignUp,
          mdp:this.mdpSignUp,
          sexe:this.sexe,
          nom:this.nom,
          prenom:this.prenom,
          naissance:this.naissance,
          telephone:this.telephone
      });
      if (res.data.uid){
        this.$router.push({name: 'profil'});
      }
      else this.error2 = res.data;
      },

      checkInputConnexion() {
        var err = "";
        var pseudo = this.safeHTML(this.pseudoLogin.trim());
        var mdp = this.safeHTML(this.mdpLogin.trim());
        if (pseudo=="") err = "*Veuillez saisir votre pseudo\n";
        else if (mdp=="") err = "*Veuillez saisir votre mot de passe\n";
        if (err!="") this.error1 = err;
        else this.login();
        },

      checkInputSignUp() {
      var err = "";
      var d = new Date();
      var maxDate = new Date(d.getFullYear()-18,d.getMonth(),d.getDay()).toISOString().split("T")[0];
      var pseudo = this.safeHTML(this.pseudoSignUp.trim());
      var mdp1 = this.safeHTML(this.mdpSignUp.trim());
      var mdp2 = this.safeHTML(this.mdp2.trim());
      var nom = this.safeHTML(this.nom.trim());
      var prenom = this.safeHTML(this.prenom.trim());
      var telephone = this.safeHTML(this.telephone.trim());
      if (this.pseudoSignUp.trim()=="") err = "*Veuillez saisir un pseudo non vide\n";
      else if (/\W/.test(pseudo))
      err = "*Votre pseudo doit être composé de caractères alphanumeriques";
      else if (mdp1=="") err = "*Veuillez saisir un mot de passe non vide\n";
      else if (mdp2=="") err = "*Veuillez confirmer votre mot de passe\n";
      else if (this.sexe=='') err = "*Veuillez selectionner un sexe\n";
      else if (nom=="") err = "*Veuillez saisir votre nom\n";
      else if (prenom=="") err = "*Veuillez saisir votre prenom\n";
      else if (telephone=="" || telephone.length!=10) err = "*Veuillez saisir votre numero de telephone\n";
      else if (this.naissance=="") err = "*Veuillez saisir votre date de naissance\n";
      else if ((new Date(Date.now()-new Date(this.naissance).getTime()).getUTCFullYear()-1970)<18)
      err = "*Vous devez avoir au moins 18 ans\n";
      else if (mdp1.length<5)
      err = "*Votre mot de passe doit être composé d'au moins 5 caractères";
      else if (mdp1!=mdp2) err = "*Mot de passe mal confirmé\n";

      if (err!="") this.error2 = err;
      else this.signup();
      }
    }
  }
</script>
