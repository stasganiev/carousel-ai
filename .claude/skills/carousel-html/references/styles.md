# Пресеты свободного стиля

Используются, когда `brand/brand.md` нет или в нём не заполнен визуал. Выбери один пресет под тему и аудиторию, вставь его строки `<link>` вместо шрифтов шаблона и его `:root` вместо блока токенов.

Шрифты локальные, с кириллицей, лежат в папке `fonts/` этого скилла. Папки шрифтов пресета (те, что названы в его `<link>`) скопируй в `posts/<slug>/fonts/`.

## Как выбрать

| Тема и аудитория | Пресет |
|---|---|
| Эксперты, услуги, обучение; тема не подсказывает стиль | Контраст |
| Консалтинг, право, финансы, медиа, образование для взрослых | Редакционный |
| Технологии, b2b, инвестиции, авто, мужская аудитория | Тёмный |
| Психология, здоровье, бьюти, родительство, эстетика | Мягкий |
| Маркетинг, digital, курсы, молодая аудитория | Яркий |
| IT, стартапы, дерзкий личный бренд, провокационная тема | Необрутализм |
| Аналитика, исследования, цифры в основе карусели | Данные |
| Еда, ремесло, локальный бизнес, путешествия | Крафт |

Фотографичная тема (еда, интерьеры, путешествия, товары) — к любому пресету добавь обложку с картинкой на весь слайд (`.s.bleed`).

## Контраст

Тёплый светлый фон, почти чёрный текст, один яркий акцент. Стоит в шаблоне по умолчанию.

```html
<link rel="stylesheet" href="fonts/manrope/font.css">
<link rel="stylesheet" href="fonts/inter/font.css">
```
```css
:root{
  --bg:#F5F2EC; --fg:#15171C; --muted:#666B76; --card:#FFFFFF; --line:rgba(21,23,28,.14);
  --bg-alt:#15171C; --fg-alt:#F5F2EC; --muted-alt:#A6ABB6; --card-alt:#23262E; --line-alt:rgba(245,242,236,.18);
  --accent:#FF5A1F; --on-accent:#FFFFFF; --accent-alt:#FF5A1F; --on-accent-alt:#FFFFFF;
  --font-head:'Manrope',sans-serif; --font-body:'Inter',sans-serif;
  --head-weight:800; --head-tracking:-0.03em; --radius:32px;
}
```

## Редакционный

Журнальная подача: антиква в заголовках, много воздуха, сдержанный акцент.

```html
<link rel="stylesheet" href="fonts/playfair-display/font.css">
<link rel="stylesheet" href="fonts/inter/font.css">
```
```css
:root{
  --bg:#FAF8F3; --fg:#1A1A1A; --muted:#6F6A60; --card:#FFFFFF; --line:rgba(26,26,26,.16);
  --bg-alt:#1F2A24; --fg-alt:#F4F1E8; --muted-alt:#A9B3AB; --card-alt:#2A372F; --line-alt:rgba(244,241,232,.2);
  --accent:#B4532A; --on-accent:#FFFFFF; --accent-alt:#E9956A; --on-accent-alt:#1F2A24;
  --font-head:'Playfair Display',serif; --font-body:'Inter',sans-serif;
  --head-weight:700; --head-tracking:-0.01em; --radius:8px;
}
```

## Тёмный

Тёмный фон, холодный светлый текст, кислотный акцент. Контрастные слайды — светлые.

```html
<link rel="stylesheet" href="fonts/geologica/font.css">
<link rel="stylesheet" href="fonts/inter/font.css">
```
```css
:root{
  --bg:#0E1014; --fg:#F2F4F7; --muted:#9299A6; --card:#191C22; --line:rgba(242,244,247,.14);
  --bg-alt:#F2F4F7; --fg-alt:#0E1014; --muted-alt:#5A6170; --card-alt:#FFFFFF; --line-alt:rgba(14,16,20,.14);
  --accent:#C6F432; --on-accent:#0E1014; --accent-alt:#4B7A00; --on-accent-alt:#FFFFFF;
  --font-head:'Geologica',sans-serif; --font-body:'Inter',sans-serif;
  --head-weight:800; --head-tracking:-0.03em; --radius:24px;
}
```

## Мягкий

Пудровые тона, изящная антиква, крупные скругления.

```html
<link rel="stylesheet" href="fonts/cormorant-garamond/font.css">
<link rel="stylesheet" href="fonts/manrope/font.css">
```
```css
:root{
  --bg:#FBF3EE; --fg:#3B2F2A; --muted:#857167; --card:#FFFFFF; --line:rgba(59,47,42,.14);
  --bg-alt:#E9D5C9; --fg-alt:#3B2F2A; --muted-alt:#75625A; --card-alt:#F6E9E1; --line-alt:rgba(59,47,42,.18);
  --accent:#BF5A3F; --on-accent:#FFFFFF; --accent-alt:#A8472E; --on-accent-alt:#FFFFFF;
  --font-head:'Cormorant Garamond',serif; --font-body:'Manrope',sans-serif;
  --head-weight:700; --head-tracking:-0.01em; --radius:44px;
}
h1{font-size:132px;} h1.sm{font-size:108px;} h2{font-size:84px;} h2.sm{font-size:68px;} .btn{font-size:46px;} .quote{font-size:74px;}
```

## Яркий

Насыщенный цветной фон, белый текст, жёлтый акцент.

