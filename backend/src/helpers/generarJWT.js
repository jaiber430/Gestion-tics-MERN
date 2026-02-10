import jwt from 'jsonwebtoken'

const generarJWT = async (id) => {
    try {
        jwt.sign({
            id
        }, process.env.SECRETKEY, { expiresIn: '30d' }
        )
    } catch (error) {
        console.log(error.message)
    }
}

export default generarJWT
