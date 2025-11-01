import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

// CORS 전체 허용 (가장 간단)
app.use(cors());

app.get('/ping', (req, res) => res.send('pong'));

// 프록시 엔드포인트: /proxy/saju?year=...&month=...
app.get('/proxy/saju', async (req, res) => {
try {
const base = 'https://my-manseryeok.onrender.com/saju';
const url = ${base}?${new URLSearchParams(req.query)};
const r = await fetch(url);
const text = await r.text();
res.set('Content-Type', r.headers.get('content-type') || 'application/json');
res.status(r.status).send(text);
} catch (e) {
res.status(500).json({ error: String(e?.message || e) });
}
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('proxy up on', PORT));
