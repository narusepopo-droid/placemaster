/* 상단 메뉴 로그인 상태 (모든 페이지 공통) — 로그인은 통합 계정 하나 (review.placemaster.co.kr/account)
   로그인돼 있으면: '로그인' → '마이페이지', '무료로 시작하기'·'다운로드'·'로그인/가입' → 마이페이지(내 상품·설치 파일),
   운영자면 '마스터 관리' 추가. 뒤로 가기로 돌아온 페이지(브라우저 캐시)도 다시 확인. */
(function () {
  var ACCOUNT = 'https://review.placemaster.co.kr/account';
  var orig = new WeakMap();   // 로그아웃 상태로 되돌릴 때 원래 글자·주소

  function links() {
    return document.querySelectorAll('header a, .header a, nav a, a.btn-hero, a.btn-cta, a.h-btn, a[href*="/account/signup"], a[href*="/account/login"], a[href="signup.html"]');
  }

  function apply(me) {
    var on = !!(me && me.logged_in);
    links().forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (!orig.has(a)) orig.set(a, { href: href, text: a.textContent });
      var o = orig.get(a);
      if (!on) { if (a.dataset.pmAuth) { a.setAttribute('href', o.href); a.textContent = o.text; delete a.dataset.pmAuth; } return; }
      var h = o.href;
      if (h.indexOf(ACCOUNT + '/login') === 0) {
        a.setAttribute('href', ACCOUNT + '/my'); a.textContent = '마이페이지'; a.dataset.pmAuth = '1';
      } else if (h.indexOf(ACCOUNT + '/signup') === 0 || h === 'signup.html') {
        a.setAttribute('href', ACCOUNT + '/my');
        a.textContent = /다운로드/.test(o.text) ? '↓ 마이페이지에서 다운로드' : '내 상품 · 다운로드';
        a.dataset.pmAuth = '1';
      }
    });
    // 첫 화면 '무료로 시작하기'(슬라이드에 따라 가입 주소가 바뀌는 버튼): 로그인 중이면 마이페이지로
    var sb = document.getElementById('startBtn');
    if (sb) {
      if (!orig.has(sb)) orig.set(sb, { href: sb.getAttribute('href'), text: sb.textContent });
      sb.textContent = on ? '내 상품 · 다운로드' : orig.get(sb).text;
      sb.dataset.pmMy = on ? '1' : '';
      if (!sb.dataset.pmHooked) {
        sb.dataset.pmHooked = '1';
        sb.addEventListener('click', function (e) {
          if (sb.dataset.pmMy) { e.preventDefault(); e.stopImmediatePropagation(); location.href = ACCOUNT + '/my'; }
        }, true);
      }
    }
    var hb = document.querySelector('.header-btns, header .inner, header .header-inner');
    var adm = document.getElementById('pm-admin-link');
    if (on && me.operator && hb && !adm) {
      adm = document.createElement('a');
      adm.id = 'pm-admin-link'; adm.href = 'https://review.placemaster.co.kr/account/master'; adm.textContent = '마스터 관리';
      adm.className = (document.querySelector('header .btn-outline, header .h-btn') || {}).className || 'btn';
      adm.style.marginRight = '8px';
      var first = hb.querySelector('a[href*="/account/"]');
      if (first) first.parentNode.insertBefore(adm, first); else hb.appendChild(adm);
    } else if (!on && adm) {
      adm.remove();
    }
    document.documentElement.classList.toggle('pm-logged-in', on);
  }

  function check() {
    fetch(ACCOUNT + '/api/v1/me', { credentials: 'include', cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(apply)
      .catch(function () {});
  }

  check();
  // 뒤로 가기·앞으로 가기로 돌아왔을 때(페이지가 캐시에서 다시 보일 때)도 로그인 상태 다시 확인
  window.addEventListener('pageshow', function (e) { if (e.persisted) check(); });
})();
