import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

// GitHub Pages 도메인만 허용(필요시 배열에 도메인 추가)
const allowedOrigins = ['https://easysajusaju-dev.github.io'];
app.use(cors({ origin: allowedOrigins }));

app.get('/ping', (req, res) => res.send('pong'));

// 프록시 엔드포인트: /proxy/saju?year=...&month=... 등
app.get('/proxy/saju', async (req, res) => {
try {
const target = 'https://my-manseryeok.onrender.com/saju?' + new URLSearchParams(req.query);
const r = await fetch(target);
const text = await r.text(); // 그대로 전달
res.set('Content-Type', r.headers.get('content-type') || 'application/json');
res.status(r.status).send(text);
} catch (e) {
res.status(500).json({ error: String(e?.message || e) });
}
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('proxy up on', PORT));
