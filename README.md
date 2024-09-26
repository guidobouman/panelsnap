<h1 align="center">PanelSnap</h1>

<p align="center">
  <a href="https://www.codacy.com/app/guidobouman/panelsnap"><img src="https://api.codacy.com/project/badge/Grade/c90e8be4cc2e4931b0f280273f54cb30" alt="Codacy Status"></a>
  <a href="https://travis-ci.org/guidobouman/panelsnap"><img src="https://travis-ci.org/guidobouman/panelsnap.svg?branch=develop" alt="Build Status"></a>
  <a href="https://www.npmjs.com/package/panelsnap"><img src="https://img.shields.io/npm/v/panelsnap.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/panelsnap"><img src="https://img.shields.io/npm/l/panelsnap.svg?sanitize=true" alt="License"></a>
  <a href="https://bundlephobia.com/result?p=panelsnap"><img src="https://img.shields.io/bundlephobia/min/panelsnap.svg?sanitize=true" alt="Bundled Size"></a>
</p>

<p align="center">
  A JavaScript library that provides snapping functionality to a set of panels within your interface.
</p>

---

## Introduction

PanelSnap is a framework agnostic JavaScript library. This means that it works in every JavaScript project, wheter you use Vue, React, jQuery or plain vanilla JavaScript. It can snap both horizontally & vertically, connect with menu's and fire events based on user behaviour.

## Installation

```bash
npm install panelsnap
```

```js
import PanelSnap from 'panelsnap';

const instance = new PanelSnap();
```

```html
<body>
  <section>
    ...
  </section>
  <section>
    ...
  </section>
  <section>
    ...
  </section>
</body>
```

## Documentation

In its simplest form, PanelSnap does not need any configuration. For more advanced scenarios, PanelSnap can be adopted to about every usecase through its settings object.

Check out the documentation at [https://panelsnap.com](https://panelsnap.com) or the `docs` folder for all the different possibilities.

## Credits

- [jellea](https://github.com/jellea) for early feedback and brainpickings.
- [aalexandrov](https://github.com/aalexandrov) for small improvements & bugfixes.
- [akreitals](https://github.com/akreitals) for fixing keyboard navigation when disabled.
- [brumm](https://github.com/brumm) far a panel count bug.
- [dpaquette](https://github.com/dpaquette) for the offset option.
- [wudi96](https://github.com/wudi96) for button navigation.
