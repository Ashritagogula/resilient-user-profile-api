const express = require("express");

const router = express.Router();

const { validateUser, validateUpdateUser } = require("../middleware/validateRequest");

const {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
  getEnrichedUser
} = require("../controllers/userController");

router.post("/", validateUser, createUser);
router.get("/", getAllUsers);
router.get("/:id/enriched", getEnrichedUser);
router.get("/:id", getUserById);
router.put("/:id", validateUpdateUser, updateUser);
router.delete("/:id", deleteUser);

module.exports = router;