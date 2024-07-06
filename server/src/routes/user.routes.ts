import express from "express";
import protectRoute from "../middleware/protectRoute";
import { getUsersForSidebar } from '../controllers/user.controller';

const router = express.Router();

router.get("/", protectRoute, (req, res) => {
    getUsersForSidebar(req, res)
});

export default router;
