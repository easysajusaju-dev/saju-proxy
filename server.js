import express from 'express';
import cors from 'cors';

const app = express();

// 여기에 당신의 API 서버 주소를 넣으세요.
const UPSTREAM = 'https://my-manseryeok.onrender.com';

app.use(cors()); // 전체 허용(간단)

app.get('/ping', (req, res) => res.send('pong'));

// /proxy/로 시작하는 모든 경로를 그대로 API 서버로 전달
app.use('/proxy', async (req, res) => {
try {
// /proxy 뒤에 붙은 경로(+쿼리)를 통째로 가져와 upstream에 붙입니다.
const sub = req.originalUrl.replace(/^/proxy/, ''); // 예: /saju/compat?year=...
const url = ${UPSTREAM}${sub}; // ← 백틱(`) 필수

// Node 18+는 fetch가 내장되어 있습니다(별도 node-fetch 불필요)
const r = await fetch(url, { headers: { accept: 'application/json' } });
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
