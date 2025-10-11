const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../src/middleware/auth')

router.get("/api", authenticateToken, async (req, res) => {
    const key = process.env.API_LINK || "https://jsonplaceholder.typicode.com/todos?_limit=20"

    try {
        const response = await fetch(key)
        const jsonData = await response.json()
        return res.status(200).json({status: "success", data: jsonData})
    } catch (error) {
        return res.status(400).json({status: "error", message: `Error fetching data: ${error}`})
    }  
})

module.exports = router 