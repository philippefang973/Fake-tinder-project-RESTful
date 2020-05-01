var express = require("express");
var cors = require("cors");
var serv = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var bcrypt = require('bcrypt');
var path = require('path');

var mysql = require("mysql");
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'db',
  timezone: 'local'
});

serv.use(cors({origin:["http://localhost:8080"],credentials:true}));
serv.use(bodyParser.urlencoded({ extended: false }));
serv.use(bodyParser.json());
serv.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {secure : false}
}));
serv.listen(8081);

serv.get("/",function(req,res) {
    if (req.session.user) return res.json("profil");
    return res.json("index");
});

serv.post('/creation',function(req,res) {
  var code = "select * from user where pseudo='"+req.body.pseudo+"'";
  connection.query(code,function(err,row,fields){
    if (err) return res.json("*Erreur mysql query (test existence pseudo)");
    if (row.length>0) return res.json("*Pseudo existant");
    var hash = bcrypt.hashSync(req.body.mdp,10);
    code = "insert into user(pseudo,mdp,sexe,nom,prenom,naissance,telephone) values (?,'"+hash+"','"+req.body.sexe+"',?,?,'"+req.body.naissance+"',?)";
    connection.query(code,[req.body.pseudo,req.body.nom,req.body.prenom,req.body.telephone],
      function(err,row,fields){
      if (err) return res.json("*Erreur mysql query (usr)");
      code = "insert into description(uid,contenu) values (" +
      "(select uid from user where pseudo='"+req.body.pseudo+"'),'')";
      connection.query(code, function(err,row2,fields){
        if (err) return res.json("*Erreur mysql query (desc)");
        var age = new Date(Date.now()-new Date(req.body.naissance).getTime()).getUTCFullYear()-1970;
        var sexe;
        if (req.body.sexe=='M') sexe = 'F';
        else sexe = 'M';
        code = "insert into preference(uid,age,sexe) values (" +
        "(select uid from user where pseudo='"+req.body.pseudo+"'),"+age+",'"+sexe+"')";
        connection.query(code, function(err,row3,fields){
          if (err) return res.json("*Erreur mysql query (pref)");
          req.session.user = {
            "uid":row.insertId,
            "pseudo":req.body.pseudo,
            "nom":req.body.nom,
            "prenom":req.body.prenom,
            "ddn":req.body.naissance,
            "sexe":req.body.sexe,
            "telephone":req.body.telephone
          };
          return res.json(req.session.user);
        });
      });
    });
  });
});

serv.post('/login',function(req,res) {
  var code = "select * from user where pseudo=?";
    connection.query(code,[req.body.pseudo],function(err,row,fields){
      if (err) return res.json("*Erreur mysql query");
      if (row.length==0) return res.json("*Pseudo inconnu");
      if (!bcrypt.compareSync(req.body.mdp,row[0].mdp)) return res.json("*Mot de passe incorrect");
      req.session.user = {
        uid: row[0].uid,
        pseudo:row[0].pseudo,
        nom:row[0].nom,
        prenom:row[0].prenom,
        ddn:new Date(row[0].naissance).toLocaleString().split(" ")[0].split("/").reverse().join("-"),
        sexe:row[0].sexe,
        telephone:row[0].telephone
      };
      return res.send(req.session.user);
    });
});

serv.get("/profil",function(req,res) {
  if (!req.session.user) return res.redirect("/");
  var row = req.session.user;
  var code1 = "select d.* from description as d where uid="+row.uid;
  var code2 = "select p.* from preference as p where uid="+row.uid;
  var desc = "";
  var pref = {age:"",sexe:""}
  var img = [];
  connection.query(code1,function(err,row1,fields){
    if (err) return res.json("Erreur mysql query (desc)");
    if (row1.length>0) desc = row1[0].contenu;
    connection.query(code2,function(err,row2,fields){
      if (err) return res.json("Erreur mysql query (pref)");
      if (row2.length>0) pref = {age:row2[0].age,sexe:row2[0].sexe};
        res.json({
          infos: {pseudo:row.pseudo,nom:row.nom,prenom:row.prenom,ddn:row.ddn,sexe:row.sexe,telephone:row.telephone},
          description: desc,
          preference: pref
      });
    });
  });
});

