import express from "express"
import cors from "cors"
import videos from "./routes/videos.js"
const app = express()
const PORT = 5050

app.use(cors())

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

app.listen(PORT, () => {
    console.log(`running on http://localhost:${PORT}`)
})