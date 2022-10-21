const mongoose = require('mongoose');
const rbacMongo = require('koa-rbac-mongo');
const app = require('koa')();
const rbac = rbacMongo.rbac;
const URI = "mongodb+srv://api-vacunacion:qaTwwuJnyPRsx6ns@cluster0.ofgjo.mongodb.net/MAPEL"


mongoose
  .connect(URI)
  .then(() => console.log('DB Connect'))
  .catch(e => console.log('fail db: ' + e));

  app.use(rbacMongo({
    uri: URI,
    permissionCollection: 'permissions',
    roleCollection: 'roles',
    mongoOptions: {},
    identity: function (ctx) {
      if (!ctx.state || !ctx.state.user) ctx.throw(401);
      return ctx.state.user;
    }
  }));
  app.use(rbac.allow(['read docs']));
 
  app.use(function *() {
    this.body = 'Protected docs';
  });

  
