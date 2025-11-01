import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

// CORS 전체 허용(가장 단순). 필요시 도메인 제한으로 바꿔드릴 수 있어요.
app.use(cors());

app.get('/ping', (req, res) => res.send('pong'));

app.get('/proxy/saju', async (req, res) => {
try {
const base = 'https://my-manseryeok.onrender.com/saju';
const qs = new URLSearchParams(req.query).toString(); // year=...&month=...
const url = base + '?' + qs;

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
