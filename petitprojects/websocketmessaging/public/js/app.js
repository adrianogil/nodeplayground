const messageList = document.getElementById('messageList');
const connectionStatus = document.getElementById('connectionStatus');
const displayNameInput = document.getElementById('displayName');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const imageInput = document.getElementById('imageInput');
const emojiButtons = document.querySelectorAll('.emoji');

const socket = new WebSocket(`ws://${window.location.host}`);

const formatTime = (value) => {
  const date = new Date(value);
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
};

const appendMessage = ({ type, content, name, timestamp, fileName }) => {
  const item = document.createElement('li');
  item.className = 'message-item';

  const meta = document.createElement('div');
  meta.className = 'message-meta';
  meta.textContent = `${name || 'Guest'} · ${formatTime(timestamp || new Date())}`;

  const body = document.createElement('div');
  body.className = 'message-body';

  if (type === 'image') {
    const image = document.createElement('img');
    image.src = content;
    image.alt = fileName || 'Shared image';
    image.loading = 'lazy';
    body.appendChild(image);

    if (fileName) {
      const caption = document.createElement('p');
      caption.className = 'message-caption';
      caption.textContent = fileName;
      body.appendChild(caption);
    }
  } else {
    body.textContent = content;
  }

  item.appendChild(meta);
  item.appendChild(body);
  messageList.appendChild(item);
  messageList.scrollTop = messageList.scrollHeight;
};

const sendPayload = (payload) => {
  if (socket.readyState !== WebSocket.OPEN) {
    return;
  }
  socket.send(JSON.stringify(payload));
};

const sendMessage = () => {
  const content = messageInput.value.trim();
  if (!content) {
    return;
  }

  sendPayload({
    type: 'text',
    content,
    name: displayNameInput.value.trim()
  });

  messageInput.value = '';
  messageInput.focus();
};

const sendImage = (file) => {
  if (file.size > 3 * 1024 * 1024) {
    appendMessage({
      type: 'system',
      content: 'Image is too large. Please pick a file under 3 MB.',
      name: 'System',
      timestamp: new Date().toISOString()
    });
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    sendPayload({
      type: 'image',
      content: reader.result,
      fileName: file.name,
      name: displayNameInput.value.trim()
    });
  };
  reader.readAsDataURL(file);
};

socket.addEventListener('open', () => {
  connectionStatus.textContent = 'Connected';
  connectionStatus.classList.add('connected');
});

socket.addEventListener('close', () => {
  connectionStatus.textContent = 'Disconnected';
  connectionStatus.classList.remove('connected');
});

socket.addEventListener('message', (event) => {
  try {
    const payload = JSON.parse(event.data);
    appendMessage(payload);
  } catch (error) {
    // ignore
  }
});

sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

emojiButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const { emoji } = button.dataset;
    messageInput.value = `${messageInput.value}${emoji}`;
    messageInput.focus();
  });
});

imageInput.addEventListener('change', (event) => {
  const [file] = event.target.files;
  if (file) {
    sendImage(file);
  }
  imageInput.value = '';
});