serv.put('/infos',function(req,res) {
  if (!req.session.user) return res.redirect("/");
  var code = "update user set nom='"+req.body.nom+"', prenom='"+req.body.prenom+"',sexe='"+req.body.sexe+"',naissance='"+req.body.naissance+"',telephone='"
  +req.body.telephone+"' where pseudo='"+req.session.user.pseudo+"'";
  connection.query(code, function(err,row,fields){
    if (err) return res.json("*Erreur mysql query (update)");
    req.session.user.nom = req.body.nom;
    req.session.user.prenom = req.body.prenom;
    req.session.user.sexe = req.body.sexe;
    req.session.user.ddn = req.body.naissance;
    req.session.user.telephone = req.body.telephone;
    return res.json("");
  });
});

serv.put('/password',function(req,res) {
  if (!req.session.user) return res.redirect("/");
  var code = "select mdp from user where pseudo='"+req.session.user.pseudo+"'";
  connection.query(code, function(err,row,fields){
    if (err) return res.json("*Erreur mysql query (select)");
    if (!bcrypt.compareSync(req.body.mdp1,row[0].mdp)) return res.json("*Ancien mot de passe incorrect");
    var hash = bcrypt.hashSync(req.body.mdp2,10);
    code = "update user set mdp='"+hash+"' where pseudo='"+req.session.user.pseudo+"'";
    connection.query(code, function(err,row1,fields) {
      if (err) return res.json("*Erreur mysql query (update)");
      return res.json("");
    });
  });
});


serv.put("/description",function(req,res){
  if (!req.session.user) return res.redirect("/");
    code = "update description set contenu=? where uid="+req.session.user.uid;
    connection.query(code,[req.body.desc],function(err,row,fields){
      if (err) return res.json("*Erreur mysql query (update)")
      return res.json("");
    });
});

serv.put("/preference",function(req,res){
  if (!req.session.user) return res.redirect("/");
  var code = "update preference set age="+req.body.age+",sexe='"+req.body.sexe+"' where uid="+req.session.user.uid;
    connection.query(code,function(err,row,fields){
      if (err) return res.json("*Erreur mysql query (update)")
      else return res.json("");
    });
});

serv.get("/deconnect",function(req,res){
  if (!req.session.user) return res.redirect("/");
  else {
    req.session.destroy();
    return res.json("")
  }
});

serv.get("/parcourir/new",function(req,res){
  if (!req.session.user) return res.redirect("/");
  req.session.parcours = {i:0,p:[]};
  var row = req.session.user;
  var code = "select *,abs((select age from preference where uid="+row.uid+")"
  + "-(timestampdiff(year,user.naissance,curdate()))) as x from user where uid<>"+row.uid
  +" and sexe=(select sexe from preference where uid="+row.uid+") "
  +"and uid not in (select cible from click where origin="+row.uid+") order by x;"
  connection.query(code,function(err,row0,fiedls){
    if (err) return res.redirect("/profil");
    req.session.parcours.p = row0;
    return res.json("")
  });
});

serv.get("/parcourir",function(req,res){
  if (!req.session.user) return res.redirect("/");
  if (!req.session.parcours || req.session.parcours.p.length==0) return res.redirect("/profil");
  var row = req.session.parcours.p[req.session.parcours.i];
  var code = "select * from user where pseudo='"+row.pseudo+"'";
  connection.query(code,function(err,row0,fields){
    if (err) return res.send("*Erreur mysql query (select)");
    var age = new Date(Date.now()-new Date(row0[0].naissance).getTime()).getUTCFullYear()-1970;
    var sexe;
    if (row0[0].sexe=='M') sexe = "Homme";
    else sexe = "Femme";
    var code1 = "select d.* from description as d where uid="+row0[0].uid;
    var code2 = "select p.* from preference as p where uid="+row0[0].uid;
    var desc = "";
    var pref = {age:"",sexe:""}
    connection.query(code1,function(err,row1,fields){
      if (err) return res.send("*Erreur mysql query (select desc)");
      if (row1.length>0) desc = row1[0].contenu;
      connection.query(code2,function(err,row2,fields){
        if (err) return res.send("*Erreur mysql query (select pref)");
        if (row2.length>0) pref = {age:row2[0].age,sexe:row2[0].sexe};
          return res.json({
            infos: {pseudo:row0[0].pseudo,nom:row0[0].nom,prenom:row0[0].prenom,age:age,sexe:sexe},
            description: desc,
            preference: pref,
            });
      });
    });
  });
});

