/**
 * Send a "request" to the makaira backend with the
 * <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage">postMessage function</a>
 * to get the JWT-Token of the current user.
 *
 */
function requestUserFromMakairaBackend() {
    const message = {
        "source": "makaira-app-boilerplate", // replace with makaira-app-{YOU_APP_SLUG}
        "action": "requestUser",
        "hmac": HMAC,
        "nonce": NONCE,
        "makairaHmac": MAKAIRA_HMAC
    }

    window.parent.postMessage(message, document.referrer)
}

/**
 * Handler for the message listener.
 *
 * @param event{MessageEvent}
 */
function handleOnMessage(event) {
    const { source, action, data, message } = event.data

    // Check that the message came from the makaira backend
    if (source !== "makaira-app-bridge") return
    // Check that the response came from a makaira domain. https://*.makaira.io
    // if (event.origin.match("https:\\/\\/([a-zA-Z])+\\.makaira\\.io")?.index !== 0) return

    if (action === "responseUserRequest") {
        const parsedToken = parseJWT(data.token)

        document.getElementById("makaira-user").innerText = parsedToken.email
        document.getElementById("makaira-role").innerText = parsedToken["https://makaira.io/roles"]
    }

    if (action === "responseUserRequestError") {
        alert(message)
    }
}

/**
 * Decodes a JWT token into an object.
 * @param token{string} JWT-token
 * @returns {object} Decoded token.
 */
function parseJWT(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("message", handleOnMessage)

    requestUserFromMakairaBackend()
})
