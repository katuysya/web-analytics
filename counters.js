// Счётчики статистики сайта «Ложка пользы».
// Подключается на всех страницах перед script.js; информеры выводятся в «подвал» (footer .counters).
// Цели отправляет window.trackGoal(name) — её вызывает script.js.

var LI_TYPE = '25.16';        // LiveInternet: вид 25 (88x15, посетители за сегодня), цвет 16 (оливковый)
var TOP100_ID = 7752738;            // Рамблер/топ-100 (Статистика от SberAds): номер счётчика
var TOP100_COLOR = '194d33';  // цвет виджета Топ-100 (тёмно-зелёный; только строчными)
var TMR_ID = '3805350';              // MyTracker / Top.Mail.Ru: ID веб-счётчика
var TMR_LOGO_TYPE = 404;      // логотип Top.Mail.Ru 88x31 «рейтинг mail.ru», зелёный (цвет 10, #436925)

var countersBox = document.querySelector('footer .counters');

// ---- LiveInternet ----
(function (d, s) {
  if (!countersBox) return;
  var a = d.createElement('a');
  a.href = 'https://www.liveinternet.ru/click';
  a.target = '_blank';
  var img = d.createElement('img');
  img.width = 88;  // размеры информера вида 25
  img.height = 15;
  img.style.border = '0';
  img.alt = '';
  img.title = 'LiveInternet: показано число посетителей за сегодня';
  // строка запроса — как в официальном коде
  img.src = 'https://counter.yadro.ru/hit?t' + LI_TYPE + ';r' + escape(d.referrer) +
    ((typeof (s) == 'undefined') ? '' : ';s' + s.width + '*' + s.height + '*' +
    (s.colorDepth ? s.colorDepth : s.pixelDepth)) + ';u' + escape(d.URL) +
    ';h' + escape(d.title.substring(0, 150)) + ';' + Math.random();
  a.appendChild(img);
  countersBox.appendChild(a);
})(document, screen);

// ---- Рамблер/топ-100 ----
// очередь вызовов до загрузки библиотеки (официальный стаб)
window.top100d = window.top100d || function () {
  (window.top100d.a = window.top100d.a || []).push(arguments);
};
if (TOP100_ID) {
  // «Аналитика блоков»: полный путь блока пишется в data-kt-block самого элемента
  (function (d) {
    var page = (location.pathname.split('/').pop() || 'index.html').replace('.html', '');
    if (page === 'index') page = 'home';
    function mark(selector, name) {
      d.querySelectorAll(selector).forEach(function (el) {
        var n = typeof name === 'function' ? name(el) : name;
        if (n) el.setAttribute('data-kt-block', n);
      });
    }
    function file(el) { var f = (el.getAttribute('href') || '').split('#')[0].replace('.html', ''); return f === 'index' ? 'home' : f; }
    function hash(el) { return (el.getAttribute('href') || '').split('#')[1] || file(el); }
    function card(el) { return el.closest('.recipe-card').id; }
    var DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    var MEALS = { 'Завтрак': 'breakfast', 'Обед': 'lunch', 'Ужин': 'dinner', 'Перекус': 'snack' };

    mark('.header .brand', page + '::header::logo');
    mark('.nav a', function (el) { return page + '::header::nav::' + file(el); });
    mark('.menu-toggle', page + '::header::menu-toggle');
    mark('footer .brand', page + '::footer::logo');
    mark('footer > a:not(.brand)', page + '::footer::link');
    mark('footer .counters', page + '::footer::counters');
    mark('.hero .btn', 'home::hero::find-recipe');
    mark('.hero .plain-link', 'home::hero::sweet');
    mark('.section-head .text-link', 'home::categories::all-recipes');
    mark('.category-grid .category', function (el) { return 'home::categories::' + hash(el); });
    if (page === 'home') mark('.recipe-card', function (el) { return 'home::week-top::' + hash(el.querySelector('a')); });
    mark('.quote a', function (el) { return page + '::quote::' + file(el); });
    mark('#search', 'recipes::filters::search');
    mark('.filter', function (el) { return 'recipes::filters::' + el.dataset.filter; });
    mark('.recipe-card summary', function (el) { return page + '::cards::' + card(el) + '::details'; });
    mark('.recipe-card .fav', function (el) { return page + '::cards::' + card(el) + '::fav'; });
    mark('.note-box', 'desserts::note');
    mark('.day-card a', function (el) {
      var day = el.closest('.day-card');
      return 'menu::week::' + DAYS[[].indexOf.call(day.parentNode.children, day)] + '::' + MEALS[el.parentNode.previousElementSibling.textContent];
    });
    mark('.about-copy .btn', 'about::approach::choose-recipe');
    mark('.privacy', 'about::privacy');
    mark('#suggest-form [name]', function (el) { return 'contact::form::' + el.name; });
    mark('#suggest-form button[type=submit]', 'contact::form::submit');
  })(document);

  // контейнер виджета 88x31 в «подвале»
  if (countersBox) {
    var top100Widget = document.createElement('span');
    top100Widget.id = 'top100_widget';
    countersBox.appendChild(top100Widget);
  }

  // код счётчика (асинхронная загрузка библиотеки)
  (function (w, d, c) {
    (w[c] = w[c] || []).push(function () {
      var options = {
        project: TOP100_ID,
        element: 'top100_widget',
        widgetColor: TOP100_COLOR,
        attributes_dataset: ['kt-block'],
        trackHashes: true,
        user_id: null
      };
      try {
        w.top100Counter = new top100(options);
      } catch (e) { }
    });
    var n = d.getElementsByTagName('script')[0],
        s = d.createElement('script'),
        f = function () { n.parentNode.insertBefore(s, n); };
    s.type = 'text/javascript';
    s.async = true;
    s.src = (d.location.protocol == 'https:' ? 'https:' : 'http:') + '//st.top100.ru/top100/top100.js';
    if (w.opera == '[object Opera]') {
      d.addEventListener('DOMContentLoaded', f, false);
    } else { f(); }
  })(window, document, '_top100q');
}

