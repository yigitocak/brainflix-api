import express from "express"
const router = express.Router()
import videoData from "../data/video_data.json" assert { type: "json" }
import fs from "fs";

function getRandomDuration() {
    let totalSeconds = Math.floor(Math.random() * (420 - 180 + 1) + 180);

    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    let formattedSeconds = seconds.toString().padStart(2, '0');

    return `${minutes}:${formattedSeconds}`;
}

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
    const currentVideos = JSON.parse(fs.readFileSync("data/video_data.json"))
    if (!requestBody.title || !requestBody.description){
        return res.status(400).json({
            message: "invalid request body"
        })
    }
    const newVideo =
        {
            id: crypto.randomUUID(),
            title: requestBody.title,
            channel: "Super Zeka Yigit Ocak",
            image: "http://localhost:5050/kazanindibi.jpg",
            description: requestBody.description,
            views: 0,
            likes: 0,
            duration: getRandomDuration(),
            video: "http://localhost:5050/aykut.mp4",
            timestamp: Date.now(),
            comments: []
        }

        currentVideos.push(newVideo)
        fs.writeFileSync("data/video_data.json", JSON.stringify(currentVideos, null, 2));

        res.status(201).json(newVideo)
})

export default router