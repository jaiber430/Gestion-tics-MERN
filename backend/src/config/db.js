import mongoose from 'mongoose'
import 'dotenv/config'


const connectBD = async () => {
    try {
        await mongoose.connect(process.env.MONGODB)
        console.log('Conexión a MongoDB establecida')
    } catch (error) {
        console.log('Error al conectar:', error.message)
    }
}

export default connectBD
