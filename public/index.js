'use strict';

let urlInput = document.querySelector('#urlInput');
let body = document.querySelector('body');

// Funktionen
const createElement = ({
    content = false,
    parent = false,
    classes = [],
    type = 'div',
    attributes = {},
    events = {},
}) => {
    let newEl = document.createElement(type);
    if (content) newEl.innerHTML = content;
    if (parent) parent.append(newEl);
    if (classes.length) newEl.className = classes.join(' ');
    Object.entries(attributes).forEach(a => newEl.setAttribute(...a));
    Object.entries(events).forEach(event => newEl.addEventListener(...event));
    return newEl
}

let askForStatus = input => {
    // fetch-Request an Server mit Route input
    // Method HEAD, um nur den Status im Header abzufragen
    fetch(input, {method: 'HEAD'}).then((response) => {
        if (response.ok) {
            window.alert("url ok")
        } else {
            throw new Error('Something went wrong');
        }
    }).catch((error) => {
        console.log(error)
    })
}

let triggerMonitoring = input => {
    fetch(input, {method: 'POST'}).then((response) => {
        if (response) {
            console.log(response);
        }
    })
}

// EventListener für Eingabe
urlInput.addEventListener('keyup', event => {
    if (event.key == "Enter") {
        // ! Eingabe extrahieren? !
        let input = event.target.value;
        createElement({
            content: "Deine Eingabe: " + input,
            parent: body,
        });
        askForStatus(input);
        triggerMonitoring(input);
        event.target.value = "";
    }
})
