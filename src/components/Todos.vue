<template>
  <div class="container">
    <div>
      <form @submit="addTodo">
        <input type="text" v-model="title" name="title" placeholder="Add Todo...">
        <input type="submit" value="submit" class="btn">
      </form>
    </div>
    <p class="error" v-if="error">{{ error }}</p>
    <div
      class="todos"
      v-for="(todo,index) in todos"
      v-bind:item="todo"
      v-bind:index="index"
      v-bind:key="todo._id"
    >
      <div
        class="todo-item"
        v-bind:class="{'is-complete':todo.completed}"
      >
        <p>
          <input type="checkbox" @click="markComplete(todo._id,todo.completed)">
          {{ todo.title }}
          <button class="del" @click="delTodo(todo._id)">x</button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import TodoService from "../TodoService";
import { isDate } from 'util';
import { constants } from 'crypto';
export default {
  name: "Todos",
  data() {
    return {
      todos: [],
      error: "",
      title: "",
    };
  },
  async created() {
    try { 
        var todo = await TodoService.getTodos(this.$route.params.id);
        this.todos = todo.data[0].todos;
    } catch (err) {
        this.error = "An Error Occured";
    }
  },
  methods: {
    async markComplete(todoId, completed) {
        if(completed===true) {
            let data = {
                completed: false
            }
            TodoService.toggleComplete(this.$route.params.id,todoId,data);
            var todo = await TodoService.getTodos(this.$route.params.id);
            this.todos = todo.data[0].todos;        
        } else {
            let data = {
                completed: true
            }
            TodoService.toggleComplete(this.$route.params.id,todoId,data);
            var todo = await TodoService.getTodos(this.$route.params.id);
            this.todos = todo.data[0].todos;        
        }
        var todo = await TodoService.getTodos(this.$route.params.id);
        this.todos = todo.data[0].todos;
    },
    async addTodo(e) {
      // Creating todo object
      e.preventDefault();
      const newTodo = {
        title: this.title,
      };
      try {
        await TodoService.newTodo(newTodo,this.$route.params.id)
        .then((res) => {
            this.title = "";
            if(res.data.err){
                if(res.data.err.errors.title) {
                    this.error = res.data.err.errors.title.message;
                }
            } else {
                this.error = "";
            }
         
        })
        var todo = await TodoService.getTodos(this.$route.params.id);
        this.todos = todo.data[0].todos;        
      } catch (err) {
          this.error = err.message;
      }
    },
    async delTodo(id) {
        try {
            await TodoService.deleteTodo(this.$route.params.id, id)
            var todo = await TodoService.getTodos(this.$route.params.id);
            this.todos = todo.data[0].todos;
        } catch (err) {
            this.error = "An Error Occured"
        }
    },
    
  }
};
</script>

<style scoped>
.wrapper {
  width: 100%;
  padding-top: 1%;
  padding-left: 3%;
}
.todos {
  display: inline-block;
  vertical-align: top;
  margin: 8px;
  width: 30%;
  min-height:43px;
  box-shadow: 5px 5px 5px #aaaaaa;
  background: #f4f4f4;

}
.todo-item {
  min-height:43px;
  background: #f4f4f4;
  padding: 10px;
  border-bottom: 1px #ccc dotted;
}
.todo-item:hover {
    background: #dbdbdb;
    padding: 10px;
    border-bottom: 1px #ccc dotted;
}

.is-complete {
  text-decoration: line-through;
}
.error {
    border: 1px solid #ff5b5f;
    background-color: #ffc5c1;
    padding: 10px;
    margin-bottom:10px; 
    margin-top:10px;
    margin-left:8px;
    border-radius: 5px;
    width:30%;
}
.del {
  background: #fa6363;
  color: #ffff;
  border: none;
  padding: 5px 9px;
  border-radius: 50%;
  cursor: pointer;
  float: right;
}
.del:hover {
  background: #ff0202;
  color: #ffff;
  border: none;
  padding: 5px 9px;
  border-radius: 50%;
  cursor: pointer;
  float: right;
}

form {
  display: flex;
}
input[type="text"] {
  flex: 10;
  padding: 5px;
}
input[type="submit"] {
  flex: 2;
}
input[type="datetime-local"] {
    font-family: Arial, Helvetica, sans-serif;
    padding-left:5px;
    width:180px;
}
@media only screen and (max-width: 900px) {
  .todos {
    display: inline-block;
    vertical-align: top;
    margin: 8px;
    width: 45%;
  }
  .error {
    border: 1px solid #ff5b5f;
    background-color: #ffc5c1;
    padding: 10px;
    margin:8px;
    width:93%;
  }
}
@media only screen and (max-width: 480px) {
  .todos {
    display: inline-block;
    vertical-align: top;
    margin: 8px;
    width: 92%;
  }
  .error {
    border: 1px solid #ff5b5f;
    background-color: #ffc5c1;
    padding: 10px;
    margin-bottom:10px; 
    width:100%;
    border-radius: 0;
    margin-left:0;
    margin-top:0;
    }
}
</style>


