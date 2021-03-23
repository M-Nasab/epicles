# Epicles

[![Build Status](https://travis-ci.org/M-Nasab/epicles.svg?branch=main)](https://travis-ci.org/M-Nasab/epicles)
[![NPM Package](https://img.shields.io/npm/v/epicles)](https://www.npmjs.com/package/epicles)

A small periodic event emitter

## Installation

```
npm install --save epicles
```

## Usage

```javascript
import { epicles } from 'epicles';

// create an emitter with initial state [0, 0, 0]
const emitter = epicles({
    period: 4,
    oscillators: 3,
});

emitter.subscribe((event) => {
    console.log(event);
});

emitter.tick(); // [1, 0, 0]
emitter.tick(); // [2, 0, 0]
emitter.tick(); // [3, 0, 0]
emitter.tick(); // [0, 1, 0]
emitter.tick(); // [1, 1, 0]

```

## Test

```
npm run test
```

## License

MIT