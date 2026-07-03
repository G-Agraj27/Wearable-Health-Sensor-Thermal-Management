let networkNodes = [];
let networkEdges = [];
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');
let selectedSource = null;
let selectedTarget = null;
let existingPath = [];
let proposedPath = [];

// Canvas Interaction
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Find clicked node
    const clickedNode = networkNodes.find(n => {
        const nx = n.x * canvas.width;
        const ny = n.y * canvas.height;
        return Math.sqrt((x-nx)**2 + (y-ny)**2) < 15;
    });

    if (clickedNode) {
        if (selectedSource === null) {
            selectedSource = clickedNode.id;
            document.getElementById('sourceNode').value = selectedSource;
        } else if (selectedTarget === null && clickedNode.id !== selectedSource) {
            selectedTarget = clickedNode.id;
            document.getElementById('targetNode').value = selectedTarget;
        } else {
            // Reset if both selected
            selectedSource = clickedNode.id;
            selectedTarget = null;
            document.getElementById('sourceNode').value = selectedSource;
            document.getElementById('targetNode').value = '';
            existingPath = [];
            proposedPath = [];
        }
        drawNetwork();
    }
});

async function generateNetwork() {
    const numNodes = document.getElementById('numNodes').value;
    const range = document.getElementById('txRange').value;
    
    const formData = new FormData();
    formData.append('num_nodes', numNodes);
    formData.append('range', range);
    
    const res = await fetch('/api/generate', {
        method: 'POST',
        body: formData
    });
    
    const data = await res.json();
    networkNodes = data.nodes;
    networkEdges = data.edges;
    
    // Reset selections
    selectedSource = null;
    selectedTarget = null;
    existingPath = [];
    proposedPath = [];
    
    drawNetwork();
}

async function findPath() {
    const source = document.getElementById('sourceNode').value;
    const target = document.getElementById('targetNode').value;
    
    if (!source || !target) {
        alert('Please select Source and Target nodes');
        return;
    }
    
    const res = await fetch('/api/path', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({source, target})
    });
    
    const data = await res.json();
    
    if (data.error) {
        alert(data.error);
        return;
    }
    
    existingPath = data.existing_path;
    proposedPath = data.proposed_path;
    
    // Update Results Panel
    document.getElementById('resultsPanel').style.display = 'block';
    
    const metrics = data.metrics;
    
    // Existing Metrics
    document.getElementById('ex-power').innerText = metrics.existing.power;
    document.getElementById('ex-energy').innerText = metrics.existing.energy;
    document.getElementById('ex-delay').innerText = metrics.existing.delay;
    document.getElementById('ex-overhead').innerText = metrics.existing.overhead;
    document.getElementById('ex-success').innerText = metrics.existing.success;
    
    // Proposed Metrics
    document.getElementById('pr-power').innerText = metrics.proposed.power;
    document.getElementById('pr-energy').innerText = metrics.proposed.energy;
    document.getElementById('pr-delay').innerText = metrics.proposed.delay;
    document.getElementById('pr-overhead').innerText = metrics.proposed.overhead;
    document.getElementById('pr-success').innerText = metrics.proposed.success;
    
    drawNetwork();
}

function drawNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Edges
    ctx.strokeStyle = '#ecf0f1';
    ctx.lineWidth = 1;
    networkEdges.forEach(edge => {
        const u = networkNodes.find(n => n.id === edge[0]);
        const v = networkNodes.find(n => n.id === edge[1]);
        if (u && v) {
            ctx.beginPath();
            ctx.moveTo(u.x * canvas.width, u.y * canvas.height);
            ctx.lineTo(v.x * canvas.width, v.y * canvas.height);
            ctx.stroke();
        }
    });
    
    // Draw Existing Path (Red)
    if (existingPath.length > 0) {
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i < existingPath.length - 1; i++) {
            const u = networkNodes.find(n => n.id === existingPath[i]);
            const v = networkNodes.find(n => n.id === existingPath[i+1]);
            if (u && v) {
                ctx.moveTo(u.x * canvas.width, u.y * canvas.height);
                ctx.lineTo(v.x * canvas.width, v.y * canvas.height);
            }
        }
        ctx.stroke();
    }
    
    // Draw Proposed Path (Green & Flashing)
    if (proposedPath.length > 0) {
        ctx.strokeStyle = '#2ecc71';
        ctx.lineWidth = 4;
        ctx.setLineDash([10, 5]); // Dashed for visibility on overlap
        ctx.beginPath();
        for (let i = 0; i < proposedPath.length - 1; i++) {
            const u = networkNodes.find(n => n.id === proposedPath[i]);
            const v = networkNodes.find(n => n.id === proposedPath[i+1]);
            if (u && v) {
                ctx.moveTo(u.x * canvas.width, u.y * canvas.height);
                ctx.lineTo(v.x * canvas.width, v.y * canvas.height);
            }
        }
        ctx.stroke();
        ctx.setLineDash([]); // Reset
    }
    
    // Draw Nodes
    networkNodes.forEach(node => {
        const x = node.x * canvas.width;
        const y = node.y * canvas.height;
        
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        
        if (node.id === selectedSource) {
            ctx.fillStyle = '#f1c40f'; // Yellow Source
        } else if (node.id === selectedTarget) {
            ctx.fillStyle = '#9b59b6'; // Purple Target
        } else if (proposedPath.includes(node.id)) {
            ctx.fillStyle = '#2ecc71'; // Green Path
        } else if (existingPath.includes(node.id)) {
            ctx.fillStyle = '#e74c3c'; // Red Path
        } else {
            ctx.fillStyle = '#34495e'; // Default Blue-Grey
        }
        
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.stroke();
        
        // Node ID
        ctx.fillStyle = '#fff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(node.id, x, y + 3);
    });
}
