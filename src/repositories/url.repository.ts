import { pool } from '../db.js';

export const createUrl = async (originalUrl: string, shortCode: string) => {
    const result = await pool.query(
        `
            INSERT INTO urls (original_url, short_code)
            VALUES($1, $2)
            RETURNING *
        `,
        [originalUrl, shortCode]
    )
    return result.rows[0];
};

export const findUrlByCode = async (shortCode: string) => {
    const result = await pool.query(
        'SELECT original_url FROM urls WHERE short_code = $1',
        [shortCode]
    )
    return result.rows[0] ?? null;
};

export const updateUrlByCode = async (shortCode: string, newUrl: string) => {
    const result = await pool.query(
        `
            UPDATE urls
            SET original_url = $1
            WHERE short_code = $2
            RETURNING *
        `,
        [newUrl, shortCode]
    )
    return result.rows[0] ?? null;
}

export const findStatsByCode = async (shortCode: string) => {
    const result = await pool.query(`
        SELECT id, original_url, short_code, clicks, created_at
        FROM urls
        WHERE short_code = $1
        `,
        [shortCode]
    )
    return result.rows[0] ?? null;
};

export const incrementClicks = async (shortCode: string) => {
    await pool.query(
        'UPDATE urls SET clicks = clicks + 1 WHERE short_code = $1',
        [shortCode]
    )
};

export const deleteUrlByCode = async (shortCode: string) => {
    const result = await pool.query(
        `
            DELETE FROM urls
            WHERE short_code = $1
            RETURNING short_code, original_url
        `,
        [shortCode]
    );

    return result.rows[0] ?? null;
}
