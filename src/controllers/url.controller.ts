import type { Request, Response } from "express"
import { getUrlStats, resolveUrl, shortenUrl, updateShortUrl as updateShortUrlService, retrieveOriginalUrl as retrieveOriginalUrlService, deleteShortUrl as deleteShortUrlService } from "../services/url.service.js";


export const createShortUrl = async (req: Request, res: Response) => {
    const { url } = req.body;

    if (!url || typeof url !== 'string') return res.status(400).json({ error: 'A valid URL is required' });

    try {
        new URL(url);
    } catch {
        return res.status(400).json({ error: 'Malformed URL provided' })
    }

    const record = await shortenUrl(url);

    return res.status(201).json({
        short_code: record.short_code,
        short_url: `http://localhost:3000/${record.short_code}`,
        original_url: record.original_url,
    })
}


export const redirectToOriginalUrl = async (req: Request, res: Response) => {
    const url = await resolveUrl(req.params.code as string);

    if(!url) {
        return res.status(400).json({
            error: 'Short URL not found.',
        });
    }

    return res.redirect(302, url);
}

export const updateShortUrl = async (req: Request, res: Response) => {
    const { code } = req.params;
    const { url } = req.body;

    if (!url || typeof code !== 'string' || typeof url !== 'string') {
        return res.status(400).json({
            error: 'A valid short code and URL are required'
        });
    }

    try {
        new URL(url);
    } catch {
        return res.status(400).json({
            error: 'Malformed URL provided'
        });
    }

    const record = await updateShortUrlService(code, url)

    if (!record) {
        return res.status(404).json({
            error: 'Short code not found',
        });
    }

    return res.json({
        short_code: record.short_code,
        original_url: record.original_url
    });
}

export const retrieveOriginalUrl = async (req: Request, res: Response) => {
    const { code } = req.params

    if (typeof code !== 'string') {
        return res.status(400).json({
            error: 'A valid short code is required',
        });
    }

    const originalUrl = await retrieveOriginalUrlService(code);

    if (!originalUrl) {
        return res.status(404).json({
            error: 'Short code not found',
        })
    }

    return res.json({
        short_code: code,
        original_url: originalUrl
    })
}

export const showUrlStats = async (req: Request, res: Response) => {
    const stats = await getUrlStats(req.params.code as string);

    if(!stats) return res.status(404).json({ error: 'Short code not found' });

    return res.json(stats);
}

export const deleteShortUrl = async (req: Request, res: Response) => {
    const { code } = req.params
    if (typeof code !== 'string') {
        return res.status(400).json({
            error: 'A valid short code is required'
        })
    }
    const record = await deleteShortUrlService(code);

    if (!record) {
        return res.status(404).json({
            error: 'Short code not found'
        })
    }

    return res.status(204).send();
}