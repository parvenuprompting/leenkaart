# ROADMAP — proto-batterij-leenkaart

Documentatie en overdracht voor de volgende agent of ontwikkelaar.

---

## 1. Context

- **Idee uit het Ideeënarchief:** *Batterij Leenkaart*
- **Verzameling:** 50 Kleine Tools (groep: Nieuwe concepten)
- **Omschrijving:** *"Houdt bij aan wie je een powerbank of accu hebt uitgeleend."*
- **Ideeënarchief live:** [https://tiendos-ideeenarchief.netlify.app](https://tiendos-ideeenarchief.netlify.app)
- **Repository:** [https://github.com/parvenuprompting/proto-batterij-leenkaart](https://github.com/parvenuprompting/proto-batterij-leenkaart)
- **Bouwdatum:** 8 september 2026 door KairOS (VPS Hermes)

---

## 2. Huidige staat

### Wat werkt nu echt:
- Toevoegen en bewerken van leenkaarten (apparaat, categorie, specificaties, lener, data, notities).
- Direct status wisselen (1-klik markering als retour of heropenen).
- Live statistieken teller (totaal, actief uitgeleend, verstreken/te laat, geretourneerd).
- Filtering op status (Alles, Uitgeleend, Te laat, Geretourneerd) en realtime fulltext filter (lener, apparaat, capaciteit, notitie).
- Volledige dark/light mode toggle met automatische onthouding in `localStorage`.
- Data persistentie in de browser via `localStorage` inclusief realistische demodata bij eerste bezoek.
- Exportfunctie naar zowel CSV (Excel/spreadsheet compatible met puntkomma-scheiding en UTF-8 BOM) als JSON.
- Responsieve en rustige gebruikersinterface conform de ontwerprichtlijnen (#F4F1E9 / #19202C).

### Bewust buiten scope gelaten voor dit prototype:
- Externe SMS/WhatsApp-herinneringen (geen externe API's of betaalde diensten).
- Backend databases of multi-user authenticatie (volledig lokaal en privacy-vriendelijk gehouden).
- Barcode/QR-code scanning van unieke accunummers via camera.

---

## 3. Technologische keuzes

- **HTML5 (semantisch):** Toegankelijke formulieren, modal dialogen en overzichten zonder zware dependencies.
- **Vanilla CSS3:** CSS Custom Properties voor vlekkeloze dark/light modus, zero-dependency layout via flexbox & CSS grid.
- **Client-side JavaScript (ES6+):** Schoon state-management, modale interacties, date-berekeningen en directe data-URL downloads.
- **LocalStorage:** Veilige, 100% offline en zero-cost opslag direct op het apparaat van de gebruiker.

---

## 4. Structuur

- `index.html`: Hoofdpagina, semantische layout, statistiekenbalk, filterknoppen en modal formulier.
- `style.css`: Volledige styling, kleurenpalet (licht/donker), knoppen, kaarten en modale elementen.
- `app.js`: State management, event listeners, datumvergelijking, localStorage sync en CSV/JSON export.
- `logo.svg`: Minimalistisch vectorlogo met transparante achtergrond.
- `README.md`: Projectoverzicht met shields.io-badges, gebruiksinstructies en context.
- `ROADMAP.md`: Dit overdrachtsdocument voor vervolgsessies.
- `.gitignore`: Standaard negeerlijst voor OS- en editorspecifieke bestanden.

---

## 5. Acceptatiecriteria

| Criterium | Status | Verificatie |
|---|---|---|
| 1. Nieuwe leenkaart toevoegen met type, capaciteit, lener en datum; kaart verschijnt direct | ✅ Voltooid | Open modal, vul in, kaart wordt toegevoegd aan de lijst en statistieken updaten. |
| 2. Status wijzigen naar 'Geretourneerd' met 1 klik; statusfilter filtert correct | ✅ Voltooid | Klik op '✓ Markeer als retour', statusbadge wijzigt direct en filter toont juiste subsets. |
| 3. Dark/light mode schakelt direct en onthoudt de voorkeur persistent | ✅ Voltooid | Klik op thema-icoon; `data-theme` en `localStorage` bewaren `dark` / `light`. |
| 4. Data blijft bewaard na herladen en kan geëxporteerd worden naar CSV en JSON | ✅ Voltooid | Ververs pagina, data is er nog; klik op CSV/JSON downloadt valide bestanden. |
| 5. Volledig client-side zonder externe netwerkverzoeken; rustig 3-kleurenschema | ✅ Voltooid | Geen externe scripts of stylesheets, kleuren matchen Tiëndo's ontwerppalet. |

---

## 6. Volgende stappen voor een vervolgsessie

1. **JSON Importfunctie:** Voeg naast de export-knoppen een eenvoudige file-picker toe om eerder geëxporteerde JSON-backups in te laden.
2. **Foto/Afbeelding toevoegen:** Optie toevoegen om een kleine thumbnail van het apparaat op te slaan (via HTML5 canvas resizing en Base64 data-URL in localStorage).
3. **QR-code generator:** Mogelijkheid bieden om een kleine sticker/QR-code te genereren die op de accu geplakt kan worden.
4. **Snelle WhatsApp template:** Een knop "Stuur herinnering" die een kant-en-klare `https://wa.me/?text=...` link opent met een vriendelijk vooringevuld herinneringsbericht.
5. **Printbare leenbon:** Eenvoudige CSS `@media print` stylesheet om een compacte fysieke uitgiftebon of inventarislijst te kunnen printen.

---

## 7. Bekende beperkingen & risico's

- **Browser-cache wissen:** Omdat de opslag uitsluitend in `localStorage` plaatsvindt, raakt de data verloren als de gebruiker zijn site-gegevens/cookies agressief wist. *(Oplossing: de CSV/JSON export knoppen zijn direct zichtbaar in de header).*
- **LocalStorage limiet:** Ongeveer 5MB opslag per domein. Voor duizenden tekstuele leenkaarten ruim voldoende, maar beelden moeten voorzichtig worden gecomprimeerd.
