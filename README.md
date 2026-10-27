# WH Digital Todos (PWA)

Einfache Todo-App für Android: Aufgaben per **Tippen**, **Sprechen** oder **Foto** erfassen.

## Funktionen
- Offene Aufgaben und erledigte Aufgaben in einer Liste
- Tippen: Textfeld → ＋
- Sprechen: 🎙️ startet die Spracherkennung (Deutsch), nach dem Stopp wird die Aufgabe automatisch gespeichert (Chrome/Android)
- Foto: 📷 öffnet die Kamera, Foto + optionale Beschreibung speichern
- Erledigt-Haken verschiebt die Aufgabe in den Bereich „Erledigt“; 🗑️ löscht sie endgültig
- **100 % lokal**: Daten liegen im `localStorage` des Browsers – kein Server, keine Cloud

## Wichtig zur Datenspeicherung
Die Aufgaben werden im Browser-Speicher (localStorage) **auf dem Smartphone** gespeichert. Das bedeutet:
- Überleben von App-Neustarts und Handy-Neustart
- **ABER**: Löscht du den Browserverlauf/-daten der App (z. B. „Website-Daten löschen“), sind die Aufgaben weg. Das ist bei rein lokalen PWAs nicht vermeidbar.
- Tipp: In Chrome unter `Einstellungen → Website-Einstellungen` nicht die Daten der App löschen.

## Installation auf Android (Chrome)
1. Repository als GitHub Pages aktivieren: Settings → Pages → Branch `main`
2. `https://<user>.github.io/<repo>/` öffnen
3. Menü (⋮) → **„Zum Startbildschirm hinzufügen“** / „App installieren“
4. Die App startet danach wie eine native App, offline nutzbar

## Dateien
- `index.html` / `app.js` / `manifest.webmanifest` / `sw.js`
- `icons/` – WH Digital Logo in verschiedenen Größen
