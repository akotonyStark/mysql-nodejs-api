const express = require('express')
const apiRouter = require('./routes')
const cors = require('cors')

const app = express();

let corsOptions = {
    origin: "http://localhost:3000"
}
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/homer', apiRouter)


app.listen(process.env.PORT || '3000', () => {
    console.log(`Server is running on port: ${process.env.PORT || '3000'}`)
})

