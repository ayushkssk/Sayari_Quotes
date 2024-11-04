const API_URL = 'https://your-worker.your-subdomain.workers.dev';

async function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const { token } = await response.json();
            localStorage.setItem('adminToken', token);
            showPostForm();
            loadAdminPosts();
            alert('Login successful! Welcome, Ayush!');
        } else {
            alert('Invalid credentials. Please try again.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please check your connection and try again.');
    }
}

function showPostForm() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('post-form').classList.remove('hidden');
}

async function createPost() {
    const content = document.getElementById('content').value;
    const type = document.getElementById('post-type').value;
    const token = localStorage.getItem('adminToken');

    try {
        const response = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                content,
                type,
                timestamp: new Date().toISOString()
            })
        });

        if (response.ok) {
            document.getElementById('content').value = '';
            loadAdminPosts();
        } else {
            alert('Failed to create post');
        }
    } catch (error) {
        console.error('Error creating post:', error);
        alert('Failed to create post');
    }
}

async function loadAdminPosts() {
    try {
        const response = await fetch(`${API_URL}/posts`);
        const posts = await response.json();
        displayAdminPosts(posts);
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

function displayAdminPosts(posts) {
    const container = document.getElementById('admin-posts');
    container.innerHTML = '<h2>Recent Posts</h2>' + posts.map(post => `
        <div class="post">
            <div class="post-content">${post.content}</div>
            <div class="post-meta">
                <span class="post-type">${post.type}</span>
                <span class="post-date">${new Date(post.timestamp).toLocaleString()}</span>
            </div>
        </div>
    `).join('');
}

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        showPostForm();
        loadAdminPosts();
    }
});

function logout() {
    localStorage.removeItem('adminToken');
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('post-form').classList.add('hidden');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    alert('Logged out successfully!');
} 