const axios = require("axios");
require('dotenv').config();
const API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";
const API_KEY = process.env.HUGGINGFACE_API_KEY;

async function chatWithAI(message) {
    try {
        const response = await axios.post(
            API_URL,
            { inputs: message },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
                timeout: 10000,
            }
        );

        console.log("Phản hồi từ API:", response.data);

        // Đảm bảo response có dữ liệu và lấy đúng đoạn text
        if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].generated_text) {
            return response.data[0].generated_text.trim();
        } else {
            return "AI không có phản hồi.";
        }
    } catch (error) {
        console.error("Lỗi API:", error.response?.data || error.message);
        return "AI không có phản hồi.";
    }
}

module.exports = { chatWithAI };