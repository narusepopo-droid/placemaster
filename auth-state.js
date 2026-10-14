/* 상단 메뉴 로그인 상태 — 통합 계정(review.placemaster.co.kr/account)에 로그인돼 있으면
   '로그인' → '마이페이지', '무료로 시작하기'·'로그인/가입' → 마이페이지 로 바꿈 (모든 페이지 공통) */
(function () {
  var ACCOUNT = 'https://review.placemaster.co.kr/account';
  fetch(ACCOUNT + '/api/v1/me', { credentials: 'include', cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (me) {
      if (!me || !me.logged_in) return;
      document.querySelectorAll('header a, .header a, nav a').forEach(function (a) {
        var href = a.getAttribute('href') || '';
        if (a.id === 'auth-btn' && a.textContent.trim() === '로그아웃') return;   // 플마 페이지 예전 로그인(그대로 둠)
        if (href.indexOf(ACCOUNT + '/login') === 0) {
          a.href = ACCOUNT + '/my';
          a.textContent = '마이페이지';
        } else if (href.indexOf(ACCOUNT + '/signup') === 0) {
          a.href = ACCOUNT + '/my';
          a.textContent = '내 상품 · 다운로드';
        }
      });
      document.documentElement.classList.add('pm-logged-in');
    })
    .catch(function () {});
})();
