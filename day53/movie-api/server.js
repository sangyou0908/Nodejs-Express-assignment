import express from "express";
import cors from "cors";
import { supabase } from "./supabase.js";

const app = express();

// TODO 1: React 앱의 출처를 허용하는 CORS Middleware를 등록하세요.

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "영화 API 서버입니다." });
});

app.get("/api/movies", async (req, res) => {
  const keyword =
    typeof req.query.query === "string"
      ? req.query.query.trim()
      : "";

  try {
    const { data, error } = await supabase
      .from("movies")
      .select("id, title, director, releaseYear, overview")
      .ilike("title", `%${keyword}%`)
      .order("id", { ascending: true });

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("영화 목록 처리 중 예외 발생:", error);
    res.status(500).json({ message: "영화 목록을 불러오지 못했습니다." });
  }
});

app.get("/api/movies/:id", async (req, res) => {
  const movieId = Number(req.params.id);

  if (
    !Number.isSafeInteger(movieId) ||
    movieId <= 0 ||
    movieId > 2147483647
  ) {
    res.status(400).json({
      message: "영화 ID는 1 이상 2147483647 이하의 정수로 입력해 주세요.",
    });
    return;
  }

  try {
    const { data, error } = await supabase
      .from("movies")
      .select("id, title, director, releaseYear, overview")
      .eq("id", movieId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (data === null) {
      res.status(404).json({ message: "영화를 찾을 수 없습니다." });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("영화 상세 처리 중 예외 발생:", error);
    res.status(500).json({ message: "영화 정보를 불러오지 못했습니다." });
  }
});

app.post("/api/movies", async (req, res) => {
  const body = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    res.status(400).json({ message: "영화 정보를 JSON 객체로 보내 주세요." });
    return;
  }

  const title = body.title;
  const director = body.director;
  const releaseYear = body.releaseYear;
  const overview = body.overview;

  if (typeof title !== "string" || title.trim() === "") {
    res.status(400).json({ message: "영화 제목을 입력해 주세요." });
    return;
  }

  if (title.trim().length > 50) {
    res.status(400).json({ message: "영화 제목은 50자 이하로 입력해 주세요." });
    return;
  }

  if (typeof director !== "string" || director.trim() === "") {
    res.status(400).json({ message: "감독을 입력해 주세요." });
    return;
  }

  if (!Number.isSafeInteger(releaseYear) || releaseYear <= 0) {
    res.status(400).json({ message: "개봉 연도는 양의 정수인 숫자로 보내 주세요." });
    return;
  }

  if (typeof overview !== "string" || overview.trim() === "") {
    res.status(400).json({ message: "줄거리를 입력해 주세요." });
    return;
  }

  const newMovie = {
    title: title.trim(),
    director: director.trim(),
    releaseYear: releaseYear,
    overview: overview.trim(),
  };

  try {
    const { data, error } = await supabase
      .from("movies")
      .insert(newMovie)
      .select("id, title, director, releaseYear, overview")
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json(data);
  } catch (error) {
    console.error("영화 추가 처리 중 예외 발생:", error);
    res.status(500).json({ message: "영화를 추가하지 못했습니다." });
  }
});

app.listen(4000, () => {
  console.log("서버 실행: http://localhost:4000");
});
