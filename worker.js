// KV namespace should be named "POSTS_STORAGE"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function handleRequest(request) {
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    
    if (request.method === 'GET' && url.pathname === '/posts') {
        return getPosts();
    } else if (request.method === 'POST' && url.pathname === '/posts') {
        return createPost(request);
    } else if (request.method === 'POST' && url.pathname === '/login') {
        return handleLogin(request);
    }
    
    return new Response('Not Found', { status: 404 });
}

async function getPosts() {
    const posts = await POSTS_STORAGE.get('all_posts', 'json') || [];
    return new Response(JSON.stringify(posts), {
        headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
        }
    });
}

async function createPost(request) {
    // Verify credentials
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || authHeader !== 'Basic YXl1c2g6dHVubmk=') { // base64 of ayush:tunni
        return new Response('Unauthorized', { status: 401 });
    }

    const post = await request.json();
    let posts = await POSTS_STORAGE.get('all_posts', 'json') || [];
    posts.unshift({
        ...post,
        id: Date.now(),
        timestamp: new Date().toISOString()
    });
    
    await POSTS_STORAGE.put('all_posts', JSON.stringify(posts));
    
    return new Response(JSON.stringify({ success: true }), {
        headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
        }
    });
}

async function handleLogin(request) {
    const { username, password } = await request.json();
    
    if (username === 'ayush' && password === 'tunni') {
        return new Response(JSON.stringify({ 
            success: true,
            token: 'YXl1c2g6dHVubmk=' // base64 of ayush:tunni
        }), {
            headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
            }
        });
    }
    
    return new Response(JSON.stringify({ 
        success: false,
        message: 'Invalid credentials'
    }), {
        status: 401,
        headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
        }
    });
}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
}); 