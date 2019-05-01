<template>
  <div class="container">
    <div class="login">
        <header class="header">
            <img src="../assets/todologo.png" alt="">
            <h1>To do List</h1>
        </header>
      <form @submit.prevent="login">
        <h2>Login</h2>
        <div class="divError">
            <p v-if="error" class="error">{{ error }}</p>
        </div>
        <div class="form-group">
            <input type="text" placeholder="Username" v-model="userName" autocomplete="username">
        </div>
        <div class="form-group">
            <input type="password" placeholder="Password" v-model="password" autocomplete="password">
        </div>
        <input type="submit">
      </form>

      <p class="reg-page">Don't have an account? <router-link to="/">Sign Up</router-link></p>
    </div>
  </div>
</template>

<script>
import TodoService from "../TodoService";
export default {
    name:'Login',
  data() {
    return {
        userName:"",
        password:"",
        error:""
    };
  },
  methods: {
    async login() {
        if(this.userName == "" || this.password=="") {
            this.error = "Fields cannot be blank";
        } else {
            const user = {
                username: this.userName,
                password: this.password
            } 
            var data = await TodoService.login(user);
            if(data.data.apiStatus===false) {
                this.error = data.data.msg;
            } else {
                this.$router.push(`/home/${data.data.data._id}`);
            }
        }
    }
  }
};
</script>

<style scoped>
.container {
    width:100%;
    height:100vh;
    background-size:cover; 
    background-image: url(../assets/login-background.jpg);
    padding-top:95px;
}
.header {
  color: #fefefe;
  text-align: center;
  padding: 10px;
  margin-bottom:0px;
}
.header img {
    width:35px;
    margin-left: -30px;
}
h1 {
    display: inline-block;
}
h1,h2 {
    font-family: 'Volkhov', serif;
    color:white;
}
.login {
    background-color:rgb(192,192,192,0.3);
    text-align: center;
    margin:auto;
    width:375px;
    min-height:500px;
    border-radius:12px;
    margin-top:0px;
    padding-top:40px; 
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.divError {
    min-height:30px;
}
.error {
    border: 1px solid #ff5b5f;
    background-color: #ffc5c1;
    padding: 10px;
    margin-bottom:10px; 
    margin-top:10px;
    margin-left:20%;
    border-radius: 5px;
    width:60%;
}

input[type="text"] {
    background-color: rgb(192,192,192,0.05);
    padding: 5px;
    width:54%;
    margin-top:20px;
    border:1px solid white;
    color:white;
}

input[type="password"] {
    background-color: rgb(192,192,192,0.05);
    padding: 5px;
    width:54%;
    margin-top:20px;
    border:1px solid white;
    color:white;
}
::-webkit-input-placeholder { /* Chrome/Opera/Safari */
  color: white;
}
input[type="submit"] {
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  width:54%;
  color: white;
  padding: 8px;
  margin: 10px;
}
.reg-page {
    margin-top:20px;
    color:#fefefe;
}
a {
    color:#fefefe;
}
@media only screen and (max-width: 450px) {
   .login {
    background-color:rgb(192,192,192,0.3);
    text-align: center;
    width:100%;
    height:100vh;
    padding-top:40px; 
    background-size:cover; 
    background-image: url(../assets/login-background.jpg);
  }
  .container {
      padding: 0px;
  }
  .header {
      margin-top:8%;
  }
}
</style>
