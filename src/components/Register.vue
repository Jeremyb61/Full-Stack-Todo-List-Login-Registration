<template>
  <div class="container">
    <div class="register">
        <header class="header">
            <img src="../assets/todologo.png" alt="">
            <h1>To do List</h1>
        </header>
      <form @submit.prevent="register">
        <h2>Register</h2>
        <div class="divError">
            <p v-if="error" class="error">{{ error }}</p>
        </div>
        <div class="form-group">
            <input type="text" placeholder="Username" v-model="userName" autocomplete="username">
        </div>
        <div class="form-group">
            <input type="password" placeholder="Password" v-model="password" autocomplete="password">
        </div>
        <div class="form-group">
            <input type="password" placeholder="Confirm Password" v-model="confirmPassword" autocomplete="confirmPassword">
        </div>
        <input type="submit">
        
      </form>
      <p class="login-page">Already have an account? <router-link to="/login">Sign In</router-link></p>
    </div>
  </div>
</template>

<script>
import TodoService from "../TodoService";
export default {
    name:'register',
  data() {
    return {
        userName:"",
        password:"",
        confirmPassword:"",
        error:""
    };
  },
  methods: {
    async register() {
        // Front End Form Validations
        if (this.userName == "" || this.password == "" || this.confirmPassword == "") {
            this.error = "Fields cannot be blank"
        }
        else if(this.password != this.confirmPassword) {
            this.error = "Passwords must match";
            this.password = "";
            this.confirmPassword = "";
        } else if(this.password.length < 8) {
            this.error = "Password must be 8 or more characters"
        } else {
            // User Instance
            const newUser = {
                username: this.userName,
                password: this.password,
                confirmPassword: this.confirmPassword
            }
            // API Call
            var regProcess = await TodoService.addUser(newUser);

            //  Server Form Validations
            if(regProcess.data.err) {
                if(regProcess.data.err.errors.userName) {
                    this.error = regProcess.data.err.errors.userName.message;
                } else if (regProcess.data.err.errors.password) {
                    this.error = regProcess.data.err.errors.password.message;
                }

            } else if(regProcess.data.apiStatus === false) {
                this.error = regProcess.data.msg;
                //End Form Validation
            } else {
                // Get new user data and enter profile
                var user = await TodoService.getUser(this.userName);
                this.$router.push(`/home/${user.data.data._id}`);
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
.divError {
    min-height:30px;
}
.register {
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
.error {
    border: 1px solid #ff5b5f;
    background-color: #ffc5c1;
    padding: 10px;
    margin-top:10px;
    margin-left:20%;
    border-radius: 5px;
    width:60%;
}

input[type="text"] {
    background-color: rgb(192,192,192,0.05);
    padding: 5px;
    width:62%;
    margin-top:20px;
    border:1px solid white;
    color:white;
}

input[type="password"] {
    background-color: rgb(192,192,192,0.05);
    padding: 5px;
    width:62%;
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
  width:62%;
  color: white;
  padding: 8px;
  margin: 10px;
}
.login-page {
    margin-top:20px;
    color:#fefefe;
}
a {
    color:#fefefe;
}
@media only screen and (max-width: 450px) {
  .register {
    /* background-color:rgb(192,192,192,0.3); */
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


