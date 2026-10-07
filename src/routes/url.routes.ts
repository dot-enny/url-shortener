import { Router } from "express";
import { createShortUrl, deleteShortUrl, redirectToOriginalUrl, retrieveOriginalUrl, showUrlStats, updateShortUrl } from "../controllers/url.controller.js";;

const router = Router();

router.post('/shorten', createShortUrl)
router.get('/shorten/:code', retrieveOriginalUrl)
router.patch('/shorten/:code', updateShortUrl)
router.delete('/shorten/:code', deleteShortUrl)
router.get('/shorten/:code/stats', showUrlStats)
router.get('/:code', redirectToOriginalUrl)

export default router