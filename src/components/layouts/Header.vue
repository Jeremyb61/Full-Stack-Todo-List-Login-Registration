<template>
    <header class="header">
        <h1><img src="../../assets/todologo.png" alt="Todo Logo"> Todo List</h1>
        <h4 class="username" v-if="usersName">Hello, {{ usersName }}</h4>
        <p @click="signOut">Sign out</p>
    </header>
</template>
<script>
import TodoService from "../../TodoService";
export default {
    name: "Header",
    data () {
        return {
            usersName:"",
        }
    },
  async created() {
        try {
            var user = await TodoService.getProfile(this.$route.params.id);
            if(user.data.error) {
                this.$router.push(`/login`);
            } else {
                this.usersName = user.data.data.userName;
            }
        } catch (err) {
            console.log(err);
        }
    },
    methods: {
        signOut () {
            TodoService.signout();
            this.$router.push(`/login`);

        }
    }
}
</script>

<style scoped>
    .header {
        background: #333;
        color: #fff;
        text-align: center;
        padding:10px;
    }
    h1 {
        display:inline-block;
    }
    img{
        width:30px;
        margin-right:5px;
    }
    .header p {
        color: #fff;
        position: absolute;
        top: 34px;
        right: 15px;
        text-decoration: underline;
        cursor: pointer;


    }
    header .username {
        display:inline-block;
        position: absolute;
        top: 15px;
        right: 15px;
    }
@media only screen and (max-width: 480px) {
    h1 {
        display:inline-block;
      
    }
    .header {
        background: #333;
        text-align:left;
        color: #fff;
        padding:10px;
    
    }

}
</style>


