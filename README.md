# Leenkaart (`proto-batterij-leenkaart` → hernoemd naar generieke Leenkaart)

![Status](https://img.shields.io/badge/status-prototype-orange.svg)
![Type](https://img.shields.io/badge/technologie-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-blue.svg)
![Storage](https://img.shields.io/badge/opslag-100%25%20lokaal%20(localStorage)-green.svg)
![License](https://img.shields.io/badge/licentie-MIT-lightgrey.svg)

Minimalistische, privacy-vriendelijke webtool om ALLES bij te houden wat je uitleent — powerbanks, gereedschap, boeken, geld, sleutels, kleding, wat dan ook. Wie, wat, en wanneer het terugkomt.

> **Origineel idee uit het Ideeënarchief:**  
> *Batterij Leenkaart* (Verzameling: 50 Kleine Tools, groep: Nieuwe concepten):  
> *"Houdt bij aan wie je een powerbank of accu hebt uitgeleend."* — uitgebreid naar ALLES wat uigeleend wordt.

---

## Kernfunctionaliteiten

- **Snel registreren**: Noteer wat je uitleent (vrij veld + categorie: Powerbank, Gereedschap, Boek/Media, Geld/Waarde, Voertuig, Kleding, Elektronica, Overig), een vrije specificatie (capaciteit, maat, druk, bedrag — wat van toepassing), lener, leendatum, verwachte retourdatum en status.
- **Direct overzicht & status**: Zie in één oogopslag wat is uitgeleend, wat overtijd/verstreken is, en wat al netjes is geretourneerd.
- **1-Klik retour**: Markeer een item direct als geretourneerd of heropen de kaart.
- **100% Lokaal & Privacy-first**: Alle data blijft in je browser via `localStorage`. Geen externe servers, geen accounts, geen cookies of tracking.
- **Design & Rust**: Rustig 3-kleurenschema (#F4F1E9 papier, #19202C inkt, salie/petrol accent) met Dark & Light-mode (met onthoudfunctie).
- **Exportmogelijkheden**: Exporteer al je leenkaarten naar **CSV** (gescheiden met puntkomma's voor Excel/spreadsheet) of **JSON**.

---

## Lokaal draaien

Aangezien dit een pure client-side webtool is zonder build-dependencies, kun je het direct in elke browser openen:

```bash
git clone https://github.com/parvenuprompting/proto-batterij-leenkaart.git
cd proto-batterij-leenkaart
```

Open `index.html` rechtstreeks in je favoriete browser of start een lokale test-server:

```bash
python3 -m http.server 8000
# Bezoek http://localhost:8000
```

---

## Status

Dit project is een werkend nachtelijk prototype (fase: MVP). Voor een overzicht van de architectuur, acceptatiecriteria en geplande vervolgstappen, zie [ROADMAP.md](ROADMAP.md).
