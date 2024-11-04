// Function to get current IP address
function getIPAddress() {
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('ip-address').textContent = data.ip;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('ip-address').textContent = 'Error fetching IP';
        });
}

// Function to parse JWT
function parseJWT() {
    const jwtInput = document.getElementById('jwt-input').value;
    try {
        const [header, payload, signature] = jwtInput.split('.');
        const decodedHeader = JSON.parse(atob(header));
        const decodedPayload = JSON.parse(atob(payload));
        
        document.getElementById('jwt-output').textContent = 
            'Header: ' + JSON.stringify(decodedHeader, null, 2) + 
            '\n\nPayload: ' + JSON.stringify(decodedPayload, null, 2);
    } catch (error) {
        document.getElementById('jwt-output').textContent = 'Invalid JWT';
    }
}

// Function to calculate days since January 1, 1970
function calculateDaysSince1970() {
    const now = new Date();
    const start = new Date(1970, 0, 1);
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    document.getElementById('days-since-1970').textContent = `${diffDays} days`;
}

// Initial calls
getIPAddress();
calculateDaysSince1970();

// Update days since 1970 every second
setInterval(calculateDaysSince1970, 1000);
