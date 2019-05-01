import axios from 'axios';

const url = 'http://localhost:8000/api/todo';

class TodoService {
    // Get Todos
    static getTodos (id) {
        return new Promise(async(resolve,reject) => {
            try {
                const res = await axios.get(`${url}/${id}`);
                const data = res.data;
                resolve(data);
            } catch(err) {
                reject(err);
            }
        })
    }
    // Create Todos
    static newTodo(todo,id) {
        return axios.patch(`${url}/${id}`, {
            todo
        });
    }
    //Delete Todos
    static deleteTodo(user,todo) {
        return axios.delete(`${url}/${user}/${todo}`);
    }
    // Toggle Complete Todo
    static toggleComplete(user_id,todo_id,completed) {
        return axios.patch(`${url}/${user_id}/${todo_id}`,completed);
    }
    // Register New User
    static addUser(user) {
        return axios.post(`http://localhost:8000/api/user`, user);
    }
    // Get One User for Registration
    static getUser(user) {
        return axios.get(`http://localhost:8000/api/user/${user}`);
    }
    // Get Specific User For Profile
    static getProfile(id) {
        return axios.get(`http://localhost:8000/api/user/profile/${id}`);
    }
    // Login User
    static login(loginInfo) {
        return axios.post(`http://localhost:8000/api/user/login`, loginInfo);
    }
    //Signout User
    static signout() {
        return axios.get(`http://localhost:8000/api/user`);
    }
}

export default TodoService;
