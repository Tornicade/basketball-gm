// Originally based on https://github.com/Srirangan/notifer.js/

const container = document.createElement("div");
container.id = "notification-container";
container.classList.add("notification-container");
document.body.appendChild(container);

const notify = (message, title, persistent = false, timeOut) => {
    let timeoutRemaining = timeOut || 5000;

    let notificationElement = document.createElement("div");
    notificationElement.classList.add("notification");
    notificationElement.classList.add("notification-fadein");

    const textElement = document.createElement("div");

    let text = "";
    if (title) {
        text += `<strong>${title}</strong><br>`;
    }
    if (message) {
        text += message;
    }
    textElement.innerHTML = text;
    notificationElement.appendChild(textElement);

    if (!persistent) {
        let timeoutId, timeoutStart;

        // Hide notification after timeout
        const notificationTimeout = () => {
            timeoutId = window.setTimeout(() => {
                if (container.contains(notificationElement)) {
                    notificationElement.classList.add("notification-delete");
                }
            }, timeoutRemaining);
            timeoutStart = new Date();
        };
        notificationTimeout();

        // When hovering over, don't count towards timeout
        notificationElement.addEventListener("mouseenter", () => {
            window.clearTimeout(timeoutId);
            timeoutRemaining -= new Date() - timeoutStart;
        });
        notificationElement.addEventListener("mouseleave", notificationTimeout);
    } else {
        // Add close link to persistent ones
        const closeLink = document.createElement("button");
        closeLink.classList.add("notification-close");
        closeLink.innerHTML = "&times;";
        notificationElement.classList.add("notification-persistent");
        closeLink.addEventListener("click", () => {
            notificationElement.classList.add("notification-delete");
        });

        notificationElement.appendChild(closeLink);
    }

    /*// Hide notification on click, except if it's a link
    notificationElement.addEventListener("click", function (event) {
        container.removeChild(notificationElement);
        notificationElement = null;
    });
    // PROBLEM: Stopping hiding on link click doesn't work because it also stops Davis.js from working
    links = notificationElement.getElementsByTagName("a");
    for (i = 0; i < links.length; i++) {
        links[0].addEventListener("click", function (event) {
            event.stopPropagation();
        });
    }*/

    // Limit displayed notifications to 5 - all the persistent ones, plus the newest ones
    let numToDelete = container.childNodes.length - 4; // 4 instead of 5 because the check happens before the new notification is shown
    if (numToDelete > 0) {
        for (let i = 0; i <= container.childNodes.length; i++) {
            if (container.childNodes[i].classList.contains("notification-delete")) {
                // Already being deleted
                numToDelete -= 1;
            } else if (container.childNodes[i] && !container.childNodes[i].classList.contains("notification-persistent")) {
                container.childNodes[i].classList.add("notification-delete");
                numToDelete -= 1;
            }

            if (numToDelete <= 0) {
                break;
            }
        }
    }

    const removeOnFadeOut = event => {
        if (event.animationName === "fadeOut") {
            container.removeChild(notificationElement);
            notificationElement = null;
        }
    };
    notificationElement.addEventListener("webkitAnimationEnd", removeOnFadeOut);
    notificationElement.addEventListener("animationend", removeOnFadeOut);


    container.appendChild(notificationElement);
};

module.exports = {
    notify,
};
