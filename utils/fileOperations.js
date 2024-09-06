const fs = require('fs');
let pointsData = {};
let registerData = [];
let parties = {}; // Asegúrate de que parties esté inicializado como un objeto vacío

function loadFiles() {
    pointsData = loadJSON('data/points.json', {});
    registerData = loadJSON('data/register.json', []);
}

function loadJSON(filePath, defaultValue) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
        return defaultValue;
    }
}

function saveJSON(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = { loadFiles, loadJSON, saveJSON, pointsData, registerData, parties };
