import express from 'express';
import cors from 'cors';

const app = express();
const UPSTREAM = 'https://my-manseryeok.onrender.com';

app.use(cors());

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.use('/proxy', async (req, res) => {
  try {
    const sub = req.originalUrl.slice('/proxy'.length);
    const url = UPSTREAM + sub;

    const r = await fetch(url, { headers: { accept: 'application/json' } });
    const body = await r.text();
    const ct = r.headers.get('content-type') || 'application/json; charset=utf-8';

    res.status(r.status).set('content-type', ct).send(body);
  } catch (e) {
    const msg = e && e.message ? e.message : String(e);
    res.status(500).json({ error: msg });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log('proxy up on', PORT);
});
