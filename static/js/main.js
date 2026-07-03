let securityNodes = [];
let securityEdges = [];
let securePath = [];

async function initSecurityCanvas() {
    const canvas = document.getElementById('securityCanvas');
    if (!canvas) return;
    
    // Check if we have nodes from global state or fetch
    const res = await fetch('/api/get_state');
    const data = await res.json();
    if (data.nodes) {
        securityNodes = data.nodes;
        securityEdges = data.edges;
        document.getElementById('btnTransmit').disabled = false;
        document.getElementById('transStatus').innerText = "Network Ready for Secure Transmission";
        drawSecurityNetwork();
    }
}

function drawSecurityNetwork() {
    const canvas = document.getElementById('securityCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    securityEdges.forEach(edge => {
        const u = securityNodes.find(n => n.id === edge[0]);
        const v = securityNodes.find(n => n.id === edge[1]);
        if (u && v) {
            ctx.beginPath();
            ctx.strokeStyle = '#eee';
            ctx.moveTo(u.x * canvas.width, u.y * canvas.height);
            ctx.lineTo(v.x * canvas.width, v.y * canvas.height);
            ctx.stroke();
        }
    });

    securityNodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x * canvas.width, node.y * canvas.height, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#34495e';
        ctx.fill();
    });
}

async function startSecureTransmission() {
    const message = document.getElementById('plainText').value;
    if (!message) {
        alert("Please enter a medical message first");
        return;
    }

    // Step 1: Encrypt
    await encrypt();
    
    // Step 2: Find path (using node 0 to node n-1 for demo if not selected)
    const res = await fetch('/api/path', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({source: 0, target: securityNodes.length - 1})
    });
    const data = await res.json();
    securePath = data.proposed_path;
    
    // Step 3: Animate transmission
    animateTransmission();
}

function animateTransmission() {
    const canvas = document.getElementById('securityCanvas');
    const ctx = canvas.getContext('2d');
    let step = 0;
    
    const interval = setInterval(() => {
        if (step >= securePath.length - 1) {
            clearInterval(interval);
            decrypt(); // Auto decrypt at destination
            document.getElementById('transStatus').innerText = "Transmission Complete & Secured";
            return;
        }
        
        const u = securityNodes.find(n => n.id === securePath[step]);
        const v = securityNodes.find(n => n.id === securePath[step+1]);
        
        ctx.beginPath();
        ctx.strokeStyle = '#2ecc71';
        ctx.lineWidth = 4;
        ctx.moveTo(u.x * canvas.width, u.y * canvas.height);
        ctx.lineTo(v.x * canvas.width, v.y * canvas.height);
        ctx.stroke();
        
        // Draw packet
        ctx.beginPath();
        ctx.arc(v.x * canvas.width, v.y * canvas.height, 12, 0, 2 * Math.PI);
        ctx.fillStyle = '#f1c40f';
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.font = '10px Arial';
        ctx.fillText('🔒', v.x * canvas.width - 5, v.y * canvas.height + 4);
        
        document.getElementById('transStatus').innerText = `Transmitting Secure Data... Hop ${step+1}`;
        step++;
    }, 800);
}

async function encrypt() {
    const text = document.getElementById('plainText').value;
    const res = await fetch('/api/security/encrypt', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: text})
    });
    const data = await res.json();
    document.getElementById('encryptedOutput').innerText = data.encrypted;
    document.getElementById('cipherText').value = data.encrypted;
}

async function decrypt() {
    const text = document.getElementById('cipherText').value;
    const res = await fetch('/api/security/decrypt', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({encrypted: text})
    });
    const data = await res.json();
    document.getElementById('decryptedOutput').innerText = data.decrypted;
}

window.onload = initSecurityCanvas;
