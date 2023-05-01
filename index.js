let keyboard = null;
class Keyboard {
    elements = {
        main: null,
        keysContainer: null,
        keys: []
    };

    eventHandlers = {
        oninput: null,
        onclose: null
    };

    properties = {
        value: "",
        capsLock: false
    };
    constructor(lang) {
        this.init(lang)
    }

    init(lang) {
        if (this.elements.main) {
            document.body.removeChild(this.elements.main)
            this.elements = {
                main: null,
                keysContainer: null,
                keys: []
            };
        }

        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");
        this.elements.main.classList.add("keyboard");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys(lang));
        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
            element.addEventListener("input", () => {

                this.properties.value = element.value;
            });
        });
    }
    _createKeys(lang) {

        const fragment = document.createDocumentFragment();
        let keyLayout;
        if (lang === 'eng') {
            keyLayout = [
                "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
                "Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "Del",
                "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
                "z", "x", "c", "v", "b", "n", "m", ",", ".", "?", "▲", "shift",
                "Ctrl", "Win", "Alt", "Space", "◄", "▼", "►",
            ];
        } else {
            keyLayout = [
                "ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
                "Tab", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "Del",
                "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
                "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", "?", "▲", "shift",
                "Ctrl", "Win", "Alt", "Space", "◄", "▼", "►",
            ];
        }
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["backspace", "Del", "enter", "shift"].indexOf(key) !== -1;


            keyElement.setAttribute("type", "button");
            keyElement.setAttribute("keyname", key);
            keyElement.classList.add("keyboard__key");

            switch (key) {
                case "Tab":
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener("click", () => {
                        const cursorPos = document.getElementById("textarea").selectionStart;
                        this.properties.value = this.properties.value.slice(0, cursorPos) + '  ' + this.properties.value.slice(cursorPos);
                        this._triggerEvent("oninput");
                        document.getElementById("textarea").focus();
                        document.getElementById("textarea").selectionStart = cursorPos + 2;
                        document.getElementById("textarea").selectionEnd = cursorPos + 2;
                    });
                    break;

                case "backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent("oninput");
                    });

                    break;
                case "Del":

                    keyElement.innerHTML = "Del";

                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent("oninput");
                    });

                    break;

                case "caps":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                    });

                    break;
                case "Ctrl":

                    keyElement.innerHTML = "Ctrl";

                    keyElement.addEventListener("keydown", () => {
                        keyElement === true;
                    });
                    keyElement.addEventListener("keyup", () => {
                        keyElement === false;
                    });

                    break;

                case "shift":

                    keyElement.innerHTML = "Shift";

                    keyElement.addEventListener("keydown", () => {
                        keyElement === true;
                    });
                    keyElement.addEventListener("keyup", () => {
                        keyElement === false;
                    });

                    break;

                case "Alt":

                    keyElement.innerHTML = "Alt";

                    keyElement.addEventListener("keydown", () => {
                        keyElement === true;
                    });
                    keyElement.addEventListener("keyup", () => {
                        keyElement === false;
                    });

                    break;
                case "enter":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "Space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", () => {
                        const cursorPos = document.getElementById("textarea").selectionStart;
                        this.properties.value = this.properties.value.slice(0, cursorPos) + ' ' + this.properties.value.slice(cursorPos);
                        this._triggerEvent("oninput");
                        document.getElementById("textarea").focus();
                        document.getElementById("textarea").selectionStart = cursorPos + 1;
                        document.getElementById("textarea").selectionEnd = cursorPos + 1;

                    });

                    break;

                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener("click", () => {
                        const cursorPos = document.getElementById("textarea").selectionStart;
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent("oninput");
                        document.getElementById("textarea").focus();
                        document.getElementById("textarea").selectionStart = cursorPos + 1;
                        document.getElementById("textarea").selectionEnd = cursorPos + 1;

                    });

                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    }
    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    }

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    }

    open(initialValue, oninput) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
    }

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
    }

}
window.addEventListener("DOMContentLoaded", function () {

    const title = document.createElement('div');
    title.classList.add('title');
    const titleText = document.createElement('h1');
    titleText.innerHTML = 'Virtual Keyboard';
    title.appendChild(titleText);
    const buttonText = document.createElement('h4');
    buttonText.innerHTML = 'You can change language by using shortcut "shift" + "p"';
    title.appendChild(buttonText)
    document.body.appendChild(title);

    const language = document.createElement('div');
    language.classList.add('button');
    const buttonLangEn = document.createElement('button');
    buttonLangEn.classList.add('en');
    if (localStorage.getItem('lang') === 'eng') {
        buttonLangEn.classList.add('active');
    }

    buttonLangEn.setAttribute('id', 'eng');
    buttonLangEn.innerHTML = 'ENG';
    language.appendChild(buttonLangEn)

    const buttonLangRu = document.createElement('button');
    buttonLangRu.classList.add('ru');
    if (localStorage.getItem('lang') === 'rus') {
        buttonLangRu.classList.add('active');
    }
    buttonLangRu.setAttribute('id', 'rus');
    buttonLangRu.innerHTML = 'RUS';
    language.appendChild(buttonLangRu)
    document.body.appendChild(language);

    const textArea = document.createElement('div');
    textArea.classList.add('area');
    const textAreaText = document.createElement('textarea');
    textAreaText.classList.add('use-keyboard-input')
    textAreaText.setAttribute('id', 'textarea');
    textAreaText.setAttribute('rows', '15');
    textAreaText.setAttribute('cols', '80');
    textArea.appendChild(textAreaText);
    document.body.appendChild(textArea);
    keyboard = new Keyboard(localStorage.getItem('lang') || 'eng');
    const buttonEng = document.getElementById('eng');
    buttonEng.addEventListener("click", (event) => {
        langEn(event);
    })
    const buttonRus = document.getElementById('rus')
    buttonRus.addEventListener("click", (event) => {
        langRu(event);
    })
});

function langEn() {
    const buttonEng = document.getElementById('eng');
    const buttonRus = document.getElementById('rus')
    localStorage.setItem('lang', 'eng');
    keyboard.init('eng')
    buttonEng.classList.add('active');
    buttonRus.classList.remove('active');
}

function langRu() {
    const buttonRus = document.getElementById('rus')
    const buttonEng = document.getElementById('eng');
    localStorage.setItem('lang', 'rus');
    keyboard.init('rus')
    buttonEng.classList.remove('active');
    buttonRus.classList.add('active');
}


window.addEventListener("keydown", function (event) {
    if (event.shiftKey && event.code === 'KeyP') {
        if (localStorage.getItem('lang') === 'eng') {
            langRu(event);
        } else {
            langEn(event);
        }
    }

    switch (event.key) {
        case "Down":
        case "ArrowDown":

            break;
        case "Up":
        case "ArrowUp":
            break;
        case "Left":
        case "ArrowLeft":

            break;
        case "Right":
        case "ArrowRight":

            break;
        case "Enter":

            break;
        case "Esc":
        case "Escape":

            break;
        case ' ':
            document.querySelector(`[keyname="${event.code}"]`).classList.add('active');
            break;
        default:
            document.querySelector(`[keyname="${event.key}"]`).classList.add('active');
    }
}, true);

window.addEventListener("keyup", function (event) {
    switch (event.key) {
        case "Down":
        case "ArrowDown":

            break;
        case ' ':
            document.querySelector(`[keyname="${event.code}"]`).classList.remove('active');
            break;
        default:
            document.querySelector(`[keyname="${event.key}"]`).classList.remove('active');
    }
}, true);