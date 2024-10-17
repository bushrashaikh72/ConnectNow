const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup
} = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


const notificationRouter = express.Router();

notificationRouter.post('/send', async (req, res) => {
    const { userId, message } = req.body;

    try {
        const result = await sendNotification(userId, message);
        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to send notification' });
    }
});

module.exports = notificationRouter;

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);

module.exports = router;