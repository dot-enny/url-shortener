import app from './app.js';
import { initDb } from './db.js';
import { initRedis } from './redis.js';

const PORT = Number(process.env.PORT ?? 3000);

const startServer = async () => {
    try {
        await initDb()
        await initRedis()

        app.listen(PORT, () => {
            console.log(`Server listening on http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error('Failed to initialize server:', error);
        process.exit(1);
    }
}

startServer();