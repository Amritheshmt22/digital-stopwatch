const BEST_LAP_KEY = "digital-stopwatch-best-lap";

const timeDisplay = document.getElementById("timeDisplay");
const statusText = document.getElementById("statusText");
const startPauseButton = document.getElementById("startPauseButton");
const lapButton = document.getElementById("lapButton");
const resetButton = document.getElementById("resetButton");
const lapCount = document.getElementById("lapCount");
const lastLap = document.getElementById("lastLap");
const bestLap = document.getElementById("bestLap");
const lapSummary = document.getElementById("lapSummary");
const emptyState = document.getElementById("emptyState");
const lapsList = document.getElementById("lapsList");

let elapsedMs = 0;
let lastLapMs = 0;
let startedAt = 0;
let timerId = null;
let laps = [];
let bestLapMs = loadBestLap();

function loadBestLap() {
  const saved = Number(localStorage.getItem(BEST_LAP_KEY));
  return Number.isFinite(saved) && saved > 0 ? saved : null;
}

function saveBestLap() {
  if (bestLapMs) {
    localStorage.setItem(BEST_LAP_KEY, String(bestLapMs));
  } else {
    localStorage.removeItem(BEST_LAP_KEY);
  }
}

function currentElapsed() {
  return timerId ? Date.now() - startedAt : elapsedMs;
}

function formatTime(ms) {
  const totalCentiseconds = Math.floor(ms / 10);
  const centiseconds = totalCentiseconds % 100;
  const totalSeconds = Math.floor(totalCentiseconds / 100);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
}

function renderStats() {
  lapCount.textContent = String(laps.length);
  lastLap.textContent = laps.length ? formatTime(laps[0].splitMs) : "--:--.--";
  bestLap.textContent = bestLapMs ? formatTime(bestLapMs) : "--:--.--";
  lapSummary.textContent = laps.length ? `${laps.length} lap${laps.length === 1 ? "" : "s"} recorded` : "No laps yet";
  emptyState.hidden = laps.length > 0;
}

function renderLaps() {
  lapsList.innerHTML = "";
  if (!laps.length) return;

  const splitValues = laps.map((lap) => lap.splitMs);
  const fastest = Math.min(...splitValues);
  const slowest = Math.max(...splitValues);

  laps.forEach((lap) => {
    const item = document.createElement("li");
    item.className = "lap-item";
    if (laps.length > 1 && lap.splitMs === fastest) item.classList.add("fastest");
    if (laps.length > 1 && lap.splitMs === slowest) item.classList.add("slowest");

    const number = document.createElement("span");
    number.className = "lap-number";
    number.textContent = `Lap ${lap.number}`;

    const total = document.createElement("span");
    total.className = "lap-total";
    total.textContent = `Total ${formatTime(lap.totalMs)}`;

    const split = document.createElement("strong");
    split.className = "lap-split";
    split.textContent = formatTime(lap.splitMs);

    item.append(number, total, split);
    lapsList.appendChild(item);
  });
}

function render() {
  const elapsed = currentElapsed();
  timeDisplay.textContent = formatTime(elapsed);
  startPauseButton.textContent = timerId ? "Pause" : "Start";
  lapButton.disabled = !timerId && elapsed === 0;
  resetButton.disabled = !timerId && elapsed === 0 && laps.length === 0;
  document.title = timerId ? `${formatTime(elapsed)} - Digital Stopwatch` : "Digital Stopwatch";
  renderStats();
  renderLaps();
}

function tick() {
  render();
}

function start() {
  if (timerId) return;
  startedAt = Date.now() - elapsedMs;
  timerId = setInterval(tick, 10);
  statusText.textContent = "Running";
  render();
}

function pause() {
  if (!timerId) return;
  elapsedMs = Date.now() - startedAt;
  clearInterval(timerId);
  timerId = null;
  statusText.textContent = "Paused";
  render();
}

function startOrPause() {
  if (timerId) {
    pause();
  } else {
    start();
  }
}

function reset() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  elapsedMs = 0;
  lastLapMs = 0;
  laps = [];
  statusText.textContent = "Ready";
  render();
}

function addLap() {
  const totalMs = currentElapsed();
  if (totalMs === 0) return;
  const splitMs = totalMs - lastLapMs;
  laps.unshift({
    number: laps.length + 1,
    splitMs,
    totalMs
  });
  lastLapMs = totalMs;
  if (!bestLapMs || splitMs < bestLapMs) {
    bestLapMs = splitMs;
    saveBestLap();
  }
  render();
}

startPauseButton.addEventListener("click", startOrPause);
lapButton.addEventListener("click", addLap);
resetButton.addEventListener("click", reset);

document.addEventListener("keydown", (event) => {
  const tagName = document.activeElement?.tagName;
  if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "BUTTON") return;
  if (event.code === "Space") {
    event.preventDefault();
    startOrPause();
  }
  if (event.key.toLowerCase() === "l") {
    addLap();
  }
});

window.digitalStopwatch = {
  getState() {
    return {
      elapsedMs: currentElapsed(),
      lastLapMs,
      running: Boolean(timerId),
      laps: laps.map((lap) => ({ ...lap })),
      bestLapMs
    };
  },
  setElapsed(ms) {
    elapsedMs = Math.max(0, Number(ms) || 0);
    if (timerId) startedAt = Date.now() - elapsedMs;
    render();
  },
  setLastLap(ms) {
    lastLapMs = Math.max(0, Number(ms) || 0);
  }
};

render();
