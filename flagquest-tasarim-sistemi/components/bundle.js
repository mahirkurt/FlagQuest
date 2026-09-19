/* @ds-bundle: {"format":4,"namespace":"FlagQuest","components":[{"name":"Buton"},{"name":"Etiket"},{"name":"ModKarti"},{"name":"BayrakKarti"},{"name":"SikButonu"},{"name":"Damga"},{"name":"Rozet"},{"name":"SeviyeCubugu"},{"name":"IpucuCipi"},{"name":"AltNavigasyon"}] } */
(function (global) {
  "use strict";
  var React = global.React;
  var h = React.createElement;

  function cx() {
    var out = [];
    for (var i = 0; i < arguments.length; i++) { if (arguments[i]) out.push(arguments[i]); }
    return out.join(" ");
  }
  function rest(props, drop) {
    var o = {};
    for (var k in props) { if (Object.prototype.hasOwnProperty.call(props, k) && drop.indexOf(k) < 0) o[k] = props[k]; }
    return o;
  }
  var RENKLER = ["altin", "damga", "vize", "meridyen", "erguvan", "bozkir"];
  function renkSinifi(onek, renk) {
    return onek + "--" + (RENKLER.indexOf(renk) >= 0 ? renk : "altin");
  }

  /* ---------------- Buton ---------------- */
  function Buton(props) {
    var p = props || {};
    var cesit = p.cesit || "birincil";
    var boyut = p.boyut || "md";
    return h("button", Object.assign({
      type: p.type || "button",
      disabled: !!p.disabled,
      className: cx("fq", "fq-btn", "fq-btn--" + cesit, "fq-btn--" + boyut, p.tamGenislik && "fq-btn--tam", p.className)
    }, rest(p, ["cesit", "boyut", "tamGenislik", "ikon", "ikonSon", "className", "children", "type", "disabled"])),
      p.ikon ? h("span", { className: "fq-btn__ikon", "aria-hidden": "true" }, p.ikon) : null,
      p.children,
      p.ikonSon ? h("span", { className: "fq-btn__ikon", "aria-hidden": "true" }, p.ikonSon) : null
    );
  }

  /* ---------------- Etiket ---------------- */
  function Etiket(props) {
    var p = props || {};
    return h("span", Object.assign({
      className: cx("fq", "fq-etiket", renkSinifi("fq-etiket", p.renk), p.className)
    }, rest(p, ["renk", "className", "children"])), p.children);
  }

  /* ---------------- ModKarti ---------------- */
  function ModKarti(props) {
    var p = props || {};
    return h("button", Object.assign({
      type: "button",
      className: cx("fq", "fq-mod", renkSinifi("fq-mod", p.renk), p.className)
    }, rest(p, ["ikon", "baslik", "aciklama", "etiket", "renk", "className"])),
      h("span", { className: "fq-mod__kutu", "aria-hidden": "true" }, p.ikon),
      h("span", { className: "fq-mod__govde" },
        h("span", { className: "fq-mod__ust" },
          h("span", { className: "fq-mod__baslik" }, p.baslik),
          p.etiket ? h(Etiket, { renk: p.renk }, p.etiket) : null
        ),
        h("span", { className: "fq-mod__aciklama" }, p.aciklama)
      ),
      h("span", { className: "fq-mod__ok", "aria-hidden": "true" },
        h("svg", { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" },
          h("path", { d: "M9 6l6 6-6 6" })))
    );
  }

  /* ---------------- BayrakKarti ---------------- */
  function BayrakKarti(props) {
    var p = props || {};
    var durum = p.durum || "net";
    var ortuMetni = durum === "bulanik1" ? (p.ortuMetni || "1. İpucu")
                  : durum === "bulanik2" ? (p.ortuMetni || "2. İpucu") : null;
    return h("figure", Object.assign({
      className: cx("fq", "fq-bayrak", "fq-bayrak--" + durum, p.className), style: p.style
    }, rest(p, ["src", "alt", "durum", "ortuMetni", "altBilgi", "className", "style"])),
      h("div", { className: "fq-bayrak__cerceve" },
        h("img", { className: "fq-bayrak__gorsel", src: p.src, alt: p.alt || "" }),
        ortuMetni ? h("div", { className: "fq-bayrak__ortu" },
          h("span", { className: "fq-bayrak__etiket" }, ortuMetni)) : null
      ),
      p.altBilgi ? h("figcaption", { className: "fq-bayrak__alt" }, p.altBilgi) : null
    );
  }

  /* ---------------- SikButonu ---------------- */
  var DURUM_ETIKETI = { dogru: "Doğru", yanlis: "Yanlış" };
  function SikButonu(props) {
    var p = props || {};
    var durum = p.durum || "bos";
    var isaret = durum === "dogru"
      ? h("svg", { width: 15, height: 15, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, h("path", { d: "M4 12.5l5.5 5.5L20 7" }))
      : durum === "yanlis"
      ? h("svg", { width: 15, height: 15, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", "aria-hidden": "true" }, h("path", { d: "M6 6l12 12M18 6L6 18" }))
      : null;
    return h("button", Object.assign({
      type: "button",
      disabled: durum === "elendi" || !!p.disabled,
      "aria-pressed": durum === "secili" ? true : undefined,
      className: cx("fq", "fq-sik", durum !== "bos" && "fq-sik--" + durum, p.className)
    }, rest(p, ["harf", "durum", "className", "children", "disabled"])),
      p.harf ? h("span", { className: "fq-sik__harf", "aria-hidden": "true" }, p.harf) : null,
      h("span", { className: "fq-sik__metin" }, p.children),
      isaret ? h("span", { className: "fq-sik__durum" }, isaret, DURUM_ETIKETI[durum]) : null
    );
  }

  /* ---------------- Damga ---------------- */
  function Damga(props) {
    var p = props || {};
    var kazanildi = !!p.kazanildi;
    var aci = typeof p.aci === "number" ? p.aci : 0;
    return h("div", Object.assign({
      className: cx("fq", "fq-damga", kazanildi ? "fq-damga--kazanildi" : "fq-damga--kilitli", p.className),
      title: p.ulkeAdi
    }, rest(p, ["ulkeKodu", "ulkeAdi", "bayrakSrc", "kazanildi", "aci", "className"])),
      h("div", { className: "fq-damga__halka", style: { transform: "rotate(" + aci + "deg)" } },
        kazanildi && p.bayrakSrc
          ? h("img", { className: "fq-damga__gorsel", src: p.bayrakSrc, alt: "" })
          : h("span", { className: "fq-damga__kod-orta", "aria-hidden": "true" }, p.ulkeKodu),
        kazanildi ? h("span", { className: "fq-damga__kod" }, p.ulkeKodu) : null
      ),
      h("span", { className: "fq-damga__ad" }, p.ulkeAdi)
    );
  }

  /* ---------------- Rozet ---------------- */
  function Rozet(props) {
    var p = props || {};
    var kazanildi = !!p.kazanildi;
    return h("div", Object.assign({
      className: cx("fq", "fq-rozet", kazanildi ? "fq-rozet--kazanildi" : "fq-rozet--kilitli", p.className)
    }, rest(p, ["ikon", "ad", "aciklama", "kazanildi", "className"])),
      h("span", { className: "fq-rozet__madalya", "aria-hidden": "true" }, p.ikon),
      h("div", null,
        h("p", { className: "fq-rozet__ad" }, p.ad),
        h("p", { className: "fq-rozet__aciklama" }, kazanildi ? p.aciklama : (p.kilitliAciklama || p.aciklama))
      )
    );
  }

  /* ---------------- SeviyeCubugu ---------------- */
  function SeviyeCubugu(props) {
    var p = props || {};
    var xp = Math.max(0, p.xp || 0);
    var hedef = p.hedefXp || 100;
    var kalan = Math.max(0, hedef - (xp % hedef));
    var yuzde = ((xp % hedef) / hedef) * 100;
    return h("section", Object.assign({
      className: cx("fq", "fq-seviye", p.className),
      "aria-label": "Seviye " + (p.seviye || 1)
    }, rest(p, ["seviye", "xp", "hedefXp", "unvan", "mrz", "className"])),
      h("div", { className: "fq-seviye__mrz", "aria-hidden": "true" }, p.mrz || "P<TURFLAGQUEST<<GEZGIN<<<<<<<<<<<<<<<<<<<<<<<<<"),
      h("div", { className: "fq-seviye__ust" },
        h("div", null,
          h("div", { className: "fq-seviye__unvan" }, p.unvan || "Çırak Seyyah"),
          h("div", { className: "fq-seviye__sayi" }, "Seviye " + (p.seviye || 1))
        ),
        h("div", { className: "fq-seviye__xp" }, xp + " XP")
      ),
      h("div", { className: "fq-seviye__yol", role: "progressbar", "aria-valuenow": Math.round(yuzde), "aria-valuemin": 0, "aria-valuemax": 100 },
        h("div", { className: "fq-seviye__dolgu", style: { width: yuzde + "%" } })
      ),
      h("div", { className: "fq-seviye__alt" },
        h("span", null, (xp % hedef) + " / " + hedef + " XP"),
        h("span", null, "Sonraki seviyeye " + kalan + " XP")
      )
    );
  }

  /* ---------------- IpucuCipi ---------------- */
  function IpucuCipi(props) {
    var p = props || {};
    var tur = p.tur || "ipucu";
    var kritik = tur === "sure" && !!p.kritik;
    return h("button", Object.assign({
      type: "button",
      disabled: !!p.kullanildi || !!p.disabled,
      className: cx("fq", "fq-cip", "fq-cip--" + tur, kritik && "fq-cip--sure-kritik", p.kullanildi && "fq-cip--kullanildi", p.className)
    }, rest(p, ["tur", "ikon", "kullanildi", "kritik", "className", "children", "disabled"])),
      p.ikon ? h("span", { "aria-hidden": "true", style: { display: "inline-flex" } }, p.ikon) : null,
      p.children
    );
  }

  /* ---------------- AltNavigasyon ---------------- */
  function AltNavigasyon(props) {
    var p = props || {};
    var ogeler = p.ogeler || [];
    var oynaIndex = typeof p.oynaIndex === "number" ? p.oynaIndex : Math.floor(ogeler.length / 2);
    return h("nav", Object.assign({
      className: cx("fq", "fq-nav", p.className), "aria-label": p.etiket || "Ana gezinme"
    }, rest(p, ["ogeler", "aktif", "oynaIndex", "etiket", "className"])),
      ogeler.map(function (o, i) {
        if (i === oynaIndex && o.oyna) {
          return h("button", { key: o.id || i, type: "button", className: "fq-nav__oyna", "aria-label": o.etiket }, o.ikon);
        }
        var aktif = p.aktif === (o.id || i);
        return h("button", {
          key: o.id || i, type: "button",
          "aria-current": aktif ? "page" : undefined,
          className: cx("fq-nav__oge", aktif && "fq-nav__oge--aktif")
        }, h("span", { "aria-hidden": "true" }, o.ikon), h("span", null, o.etiket));
      })
    );
  }

  global.FlagQuest = {
    Buton: Buton, Etiket: Etiket, ModKarti: ModKarti, BayrakKarti: BayrakKarti,
    SikButonu: SikButonu, Damga: Damga, Rozet: Rozet, SeviyeCubugu: SeviyeCubugu,
    IpucuCipi: IpucuCipi, AltNavigasyon: AltNavigasyon
  };
})(window);
