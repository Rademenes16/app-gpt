// Code Snippet Manager app logic

// DOM Elements
const addSnippetBtn = document.getElementById('addSnippetBtn');
const snippetList = document.getElementById('snippetList');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const snippetForm = document.getElementById('snippetForm');
const closeBtn = document.querySelector('.close-btn');

// Snippet Data
const snippets = [];

// Event Listeners
addSnippetBtn.addEventListener('click', () => {
    openModal('Add Snippet', null);
});

closeBtn.addEventListener('click', () => {
    closeModal();
});

snippetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveSnippet();
});

// Functions
function renderSnippet(snippet) {
    const snippetCard = document.createElement('div');
    snippetCard.classList.add('snippet-card');
    snippetCard.innerHTML = `
    <h3>${snippet.title}</h3>
    <p>${snippet.description}</p>
    <pre><code>${snippet.code}</code></pre>
    <p><strong>Tags:</strong> ${snippet.tags.join(', ')}</p>
    <div class="btn-group">
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    </div>
  `;
    snippetList.appendChild(snippetCard);
}

function openModal(title, snippet) {
    modal.style.display = 'block';
    modalTitle.textContent = title;
    if (snippet) {
        document.getElementById('title').value = snippet.title;
        document.getElementById('description').value = snippet.description;
        document.getElementById('code').value = snippet.code;
        document.getElementById('tags').value = snippet.tags.join(', ');
    } else {
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
        document.getElementById('code').value = '';
        document.getElementById('tags').value = '';
    }
}

function closeModal() {
    modal.style.display = 'none';
    snippetForm.reset();
}

// Save Snippet to Local Storage
function saveSnippet() {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const code = document.getElementById('code').value;
  const tags = document.getElementById('tags').value.split(',');

  // Create snippet object
  const snippet = {
    title,
    description,
    code,
    tags
  };

  // Check if editing existing snippet or adding new snippet
  const editingSnippetIndex = snippets.findIndex(snip => snip.title === title);
  if (editingSnippetIndex !== -1) {
    // Editing existing snippet
    snippets[editingSnippetIndex] = snippet;
  } else {
    // Adding new snippet
    snippets.push(snippet);
  }

  renderSnippet(snippet);
  closeModal();
  saveToLocalStorage();
}

// Load Snippets from Local Storage
function loadSnippets() {
  const savedSnippets = localStorage.getItem('snippets');
  if (savedSnippets) {
    snippets.push(...JSON.parse(savedSnippets));
    snippets.forEach(snippet => renderSnippet(snippet));
  }
}

// Save Snippets to Local Storage
function saveToLocalStorage() {
  localStorage.setItem('snippets', JSON.stringify(snippets));
}
// Event Delegation for Edit and Delete Buttons
snippetList.addEventListener('click', (e) => {
  if (e.target.classList.contains('edit-btn')) {
    const snippetCard = e.target.closest('.snippet-card');
    const title = snippetCard.querySelector('h3').textContent;
    const snippet = snippets.find(snip => snip.title === title);
    openModal('Edit Snippet', snippet);
  } else if (e.target.classList.contains('delete-btn')) {
    const snippetCard = e.target.closest('.snippet-card');
    const title = snippetCard.querySelector('h3').textContent;
    const snippetIndex = snippets.findIndex(snip => snip.title === title);
    snippetList.removeChild(snippetCard);
    snippets.splice(snippetIndex, 1);
    saveToLocalStorage();
  }
});
