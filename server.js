import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors()); // 전체 허용(간단)

const UPSTREAM = 'https://my-manseryeok.onrender.com';

// 살아있나 확인
app.get('/ping', (req, res) => res.send('pong'));

// /proxy/로 시작하는 모든 경로를 그대로 API 서버로 전달
app.get('/proxy/*', async (req, res) => {
try {
const path = req.path.replace('/proxy', ''); // 예: /saju/full
const qs = req.url.includes('?') ? req.url.split('?')[1] : '';
const url = ${UPSTREAM}${path}${qs ? '?' + qs : ''};
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
