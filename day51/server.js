import express from "express";
import { supabase } from "./supabase.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "영화 API 서버입니다." });
});

app.get("/api/movies", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("movies")
      .select("id, title, director, releaseYear, overview")
      .order("id", { ascending: true });

    // 오류 정보가 있으면 catch로 전달합니다.
    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("영화 목록 처리 중 예외 발생:", error);
    res.status(500).json({ message: "영화 목록을 불러오지 못했습니다." });
  }
});

// 영화 안내 목록 API: 아래 TODO 1~4를 완성하세요.
app.get("/api/movie-catalog", async (req, res) => {
  try {
    // TODO 1: movies에서 title, releaseYear만 조회하세요.
    // 수업과 같이 ID 오름차순으로 정렬하고, data와 error를 가져오세요.
    const { data, error } = await supabase
      .from("movies")
      .select("title, releaseYear")
      .order("id", { ascending: true });

    // TODO 2: error가 있으면 throw error로 catch에 전달하세요.

    // TODO 3: 상태 코드 200과 data를 응답하세요.
  } catch (error) {
    console.error("영화 안내 목록 조회 실패:", error);
    // TODO 4: 상태 코드 500과 지정된 안내 메시지를 응답하세요.
  }
});

app.listen(4000, () => {
  console.log("서버 실행: http://localhost:4000");
});
