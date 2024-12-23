/* Backend (Node.js + Express.js) */
// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

let posts = [];

app.post('/api/posts', upload.single('image'), (req, res) => {
    const { title, content } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    const newPost = { title, content, image };
    posts.push(newPost);
    res.status(201).json(newPost);
});

app.get('/api/posts', (req, res) => {
    res.json(posts);
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

/* Frontend JavaScript (scripts.js) */
const form = document.getElementById('new-post-form');
const postsContainer = document.getElementById('posts-container');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData
    });
    const post = await response.json();
    displayPost(post);
    form.reset();
});

async function loadPosts() {
    const response = await fetch('/api/posts');
    const posts = await response.json();
    posts.forEach(displayPost);
}

function displayPost(post) {
    const div = document.createElement('div');
    div.classList.add('post');
    div.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        ${post.image ? `<img src="${post.image}" alt="صورة المقال">` : ''}
    `;
    postsContainer.appendChild(div);
}

loadPosts();
