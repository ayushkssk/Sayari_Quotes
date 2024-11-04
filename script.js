const API_URL = 'https://your-worker.your-subdomain.workers.dev';

async function loadPosts() {
    try {
        const response = await fetch(`${API_URL}/posts`);
        const posts = await response.json();
        displayPosts(posts);
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

function displayPosts(posts) {
    const container = document.getElementById('posts-container');
    container.innerHTML = posts.map(post => `
        <div class="post" data-type="${post.type}">
            <div class="post-content">${post.content}</div>
            <div class="post-meta">
                <span class="post-type">${post.type}</span>
                <span class="post-date">${new Date(post.timestamp).toLocaleString()}</span>
            </div>
        </div>
    `).join('');
}

function filterPosts(type) {
    const posts = document.querySelectorAll('.post');
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    posts.forEach(post => {
        if (type === 'all' || post.dataset.type === type) {
            post.style.display = 'block';
        } else {
            post.style.display = 'none';
        }
    });
}

// Load posts when page loads
document.addEventListener('DOMContentLoaded', loadPosts); 