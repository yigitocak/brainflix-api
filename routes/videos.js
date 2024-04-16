import express from "express"
const router = express.Router()
import videoData from "../data/video_data.json" assert { type: "json" }

router.get('/',(req, res) => {
    const filteredVideoData = videoData.map(video => ({
        id: video.id,
        title: video.title,
        channel: video.channel,
        image: video.image
    }));
    res.status(200).json(filteredVideoData)
})

router.get('/:id',(req, res) => {
    const videoId = req.params.id
    const video = videoData.find(video => video.id === videoId)
    res.status(200).json(video)
})

router.use(express.json())


router.post('/',(req, res) => {
    const requestBody = req.body
    // Required body: title imagelink (CORS) description, duration
    // check if the body is valid (all necessary fields are given) if not return 400
    // construct the new detailed video data using the data given (timestamp, etc...)
    // Add the newly constructed object to the data file
})

export default router