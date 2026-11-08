# Mobility Decision Game – Web-Prototyp Version 2 (Fall Herr M.)

Statische Webseite (HTML, CSS, JavaScript) ohne Server, ohne Konto, ohne externe Anfragen. Der Spielstand liegt nur im Browser des Geräts.

## Neu in Version 2
- **Heller Look** (Palette: Grautöne mit Lime, Blau und Cyan als Highlights), runde Knöpfe, eckige Kästchen.
- **Patientenakte** (Prolog): Patientenebene mit ICF-Feldern, Historia morbis und Rahmendaten. Die Akte füllt sich im Spiel (Zwischenhypothese, Befund, Diagnose, Ziel, Maßnahme, Wiederbefund, Ereignis). Quer (ab ca. 900 px Breite) steht sie links, im Hochformat über den Knopf **AKTE**.
- **Praxisweg:** Entscheidungsbaum als Karte. Nur besuchte Stationen sind benannt, am Ende wird alles aufgedeckt.
- **Pfeil ①** heißt jetzt Zwischenhypothese und Untersuchung und endet mit der **physiotherapeutischen Diagnose**.
- **Dosierungs-Stepper** mit Live-Berechnung (Volumen, Dauer, grobe Tendenz) und **ASTE**.
- **Therapieplanung** am Ende (A4 quer, schwarz auf weiß) mit Praxisweg, **PDF speichern / Drucken** und **Teilen**. Der Dateiname enthält den Teamnamen.
- **Raum neu starten** (Knopf oben).

## Inhalt
`index.html`, `style.css`, `game.js` (Oberfläche und Logik) · `data.js` (Fall Herr M., Akte, Ereigniskarten; alle Zahlen und Texte sind **Spielwerte**, die Akte-Texte sind Entwürfe zur fachlichen Prüfung) · `fonts/` (lokal eingebunden; Lizenz bitte selbst prüfen, meines Wissens SIL Open Font License) · `.nojekyll`

## Auf GitHub Pages veröffentlichen (kostenloses Konto: nur öffentliches Repository)
1. Bei GitHub anmelden, **New repository** (Public).
2. **Add file → Upload files**: alle Dateien und den Ordner `fonts` hineinziehen (bestehende Dateien werden ersetzt), **Commit changes**.
3. **Settings → Pages**: Branch `main`, Ordner `/ (root)`.
4. Adresse öffnen und die Seite neu laden (iPad: ggf. Cache leeren).

Bei einem öffentlichen Repository ist alles einsehbar (Lösungen, Codes). Keine Klarnamen oder geschützten Inhalte hochladen.

## Testen
- **Kartenmodus:** Standard. Das Spiel nennt die Kartennummer, die Karten liegen ausgedruckt am Tisch (Kartenset-PDF).
- **Alleine testen:** `?karten=bildschirm` an die Adresse hängen.
- **PDF/AirDrop auf dem iPad:** Am Ende „PDF speichern / Drucken“, dann Vorschau mit zwei Fingern aufziehen, Teilen, AirDrop. Der Ablauf ist nicht geprüft, bitte am iPad testen. „Teilen“ sendet nur den Text der Präsentation.
- **Spielstand:** wird lokal gespeichert. „Neues Spiel / Daten löschen“ unten setzt zurück (auf geteilten Geräten nach jeder Gruppe nutzen).

## Stand und Grenzen
Wurde nur auf Syntaxfehler geprüft, **nicht in Browsern oder auf iPads getestet**. Nicht enthalten: Patienten-Sprechblasen, Ton, Live-Vergleich der Teams, echte PDF-Erzeugung, weitere Fälle (kommt mit der Maske).
