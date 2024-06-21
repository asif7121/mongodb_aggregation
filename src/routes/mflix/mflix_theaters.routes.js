import { Router } from "express";
import { searchThearterList } from "../../controllers/mflix/mflix_theater.controller.js";



const router = Router();


router.get( '/search-theaters', searchThearterList )


export default router;