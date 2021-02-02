'use strict';
// Modul zum Erstellen eines Webservers importieren
const express = require('express');
// Modul zur Interaktion mit File System
const fs = require('fs');

// Date-Funktion für Monatsname
Date.prototype.getMonthName = function() {
    const MONTHNAMES = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEZ" ];
    return MONTHNAMES[this.getMonth()];
}

// Funktion für Datumsformat
let logLine = ": http://mynode/login.html -> nicht erreichbar!"
let writeDate = today => {
    let dy = today.getDay();
    let yr = today.getFullYear();
    let mth = today.getMonthName();
    return `${dy}-${mth}-${yr}`
}

// Erzeugen des Server-Objektes
let server = express();

// Middleware zum Bereitstellen von statischen Dateien
server.use(express.static('public', {
    // Falls keine Extension angegeben und die Datei nicht gefunden wurde, wird die Endung html ausprobiert (Fallback)
    extensions: ['html']
}));

// Routen
// Rückmeldung an Client
server.head('/login', (req,res) => {
    const my_resp = JSON.stringify({ok: true});
    res.send(my_resp);
})

// Postanfrage vom Client bearbeiten
server.post('/login', () => {
    let today = new Date();
    // gucken, ob directory & file da sind
    fs.access('logs/access.log', err => {
        // wenn ja, dann ergänzen
        if (!err) {
            fs.appendFile('logs/access.log', `${writeDate(today)} ${today.toLocaleTimeString()} ${logLine}\n`, err => {
                if (err) console.log(err);
                console.log('appendFile erfolgreich');
            })
        }
        // Wenn nicht, dann erstelle Verzeichnis...
        else {
            fs.mkdir('logs', () => {
                console.log('Verzeichnis erstellt');
                // ...erstelle eine Datei darin...
                fs.writeFile('logs/access.log', `${writeDate(today)} ${today.toLocaleTimeString()} ${logLine}\n`, () => {
                    console.log("Datei erstellt");
                });
            });            
        };
         
    })
})


// Auf den Port 80 horchen & bestätigen
server.listen(80,err => {
    if (err) console.log(err);
    else console.log('Server läuft');
})