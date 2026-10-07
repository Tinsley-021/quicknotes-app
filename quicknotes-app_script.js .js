const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const searchInput = document.querySelector("#search-input");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const clearAll = document.querySelector("#clear-all");

let notes = [];

const savedNotes = localStorage.getItem("quicknotes");

if (savedNotes) {
  notes = JSON.parse(savedNotes);
}

function saveNotes() {
  localStorage.setItem("quicknotes", JSON.stringify(notes));
}

function render(searchText = "") {
  notesList.textContent = "";

  const search = searchText.toLowerCase().trim();

  const filteredNotes = notes.filter(function(note) {
    return note.text.toLowerCase().includes(search);
  });

  if (filteredNotes.length === 0) {

    const message = document.createElement("li");
    message.classList.add("empty-message");

    if (search !== "") {
      message.textContent = "No notes match your search.";
    } else {
      message.textContent = "No notes yet.";
    }

    notesList.appendChild(message);
  }

  filteredNotes.forEach(function(note) {

    const noteItem = document.createElement("li");
    noteItem.classList.add("note-card");

    if (note.category === "Personal") {
      noteItem.classList.add("category-personal");
    }

    if (note.category === "Work") {
      noteItem.classList.add("category-work");
    }

    if (note.category === "Study") {
      noteItem.classList.add("category-study");
    }

    const noteText = document.createElement("p");
    noteText.classList.add("note-text");
    noteText.textContent = note.text;

    const category = document.createElement("span");
    category.classList.add("category-label");
    category.textContent = note.category;

    const date = document.createElement("p");
    date.classList.add("note-date");
    date.textContent = note.createdAt;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";

    deleteButton.addEventListener("click", function() {
      deleteNote(note.id);
    });

    noteItem.appendChild(noteText);
    noteItem.appendChild(category);
    noteItem.appendChild(date);
    noteItem.appendChild(deleteButton);

    notesList.appendChild(noteItem);
  });

  updateCount();
}

function updateCount() {

  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${notes.length} notes.`;
  }
}

noteForm.addEventListener("submit", function(event) {

  event.preventDefault();

  const text = noteInput.value.trim();

  errorMessage.textContent = "";

  if (text === "") {
    errorMessage.textContent = "Please type a note first.";
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent =
      "Notes must be 200 characters or fewer.";
    return;
  }

  const note = {
    id: Date.now(),
    text: text,
    category: noteCategory.value,
    createdAt: new Date().toLocaleString()
  };

  notes.push(note);

  saveNotes();

  render();

  noteInput.value = "";
  noteCategory.value = "Personal";
});


function deleteNote(id) {

  notes = notes.filter(function(note) {
    return note.id !== id;
  });

  saveNotes();

  render(searchInput.value);
}


searchInput.addEventListener("input", function() {
  render(searchInput.value);
});


clearAll.addEventListener("click", function() {

  if (notes.length === 0) {
    return;
  }

  const answer = confirm("Delete all notes?");

  if (answer) {
    notes = [];

    saveNotes();

    render();

    errorMessage.textContent = "";
  }
});


render();