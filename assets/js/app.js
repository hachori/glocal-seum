/* 글로컬 세움 일반화 자료실
   자료 목록(assets/data/materials.json)을 읽어 홈의 자료 목록·QR 번호표·추천 영상과
   프로그램 화면(p01~p12)을 채운다. 링크를 바꿀 때는 materials.json만 고치면 된다. */
(function () {
  'use strict';

  var ROOT = document.documentElement.getAttribute('data-root') || '.';
  var TYPES = {
    video: { label: '영상', meta: '바로 재생', act: '보기' },
    doc: { label: '문서', meta: '내려받기', act: '받기' },
    tool: { label: '웹 도구', meta: '새 창에서 열기', act: '열기' }
  };
  var STROKE = ' aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';
  var I = {
    video: '<svg width="20" height="20" stroke-width="1.8"' + STROKE + '><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M10.5 9.5v5l4-2.5z"/></svg>',
    doc: '<svg width="20" height="20" stroke-width="1.8"' + STROKE + '><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h4"/></svg>',
    tool: '<svg width="20" height="20" stroke-width="1.8"' + STROKE + '><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/><path d="m9 10 2 2 4-4"/></svg>',
    down: '<svg width="16" height="16" stroke-width="2"' + STROKE + '><path d="M12 4v11"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/></svg>',
    open: '<svg width="16" height="16" stroke-width="2"' + STROKE + '><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    chev: '<svg width="18" height="18" stroke-width="2"' + STROKE + '><path d="m9 6 6 6-6 6"/></svg>',
    arrow: '<svg width="18" height="18" stroke-width="2"' + STROKE + '><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
    play: '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l12-7.5z"/></svg>',
    playL: '<svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    check: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7FDCA4" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>'
  };
  function sprout(size) {
    return '<svg aria-hidden="true" width="' + size + '" height="' + size + '" viewBox="0 0 24 24"><path d="M12 22V12" stroke="#18B454" stroke-width="2.2" stroke-linecap="round" fill="none"/><path d="M12 12.5C11.6 8 8.6 5.5 3.5 5.6C3.6 10.2 6.8 12.6 12 12.5Z" fill="#18B454"/><path d="M12 11C12.4 6.8 15.3 4.2 20.5 4.3C20.4 8.6 17.3 11.1 12 11Z" fill="#3C909C"/></svg>';
  }

  function $(sel, el) { return (el || document).querySelector(sel); }
  function $$(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function norm(s) { return String(s).toLowerCase().replace(/[\s'"‘’“”·,.()~\-]/g, ''); }

  function load() {
    return fetch(ROOT + '/assets/data/materials.json', { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  function prepare(data) {
    data.domainById = {};
    data.programById = {};
    data.total = 0;
    data.domains.forEach(function (d) { data.domainById[d.id] = d; });
    data.programs.forEach(function (p) {
      p.no = p.id.slice(1);
      data.programById[p.id] = p;
      data.total += p.items.length;
    });
    return data;
  }

  function mark(d, cls) {
    if (d.logo) return '<img class="' + cls + '" src="' + ROOT + '/assets/img/' + d.logo + '" alt="" width="172" height="132">';
    return '<span class="mark" aria-hidden="true">' + sprout(24) + '</span>';
  }

  /* 자료 한 줄: 주소가 있으면 새 창 링크, 없으면 '준비 중' */
  function itemHTML(it, cls) {
    var t = TYPES[it.type] || TYPES.doc;
    var meta = t.label + (it.note ? ' · ' + it.note : (it.url ? ' · ' + t.meta : ''));
    var body = '<span class="well" aria-hidden="true">' + (I[it.type] || I.doc) + '</span>' +
      '<span class="item__txt"><span class="item__t">' + esc(it.title) + '</span><span class="item__m">' + esc(meta) + '</span></span>';
    if (!it.url) return '<div class="item ' + (cls || '') + '">' + body + '<span class="act act--soon">준비 중</span></div>';
    var icon = it.type === 'video' ? I.play : (it.type === 'tool' ? I.open : I.down);
    return '<a class="item ' + (cls || '') + '" href="' + esc(it.url) + '" target="_blank" rel="noopener">' + body +
      '<span class="act">' + icon + '<span class="act__t">' + t.act + '</span></span><span class="sr"> (새 창에서 열림)</span></a>';
  }

  function youtube(url) {
    if (!url) return null;
    var v = url.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
    var l = url.match(/[?&]list=([\w-]+)/);
    if (v) {
      return {
        embed: 'https://www.youtube-nocookie.com/embed/' + v[1] + '?autoplay=1&rel=0' + (l ? '&list=' + l[1] : ''),
        thumb: 'https://i.ytimg.com/vi/' + v[1] + '/hqdefault.jpg'
      };
    }
    if (l) return { embed: 'https://www.youtube-nocookie.com/embed/videoseries?list=' + l[1] + '&autoplay=1', thumb: '' };
    return null;
  }

  /* 모바일 메뉴 */
  function initMenu() {
    var btn = $('.menu-btn'), nav = $('#mnav');
    if (!btn || !nav) return;
    function set(open) { btn.setAttribute('aria-expanded', String(open)); nav.hidden = !open; }
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !nav.hidden) { set(false); btn.focus(); } });
  }

  /* ---------- 홈 ---------- */
  function initHome(data) {
    var state = { dom: 'all', fmt: 'all', q: '', sug: false };
    var catalog = $('#catalog'), input = $('#q'), clear = $('#q-clear'), sug = $('#q-list');

    function matchQ(d, p, it, nq) {
      return !nq || norm(it.title + p.name + (p.tags || '') + d.name + TYPES[it.type].label).indexOf(nq) >= 0;
    }

    function render() {
      var nq = norm(state.q), html = '', n = 0;
      var cnt = { all: 0 }, fcnt = { all: 0, video: 0, doc: 0, tool: 0 };
      data.domains.forEach(function (d) { cnt[d.id] = 0; });
      data.domains.forEach(function (d) {
        var progs = data.programs.filter(function (p) { return p.domain === d.id; });
        var body = '', total = 0;
        progs.forEach(function (p) {
          var rows = '';
          p.items.forEach(function (it) {
            total += 1;
            var okQ = matchQ(d, p, it, nq);
            var okD = state.dom === 'all' || state.dom === d.id;
            var okF = state.fmt === 'all' || state.fmt === it.type;
            if (okQ && okF) { cnt.all += 1; cnt[d.id] += 1; }
            if (okQ && okD) { fcnt.all += 1; fcnt[it.type] += 1; }
            if (okQ && okD && okF) { rows += itemHTML(it, 'enter'); n += 1; }
          });
          if (rows) {
            body += '<div class="prow rv" id="' + p.id + '"><div class="prow__top"><span class="qr-badge">QR ' + p.no + '</span>' +
              '<h4 class="prow__name"><a href="' + ROOT + '/' + p.id + '/">' + esc(p.name) + '</a></h4></div>' +
              '<div class="items">' + rows + '</div></div>';
          }
        });
        if (body) {
          html += '<section class="group dom-' + d.id + '" id="' + d.id + '" aria-labelledby="' + d.id + '-t">' +
            '<div class="group__head rv">' + mark(d, 'group__logo') + '<h3 class="group__name" id="' + d.id + '-t">' + esc(d.name) + '</h3>' +
            '<span class="group__sub">' + esc(d.sub) + '</span><span class="group__count">프로그램 ' + progs.length + ' · 자료 ' + total + '</span></div>' +
            body + '</section>';
        }
      });
      if (!n) html = '<div class="empty enter"><p>이 조건에 맞는 자료가 없습니다.</p><button type="button" class="chip" data-reset>조건 지우고 전체 보기</button></div>';
      catalog.innerHTML = html;

      $('#result-n').textContent = n;
      $('#result-q').textContent = nq ? '‘' + state.q.trim() + '’ 검색 · ' : '';
      $('#reset').hidden = !(state.dom !== 'all' || state.fmt !== 'all' || nq);
      $$('[data-filter]').forEach(function (b) {
        var key = b.getAttribute('data-filter'), val = b.getAttribute('data-value');
        b.setAttribute('aria-pressed', String(state[key] === val));
        var num = $('.chip__n', b);
        if (num) num.textContent = key === 'dom' ? cnt[val] : fcnt[val];
      });
    }

    function renderSug() {
      var nq = norm(state.q);
      clear.hidden = !nq;
      if (!nq || !state.sug) { sug.hidden = true; input.setAttribute('aria-expanded', 'false'); return; }
      var list = [], total = 0;
      data.programs.forEach(function (p) {
        var d = data.domainById[p.domain];
        p.items.forEach(function (it) {
          if (!matchQ(d, p, it, nq)) return;
          total += 1;
          if (list.length < 8) list.push({ p: p, d: d, it: it });
        });
      });
      var h = '<p class="sug__head">‘' + esc(state.q.trim()) + '’ 찾은 자료 <strong>' + total + '</strong>종</p>';
      list.forEach(function (m) {
        h += '<a class="sug__a dom-' + m.d.id + '" href="#' + m.p.id + '"><span class="sug__qr" aria-hidden="true">QR ' + m.p.no + '</span>' +
          '<span class="sug__txt"><span class="sug__t">' + esc(m.it.title) + '</span>' +
          '<span class="sug__m">' + esc(m.d.name + ' · ' + m.p.name + ' · ' + TYPES[m.it.type].label) + '</span></span></a>';
      });
      if (!total) h += '<p class="sug__none">찾는 자료가 없습니다. 다른 낱말로 찾아보세요.</p>';
      sug.innerHTML = h;
      sug.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    }

    function closeSug() { state.sug = false; renderSug(); }
    function resetAll() { state.dom = 'all'; state.fmt = 'all'; state.q = ''; input.value = ''; render(); closeSug(); }

    input.addEventListener('input', function () { state.q = input.value; state.sug = true; render(); renderSug(); });
    input.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSug(); });
    clear.addEventListener('click', function () { state.q = ''; input.value = ''; input.focus(); render(); renderSug(); });
    $('#search').addEventListener('submit', function (e) {
      e.preventDefault();
      closeSug();
      input.blur();
      $('#all').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    sug.addEventListener('click', function (e) { if (e.target.closest('a')) closeSug(); });
    document.addEventListener('click', function (e) { if (!e.target.closest('#search')) closeSug(); });
    $('.fpanel').addEventListener('click', function (e) {
      var b = e.target.closest('[data-filter]');
      if (!b) return;
      state[b.getAttribute('data-filter')] = b.getAttribute('data-value');
      render();
    });
    $$('[data-pick]').forEach(function (a) {
      a.addEventListener('click', function () { state.dom = a.getAttribute('data-pick'); render(); });
    });
    document.addEventListener('click', function (e) { if (e.target.closest('[data-reset], #reset')) resetAll(); });

    render();
    renderStatic(data);
    if (location.hash.length > 1) {
      var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) { target.scrollIntoView(); target.classList.add('is-target'); }
    }
  }

  /* 홈의 영역 카드 수·숫자 띠·QR 번호표·추천 영상·운영 자료 */
  function renderStatic(data) {
    data.domains.forEach(function (d) {
      var progs = data.programs.filter(function (p) { return p.domain === d.id; });
      var items = progs.reduce(function (s, p) { return s + p.items.length; }, 0);
      var el = $('[data-count="' + d.id + '"]');
      if (el) el.textContent = '프로그램 ' + progs.length + ' · 자료 ' + items;
    });
    [['domains', data.domains.length], ['programs', data.programs.length], ['items', data.total]].forEach(function (s) {
      var el = $('[data-stat="' + s[0] + '"]');
      if (!el) return;
      $('.cnt', el).style.setProperty('--to', s[1]);
      $('.sr', el).textContent = s[1];
    });
    countUp();

    var qg = $('#qrgrid');
    if (qg) {
      qg.innerHTML = data.programs.map(function (p, i) {
        return '<li class="rv" style="--i:' + (i % 3) + '"><a class="qtile dom-' + p.domain + '" href="' + ROOT + '/' + p.id + '/">' +
          '<span class="qtile__n">' + p.no + '</span><span class="qtile__t">' + esc(p.name) + '</span></a></li>';
      }).join('');
    }

    var fg = $('#featured');
    if (fg && data.featured) {
      fg.innerHTML = data.featured.map(function (f, i) {
        var p = data.programById[f.program], d = data.domainById[p.domain], it = p.items[f.item] || {};
        var y = youtube(it.url);
        return '<a class="vcard rv dom-' + d.id + '" style="--i:' + i + '" href="' + ROOT + '/' + p.id + '/">' +
          '<span class="vthumb">' + (y && y.thumb ? '<img src="' + y.thumb + '" alt="" loading="lazy">' : '') +
          '<span class="vplay" aria-hidden="true">' + I.playL + '</span>' +
          (y && y.thumb ? '' : '<span class="vtag">' + (it.url ? '재생목록' : '영상 준비 중') + '</span>') + '</span>' +
          '<span class="vcard__body"><span class="vcard__k">' + esc(d.name) + ' · QR ' + p.no + '</span>' +
          '<span class="vcard__t">' + esc(f.title) + '</span><span class="vcard__d">' + esc(f.desc) + '</span></span></a>';
      }).join('');
    }

    var docs = $('#docs');
    if (docs && data.docs) docs.innerHTML = data.docs.map(function (it) { return itemHTML(it); }).join('');
  }

  /* 숫자 띠가 화면에 들어오면 한 번만 올라가게(스크롤 중간에 멈춰도 끝값이 보이도록 시간 기반) */
  function countUp() {
    var els = $$('.cnt');
    if (!els.length || !('IntersectionObserver' in window)) return;
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.remove('is-wait');
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.9 });
    els.forEach(function (el) { el.classList.add('is-wait'); io.observe(el); });
  }

  /* ---------- 프로그램 화면(QR 도착 화면) ---------- */
  function initProgram(data, pid) {
    var main = $('#program'), p = data.programById[pid];
    if (!p) { main.innerHTML = '<div class="wrap pbody"><p class="notice">프로그램을 찾지 못했습니다. <a href="' + ROOT + '/">홈으로 가기</a></p></div>'; return; }
    var d = data.domainById[p.domain];
    var vid = p.items.filter(function (it) { return it.type === 'video'; })[0];
    var player = '';
    if (vid) {
      var y = youtube(vid.url);
      if (y) {
        player = '<button type="button" class="player" data-embed="' + esc(y.embed) + '" aria-label="영상 재생: ' + esc(vid.title) + '">' +
          (y.thumb ? '<img src="' + y.thumb + '" alt="">' : '') +
          '<span class="player__play" aria-hidden="true">' + I.playL + '</span><span class="player__cap">' + esc(vid.title) + '</span></button>';
      } else if (vid.url) {
        player = '<a class="player" href="' + esc(vid.url) + '" target="_blank" rel="noopener"><span class="player__play" aria-hidden="true">' + I.playL + '</span>' +
          '<span class="player__cap">' + esc(vid.title) + ' (새 창에서 열림)</span></a>';
      } else {
        player = '<div class="player player--soon">영상 준비 중입니다</div>';
      }
    }
    var info = [['대상', p.target], ['제작', p.school], ['탑재일', p.date]].filter(function (r) { return r[1]; });
    var rel = data.programs.filter(function (x) { return x.domain === p.domain && x.id !== p.id; });

    main.innerHTML =
      '<div class="phero"><div class="wrap">' +
        '<nav class="crumb hi" style="--i:0" aria-label="현재 위치"><a href="' + ROOT + '/">홈</a> › <a href="' + ROOT + '/#' + d.id + '">' + esc(d.name) + '</a></nav>' +
        '<div class="phero__meta hi" style="--i:1"><span class="qr-badge">QR ' + p.no + '</span>' + mark(d, 'phero__logo') +
          '<span class="phero__dom">' + esc(d.name + ' · ' + d.sub) + '</span></div>' +
        '<h1 class="phero__h hi" style="--i:2">' + esc(p.name) + '</h1>' +
        (p.summary ? '<p class="phero__sum hi" style="--i:3">' + esc(p.summary) + '</p>' : '') +
      '</div></div>' +
      '<div class="wrap pbody">' +
        (player ? '<div class="hi" style="--i:4">' + player + '</div>' : '') +
        '<section class="hi" style="--i:5" aria-labelledby="mats-t"><h2 class="ph2" id="mats-t">이 프로그램의 자료 <span>' + p.items.length + '</span></h2>' +
          '<div class="mats">' + p.items.map(function (it) { return itemHTML(it); }).join('') + '</div></section>' +
        (info.length ? '<dl class="pinfo">' + info.map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('') + '</dl>' : '') +
        (rel.length ? '<section aria-labelledby="rel-t"><h2 class="ph2" id="rel-t">' + esc(d.name) + '의 다른 프로그램</h2><div class="rel">' +
          rel.map(function (x) {
            return '<a href="' + ROOT + '/' + x.id + '/"><span class="rel__n">QR ' + x.no + '</span><span class="rel__t">' + esc(x.name) + '</span>' + I.chev + '</a>';
          }).join('') + '</div></section>' : '') +
        '<a class="cta" href="' + ROOT + '/#all">전체 자료 ' + data.total + '종 보기' + I.arrow + '</a>' +
      '</div>';

    var btn = $('.player[data-embed]', main);
    if (btn) {
      btn.addEventListener('click', function () {
        var f = document.createElement('iframe');
        f.src = btn.getAttribute('data-embed');
        f.title = vid.title;
        f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        f.allowFullscreen = true;
        var box = document.createElement('div');
        box.className = 'player';
        box.appendChild(f);
        btn.replaceWith(box);
      });
    }

    /* 보고서 QR로 들어온 경우(주소 끝 ?qr) 잠깐 알림 */
    if (/[?&]qr\b/.test(location.search)) {
      var t = document.createElement('p');
      t.className = 'toast is-on';
      t.setAttribute('role', 'status');
      t.innerHTML = I.check + '운영보고서 QR ' + p.no + '로 열린 화면입니다';
      document.body.appendChild(t);
      setTimeout(function () { t.remove(); }, 5600);
    }
  }

  function fail(err) {
    var box = $('#catalog') || $('#program');
    if (!box) return;
    var local = location.protocol === 'file:';
    box.innerHTML = '<div class="' + ($('#program') ? 'wrap pbody' : '') + '"><p class="notice">자료 목록을 불러오지 못했습니다. ' +
      (local ? '내 컴퓨터에서 파일을 바로 열면 목록이 보이지 않습니다. README의 ‘미리 보기’ 방법으로 열어 주세요.' : '잠시 뒤 다시 열어 주세요.') + '</p></div>';
    if (window.console) console.error(err);
  }

  initMenu();
  var pid = document.body.getAttribute('data-program');
  load().then(prepare).then(function (data) {
    if (pid) initProgram(data, pid); else initHome(data);
  }).catch(fail);
})();
