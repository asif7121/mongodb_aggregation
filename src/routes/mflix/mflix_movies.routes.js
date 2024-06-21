import { Router } from "express";
import { filterMoviesByYear } from "../../controllers/mflix/mflix_movies.controller.js";



const router = Router()


router.get( '/movies', filterMoviesByYear )


export default router;