serv.get("/like",function(req,res){
  if (!req.session.user) return res.json("redirect1");
  if (!req.session.parcours) return res.json("redirect2");
  var uid = req.session.parcours.p[req.session.parcours.i].uid;
  var code = "insert into click(origin,cible,aimer) values("
  +"(select uid from user where pseudo='"+req.session.user.pseudo+"'),"+uid+",true)";
  connection.query(code,function(err,row,fields){
    if (err) return res.json("*Erreur mysql query (insert)");
    req.session.parcours.p.splice(req.session.parcours.i,1);
    req.session.parcours.i = (req.session.parcours.i+1)%req.session.parcours.p.length;
    var row = req.session.parcours.p[req.session.parcours.i];
    var code = "select * from user where pseudo='"+row.pseudo+"'";
    connection.query(code,function(err,row0,fields){
      if (err) return res.send("*Erreur mysql query (select)");
      var age = new Date(Date.now()-new Date(row0[0].naissance).getTime()).getUTCFullYear()-1970;
      var sexe;
      if (row0[0].sexe=='M') sexe = "Homme";
      else sexe = "Femme";
      var code1 = "select d.* from description as d where uid="+row0[0].uid;
      var code2 = "select p.* from preference as p where uid="+row0[0].uid;
      var desc = "";
      var pref = {age:"",sexe:""}
      connection.query(code1,function(err,row1,fields){
        if (err) return res.send("*Erreur mysql query (select desc)");
        if (row1.length>0) desc = row1[0].contenu;
        connection.query(code2,function(err,row2,fields){
          if (err) return res.send("*Erreur mysql query (select pref)");
          if (row2.length>0) pref = {age:row2[0].age,sexe:row2[0].sexe};
            res.json({
              infos: {pseudo:row0[0].pseudo,nom:row0[0].nom,prenom:row0[0].prenom,age:age,sexe:sexe},
              description: desc,
              preference: pref,
              }
            );
        });
      });
    });
  });
});

serv.get("/pass",function(req,res){
  if (!req.session.user) return res.json("redirect1");
  if (!req.session.parcours) return res.json("redirect2");
  var uid = req.session.parcours.p[req.session.parcours.i].uid;
  var code = "insert into click(origin,cible,aimer) values("
  +"(select uid from user where pseudo='"+req.session.user.pseudo+"'),"+uid+",false)";
  connection.query(code,function(err,row,fields){
    if (err) return res.json("*Erreur mysql query (insert)");
    req.session.parcours.p.splice(req.session.parcours.i,1);
    req.session.parcours.i = (req.session.parcours.i+1)%req.session.parcours.p.length;
    var row = req.session.parcours.p[req.session.parcours.i];
    var code = "select * from user where pseudo='"+row.pseudo+"'";
    connection.query(code,function(err,row0,fields){
      if (err) return res.send("*Erreur mysql query (select)");
      var age = new Date(Date.now()-new Date(row0[0].naissance).getTime()).getUTCFullYear()-1970;
      var sexe;
      if (row0[0].sexe=='M') sexe = "Homme";
      else sexe = "Femme";
      var code1 = "select d.* from description as d where uid="+row0[0].uid;
      var code2 = "select p.* from preference as p where uid="+row0[0].uid;
      var desc = "";
      var pref = {age:"",sexe:""}
      connection.query(code1,function(err,row1,fields){
        if (err) return res.send("*Erreur mysql query (select desc)");
        if (row1.length>0) desc = row1[0].contenu;
        connection.query(code2,function(err,row2,fields){
          if (err) return res.send("*Erreur mysql query (select pref)");
          if (row2.length>0) pref = {age:row2[0].age,sexe:row2[0].sexe};
          res.json({
              infos: {pseudo:row0[0].pseudo,nom:row0[0].nom,prenom:row0[0].prenom,age:age,sexe:sexe},
              description: desc,
              preference: pref,
              }
            );
        });
      });
    });
  });
});

serv.get("/matchs",function(req,res){
  if (!req.session.user) return res.redirect("/");
  var code = "select pseudo from user,click where origin="+req.session.user.uid+" and cible=uid and aimer=1";
  connection.query(code,function(err,row,fields){
    if (err) return res.redirect("/profil");
    code = "select pseudo,telephone from user,click where origin="+req.session.user.uid
    +" and cible in (select origin from click where cible="+req.session.user.uid+" and aimer=1) and uid=cible and aimer=1";
    connection.query(code,function(err,row2,fields){
      if (err) return res.redirect("/profil");
      return res.json({cibles:row,matchs:row2});
    });
  });
});

serv.use(function(req,res){ res.redirect("/");});
