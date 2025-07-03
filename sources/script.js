const form = document.getElementById('chat-form');
const input = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const container = document.getElementById('chat-container');
const clearBtn = document.getElementById('clear-btn');

function stripFences(text) {
  return text.replace(/```[\r\n]?/g, '').trim();
}

input.addEventListener('input', () => {
  sendBtn.disabled = !input.value.trim();
});

clearBtn.addEventListener('click', () => {
  container.innerHTML = '';
  input.value = '';
  sendBtn.disabled = true;
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  const msg = input.value.trim();
  if (!msg) return;

  appendBubble(msg, 'user');
  input.value = '';
  sendBtn.disabled = true;

  appendBubble('Typing…', 'bot', true);

  try {
    const res = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
    const data = await res.json();
    const clean = stripFences(data.text);
    replaceLastBubble(clean);
  } catch {
    replaceLastBubble('Error: Server unreachable');
  }
});

function appendBubble(text, who, isTemp = false) {
  const div = document.createElement('div');
  div.className = `bubble ${who}`;
  div.textContent = text;
  if (isTemp) div.dataset.temp = 'true';
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function replaceLastBubble(text) {
  const last = container.querySelector('.bubble[data-temp="true"]');
  if (!last) return;
  delete last.dataset.temp;
  last.textContent = text;
  container.scrollTop = container.scrollHeight;
}
