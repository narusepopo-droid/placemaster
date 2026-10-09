/* 플마·영수증리뷰 공통: 함께 쓰기 + 요금제 (가격은 계정 서버에서, 유료화 전에는 '무료' 표시) */
(function () {
  var ACCOUNT = 'https://review.placemaster.co.kr/account';
  var PLMA_SIGNUP = 'signup.html';
  var el = document.getElementById('pm-together');
  if (!el) return;
  var here = el.getAttribute('data-product');   // plma | receipt_review

  var OTHER = {
    receipt_review: {
      cls: 'rr', ico: '🧾', name: '영수증리뷰', sub: 'QR 한 번이면 네이버 영수증 리뷰 끝',
      points: ['결제 영수증이 손님 폰에 바로 저장돼요', '리뷰 문구가 자동 복사 — 손님은 붙여넣기만', '참여 손님 번호가 고객 DB로 차곡차곡'],
      href: 'receipt-review.html'
    },
    plma: {
      cls: 'plma', ico: '📊', name: '플레이스 마스터 PRO', sub: '우리 매장 네이버 플레이스 순위, 매일 자동으로',
      points: ['키워드 100개 순위를 한 번에 확인', '어제보다 오른·내린 순위를 자동 비교', '광고대행사들도 쓰는 검증된 순위 분석'],
      href: 'plma.html'
    }
  };
  var other = OTHER[here === 'plma' ? 'receipt_review' : 'plma'];
  var title = here === 'plma'
    ? '순위를 확인했다면,<br>이제 리뷰로 올릴 차례예요'
    : '리뷰를 늘렸다면,<br>순위가 오르는지 확인하세요';

  function won(n) { return Number(n).toLocaleString('ko-KR') + '원'; }
  function r100(n) { return Math.round(n / 100) * 100; }

  el.innerHTML =
    '<section class="tg" id="together"><div class="tg-inner">' +
      '<span class="tg-eyebrow">함께 쓰면 더 좋아요</span>' +
      '<h2>' + title + '</h2>' +
      '<p class="tg-lead">네이버 플레이스 순위에는 리뷰가 큰 영향을 줘요. 영수증리뷰로 리뷰를 늘리고, 플레이스 마스터로 순위가 오르는지 매일 확인하세요.</p>' +
      '<div class="tg-grid">' +
        '<div class="tg-card tg-other ' + other.cls + '"><div class="ico">' + other.ico + '</div>' +
          '<h3>' + other.name + '</h3><p class="sub">' + other.sub + '</p>' +
          '<ul>' + other.points.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ul>' +
          '<a class="more" href="' + other.href + '">' + other.name + ' 자세히 보기 →</a></div>' +
        '<div class="tg-card tg-loop"><h3>이렇게 함께 써요</h3><div class="flow">' +
          '<div class="step rr"><span class="n">1</span><p><b>영수증리뷰로 리뷰 받기</b><span>손님이 QR 찍고 붙여넣기만 하면 리뷰 등록</span></p></div>' +
          '<div class="arrow">▼</div>' +
          '<div class="step"><span class="n">2</span><p><b>리뷰가 쌓이면 순위에 반영</b><span>리뷰 수·최신 리뷰는 플레이스 노출에 영향을 줘요</span></p></div>' +
          '<div class="arrow">▼</div>' +
          '<div class="step"><span class="n">3</span><p><b>플레이스 마스터로 효과 확인</b><span>어떤 키워드가 올랐는지 매일 자동으로 비교</span></p></div>' +
        '</div><p class="note">하나의 계정으로 두 프로그램을 함께 관리할 수 있어요.</p></div>' +
      '</div>' +
    '</div></section>' +
    '<section class="pr" id="pricing"><div class="pr-inner">' +
      '<h2>요금제</h2><p class="pr-lead" id="prLead">지금은 무료로 이용할 수 있어요</p>' +
      '<div id="prToggle"></div><div class="pr-cards" id="prCards"></div>' +
      '<p class="pr-note">플레이스 마스터 PRO는 계정당 PC 1대, 영수증리뷰는 매장 1곳(포스 PC 1대) 기준이에요.<br>매장이 더 있으면 영수증리뷰는 매장마다 추가돼요.</p>' +
    '</div></section>';

  var CARDS = [
    { code: 'plma', who: '순위를 직접 확인하고 싶다면', name: '플레이스 마스터 PRO',
      desc: '네이버 플레이스·블로그 순위 자동 분석', feats: ['키워드 100개 동시 분석', '순위 변화 자동 비교', '카톡 보고서 자동 정리'] },
    { code: 'receipt_review', who: '리뷰를 늘리고 싶다면', name: '영수증리뷰',
      desc: '포스 영수증으로 네이버 영수증 리뷰 자동화', feats: ['영수증 자동 저장·문구 자동 복사', '앱 설치 없이 QR만', '고객 DB 자동 적립'] },
    { code: 'both', who: '리뷰도 늘리고 순위도 확인', name: '함께 쓰기', best: true,
      desc: '두 프로그램을 하나의 계정으로', feats: ['플레이스 마스터 PRO 전체 기능', '영수증리뷰 전체 기능', '함께 결제하면 묶음 할인'] }
  ];

  function signupUrl(code) {
    if (code === 'plma') return PLMA_SIGNUP;
    if (code === 'both') return ACCOUNT + '/signup?product=receipt_review,plma';
    return ACCOUNT + '/signup?product=receipt_review';
  }

  function renderFree() {
    document.getElementById('prLead').textContent = '지금은 무료예요 · 가입 후 승인되면 바로 사용';
    document.getElementById('prToggle').innerHTML = '';
    document.getElementById('prCards').innerHTML = CARDS.map(function (c) {
      return '<div class="pr-card' + (c.best ? ' best' : '') + '">' + (c.best ? '<span class="tag">추천</span>' : '') +
        '<div class="who">' + c.who + '</div><h3>' + c.name + '</h3><p class="desc">' + c.desc + '</p>' +
        '<div class="free">무료<small>현재 무료 이용 기간</small></div>' +
        '<ul>' + c.feats.map(function (f) { return '<li>' + f + '</li>'; }).join('') + '</ul>' +
        '<a class="cta" href="' + signupUrl(c.code) + '">' + (c.code === 'both' ? '둘 다 무료로 시작하기' : '무료로 시작하기') + '</a></div>';
    }).join('');
  }

  function renderPaid(d) {
    var prods = {}; d.products.forEach(function (p) { prods[p.code] = p; });
    var periods = [
      { key: 'monthly', label: '월 결제', match: function (pl) { return pl.kind === 'monthly'; } },
      { key: 'p12', label: '1년', match: function (pl) { return pl.kind === 'prepaid' && pl.months === 12; } },
      { key: 'p24', label: '2년', match: function (pl) { return pl.kind === 'prepaid' && pl.months === 24; } },
      { key: 'life', label: '영구', match: function (pl) { return pl.kind === 'lifetime'; } }
    ].filter(function (per) {
      return d.products.some(function (p) { return p.enabled && p.plans.some(per.match); });
    });
    if (!periods.length) return renderFree();
    var cur = periods.some(function (p) { return p.key === 'p12'; }) ? 'p12' : periods[0].key;

    function pick(code, per) {
      var p = prods[code];
      if (!p || !p.enabled) return null;
      var c = p.plans.filter(per.match);
      c.sort(function (a, b) { return a.monthly - b.monthly; });   // 같은 방식이면 월 환산이 싼 것
      return per.key === 'monthly' ? (p.plans.filter(per.match).sort(function (a, b) { return a.months - b.months; })[0]) : c[0];
    }

    function draw() {
      var per = periods.filter(function (p) { return p.key === cur; })[0];
      document.getElementById('prLead').textContent = '기간이 길수록, 함께 쓸수록 더 저렴해요';
      document.getElementById('prToggle').innerHTML = '<div class="pr-toggle">' + periods.map(function (p) {
        var best = 0;
        d.products.forEach(function (pr) { var pl = pr.enabled && pr.plans.filter(p.match)[0]; if (pl && pl.save_pct > best) best = pl.save_pct; });
        return '<button data-k="' + p.key + '" class="' + (p.key === cur ? 'on' : '') + '">' + p.label + (best ? '<small>-' + best + '%</small>' : '') + '</button>';
      }).join('') + '</div>';
      var suffix = per.key === 'monthly' ? '<small> /월</small>' : per.key === 'life' ? '<small> 한 번 결제</small>' : '<small> /' + per.label + '</small>';
      document.getElementById('prCards').innerHTML = CARDS.map(function (c) {
        var price, list, note = '';
        if (c.code === 'both') {
          var a = pick('plma', per), b = pick('receipt_review', per);
          if (!a || !b) return freeCard(c);
          var sub = a.price + b.price, lsum = a.list + b.list;
          price = r100(sub * (1 - (d.bundle_pct || 0) / 100));
          var floor = r100(lsum * (1 - (d.max_discount_pct || 60) / 100));
          if (price < floor) price = Math.min(sub, floor);
          list = lsum;
          if (d.bundle_pct) note = '<div class="save">묶음 ' + d.bundle_pct + '% 추가 할인</div>';
        } else {
          var pl = pick(c.code, per);
          if (!pl) return freeCard(c);
          price = pl.price; list = pl.list;
          if (per.key !== 'monthly' && per.key !== 'life' && pl.monthly) note = '<div class="save">월 ' + won(pl.monthly) + ' 꼴</div>';
        }
        var pct = list ? Math.round((1 - price / list) * 100) : 0;
        return '<div class="pr-card' + (c.best ? ' best' : '') + '">' + (c.best ? '<span class="tag">추천 · 가장 많이 선택</span>' : '') +
          '<div class="who">' + c.who + '</div><h3>' + c.name + '</h3><p class="desc">' + c.desc + '</p>' +
          '<div class="price">' + won(price) + suffix + '</div>' +
          (pct > 0 ? '<div class="strike">' + won(list) + ' · ' + pct + '% 할인</div>' : '') + note +
          '<ul>' + c.feats.map(function (f) { return '<li>' + f + '</li>'; }).join('') + '</ul>' +
          '<a class="cta" href="' + signupUrl(c.code) + '">' + (c.code === 'both' ? '함께 시작하기' : '시작하기') + '</a></div>';
      }).join('');
      Array.prototype.forEach.call(document.querySelectorAll('.pr-toggle button'), function (b) {
        b.onclick = function () { cur = b.getAttribute('data-k'); draw(); };
      });
    }
    function freeCard(c) {
      return '<div class="pr-card' + (c.best ? ' best' : '') + '"><div class="who">' + c.who + '</div><h3>' + c.name + '</h3>' +
        '<p class="desc">' + c.desc + '</p><div class="free">무료<small>현재 무료 이용 기간</small></div>' +
        '<ul>' + c.feats.map(function (f) { return '<li>' + f + '</li>'; }).join('') + '</ul>' +
        '<a class="cta" href="' + signupUrl(c.code) + '">무료로 시작하기</a></div>';
    }
    draw();
  }

  renderFree();
  if (!window.fetch) return;
  var done = false;
  setTimeout(function () { done = true; }, 6000);
  fetch(ACCOUNT + '/api/v1/pricing', { mode: 'cors' }).then(function (r) { return r.json(); }).then(function (d) {
    if (done || !d || !d.products) return;
    if (d.products.some(function (p) { return p.enabled; })) renderPaid(d);
  }).catch(function () { /* 무료 표시 유지 */ });

  // 다른 페이지에서 #pricing / #together 로 들어온 경우 위치 맞추기
  if (location.hash === '#pricing' || location.hash === '#together') {
    setTimeout(function () { var t = document.querySelector(location.hash); if (t) t.scrollIntoView(); }, 50);
  }
})();
