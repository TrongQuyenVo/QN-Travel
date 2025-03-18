const Chat = require('../models/Chat');
const { chatWithAI } = require("../services/huggingfaceService");

exports.sendMessage = async (req, res) => {
    try {
        const { userID, message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Tin nhắn không được để trống!" });
        }

        if (!userID) {
            return res.status(400).json({ error: "Thiếu thông tin người dùng!" });
        }

        console.log(`Đã nhận tin nhắn từ người dùng ${userID}: ${message}`);

        // Gọi service AI để lấy phản hồi
        const aiResponse = await chatWithAI(message);
        console.log(`Phản hồi từ AI: ${aiResponse}`);

        // Kiểm tra nếu phản hồi là thông báo lỗi
        if (aiResponse.startsWith("Lỗi") || aiResponse.startsWith("Xin lỗi") ||
            aiResponse.startsWith("Dịch vụ AI") || aiResponse.startsWith("Có lỗi")) {
            // Vẫn lưu vào DB nhưng đánh dấu là lỗi
            console.log("Phát hiện lỗi trong phản hồi AI");
        }

        // Lưu cuộc trò chuyện vào cơ sở dữ liệu
        const chatEntry = new Chat({
            userID,
            message,
            response: aiResponse,
            timestamp: new Date()
        });

        await chatEntry.save();
        console.log("Đã lưu cuộc trò chuyện vào cơ sở dữ liệu");

        // Trả về phản hồi cho client
        res.json({ response: aiResponse });
    } catch (error) {
        console.error("Lỗi trong quá trình xử lý tin nhắn:", error);
        res.status(500).json({
            error: "Có lỗi xảy ra khi xử lý tin nhắn của bạn",
            details: error.message
        });
    }
};

// Lấy lịch sử trò chuyện giữa User và AI
exports.getChatHistory = async (req, res) => {
    try {
        const { userID } = req.query;

        if (!userID) {
            return res.status(400).json({ error: "Thiếu ID người dùng!" });
        }

        const chatHistory = await Chat.find({ userID }).sort({ timestamp: 1 });

        // Định dạng lại lịch sử trò chuyện để dễ sử dụng ở phía client
        const formattedHistory = [];
        chatHistory.forEach(chat => {
            formattedHistory.push({
                sender: 'user',
                content: chat.message,
                timestamp: chat.timestamp
            });
            formattedHistory.push({
                sender: 'ai',
                content: chat.response,
                timestamp: chat.timestamp
            });
        });

        res.json(formattedHistory);
    } catch (error) {
        console.error("Lỗi khi lấy lịch sử trò chuyện:", error);
        res.status(500).json({
            message: 'Lỗi server khi lấy lịch sử trò chuyện',
            error: error.message
        });
    }
};

// Thêm endpoint để xóa lịch sử trò chuyện
exports.clearChatHistory = async (req, res) => {
    try {
        const { userID } = req.query;

        if (!userID) {
            return res.status(400).json({ error: "Thiếu ID người dùng!" });
        }

        await Chat.deleteMany({ userID });

        res.json({ message: "Đã xóa lịch sử trò chuyện thành công" });
    } catch (error) {
        console.error("Lỗi khi xóa lịch sử trò chuyện:", error);
        res.status(500).json({
            message: 'Lỗi server khi xóa lịch sử trò chuyện',
            error: error.message
        });
    }
};