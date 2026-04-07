// Spielkonfiguration
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 500;

// Spielzustände
const GameState = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused'
};

// Spiel-Objekt
const game = {
    state: GameState.MENU,
    score1: 0,
    score2: 0,
    speed: 3,
    frameCount: 0
};

// Karotte (das Ziel)
const carrot = {
    x: 800,
    y: 125,
    width: 40,
    height: 50,
    speed: 3,
    lane: 0, // 0 = oben, 1 = unten
    animFrame: 0
};

// Esel-Spieler
const donkey1 = {
    x: 50,
    y: 100,
    width: 60,
    height: 60,
    speed: 0,
    maxSpeed: 8,
    acceleration: 0.5,
    deceleration: 0.3,
    lane: 0,
    animFrame: 0
};

const donkey2 = {
    x: 50,
    y: 350,
    width: 60,
    height: 60,
    speed: 0,
    maxSpeed: 8,
    acceleration: 0.5,
    deceleration: 0.3,
    lane: 1,
    animFrame: 0
};

// Tastatureingaben
const keys = {
    space: false,    // Spieler 1
    enter: false,    // Spieler 2
    r: false
};

// Hindernisse
let obstacles = [];

// Event Listener für Tastatur
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        e.preventDefault();
        keys.space = true;
        if (game.state === GameState.MENU) {
            startGame();
        }
    }
    if (e.key === 'Enter') {
        e.preventDefault();
        keys.enter = true;
        if (game.state === GameState.MENU) {
            startGame();
        }
    }
    if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        if (game.state === GameState.PLAYING) {
            game.state = GameState.PAUSED;
            updateStatus('⏸️ PAUSE - Drücke P zum Fortfahren');
        } else if (game.state === GameState.PAUSED) {
            game.state = GameState.PLAYING;
            updateStatus('');
        }
    }
    if (e.key === 'r' || e.key === 'R') {
        resetGame();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === ' ') {
        keys.space = false;
    }
    if (e.key === 'Enter') {
        keys.enter = false;
    }
});

// Hilfsfunktionen
function updateStatus(text) {
    document.getElementById('status').textContent = text;
}

function updateScores() {
    document.getElementById('score1').textContent = game.score1;
    document.getElementById('score2').textContent = game.score2;
}

function startGame() {
    game.state = GameState.PLAYING;
    updateStatus('');
    resetPositions();
}

function resetGame() {
    game.score1 = 0;
    game.score2 = 0;
    game.speed = 3;
    updateScores();
    resetPositions();
    game.state = GameState.MENU;
    updateStatus('Drücke LEERTASTE oder ENTER zum Starten!');
    obstacles = [];
}

function resetPositions() {
    donkey1.x = 50;
    donkey1.speed = 0;
    donkey2.x = 50;
    donkey2.speed = 0;
    carrot.x = 200; // Karotte startet vor den Eseln
    carrot.lane = Math.floor(Math.random() * 2);
    carrot.y = carrot.lane === 0 ? 125 : 375;
}

