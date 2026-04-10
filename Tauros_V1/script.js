const CURRENT_SESSION_ID = "ui-session-" + Math.random().toString(36).substring(2, 10);
console.log("Session Active:", CURRENT_SESSION_ID);

const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const chatHistory = document.getElementById('chatHistory');
const jsonData = document.getElementById('jsonData');

function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;

    if (isUser) {
        messageDiv.textContent = text;
    } else {
        messageDiv.innerHTML = marked.parse(text || "*(Agent did not send text response)*");
    }

    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

async function handleChat() {
    const message = userInput.value.trim();
    if (!message) return;
    addMessage(message, true);
    userInput.value = '';
    sendBtn.disabled = true;

    const statusLabel = document.getElementById('apiStatus');
    if (statusLabel) statusLabel.textContent = "Somethig big is working...";

    try {
        const response = await fetch('/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: message,
                sessionId: CURRENT_SESSION_ID
            })
        });

        const data = await response.json();
        let aiText = "";
        if (data.output) {
            aiText = typeof data.output === 'object' ? data.output.content : data.output;
        } else if (data.detail) {
            aiText = `⚠️ Error de validación: ${JSON.stringify(data.detail)}`;
        }

        addMessage(aiText || "Respuesta procesada correctamente.");
        if (jsonData) {
            jsonData.textContent = JSON.stringify(data, null, 2);
        }

    } catch (error) {
        console.error("Communitation error:", error);
        addMessage("Error connecting to the proxy. Make sure python3 proxy_server.py is running. ");
    } finally {
        sendBtn.disabled = false;
        if (statusLabel) statusLabel.textContent = "Connected";
        userInput.focus();
    }
}

sendBtn.addEventListener('click', handleChat);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleChat();
    }
});

addMessage("Connection established! You can now start querying.");