// ---- MyTracker (веб-счётчик Top.Mail.Ru) ----
var _tmr = window._tmr || (window._tmr = []);
if (TMR_ID) {
  _tmr.push({ id: TMR_ID, type: 'pageView', start: (new Date()).getTime() });
  (function (d, w, id) {
    if (d.getElementById(id)) return;
    var ts = d.createElement('script'); ts.type = 'text/javascript'; ts.async = true; ts.id = id;
    ts.src = 'https://top-fwz1.mail.ru/js/code.js';
    var f = function () { var s = d.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ts, s); };
    if (w.opera == '[object Opera]') { d.addEventListener('DOMContentLoaded', f, false); } else { f(); }
  })(document, window, 'tmr-code');

  // логотип Top.Mail.Ru 88x31 в «подвале»
  if (countersBox) {
    var tmrLink = document.createElement('a');
    tmrLink.href = 'https://top-fwz1.mail.ru/jump?from=' + TMR_ID;
    var tmrLogo = document.createElement('img');
    tmrLogo.src = 'https://top-fwz1.mail.ru/counter?id=' + TMR_ID + ';t=' + TMR_LOGO_TYPE + ';l=1';
    tmrLogo.width = 88;
    tmrLogo.height = 31;
    tmrLogo.alt = 'Top.Mail.Ru';
    tmrLogo.style.border = '0';
    tmrLink.appendChild(tmrLogo);
    countersBox.appendChild(tmrLink);
  }
}
<!-- Top.Mail.Ru counter -->
<script type="text/javascript">
var _tmr = window._tmr || (window._tmr = []);
_tmr.push({id: "3805350", type: "pageView", start: (new Date()).getTime()});
(function (d, w, id) {
  if (d.getElementById(id)) return;
  var ts = d.createElement("script"); ts.type = "text/javascript"; ts.async = true; ts.id = id;
  ts.src = "https://top-fwz1.mail.ru/js/code.js";
  var f = function () {var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ts, s);};
  if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); }
})(document, window, "tmr-code");
</script>
<noscript><div><img src="https://top-fwz1.mail.ru/counter?id=3805350;js=na" style="position:absolute;left:-9999px;" alt="Top.Mail.Ru" /></div></noscript>
<!-- /Top.Mail.Ru counter -->
// ---- Цели сайта: recipe_details | recipe_search | favorite_add | suggest_recipe ----
window.trackGoal = function (name) {
  if (TOP100_ID) window.top100d(TOP100_ID, 'reachGoal', name);
  if (TMR_ID) _tmr.push({ id: TMR_ID, type: 'reachGoal', goal: name });
};
