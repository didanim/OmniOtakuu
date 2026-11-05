const AUDIO_BASE = 'https://cdn.jsdelivr.net/gh/didanim/OmniOtakuu/sounds/';

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const soundBuffers = {};

async function loadSound(name, filename) {
    try {
        const response = await fetch(AUDIO_BASE + filename);
        const arrayBuffer = await response.arrayBuffer();
        soundBuffers[name] = await audioCtx.decodeAudioData(arrayBuffer);
    } catch (e) {
        console.error('Audio load failed:', name, e);
    }
}

function playSound(name, volume = 1) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const buffer = soundBuffers[name];
    if (!buffer) return null;

    const source = audioCtx.createBufferSource();
    const gainNode = audioCtx.createGain();

    source.buffer = buffer;
    gainNode.gain.value = volume;

    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    source.start(0);
    return source; 
}


let warmedUp = false;
function warmUp() {
    if (warmedUp) return;
    warmedUp = true;
    
    if (audioCtx.state === 'suspended') audioCtx.resume();

    // Fetch and cache audio files concurrently
    loadSound('pour', 'coffee-pour.mp3');
    loadSound('lightOn', 'light-on.mp3');
    loadSound('lightOff', 'light-off.mp3');
    loadSound('paperTurn', 'paper-turn.mp3');
    loadSound('paperCrumple', 'crumpling-paper.mp3'); // Added missing declaration
    loadSound('splat', 'deltasplat.mp3');                // Added missing declaration
}

window.addEventListener('pointerdown', warmUp, { once: true });
window.addEventListener('keydown', warmUp, { once: true });


const mugBtn = document.getElementById('mugBtn');
if (mugBtn) {
    mugBtn.addEventListener('click', () => {
        const pourSource = playSound('pour', 0.6);
        if (pourSource) {
            mugBtn.classList.add('pouring');
            pourSource.onended = () => mugBtn.classList.remove('pouring');
        }
    });
}

const stainBtn = document.getElementById('stainBtn');
if (stainBtn) {
    stainBtn.addEventListener('click', () => playSound('splat', 1));
}

const lightSwitch = document.getElementById('lightSwitch');
if (lightSwitch) {
    lightSwitch.addEventListener('click', () => {
        const dark = document.body.classList.toggle('lights-off');
        lightSwitch.setAttribute('aria-pressed', !dark);
        playSound(dark ? 'lightOff' : 'lightOn', dark ? 1 : 0.55);
    });
}

// Custom Journal Events
document.addEventListener('journal:turn', () => playSound('paperTurn', 0.5));
document.addEventListener('journal:empty', () => playSound('paperCrumple', 0.5));
