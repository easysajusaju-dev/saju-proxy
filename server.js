import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; // package.json에 type:module 되어 있어야 합니다.

const app = express();
const UPSTREAM = 'https://my-manseryeok.onrender.com';

app.use(cors()); // 전부 허용(간단)

app.get('/ping', (req, res) => res.send('pong'));

// /proxy/로 시작하는 모든 경로를 upstream으로 전달
app.get('/proxy/*', async (req, res) => {
try {
const path = req.path.replace('/proxy', ''); // 예: /saju/full
const qs = req.url.includes('?') ? '?' + req.url.split('?')[1] : '';
const url = ${UPSTREAM}${path}${qs}; // ← 백틱(`) 필수

const r = await fetch(url, { headers: { 'accept': 'application/json' } });
const text = await r.text();

res.status(r.status);
res.set('content-type', r.headers.get('content-type') || 'application/json; charset=utf-8');
res.send(text);
} catch (e) {
res.status(500).json({ error: String(e?.message || e) });
}
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('proxy up on', PORT));
}
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('proxy up on', PORT));
