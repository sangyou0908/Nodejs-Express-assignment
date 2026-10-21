import express from "express";

const app = express();

app.use(express.json());
const movies = [
  {
    id: 101,
    title: "인셉션",
    director: "크리스토퍼 놀란",
    releaseYear: 2010,
    overview: "다른 사람의 꿈에 들어가 생각을 심는 작전을 다룬 영화입니다.",
    runtimeMinutes: 148,
  },
  {
    id: 102,
    title: "인터스텔라",
    director: "크리스토퍼 놀란",
    releaseYear: 2014,
    overview:
      "인류가 살아갈 새로운 터전을 찾기 위해 우주로 떠나는 이야기입니다.",
    runtimeMinutes: 169,
  },
  {
    id: 103,
    title: "다크 나이트",
    director: "크리스토퍼 놀란",
    releaseYear: 2008,
    overview:
      "고담시를 지키는 배트맨과 도시를 혼란에 빠뜨리는 조커의 대결을 다룹니다.",
    runtimeMinutes: 152,
  },
  {
    id: 104,
    title: "테넷",
    director: "크리스토퍼 놀란",
    releaseYear: 2020,
    overview:
      "시간의 방향이 뒤집히는 현상을 이용해 위기를 막으려는 이야기입니다.",
    runtimeMinutes: 150,
  },
  {
    id: 105,
    title: "어벤져스",
    director: "조스 웨던",
    releaseYear: 2012,
    overview:
      "서로 다른 능력을 가진 영웅들이 힘을 합쳐 지구를 지키는 이야기입니다.",
    runtimeMinutes: 143,
  },
  {
    id: 106,
    title: "어벤져스: 엔드게임",
    director: "앤서니 루소, 조 루소",
    releaseYear: 2019,
    overview:
      "남은 영웅들이 잃어버린 사람들을 되찾기 위해 다시 모이는 이야기입니다.",
    runtimeMinutes: 181,
  },
];

let nextMovieId = 107;

app.get("/", (req, res) => {
  res.json({ message: "영화 API 서버입니다." });
});

app.get("/api/movies", (req, res) => {
  const keyword =
    typeof req.query.query === "string" ? req.query.query.trim() : "";

  const filteredMovies = movies.filter((movie) => {
    return movie.title.includes(keyword);
  });

  const movieList = filteredMovies.map((movie) => {
    return {
      id: movie.id,
      title: movie.title,
    };
  });

  res.json(movieList);
});

app.get("/api/movies/:id", (req, res) => {
  const movieId = Number(req.params.id);

  if (!Number.isSafeInteger(movieId) || movieId <= 0) {
    res.status(400).json({ message: "영화 ID는 양의 정수로 입력해 주세요." });
    return;
  }

  const movie = movies.find((item) => {
    return item.id === movieId;
  });

  if (!movie) {
    res.status(404).json({ message: "영화를 찾을 수 없습니다." });
    return;
  }

  res.json(movie);
});

app.post("/api/movies", (req, res) => {
  const body = req.body;

  if (!body || Array.isArray(body)) {
    res.status(400).json({ message: "영화 정보를 JSON 객체로 보내 주세요." });
    return;
  }

  const title = body.title;
  const director = body.director;
  const releaseYear = body.releaseYear;
  const overview = body.overview;

  // TODO 1: body에서 runtimeMinutes를 읽어 변수에 저장하세요.

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
    res
      .status(400)
      .json({ message: "개봉 연도는 양의 정수인 숫자로 지정해주세요." });
    return;
  }

  if (typeof overview !== "string" || overview.trim() === "") {
    res.status(400).json({ message: "줄거리를 입력해 주세요." });
    return;
  }

  // TODO 2: runtimeMinutes가 1 이상 300 이하의 정수인지 검사하세요.
  // 조건에 맞지 않으면 400과 안내 메시지를 응답하고 return하세요.

  const newMovie = {
    id: nextMovieId,
    title: title.trim(),
    director: director.trim(),
    releaseYear: releaseYear,
    overview: overview.trim(),
    // TODO 3: 검사한 runtimeMinutes를 새 영화 객체에 포함하세요.
  };

  movies.push(newMovie);
  nextMovieId += 1;

  res.status(201).json(newMovie);
});

app.listen(4000, () => {
  console.log("서버 실행: http://localhost:4000");
});
