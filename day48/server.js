import express from "express";

const app = express();

const notices = [
  { id: 1, title: "서비스 이용 안내" },
  { id: 2, title: "이번 주 업데이트" },
  { id: 3, title: "고객 문의 안내" },
];

app.get("/", (req, res) => {
  res.json({ message: "공지 API 서버입니다." });
});

// TODO 1: /api/notices의 GET 요청에 notices 배열을 응답합니다.
app.get("/api/notices", (req, res) => {
  res.json(notices);
});

// TODO 2: /api/notice-count의 GET 요청에 공지 개수가 담긴 객체를 응답합니다.
app.get("/api/notice-count", (req, res) => {
  res.json({ noticeCount: notices.length });
});

app.listen(4000, () => {
  console.log("서버 실행: http://localhost:4000");
});
