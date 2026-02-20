import axios from 'axios'

const clienteAxios = axios.create({
    baseURL: 'http://localhost:4000/gestion-tics/api',
    withCredentials: true // 🔥 NECESARIO para enviar y recibir cookies
})

export default clienteAxios
