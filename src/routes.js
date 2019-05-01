import Register from './components/Register'
import Home from './components/Home'
import Login from './components/Login'

export default [
    { path: '/', component: Register },
    { path: '/login', component: Login },
    { path: '/home/:id', component: Home },
]
