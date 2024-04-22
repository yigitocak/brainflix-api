import express from "express"
import cors from "cors"
import videos from "./routes/videos.js"
import 'dotenv/config'
import morgan from "morgan"
const app = express()
const PORT = process.env.PORT

app.use(morgan('dev'));
app.use(cors())
app.use(express.static('public'));

app.use((req, res, next) => {
    const apiKey = req.query.api_key
    if (!apiKey){
        return res.status(401).json({
            message: "You must enter a valid API key"
        })
    }
    next()
})

app.use("/videos", videos)

app.listen(PORT || 5050, () => {
    console.log(`running on http://localhost:${PORT}`)
})