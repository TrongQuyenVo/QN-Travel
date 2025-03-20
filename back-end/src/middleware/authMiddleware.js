const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ error: "Không có token, quyền truy cập bị từ chối" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.userId) {
            return res.status(401).json({ error: "Token không hợp lệ" });
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "Người dùng không tồn tại" });
        }

        req.user = { id: user._id, role: user.role };
        next();
    } catch (error) {
        res.status(401).json({ error: "Token không hợp lệ" });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user?.role === "admin") {
        next();
    } else {
        res.status(403).json({ error: "Quyền truy cập bị từ chối, chỉ admin mới có quyền" });
    }
};

module.exports = { authMiddleware, adminMiddleware };