```html
<link rel="stylesheet" href="fonts/golos-text/font.css">
<link rel="stylesheet" href="fonts/inter/font.css">
```
```css
:root{
  --bg:#5B2EFF; --fg:#FFFFFF; --muted:rgba(255,255,255,.8); --card:rgba(255,255,255,.12); --line:rgba(255,255,255,.28);
  --bg-alt:#0F0A2A; --fg-alt:#FFFFFF; --muted-alt:#B5ADD9; --card-alt:#1D1546; --line-alt:rgba(255,255,255,.18);
  --accent:#FFE14D; --on-accent:#1A1040; --accent-alt:#FFE14D; --on-accent-alt:#1A1040;
  --font-head:'Golos Text',sans-serif; --font-body:'Inter',sans-serif;
  --head-weight:800; --head-tracking:-0.01em; --radius:36px;
}
```

## Необрутализм

Плоские цвета, чёрные рамки, жёсткие тени без размытия.

```html
<link rel="stylesheet" href="fonts/rubik/font.css">
<link rel="stylesheet" href="fonts/inter/font.css">
```
```css
:root{
  --bg:#FFF4D6; --fg:#111111; --muted:#4A4A4A; --card:#FFFFFF; --line:#111111;
  --bg-alt:#111111; --fg-alt:#FFF4D6; --muted-alt:#C9C1A8; --card-alt:#242424; --line-alt:#FFF4D6;
  --accent:#FF4D8D; --on-accent:#111111; --accent-alt:#FF4D8D; --on-accent-alt:#111111;
  --font-head:'Rubik',sans-serif; --font-body:'Inter',sans-serif;
  --head-weight:800; --head-tracking:-0.01em; --radius:10px;
}
.card,.btn,.kicker{border:4px solid var(--c-fg);box-shadow:10px 10px 0 var(--c-fg);}
.kicker,.btn{border-radius:10px;}
```

## Данные

Белый фон, строгая сетка, синий акцент, цифры моноширинным шрифтом.

```html
<link rel="stylesheet" href="fonts/onest/font.css">
<link rel="stylesheet" href="fonts/inter/font.css">
<link rel="stylesheet" href="fonts/jetbrains-mono/font.css">
```
```css
:root{
  --bg:#FFFFFF; --fg:#0F172A; --muted:#64748B; --card:#F1F5F9; --line:rgba(15,23,42,.12);
  --bg-alt:#0F172A; --fg-alt:#F8FAFC; --muted-alt:#94A3B8; --card-alt:#1E293B; --line-alt:rgba(248,250,252,.16);
  --accent:#2563EB; --on-accent:#FFFFFF; --accent-alt:#60A5FA; --on-accent-alt:#0F172A;
  --font-head:'Onest',sans-serif; --font-body:'Inter',sans-serif;
  --head-weight:800; --head-tracking:-0.03em; --radius:16px;
}
.big,.head .num{font-family:'JetBrains Mono',monospace;letter-spacing:-0.04em;}
.s{background-image:linear-gradient(var(--c-line) 1px,transparent 1px),linear-gradient(90deg,var(--c-line) 1px,transparent 1px);background-size:90px 90px;}
```

## Крафт

Бумажный фон, тёплые природные цвета, декоративная антиква.

```html
<link rel="stylesheet" href="fonts/yeseva-one/font.css">
<link rel="stylesheet" href="fonts/pt-sans/font.css">
```
```css
:root{
  --bg:#F3E9D7; --fg:#2A2118; --muted:#746451; --card:#FBF5EA; --line:rgba(42,33,24,.18);
  --bg-alt:#2F4A3A; --fg-alt:#F3E9D7; --muted-alt:#B9C4B4; --card-alt:#3A5846; --line-alt:rgba(243,233,215,.2);
  --accent:#C2452D; --on-accent:#FBF5EA; --accent-alt:#F2A65A; --on-accent-alt:#2A2118;
  --font-head:'Yeseva One',serif; --font-body:'PT Sans',sans-serif;
  --head-weight:400; --head-tracking:0; --radius:20px;
}
```

## Свой набор токенов

Собирая токены из брендбука или подбирая стиль с нуля, держи правила:

- Контраст текста с фоном не ниже 4,5:1. Акцентный цвет на фоне — не ниже 3:1, и только в крупном тексте и плашках.
- Один акцентный цвет. Второй допустим только в данных и схемах.
- Не больше двух шрифтов: один для заголовков, один для текста. У обоих должна быть кириллица.
- `--bg-alt` заметно отличается от `--bg`: контрастные слайды задают ритм карусели.
- `--accent-alt` — тот же акцент, подобранный под `--bg-alt`. Если основной акцент на контрастном фоне читается, значения совпадают.
- Жирные начертания (800–900) не ужимай трекингом сильнее −0.01em: буквы слипаются.
- В наборе `fonts/` есть: Manrope, Inter, Golos Text, Onest, Rubik, Geologica, PT Sans (гротески); Playfair Display, Cormorant Garamond, Yeseva One (антиквы); JetBrains Mono (моноширинный).
- Фирменного шрифта в наборе нет — ищи его файлы в `brand/fonts/` и подключи через `@font-face`, скопировав в `posts/<slug>/fonts/`. Файлов нет — возьми ближайший по характеру из набора и скажи об этом пользователю. Ссылки на шрифты в интернете не ставь.
