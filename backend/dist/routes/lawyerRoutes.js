"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LawyerController_1 = require("../controllers/LawyerController");
const router = (0, express_1.Router)();
router.get('/getCases', LawyerController_1.getUserReq);
exports.default = router;
