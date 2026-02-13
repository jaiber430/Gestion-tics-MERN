import app from "./app.js";
import connectBD from "./config/db.js";
import 'dotenv/config'

connectBD()
const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log('Server run on port:', PORT)
})
