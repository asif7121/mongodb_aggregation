

import { Router } from "express";
import { getPropertyType, searchProperty } from "../controllers/airbnb.controller.js";

const router = Router()

router.get( '/property-type-list', getPropertyType )
router.get( '/search-property', searchProperty )



export default router