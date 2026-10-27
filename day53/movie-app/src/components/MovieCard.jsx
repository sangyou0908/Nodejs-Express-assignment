function MovieCard({ movie }) {
  return (
    // TODO 2: 카드의 배경·테두리·모서리·안쪽 여백을 지정하세요.
    <article className="bg-white border border-slate-200 rounded-xl p-6">
      {/* TODO 3: 제목과 개봉 연도를 가로로 배치하세요. */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="min-w-0 wrap-anywhere text-xl font-bold tracking-tight">
          {movie.title}
        </h3>
        {/* TODO 4: 개봉 연도의 배경·모서리·여백·글자 스타일을 지정하세요. */}
        <span className="shrink-0 rounded bg-slate-100 px-2 py-1 text-sm text-slate-600 ">
          {movie.releaseYear}
        </span>
      </div>
      <p className="wrap-anywhere mt-2 text-sm text-slate-500">
        감독 · {movie.director}
      </p>
      {/* TODO 5: 줄거리 위쪽 구분선·여백과 글자 스타일을 지정하세요. */}
      <p className="wrap-anywhere mt-4 border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-700">
        {movie.overview}
      </p>
    </article>
  );
}

export default MovieCard;
