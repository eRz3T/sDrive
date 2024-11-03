document.addEventListener("DOMContentLoaded", function() {
    const conversationListButton = document.getElementById("readNotificationsButton");
    if (conversationListButton) {
        conversationListButton.onclick = loadConversations;
    }
});

function loadConversations() {
    fetch('/api/get-conversations')
        .then(response => response.json())
        .then(data => {
            const conversationList = document.getElementById('conversationList');
            conversationList.innerHTML = '';

            if (data.status === 'success' && data.conversations.length > 0) {
                data.conversations.forEach(conversation => {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                    
                    const conversationText = document.createElement('span');
                    conversationText.textContent = `Rozmowa z ${conversation.partnerName}`;

                    const openButton = document.createElement('button');
                    openButton.className = 'btn btn-primary btn-sm';
                    openButton.textContent = 'Otwórz konwersację';
                    openButton.onclick = () => openConversation(conversation.codemsg); // Upewnij się, że codemsg jest tutaj przekazywany

                    listItem.appendChild(conversationText);
                    listItem.appendChild(openButton);
                    conversationList.appendChild(listItem);
                });
            } else {
                const emptyMessage = document.createElement('li');
                emptyMessage.className = 'list-group-item';
                emptyMessage.textContent = 'Brak konwersacji';
                conversationList.appendChild(emptyMessage);
            }
        })
        .catch(error => console.error('Błąd podczas wczytywania konwersacji:', error));
}





function startNewConversation() {
    const recipientId = document.getElementById('recipientSelect').value;
    const initialMessage = document.getElementById('messageContent').value;

    if (!recipientId || !initialMessage) {
        alert("Wybierz znajomego i wpisz wiadomość.");
        return;
    }

    fetch('/api/start-conversation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ recipientSafeId: recipientId, initialMessage: initialMessage })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert("Konwersacja rozpoczęta.");
            loadConversations();  // Odśwież listę konwersacji
            const newConversationModal = document.getElementById('newConversationModal');
            const modalInstance = bootstrap.Modal.getInstance(newConversationModal);
            modalInstance.hide();
        } else {
            alert("Błąd: " + data.error);
        }
    })
    .catch(error => console.error('Błąd podczas inicjacji konwersacji:', error));
}


function openConversation(codemsg) {
    const messagesModal = document.getElementById('conversationMessagesModal');
    messagesModal.setAttribute('data-codemsg', codemsg); // Ustawienie `codemsg`

    fetch(`/api/get-messages?codemsg=${codemsg}`)
        .then(response => response.json())
        .then(data => {
            const messageList = document.getElementById('messageList');
            messageList.innerHTML = '';

            if (data.status === 'success' && data.messages.length > 0) {
                data.messages.forEach(message => {
                    const messageItem = document.createElement('li');
                    messageItem.className = 'list-group-item';
                    messageItem.innerHTML = `
                        <strong>${message.senderName}:</strong> ${message.content}
                        <br><small>${new Date(message.date).toLocaleString()}</small>
                    `;
                    messageList.appendChild(messageItem);
                });
            } else {
                const emptyMessage = document.createElement('li');
                emptyMessage.className = 'list-group-item';
                emptyMessage.textContent = 'Brak wiadomości';
                messageList.appendChild(emptyMessage);
            }

            const modalInstance = new bootstrap.Modal(messagesModal);
            modalInstance.show();
        })
        .catch(error => console.error('Błąd podczas wczytywania wiadomości:', error));
}





function sendMessage() {
    const codemsg = document.getElementById('conversationMessagesModal').dataset.codemsg;
    const content = document.getElementById('newMessageContent').value;

    fetch('/api/send-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codemsg, content })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            document.getElementById('newMessageContent').value = ''; // Wyczyść pole wiadomości
            openConversation(codemsg); // Odśwież listę wiadomości
        } else {
            console.error('Błąd podczas wysyłania wiadomości:', data.error);
        }
    })
    .catch(error => console.error('Błąd podczas wysyłania wiadomości:', error));
}


