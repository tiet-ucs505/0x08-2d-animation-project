// Canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 550;

// Define the center coordinates of the sun relative to canvas size
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

// Define planets (scaled for smaller canvas)
const planets = [
    { name: 'Mercury', radius: 5, distance: 50, speed: 0.03, color: 'gray' },
    { name: 'Venus', radius: 8, distance: 90, speed: 0.02, color: 'orange' },
    { name: 'Earth', radius: 12, distance: 130, speed: 0.015, color: 'blue' },
    { name: 'Mars', radius: 7, distance: 170, speed: 0.01, color: 'red' },
    { name: 'Jupiter', radius: 20, distance: 210, speed: 0.007, color: 'brown' },
    { name: 'Saturn', radius: 18, distance: 253, speed: 0.006, color: 'yellow' }
    // Add more planets as needed
];

// Generate random stars (scaled for smaller canvas)
const stars = [];
const numStars = 200;

for (let i = 0; i < numStars; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 2;
    stars.push({ x, y, radius });
}

// Define shooting stars (scaled for smaller canvas)
const shootingStars = [];
const shootingStarFrequency = 0.008; // Adjust frequency (lower = less frequent)

function createShootingStar() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height / 2; // Appear from the top half of the canvas
    const length = Math.random() * 40 + 10; // Length of the shooting star
    const speed = Math.random() * 4 + 1; // Speed of the shooting star

    shootingStars.push({ x, y, length, speed });
}

function drawBackground() {
    // Draw starry sky
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    ctx.fillStyle = 'white';
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    // Create shooting stars randomly
    if (Math.random() < shootingStarFrequency) {
        createShootingStar();
    }

    // Update and draw shooting stars
    shootingStars.forEach((star, index) => {
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x + star.length, star.y + star.length);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Move shooting star along its path
        star.x += star.speed;
        star.y += star.speed;

        // Remove shooting star if it goes out of the canvas
        if (star.x > canvas.width || star.y > canvas.height) {
            shootingStars.splice(index, 1);
        }
    });
}

function drawPlanet(planet) {
    // Calculate planet position relative to canvas center
    const x = centerX + Math.cos(planet.angle) * planet.distance;
    const y = centerY + Math.sin(planet.angle) * planet.distance;

    ctx.beginPath();
    ctx.arc(x, y, planet.radius, 0, Math.PI * 2);
    ctx.fillStyle = planet.color;
    ctx.fill();

    // Update planet angle for next frame
    planet.angle += planet.speed;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    drawBackground();

    // Draw sun at the center
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = 'yellow';
    ctx.fill();

    // Draw planets
    planets.forEach(planet => {
        if (!planet.hasOwnProperty('angle')) {
            planet.angle = Math.random() * Math.PI * 2; // Randomize initial angle
        }
        drawPlanet(planet);
    });

    // Redraw the frame
    requestAnimationFrame(draw);
}

// Start the animation loop
draw();
