import express from "express";
import urlRoutes from './routes/url.routes.js'

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.use(urlRoutes);

export default app;

