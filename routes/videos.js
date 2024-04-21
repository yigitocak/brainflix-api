import express from "express"
const router = express.Router()
import videoData from "../data/video_data.json" assert { type: "json" }
import fs from "fs"
import { fileURLToPath } from 'url'
import path from 'path'

const dataFilePath = path.join(fileURLToPath(import.meta.url), '../../data/video_data.json')

router.use(express.json())

function getRandomDuration() {
    let totalSeconds = Math.floor(Math.random() * (420 - 180 + 1) + 180);

    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    let formattedSeconds = seconds.toString().padStart(2, '0');

    return `${minutes}:${formattedSeconds}`
}

router.get('/', async (req, res) => {
    try {
        const currentVideos = JSON.parse(fs.readFileSync(dataFilePath));
        const filteredVideoData = currentVideos.map(video => ({
            id: video.id,
            title: video.title,
            channel: video.channel,
            image: video.image
        }));
        res.status(200).json(filteredVideoData);
    } catch (error) {
        res.status(500).json({ message: "Failed to load video data" })
    }
});

router.get('/:id', async (req, res) => {
    try {
        const currentVideos = JSON.parse(fs.readFileSync(dataFilePath))
        const videoId = req.params.id
        const video = currentVideos.find(video => video.id === videoId)
        res.status(200).json(video)
    } catch (error) {
        res.status(500).json({ message: "Failed to load video data" })
    }
})

router.post('/', async (req, res) => {
    try {
        const requestBody = req.body
        const currentVideos = JSON.parse(fs.readFileSync(dataFilePath))

        if (!requestBody.title || !requestBody.description) {
            return res.status(400).json({
                message: "Invalid request body"
            })
        }

        const newVideo = {
            id: crypto.randomUUID(),
            title: requestBody.title,
            channel: "Yigit Ocak",
            image: "http://localhost:5050/images/kazanindibi.jpg",
            description: requestBody.description,
            views: 0,
            likes: 0,
            duration: getRandomDuration(),
            video: "http://localhost:5050/aykut.mp4",
            timestamp: Date.now(),
            comments: []
        };

        currentVideos.push(newVideo);
        fs.writeFileSync(dataFilePath, JSON.stringify(currentVideos, null, 2))

        const updatedVideos = JSON.parse(fs.readFileSync(dataFilePath))
        res.status(201).json(updatedVideos)
    } catch (error) {
        res.status(500).json({ message: "Failed to process request", error })
    }
})

router.post("/:id/comments", async (req, res) => {
    try {
        const currentVideos = JSON.parse(fs.readFileSync(dataFilePath))
        const videoId = req.params.id
        const video = currentVideos.find(video => video.id === videoId)

        if (!video) {
            return res.status(404).json({ message: "Video not found" })
        }

        const reqBody = req.body

        if (!reqBody.comment) {
            return res.status(400).json({ message: "Invalid request: Comment is required" })
        }

        const newComment = {
            name: "Yigit Ocak",
            comment: reqBody.comment,
            id: crypto.randomUUID(),
            timestamp: Date.now()
        };

        video.comments.push(newComment);
        video.comments.sort((a, b) => b.timestamp - a.timestamp)

        fs.writeFileSync(dataFilePath, JSON.stringify(currentVideos , null, 2))

        res.status(200).json(newComment)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to load video data" })
    }
})

router.delete("/:id/comments/:commentId", (req, res) => {
    try {
        const currentVideos = JSON.parse(fs.readFileSync(dataFilePath))

        const videoId = req.params.id
        const video = currentVideos.find(video => video.id === videoId)

        if (!video) {
            return res.status(404).json({ message: "Video not found" })
        }

        const commentId = req.params.commentId
        const initialCommentCount = video.comments.length
        video.comments = video.comments.filter(comment => comment.id !== commentId)

        if (initialCommentCount === video.comments.length) {
            return res.status(404).json({ message: "Comment not found" })
        }

        fs.writeFileSync(dataFilePath, JSON.stringify(currentVideos, null, 2))

        res.status(200).json({ message: "Comment deleted", commentId: commentId })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to load video data" })
    }
})

export default router