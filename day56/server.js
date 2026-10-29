import express from "express";
import cors from "cors";
import { supabase } from "./supabase.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "영화 API 서버입니다." });
});

app.get("/api/movies", async (req, res) => {
  const keyword =
    typeof req.query.query === "string" ? req.query.query.trim() : "";

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

app.get("/api/movies", async (req, res) => {
  const keyword =
    typeof req.query.query === "string" ? req.query.query.trim() : "";

  // TODO 1: sort의 기본값을 지정하고 if / else if로 column과 ascending을 정하세요. 허용하지 않은 값은 400으로 응답합니다.
  const sort = req.query.sort === undefined ? "id_asc" : req.query.sort;

  let column;
  let ascending;

  if (sort === "id=asc") {
    column = "id";
    ascending = true;
  } else if (sort === "year_desc") {
    column = "releaseYear";
    ascending = false;
  } else if (sort === "year_asc") {
    column = "releaseYear";
    ascending = true;
  } else {
    res.status(400).json({
      message:
        "정렬 기준을 하나로 선택해서 요청하세요. (id=asc / year_desc / year_asc)",
    });
    return;
  }

  try {
    // TODO 2: 검색 조건과 선택한 정렬 기준을 지정하고, await로 data와 error를 받으세요.

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

  if (!Number.isSafeInteger(movieId) || movieId <= 0 || movieId > 2147483647) {
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

  if (
    !Number.isSafeInteger(releaseYear) ||
    releaseYear <= 0 ||
    releaseYear > 2147483647
  ) {
    res.status(400).json({
      message:
        "개봉 연도는 1 이상 2147483647 이하의 정수인 숫자로 보내 주세요.",
    });
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

app.delete("/api/movies/:id", async (req, res) => {
  const movieId = Number(req.params.id);

  if (!Number.isSafeInteger(movieId) || movieId <= 0 || movieId > 2147483647) {
    res.status(400).json({
      message: "영화 ID는 1 이상 2147483647 이하의 정수로 입력해 주세요.",
    });
    return;
  }

  try {
    const { data, error } = await supabase
      .from("movies")
      .delete()
      .eq("id", movieId)
      .select("id")
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (data === null) {
      res.status(404).json({ message: "삭제할 영화를 찾을 수 없습니다." });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("영화 삭제 처리 중 예외 발생:", error);
    res.status(500).json({ message: "영화를 삭제하지 못했습니다." });
  }
});

function validateMovie(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { message: "영화 정보를 JSON 객체로 보내 주세요." };
  }

  const allowedFields = ["title", "director", "releaseYear", "overview"];
  const fields = Object.keys(body);

  if (fields.length === 0) {
    return { message: "수정할 정보를 보내 주세요." };
  }

  const hasUnknownField = fields.some(
    (field) => !allowedFields.includes(field),
  );
  if (hasUnknownField) {
    return { message: "수정할 수 없는 속성이 포함되어 있습니다." };
  }

  const changes = {};

  if (Object.hasOwn(body, "title")) {
    const title = body.title;
    if (typeof title !== "string" || title.trim() === "") {
      return { message: "영화 제목을 입력해 주세요." };
    }
    if (title.trim().length > 50) {
      return { message: "영화 제목은 50자 이하로 입력해 주세요." };
    }
    changes.title = title.trim();
  }

  if (Object.hasOwn(body, "director")) {
    const director = body.director;
    if (typeof director !== "string" || director.trim() === "") {
      return { message: "감독을 입력해 주세요." };
    }
    changes.director = director.trim();
  }

  if (Object.hasOwn(body, "releaseYear")) {
    const releaseYear = body.releaseYear;
    if (
      !Number.isSafeInteger(releaseYear) ||
      releaseYear <= 0 ||
      releaseYear > 2147483647
    ) {
      return {
        message:
          "개봉 연도는 1 이상 2147483647 이하의 정수인 숫자로 보내 주세요.",
      };
    }
    changes.releaseYear = releaseYear;
  }

  if (Object.hasOwn(body, "overview")) {
    const overview = body.overview;
    if (typeof overview !== "string" || overview.trim() === "") {
      return { message: "줄거리를 입력해 주세요." };
    }
    changes.overview = overview.trim();
  }

  return { changes };
}

app.patch("/api/movies/:id", async (req, res) => {
  const movieId = Number(req.params.id);

  if (!Number.isSafeInteger(movieId) || movieId <= 0 || movieId > 2147483647) {
    res.status(400).json({
      message: "영화 ID는 1 이상 2147483647 이하의 정수로 입력해 주세요.",
    });
    return;
  }

  const result = validateMovie(req.body);
  if (result.message) {
    res.status(400).json({ message: result.message });
    return;
  }
  const changes = result.changes;

  try {
    // TODO 1: changes로 해당 ID의 영화를 수정하고, 수정한 영화 객체를 반환받으세요.

    if (error) {
      throw error;
    }

    // TODO 2: data가 null이면 404와 안내 메시지를 응답하고 return하세요.

    // TODO 3: 200과 수정된 영화 객체 data를 응답하세요.
  } catch (error) {
    console.error("영화 수정 처리 중 오류:", error);
    res.status(500).json({ message: "영화를 수정하지 못했습니다." });
  }
});

app.listen(4000, () => {
  console.log("서버 실행: http://localhost:4000");
});