// Zeichenfunktionen
function drawDonkey(donkey) {
    const bodyColor = '#8B7355';
    const earColor = '#A0826D';
    const fluffColor = '#D4B896';

    ctx.save();
    ctx.translate(donkey.x, donkey.y);

    // Animation
    const bounce = Math.sin(game.frameCount * 0.2) * 3;

    // Ohren (groß und fluffig)
    ctx.fillStyle = earColor;
    ctx.beginPath();
    ctx.ellipse(-5, -15 + bounce, 8, 20, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(35, -15 + bounce, 8, 20, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Innenohren (rosa)
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.ellipse(-5, -15 + bounce, 4, 12, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(35, -15 + bounce, 4, 12, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Körper
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(15, 25, 25, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Kopf (rund und niedlich)
    ctx.fillStyle = fluffColor;
    ctx.beginPath();
    ctx.arc(15, 5 + bounce, 18, 0, Math.PI * 2);
    ctx.fill();

    // Augen (groß und niedlich)
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(10, 3 + bounce, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(20, 3 + bounce, 4, 0, Math.PI * 2);
    ctx.fill();

    // Glanzpunkte in den Augen
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(11, 2 + bounce, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(21, 2 + bounce, 2, 0, Math.PI * 2);
    ctx.fill();

    // Nase
    ctx.fillStyle = '#8B7355';
    ctx.beginPath();
    ctx.ellipse(15, 12 + bounce, 6, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nasenlöcher
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(12, 12 + bounce, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(18, 12 + bounce, 2, 0, Math.PI * 2);
    ctx.fill();

    // Beine
    const legMove = Math.sin(donkey.speed > 0 ? game.frameCount * 0.3 : 0) * 5;
    ctx.fillStyle = bodyColor;
    ctx.fillRect(5, 40, 8, 15 + legMove);
    ctx.fillRect(22, 40, 8, 15 - legMove);

    // Hufe
    ctx.fillStyle = '#000';
    ctx.fillRect(5, 53 + legMove, 8, 5);
    ctx.fillRect(22, 53 - legMove, 8, 5);

    // Schwanz (fluffig)
    ctx.strokeStyle = bodyColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(38, 30);
    ctx.quadraticCurveTo(50, 25, 55, 35);
    ctx.stroke();

    // Schwanz-Spitze (fluffig)
    ctx.fillStyle = fluffColor;
    ctx.beginPath();
    ctx.arc(55, 35, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function drawCarrot() {
    const orangeColor = '#FF8C00';
    const greenColor = '#228B22';

    ctx.save();
    ctx.translate(carrot.x, carrot.y);

    // Animation (Laufen)
    const legMove = Math.sin(game.frameCount * 0.4) * 8;
    const bodyBounce = Math.abs(Math.sin(game.frameCount * 0.4)) * 4;

    // Karotten-Körper
    ctx.fillStyle = orangeColor;
    ctx.beginPath();
    ctx.moveTo(10, -15 + bodyBounce);
    ctx.lineTo(0, 20 + bodyBounce);
    ctx.lineTo(20, 20 + bodyBounce);
    ctx.closePath();
    ctx.fill();

    // Streifen auf der Karotte
    ctx.strokeStyle = '#FF6B00';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(10, -5 + i * 8 + bodyBounce, 8, 0, Math.PI);
        ctx.stroke();
    }

    // Grünes Karottengrün
    ctx.fillStyle = greenColor;
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(5 + i * 5, -20 + bodyBounce, 3, 10, i * 0.3 - 0.3, 0, Math.PI * 2);
        ctx.fill();
    }

    // Arme
    ctx.strokeStyle = orangeColor;
    ctx.lineWidth = 4;

    // Linker Arm
    ctx.beginPath();
    ctx.moveTo(0, 5 + bodyBounce);
    ctx.lineTo(-10, 10 + bodyBounce + Math.sin(game.frameCount * 0.3) * 5);
    ctx.stroke();

    // Hand
    ctx.fillStyle = orangeColor;
    ctx.beginPath();
    ctx.arc(-10, 10 + bodyBounce + Math.sin(game.frameCount * 0.3) * 5, 3, 0, Math.PI * 2);
    ctx.fill();

    // Rechter Arm
    ctx.beginPath();
    ctx.moveTo(20, 5 + bodyBounce);
    ctx.lineTo(30, 10 + bodyBounce - Math.sin(game.frameCount * 0.3) * 5);
    ctx.stroke();

    // Hand
    ctx.beginPath();
    ctx.arc(30, 10 + bodyBounce - Math.sin(game.frameCount * 0.3) * 5, 3, 0, Math.PI * 2);
    ctx.fill();

    // Beine
    ctx.lineWidth = 5;

    // Linkes Bein
    ctx.beginPath();
    ctx.moveTo(5, 20 + bodyBounce);
    ctx.lineTo(3, 35 + legMove);
    ctx.stroke();

    // Fuß
    ctx.fillStyle = orangeColor;
    ctx.beginPath();
    ctx.ellipse(3, 37 + legMove, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rechtes Bein
    ctx.beginPath();
    ctx.moveTo(15, 20 + bodyBounce);
    ctx.lineTo(17, 35 - legMove);
    ctx.stroke();

    // Fuß
    ctx.beginPath();
    ctx.ellipse(17, 37 - legMove, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Gesicht
    ctx.fillStyle = '#000';

    // Augen (verschmitzt)
    ctx.beginPath();
    ctx.arc(7, 5 + bodyBounce, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(13, 5 + bodyBounce, 2, 0, Math.PI * 2);
    ctx.fill();

    // Lächeln
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(10, 8 + bodyBounce, 4, 0, Math.PI);
    ctx.stroke();

    ctx.restore();
}

function drawBackground() {
    // Himmel
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#a8e6cf');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Bahnen
    // Obere Bahn
    ctx.fillStyle = '#8FBC8F';
    ctx.fillRect(0, 80, canvas.width, 150);
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 80, canvas.width, 150);

    // Untere Bahn
    ctx.fillStyle = '#8FBC8F';
    ctx.fillRect(0, 330, canvas.width, 150);
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 330, canvas.width, 150);

    // Mitteltrennlinie
    ctx.strokeStyle = '#6B8E23';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(0, 155);
    ctx.lineTo(canvas.width, 155);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 405);
    ctx.lineTo(canvas.width, 405);
    ctx.stroke();
    ctx.setLineDash([]);

    // Wolken
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    const cloudX = (game.frameCount * 0.5) % (canvas.width + 100);
    drawCloud(cloudX, 30);
    drawCloud(cloudX - 300, 50);
    drawCloud(cloudX + 400, 40);
}

function drawCloud(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.arc(x + 25, y, 25, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
    ctx.fill();
}

function drawObstacles() {
    ctx.fillStyle = '#8B4513';
    obstacles.forEach(obs => {
        // Stein oder Baumstumpf
        ctx.beginPath();
        ctx.arc(obs.x, obs.y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

// Spiellogik
function updateDonkey(donkey, isAccelerating) {
    if (isAccelerating && donkey.speed < donkey.maxSpeed) {
        donkey.speed += donkey.acceleration;
    } else if (donkey.speed > 0) {
        donkey.speed -= donkey.deceleration;
    }

    donkey.speed = Math.max(0, Math.min(donkey.speed, donkey.maxSpeed));
    donkey.x += donkey.speed;

    // Begrenzung auf Canvas
    if (donkey.x > canvas.width - donkey.width) {
        donkey.x = canvas.width - donkey.width;
    }
}

function updateCarrot() {
    // Finde den nächsten Esel zur Karotte
    const donkeyInSameLane = carrot.lane === 0 ? donkey1 : donkey2;
    const distanceToNearestDonkey = carrot.x - donkeyInSameLane.x;

    // Basis-Geschwindigkeit
    let carrotSpeed = game.speed;

    // Wenn ein Esel in der gleichen Bahn ist und näher als 300 Pixel kommt
    if (distanceToNearestDonkey < 300 && distanceToNearestDonkey > 0) {
        // Karotte rennt schneller weg, je näher der Esel kommt
        const panicFactor = 1 - (distanceToNearestDonkey / 300);
        carrotSpeed = game.speed + (panicFactor * 6); // Bis zu 6 Pixel schneller!

        // Chance, die Bahn zu wechseln, wenn Esel sehr nah ist
        if (distanceToNearestDonkey < 150 && Math.random() < 0.02) {
            carrot.lane = carrot.lane === 0 ? 1 : 0;
            carrot.y = carrot.lane === 0 ? 125 : 375;
        }
    }

    // Karotte bewegt sich nach rechts (weg vom Esel)
    carrot.x += carrotSpeed;

    // Karotte zurücksetzen, wenn sie den rechten Bildschirmrand verlässt
    if (carrot.x > canvas.width + 50) {
        carrot.x = 200; // Startet weiter vorne
        carrot.lane = Math.floor(Math.random() * 2);
        carrot.y = carrot.lane === 0 ? 125 : 375;
        game.speed += 0.1; // Geschwindigkeit erhöhen
    }

    // Karotte zurücksetzen, wenn sie vom linken Rand verschwindet (falls überholt)
    if (carrot.x < -50) {
        carrot.x = 200;
        carrot.lane = Math.floor(Math.random() * 2);
        carrot.y = carrot.lane === 0 ? 125 : 375;
    }
}

function checkCollision(donkey) {
    const dx = donkey.x - carrot.x;
    const dy = (donkey.lane === 0 ? 100 : 350) - carrot.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < 50 && donkey.lane === carrot.lane;
}

function updateObstacles() {
    // Hindernisse bewegen
    obstacles.forEach(obs => {
        obs.x -= game.speed;
    });

    // Entferne Hindernisse, die den Bildschirm verlassen haben
    obstacles = obstacles.filter(obs => obs.x > -30);

    // Neue Hindernisse hinzufügen
    if (Math.random() < 0.01 && obstacles.length < 3) {
        obstacles.push({
            x: canvas.width,
            y: Math.random() < 0.5 ? 155 : 405,
            width: 30,
            height: 30
        });
    }
}

function checkObstacleCollision(donkey) {
    const donkeyY = donkey.lane === 0 ? 155 : 405;
    return obstacles.some(obs => {
        return Math.abs(obs.y - donkeyY) < 50 &&
               donkey.x < obs.x + obs.width &&
               donkey.x + donkey.width > obs.x;
    });
}

// Haupt-Spiel-Schleife
function gameLoop() {
    // Hintergrund zeichnen
    drawBackground();

    if (game.state === GameState.PLAYING) {
        // Spieler aktualisieren
        updateDonkey(donkey1, keys.space);
        updateDonkey(donkey2, keys.enter);

        // Karotte aktualisieren
        updateCarrot();

        // Hindernisse aktualisieren
        updateObstacles();

        // Kollision prüfen
        if (checkCollision(donkey1)) {
            game.score1 += 10;
            updateScores();
            resetPositions();
        }

        if (checkCollision(donkey2)) {
            game.score2 += 10;
            updateScores();
            resetPositions();
        }

        // Hindernis-Kollision
        if (checkObstacleCollision(donkey1)) {
            donkey1.speed *= 0.5;
        }
        if (checkObstacleCollision(donkey2)) {
            donkey2.speed *= 0.5;
        }

        game.frameCount++;
    }

    // Hindernisse zeichnen
    drawObstacles();

    // Karotte zeichnen
    drawCarrot();

    // Esel zeichnen
    drawDonkey(donkey1);
    drawDonkey(donkey2);

    requestAnimationFrame(gameLoop);
}

// Spiel starten
updateScores();
gameLoop();
