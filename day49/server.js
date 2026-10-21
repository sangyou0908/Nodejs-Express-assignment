import express from "express";

const app = express();

const notices = [
  {
    id: 1,
    title: "수업 일정 안내",
    content: "이번 주 수업은 오전 10시에 시작합니다.",
  },
  {
    id: 2,
    title: "과제 제출 안내",
    content: "과제는 다음 수업 시작 전까지 제출해 주세요.",
  },
  {
    id: 3,
    title: "시스템 점검",
    content: "토요일 오전에는 학습 사이트를 점검합니다.",
  },
];

app.get("/", (req, res) => {
  res.json({ message: "공지 API 서버입니다." });
});

app.get("/api/notices", (req, res) => {
  const keyword =
    typeof req.query.query === "string" ? req.query.query.trim() : "";

  // TODO 1: filter()로 제목에 keyword가 포함된 공지만 선택합니다.
  const filteredNotices = notices.filter((notice) =>
    notice.title.includes(keyword),
  );

  // TODO 2: 선택한 공지를 map()으로 id와 title만 가진 객체의 배열로 만듭니다.
  const result = filteredNotices.map((notice) => ({
    id: notice.id,
    title: notice.title,
  }));

  // TODO 3: 아래 응답을 수정하여 가공한 목록을 응답합니다.
  res.json(result);
});

app.get("/api/notice-count", (req, res) => {
  res.json({ noticeCount: notices.length });
});

app.get("/api/notices/:id", (req, res) => {
  const noticeId = Number(req.params.id);

  if (!Number.isSafeInteger(noticeId) || noticeId <= 0) {
    res.status(400).json({ message: "공지 ID는 양의 정수로 입력해 주세요." });
    return;
  }

  // TODO 4: find()로 noticeId와 ID가 같은 공지를 찾습니다.
  const notice = notices.find((notice) => notice.id === noticeId);

  // TODO 5: 공지가 없으면 404와 안내 메시지를 응답하고 함수를 종료합니다.
  if (!notice) {
    res.status(404).json({ message: "공지를 찾을 수 없습니다." });
    return;
  }

  // TODO 6: 공지가 있으면 해당 객체를 응답합니다.
  res.json(notice);
});

app.listen(4000, () => {
  console.log("서버 실행: http://localhost:4000");
});
