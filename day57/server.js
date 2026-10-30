import express from "express";
import cors from "cors";
// TODO 1: ./routes/movies.js에서 moviesRouter를 가져옵니다.
import moviesRouter from "./routes/movies.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "영화 API 서버입니다." });
});

// TODO 2: /api/movies 경로에 moviesRouter를 등록합니다.
app.use("/api/movies", moviesRoute);

// TODO 3: 앞에서 응답하지 않은 요청에 404와 JSON 안내 메시지를 응답합니다.
app.use((req, res) => {
  res.status(404).json({
    message: "요청한 API를 찾을 수 없습니다.",
  });
});

app.listen(4000, () => {
  console.log("서버 실행: http://localhost:4000");
});
