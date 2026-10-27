---
title: "Esimerkkisivu"
description: "Tämä sivu esittelee julkisen artikkelipohjan kaikki ominaisuudet."
author: "TKO-äly"
date: 2026-10-24
readingTime: 3
tag: "ESIMERKKI"
coverImage: "https://www.tko-aly.fi/images/kyykka2008.png"
coverImageAlt: "Kyykkäpelaajia vuodelta 2008"
---

Tämä sivu esittelee kaikki julkisen artikkelipohjan ominaisuudet: front matter -metatiedot, sisällysluettelon, otsikkotasot, listat, koodin, taulukot ja linkit. Sivu on tarkoitettu vain kehityskäyttöön.

> Front matter luetaan sivun alussa olevasta YAML-lohkosta. Se näkyy sivun yläpalkissa (päivämäärä, lukuaika ja tunniste).

## Tekstin muotoilu

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Tekstissä voi käyttää **lihavointia**, _kursiivia_ ja `inline-koodia`, ~~yliviivausta~~ ja kaikkea yhdessä. Sisäinen linkki: [Edunvalvonta](/fi/edunvalvonta). Ulkoinen linkki: [tko-aly.fi](https://tko-aly.fi).

### Lorem ipsum

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

### Dolor sit amet

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

## Listat

### Järjestämätön lista

- Ensimmäinen kohta
- Toinen kohta
  - Sisäkkäinen kohta
  - Toinen sisäkkäinen kohta
- Kolmas kohta

### Järjestetty lista

1. Avaa sivu
2. Vieritä alaspäin
3. Katso, miten sisällysluettelo seuraa

## Tekstityylit

Normaali teksti on sans serif -fontilla. Alla kaikki tyylit rivi riviltä:

- Tavallinen teksti
- _Kursivoitu teksti_
- **Lihavoitu teksti**
- `Mono-teksti`
- _**Kursivoitu ja lihavoitu**_
- **`Mono ja lihavoitu`**
- ~~Yliviivattu teksti~~

## Koodi

Esimerkki front matterista:

```yaml
---
title: "Otsikko"
date: 2026-10-24
readingTime: 3
tag: "TUNNISTE"
---
```

Ja esimerkki TypeScriptistä:

```ts
export function greet(name: string) {
  return `Hei, ${name}!`
}
```

## Taulukko

| Ominaisuus    | Lähde        | Näkyy             |
| ------------- | ------------ | ----------------- |
| `title`       | front matter | välilehden nimi   |
| `date`        | front matter | yläpalkki         |
| `readingTime` | front matter | yläpalkki         |
| `tag`         | front matter | yläpalkin merkki  |
| `coverImage`  | front matter | artikkelin yläosa |

## Kuva

![Kyykkäpelaajia vuodelta 2008](https://www.tko-aly.fi/images/kyykka2008.png)

## Pitkä sisältö sisällysluettelon testaamiseen

### Osio 1

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

### Osio 2

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

### Osio 3

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Vaakasuora viiva

---

Viivan jälkeinen kappale. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Loppusanat

Kiitos kun luit! Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
