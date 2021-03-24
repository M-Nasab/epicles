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
    steps: 4,
    steppers: 3,
});

emitter.subscribe((event) => {
    console.log(event);
});

emitter.tick(); // [{ step: 1, stepper: 0 }]
emitter.tick(); // [{ step: 2, stepper: 0 }]
emitter.tick(); // [{ step: 3, stepper: 0 }]
emitter.tick(); // [{ step: 0, stepper: 0 }, { step: 1, stepper: 1 }]
emitter.tick(); // [{ step: 1, stepper: 0 }]

```

## Test

```
npm run test
```

## License

MIT