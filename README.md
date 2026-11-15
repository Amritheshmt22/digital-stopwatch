# Digital Stopwatch

A small frontend stopwatch with precise timing, lap history and a saved best lap. It is built with plain HTML, CSS and JavaScript, with no build step, server or external dependency.

## Features

- Start, pause and reset controls
- Centisecond time display
- Lap recording with total and split times
- Fastest and slowest lap highlighting
- Lap count, last lap and best lap statistics
- Best lap saved in browser local storage
- Keyboard shortcuts for Space and L
- Responsive desktop and mobile layout

## Files

- `index.html` - page structure and stopwatch panels
- `styles.css` - responsive layout, lap cards and visual design
- `script.js` - timing state, laps, keyboard shortcuts and saved best lap

## How to run

1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. Start the stopwatch and press Lap to record split times.

No account, package install or server is required.

## How it works

The JavaScript stores the elapsed time and calculates each lap from the previous lap total. Lap history is rendered newest first. The best lap is saved in local storage so it remains available in the same browser after a reload.

## Testing

The project was checked in a browser with functional tests for starting, pausing, resetting, lap splits, fastest and slowest highlighting, best lap persistence, reload state and keyboard shortcuts. Desktop and mobile layouts were visually inspected.

## Note

This project was built with the help of an AI assistant (Instinct) as a learning project.
