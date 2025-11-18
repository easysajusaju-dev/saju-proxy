/**
 * saju-proxy 완성본
 * ------------------
 * 프론트 요청:   https://saju-proxy.onrender.com/proxy/saju?year=...
 * 프록시 변환:   /saju? → /saju/compat?
 * 최종 호출:     https://my-manseryeok.onrender.com/saju/compat?...
 */

import express from "express";
import cors from "cors";

const app = express();

// ⚡ 너의 만세력 서버 주소
const UPSTREAM = "https://my-manseryeok.onrender.com";

app.use(cors());

/* ===============================
   간단 ping (Render 헬스체크)
   =============================== */
app.get("/ping", (req, res) => {
  res.send("pong");
});

/* ===============================
   프록시 핵심
   =============================== */
app.use("/proxy", async (req, res) => {
  try {
    // /proxy 뒤 URL 경로만 추출
    let sub = req.originalUrl.slice("/proxy".length);

    // -------------------------------
    // 🚀 핵심!
    // /saju? → /saju/compat? 변환
    // -------------------------------
    if (sub.startsWith("/saju?")) {
      sub = sub.replace("/saju?", "/saju/compat?");
    }

    // 최종 호출 URL
    const url = UPSTREAM + sub;

    console.log("▶ Proxy →", url);

    // Upstream 서버 요청
    const upstreamRes = await fetch(url, {
      headers: { accept: "application/json" },
    });

    const body = await upstreamRes.text();
    const contentType =
      upstreamRes.headers.get("content-type") ||
      "application/json; charset=utf-8";

    res.status(upstreamRes.status).set("content-type", contentType).send(body);
  } catch (err) {
    console.error("❌ Proxy Error:", err);

    res.status(500).json({
      error: err?.message || String(err),
    });
  }
});

/* ===============================
   서버 시작
   =============================== */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("🚀 saju-proxy running on port", PORT);
});
