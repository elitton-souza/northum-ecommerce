(function () {
  "use strict";

  var C = window.SITE_CONFIG || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function digits(s) { return String(s || "").replace(/\D/g, ""); }
  var waNumber = digits(C.WHATSAPP_NUMERO);
  var hasWhatsApp = waNumber.length >= 12 && !/X/i.test(C.WHATSAPP_NUMERO || "");

  function waLink(text) {
    return "https://wa.me/" + waNumber + (text ? "?text=" + encodeURIComponent(text) : "");
  }

  // ---------- Analytics (preparado, sem ferramenta instalada) ----------
  window.dataLayer = window.dataLayer || [];
  function track(event, data) {
    window.dataLayer.push(Object.assign({ event: event }, data || {}));
  }

  // ---------- Dados do config.js ----------
  document.querySelectorAll("[data-config]").forEach(function (el) {
    var v = C[el.getAttribute("data-config")];
    if (v) el.textContent = v;
  });

  document.querySelectorAll("[data-show-if]").forEach(function (el) {
    var cond = el.getAttribute("data-show-if");
    var visible = cond === "whatsapp" && hasWhatsApp;
    el.classList.toggle("is-hidden", !visible);
  });

  document.querySelectorAll(".js-whatsapp").forEach(function (a) {
    a.href = waLink("Olá! Quero conhecer a Nina, a IA de vendas da Northum.");
    a.target = "_blank";
    a.rel = "noopener";
  });

  var ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();

  var contact = document.getElementById("footer-contact");
  if (contact) {
    var items = [];
    if (hasWhatsApp) items.push('<li><a href="' + waLink() + '" target="_blank" rel="noopener">WhatsApp</a></li>');
    if (C.EMAIL_CONTATO) items.push('<li><a href="mailto:' + C.EMAIL_CONTATO + '">' + C.EMAIL_CONTATO + "</a></li>");
    if (C.INSTAGRAM_URL) items.push('<li><a href="' + C.INSTAGRAM_URL + '" target="_blank" rel="noopener">Instagram</a></li>');
    if (C.LINKEDIN_URL) items.push('<li><a href="' + C.LINKEDIN_URL + '" target="_blank" rel="noopener">LinkedIn</a></li>');
    if (C.CIDADE_UF) items.push("<li>" + C.CIDADE_UF + "</li>");
    if (C.CNPJ) items.push("<li>CNPJ " + C.CNPJ + "</li>");
    if (items.length) contact.innerHTML = '<li class="footer-title">Contato</li>' + items.join("");
  }

  // ---------- Cabeçalho e menu ----------
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("menu");

  if (header && toggle && nav) {
    // Some ao rolar para baixo e volta ao rolar para cima (ou perto do topo).
    var lastY = window.scrollY;
    var onScroll = function () {
      var y = window.scrollY;
      header.classList.toggle("scrolled", y > 20);
      var menuOpen = nav.classList.contains("open");
      var focusInside = header.contains(document.activeElement) && document.activeElement !== document.body;
      if (y < 120 || menuOpen || focusInside) header.classList.remove("is-hidden");
      else if (y > lastY + 4) header.classList.add("is-hidden");
      else if (y < lastY - 4) header.classList.remove("is-hidden");
      if (Math.abs(y - lastY) > 4) lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    header.addEventListener("focusin", function () { header.classList.remove("is-hidden"); });

    var setMenu = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      nav.classList.toggle("open", open);
      header.classList.toggle("menu-open", open);
      document.documentElement.classList.toggle("menu-open", open);
    };
    toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    // Toque no fundo escurecido fecha o menu.
    header.addEventListener("click", function (e) { if (e.target === header) setMenu(false); });
    window.addEventListener("resize", function () { if (window.innerWidth > 1060) setMenu(false); });

    // Marca no menu a seção em que o visitante está.
    var spyLinks = {};
    nav.querySelectorAll('a[href^="#"]:not(.nav-cta)').forEach(function (a) { spyLinks[a.getAttribute("href").slice(1)] = a; });
    if ("IntersectionObserver" in window) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var link = spyLinks[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            Object.keys(spyLinks).forEach(function (id) { spyLinks[id].removeAttribute("aria-current"); });
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      Object.keys(spyLinks).forEach(function (id) {
        var sec = document.getElementById(id);
        if (sec) spy.observe(sec);
      });
    }
  }

  // ---------- Conversa de exemplo no topo ----------
  // Sem JavaScript (ou com redução de movimento), a conversa aparece inteira.
  // Com JavaScript, ela se desenrola em ordem: o lead escreve, a Nina espera, digita e responde.
  var demo = document.getElementById("demo");
  if (demo && !reduceMotion) {
    var status = document.getElementById("demo-status");
    var byStep = function (n) { return demo.querySelectorAll('[data-step="' + n + '"]'); };
    var timers = [];
    var later = function (ms, fn) { timers.push(setTimeout(fn, ms)); };
    var show = function (n, gap) {
      Array.prototype.forEach.call(byStep(n), function (el, i) { later(i * (gap || 0), function () { el.classList.add("on"); }); });
    };

    var play = function () {
      timers.forEach(clearTimeout); timers = [];
      demo.classList.add("is-playing");
      demo.querySelectorAll("[data-step]").forEach(function (el) { el.classList.remove("on", "off"); });
      if (status) status.textContent = "online";
      var typing = demo.querySelector(".msg.typing");
      later(300, function () { show(1); });
      later(1300, function () { show(2); });
      // A Nina espera o lead terminar de escrever antes de responder.
      later(2900, function () { show(3); if (status) status.textContent = "Nina está digitando…"; });
      later(4300, function () { typing.classList.add("off"); show(4, 650); if (status) status.textContent = "online"; });
      later(7000, function () { show(5); });
      later(8300, function () { if (status) status.textContent = "Nina está digitando…"; });
      later(9300, function () { show(6, 650); if (status) status.textContent = "online"; });
      later(10800, function () { show(7); track("demo_completa"); });
    };

    if ("IntersectionObserver" in window) {
      var played = false;
      new IntersectionObserver(function (entries, obs) {
        if (entries[0].isIntersecting && !played) { played = true; play(); obs.disconnect(); }
      }, { threshold: 0.3 }).observe(demo);
    }
  }

  // ---------- Botão Assumir (seção de controle) ----------
  var takeBtn = document.getElementById("take-btn");
  if (takeBtn) {
    takeBtn.addEventListener("click", function () {
      if (takeBtn.getAttribute("aria-pressed") === "true") return;
      takeBtn.setAttribute("aria-pressed", "true");
      takeBtn.querySelector("span").textContent = "Você assumiu";
      document.getElementById("take-status").textContent = "Com você";
      document.getElementById("take-sys").hidden = false;
      setTimeout(function () { document.getElementById("take-human").hidden = false; }, reduceMotion ? 0 : 700);
      track("demo_assumir");
    });
  }

  // ---------- CTAs: rastrear; os de demonstração abrem o pop-up ----------
  var applyDialog = document.getElementById("apply-dialog");
  document.querySelectorAll("[data-cta]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      track("cta_click", { origem: el.getAttribute("data-cta") });
      if (el.classList.contains("js-whatsapp")) track("whatsapp_click", { origem: el.getAttribute("data-cta") });
      if (el.getAttribute("href") === "#demonstracao" && applyDialog && el.getAttribute("data-cta") !== "menu-scroll") {
        e.preventDefault();
        openApply(el);
      }
    });
  });

  // ---------- Entrada dos blocos ao rolar ----------
  var reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains("reveal"); });
        var i = siblings.indexOf(el);
        el.style.transitionDelay = [0, 60, 110, 150, 180, 200][Math.min(Math.max(i, 0), 5)] + "ms";
        el.classList.add("in");
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  // ---------- WhatsApp flutuante some perto da chamada final ----------
  var fab = document.querySelector(".wa-float");
  var finalSec = document.getElementById("demonstracao");
  if (fab && finalSec && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      fab.classList.toggle("tucked", entries[0].isIntersecting);
    }, { threshold: 0.15 }).observe(finalSec);
  }

  // ---------- Barra de ação no celular ----------
  // Aparece depois que os botões do topo saem da tela e some perto da chamada final.
  var ctaBar = document.getElementById("cta-bar");
  var heroActions = document.querySelector(".hero .actions");
  if (ctaBar && heroActions && finalSec && "IntersectionObserver" in window) {
    document.body.classList.add("has-cta-bar");
    var pastHero = false, nearFinal = false;
    var syncBar = function () { ctaBar.classList.toggle("is-on", pastHero && !nearFinal); };
    new IntersectionObserver(function (entries) {
      pastHero = !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0;
      syncBar();
    }).observe(heroActions);
    new IntersectionObserver(function (entries) {
      nearFinal = entries[0].isIntersecting;
      syncBar();
    }, { threshold: 0.05 }).observe(finalSec);
  }

  // ---------- Pop-up de agendamento ----------
  // Passo 1: contato. Passo 2: sobre os leads. Envio: FORM_ENDPOINT → WhatsApp → aviso.
  var form = document.getElementById("apply-form");
  if (!applyDialog || !form) return;
  var formStatus = document.getElementById("form-status");
  var lastTrigger = null;
  var applyOrigin = "";
  var steps = form.querySelectorAll(".apply-step");
  var bars = form.querySelectorAll(".apply-progress i");

  // UTMs da URL vão junto com o pedido
  var utm = {};
  new URLSearchParams(location.search).forEach(function (v, k) { if (/^utm_/.test(k)) utm[k] = v; });

  function showStep(name, dir) {
    if (dir) form.setAttribute("data-dir", dir); else form.removeAttribute("data-dir");
    steps.forEach(function (s) { s.hidden = s.getAttribute("data-step") !== name; });
    bars.forEach(function (b, i) { b.classList.toggle("on", name === "done" || i < Number(name)); });
    form.querySelector(".apply-progress").hidden = name === "done";
    var focusEl = form.querySelector('.apply-step[data-step="' + name + '"] ' + (name === "done" ? ".apply-title" : "input, select"));
    if (focusEl && applyDialog.open) focusEl.focus({ preventScroll: true });
    applyDialog.scrollTop = 0;
  }

  function openApply(trigger) {
    lastTrigger = trigger || null;
    applyOrigin = (trigger && trigger.getAttribute("data-cta")) || "";
    if (!form.querySelector('[data-step="done"]').hidden) { form.reset(); setStatus("", ""); showStep("1"); }
    if (typeof applyDialog.showModal === "function") applyDialog.showModal();
    else applyDialog.setAttribute("open", "");
    document.body.classList.add("dialog-open");
    showStep(form.querySelector('[data-step="2"]').hidden ? "1" : "2");
    track("apply_open", { origem: applyOrigin });
  }
  function closeApply() {
    if (typeof applyDialog.close === "function") applyDialog.close();
    else { applyDialog.removeAttribute("open"); onClose(); }
  }
  function onClose() {
    document.body.classList.remove("dialog-open");
    if (!form.querySelector('[data-step="done"]').hidden) {
      setTimeout(function () { if (!applyDialog.open) { form.reset(); showStep("1"); setStatus("", ""); } }, 220);
    }
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });
  }
  applyDialog.addEventListener("close", onClose);
  applyDialog.addEventListener("click", function (e) { if (e.target === applyDialog) closeApply(); });
  form.querySelectorAll("[data-close]").forEach(function (b) { b.addEventListener("click", closeApply); });
  if (location.hash === "#aplicar") openApply(null);

  function phoneDigits(v) {
    var d = digits(v);
    if (d.length > 11 && d.indexOf("55") === 0) d = d.slice(2);
    return d;
  }

  var rules = {
    nome: function (v) { return v.trim().length >= 2 || "Informe seu nome."; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Informe um e-mail válido."; },
    whatsapp: function (v) { var d = phoneDigits(v); return (d.length === 10 || d.length === 11) || "Informe o WhatsApp com DDD."; },
    empresa: function (v) { return v.trim().length >= 2 || "Informe o nome da empresa."; },
    segmento: function (v) { return !!v || "Selecione o segmento."; },
    leads: function (v) { return !!v || "Selecione uma faixa, ou \"Não sei\"."; },
    equipe: function (v) { return !!v || "Selecione o tamanho do time."; },
  };
  var stepFields = { 1: ["nome", "email", "whatsapp", "empresa"], 2: ["segmento", "leads", "equipe"] };

  function check(name) {
    var el = form.elements[name];
    var res = rules[name](el.value || "");
    var err = document.getElementById("e-" + name);
    var ok = res === true;
    el.setAttribute("aria-invalid", ok ? "false" : "true");
    if (err) {
      err.textContent = ok ? "" : res;
      if (!ok) el.setAttribute("aria-describedby", err.id); else el.removeAttribute("aria-describedby");
    }
    return ok;
  }
  function checkStep(n) {
    var firstBad = null;
    stepFields[n].forEach(function (name) { if (!check(name) && !firstBad) firstBad = form.elements[name]; });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  ["nome", "email", "whatsapp", "empresa"].forEach(function (name) {
    form.elements[name].addEventListener("blur", function () { if (this.value) check(name); });
  });
  ["segmento", "leads", "equipe"].forEach(function (name) {
    form.elements[name].addEventListener("change", function () { check(name); });
  });

  // Máscara do WhatsApp: (11) 98765-4321
  form.elements.whatsapp.addEventListener("input", function () {
    var d = phoneDigits(this.value).slice(0, 11);
    var out = d;
    if (d.length > 2) out = "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length > 6) out = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length - 4) + "-" + d.slice(d.length - 4);
    this.value = out;
  });

  document.getElementById("apply-next").addEventListener("click", function () {
    if (!checkStep(1)) return;
    track("apply_step1", { origem: applyOrigin });
    showStep("2", "next");
  });
  document.getElementById("apply-back").addEventListener("click", function () { setStatus("", ""); showStep("1", "back"); });
  // Enter no passo 1 avança em vez de enviar
  form.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !form.querySelector('[data-step="1"]').hidden && e.target.tagName === "INPUT") {
      e.preventDefault();
      document.getElementById("apply-next").click();
    }
  });

  function setStatus(kind, msg) {
    formStatus.className = "form-status " + kind;
    formStatus.textContent = msg;
  }

  function summary(d) {
    return [
      "Olá! Quero agendar uma demonstração da Nina, a IA de vendas da Northum.",
      "",
      "Nome: " + d.nome,
      "E-mail: " + d.email,
      "WhatsApp: " + d.whatsapp,
      "Empresa: " + d.empresa,
      "Segmento: " + d.segmento,
      "Leads por mês no WhatsApp: " + d.leads,
      "Time comercial: " + d.equipe,
      d.hoje ? "Como respondem hoje: " + d.hoje : "",
    ].filter(Boolean).join("\n");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!checkStep(1)) { showStep("1", "back"); checkStep(1); return; }
    if (!checkStep(2)) return;

    var data = Object.assign({
      nome: form.nome.value.trim(),
      email: form.email.value.trim(),
      whatsapp: "+55" + phoneDigits(form.whatsapp.value),
      empresa: form.empresa.value.trim(),
      segmento: form.segmento.value,
      leads: form.leads.value,
      equipe: form.equipe.value,
      hoje: form.hoje.value,
      aceite_politica_privacidade: true,
      origem: "site" + (applyOrigin ? ":" + applyOrigin : ""),
      pagina: location.pathname,
      enviado_em: new Date().toISOString(),
    }, utm);

    var btn = form.querySelector('button[type="submit"]');
    var label = btn.textContent;

    function done(text) {
      track("form_submit", { origem: applyOrigin, segmento: data.segmento, leads: data.leads, equipe: data.equipe });
      if (text) document.getElementById("apply-done-text").textContent = text;
      setStatus("", "");
      showStep("done", "next");
    }

    if (C.FORM_ENDPOINT) {
      btn.disabled = true;
      btn.textContent = "Enviando…";
      setStatus("", "");
      fetch(C.FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      })
        .then(function (r) { if (!r.ok) throw new Error(r.status); done(); })
        .catch(function () {
          setStatus("fail", "Não foi possível enviar agora. Tente de novo em instantes" + (hasWhatsApp ? " ou fale conosco pelo WhatsApp." : "."));
        })
        .finally(function () { btn.disabled = false; btn.textContent = label; });
    } else if (hasWhatsApp) {
      window.open(waLink(summary(data)), "_blank", "noopener");
      done("Abrimos o WhatsApp com as suas respostas. É só enviar a mensagem para combinarmos a demonstração.");
    } else {
      setStatus("fail", "O envio ainda não está configurado. Defina FORM_ENDPOINT ou WHATSAPP_NUMERO em config.js.");
      console.warn("[site] Formulário sem destino: configure FORM_ENDPOINT ou WHATSAPP_NUMERO em config.js.");
    }
  });
})();

/* ===== Vídeo de vendas: começa sem som; o botão recomeça com som ===== */
(function () {
  "use strict";
  var video = document.getElementById("sales-video");
  var btn = document.getElementById("video-sound");
  if (!video || !btn) return;

  // Alguns navegadores só liberam o autoplay se o "mudo" for definido via JS.
  video.muted = true;
  video.defaultMuted = true;
  var tryPlay = function () { var p = video.play(); if (p && p.catch) p.catch(function () {}); };
  tryPlay();

  btn.addEventListener("click", function () {
    video.loop = false;
    video.muted = false;
    video.currentTime = 0;
    video.controls = true;
    tryPlay();
    btn.hidden = true;
  });
})();
