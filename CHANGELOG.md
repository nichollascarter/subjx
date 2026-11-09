# [2.0.0-rc.2](https://github.com/nichollascarter/subjx/compare/v2.0.0-rc.1...v2.0.0-rc.2) (2026-11-09)


* feat(transform)!: direction cursors on resize handles and no grid snapping by default ([0d51a4d](https://github.com/nichollascarter/subjx/commit/0d51a4d80097c82c8a8c133eb9fb992d287b5a8b))


### BREAKING CHANGES

* snap defaults to { x: 0, y: 0, angle: 0 }, so elements move, resize and rotate freely unless a snap step is passed. cursorResize and cursorRotate default to the cursor of the grabbed handle and grabbing instead of auto.

# [2.0.0-rc.1](https://github.com/nichollascarter/subjx/compare/v1.4.0...v2.0.0-rc.1) (2026-11-08)


* build!: keep the UMD bundle in ES5 for script tag users ([725c88c](https://github.com/nichollascarter/subjx/commit/725c88c412afe23976192c0caa77361fb1bf0fa5))
* refactor(observable)!: typed notifier payloads and a handler map instead of a switch ([8f4a984](https://github.com/nichollascarter/subjx/commit/8f4a9848452c47eec1877fa4921d0e38e130b036))
* refactor(transform)!: make the observable field private ([d93d4a9](https://github.com/nichollascarter/subjx/commit/d93d4a97bf26397703af09faade309f86e7d05f5))
* refactor(transform)!: observe peers through a private adapter instead of implements Observer ([8844864](https://github.com/nichollascarter/subjx/commit/8844864223bea8718e16691441ea8f4f307a2688))
* refactor(transform)!: remove deprecated rotationPoint option ([45d953c](https://github.com/nichollascarter/subjx/commit/45d953c832ba88b0ca39e5742276968d537df05b))
* refactor(transform)!: remove deprecated setCenterPoint and resetCenterPoint ([5422082](https://github.com/nichollascarter/subjx/commit/54220827f188b9d68caacaeb2bbe046f72cd42f4))


### Bug Fixes

* **util:** resolve animation frame functions at call time so the library imports without a DOM ([b7f8365](https://github.com/nichollascarter/subjx/commit/b7f8365de4157e06da6b710a2ecc2eb6ca27b384))
* start drag, resize and rotate only on the primary mouse button ([ec2e7c4](https://github.com/nichollascarter/subjx/commit/ec2e7c485946e6718e4c6973398af60994776851))
* **observable:** unsubscribing an unknown observer no longer removes the last one ([2976ee3](https://github.com/nichollascarter/subjx/commit/2976ee36d09789a5bfe6c4bedfbcfaf15ff53b40))


### Features

* **transform:** handles getter as the public way to reach handle elements ([ebf2fe0](https://github.com/nichollascarter/subjx/commit/ebf2fe0b750136f3194f8913d2a8688890af1e08))
* **transform:** update(options) changes options in place and redraws only the handles that depend on them ([c5b2442](https://github.com/nichollascarter/subjx/commit/c5b2442066888125544c013ad64aeb99ede686c5))


### BREAKING CHANGES

* the ESM build now targets browsers with ES module support (Chrome 61+, Safari 10.1+, Firefox 60+) and the CommonJS build targets Node 12+ and browsers matched by ">0.25%, not dead". Only the UMD build (dist/js/subjx.js, the unpkg entry) stays ES5, so projects that bundle subjx for ES5 environments need to transpile it.
* the rotationPoint option is removed, use transformOrigin instead.
* Transformable.observable is no longer public, pass a shared Observable through drag(options, observable) instead.
* Observable.subscribe, unsubscribe and notify accept only notifier event names, and notify checks the payload type per event.
* notifyMove, notifyRotate, notifyResize, notifyApply, notifyGetState, subscribe and unsubscribe are no longer part of the public Transformable API.
* setCenterPoint and resetCenterPoint are removed, use setTransformOrigin and resetTransformOrigin instead.

# [1.4.0](https://github.com/nichollascarter/subjx/compare/v1.3.0...v1.4.0) (2026-10-16)


### Bug Fixes

* **svg:** avoid singular matrix on resize past an edge, fix text resize and mirroring ([ce8745e](https://github.com/nichollascarter/subjx/commit/ce8745e64b9935943dc2f0997c53c66ebd9a34db))
* **html:** build controls from fractional layout size so handles stop jittering ([f786b86](https://github.com/nichollascarter/subjx/commit/f786b86626f4d2465e5d123ea084346c7f34711d))
* **svg:** resize axis-aligned rect, image and foreignObject in a group through geometry ([32f2324](https://github.com/nichollascarter/subjx/commit/32f2324c253b543827bf0271f77e62ad93eb59db))
* **html:** rotated elements, group resize/rotate and transform origin ([ce876b8](https://github.com/nichollascarter/subjx/commit/ce876b871aab2fd577081b8219766f4b43779c2c))


### Features

* **transform:** `flip` option, working min size for SVG and HTML resize ([03ab499](https://github.com/nichollascarter/subjx/commit/03ab49990a67f0f194985a9d744f6aaedc17a1a1))

# [1.4.0-rc.1](https://github.com/nichollascarter/subjx/compare/v1.3.0...v1.4.0-rc.1) (2026-10-15)


### Bug Fixes

* **svg:** avoid singular matrix on resize past an edge, fix text resize and mirroring ([ce8745e](https://github.com/nichollascarter/subjx/commit/ce8745e64b9935943dc2f0997c53c66ebd9a34db))
* **html:** build controls from fractional layout size so handles stop jittering ([f786b86](https://github.com/nichollascarter/subjx/commit/f786b86626f4d2465e5d123ea084346c7f34711d))
* **svg:** resize axis-aligned rect, image and foreignObject in a group through geometry ([32f2324](https://github.com/nichollascarter/subjx/commit/32f2324c253b543827bf0271f77e62ad93eb59db))
* **html:** rotated elements, group resize/rotate and transform origin ([ce876b8](https://github.com/nichollascarter/subjx/commit/ce876b871aab2fd577081b8219766f4b43779c2c))


### Features

* **transform:** `flip` option, working min size for SVG and HTML resize ([03ab499](https://github.com/nichollascarter/subjx/commit/03ab49990a67f0f194985a9d744f6aaedc17a1a1))

# [1.3.0](https://github.com/nichollascarter/subjx/compare/v1.2.0...v1.3.0) (2026-10-09)


### Bug Fixes

* **svg:** `restrict` stops elements exactly at the boundary ([8e01f56](https://github.com/nichollascarter/subjx/commit/8e01f560c1e459d32982a73ead26c6475ea5edea))
* **svg:** cleaner grab area highlight, keep narrow elements draggable ([#99](https://github.com/nichollascarter/subjx/issues/99)) ([20846fd](https://github.com/nichollascarter/subjx/commit/20846fd5cfc9b87bd38e14fab9c3d0043d02599a))
* **svg:** drag end threw with applyTranslate enabled ([ff7df2c](https://github.com/nichollascarter/subjx/commit/ff7df2c0efac15f7cc555945a527b719ea110106))
* **clone:** dragEnd listener threw TypeError ([d8ba99d](https://github.com/nichollascarter/subjx/commit/d8ba99d543978f6a3abfa7e970b151ce10648fb2))
* **package:** export the stylesheet and dist files ([87c15f7](https://github.com/nichollascarter/subjx/commit/87c15f7d84df76c44f2709b4b09adff401ff4656))
* **transform:** keep the rotator off a flat box ([#98](https://github.com/nichollascarter/subjx/issues/98)) ([3938736](https://github.com/nichollascarter/subjx/commit/393873689fd530b053b6f4f7206a0fc15a95a754))
* **events:** off() threw TypeError ([c21bde5](https://github.com/nichollascarter/subjx/commit/c21bde5ca00d270936d62c32b1a8d631f81adfcd))
* **drag:** partial snap option broke drag/resize/rotate ([77a2e49](https://github.com/nichollascarter/subjx/commit/77a2e496d9044ed2536c229d76de43ff8365a31e))


### Features

* **svg:** `hitRadius` option and handle highlighting ([8eb86d5](https://github.com/nichollascarter/subjx/commit/8eb86d576fafb164e334c26bd8853e0d5f64f0a4))
* **svg:** alignment guides and snapping while dragging ([fbc7eb1](https://github.com/nichollascarter/subjx/commit/fbc7eb1ad5eb72ad32d777b15937fa1a7b591a11))
* **svg:** alignment guides while resizing and moving line endpoints ([c115d28](https://github.com/nichollascarter/subjx/commit/c115d28bbdbf0c4f84af39ea442d9f731efc5d82))
* choose resize handles with the `handles` option ([b7e4f63](https://github.com/nichollascarter/subjx/commit/b7e4f63d09d892aaba34afbbbb23d9be3426271d))
* **svg:** endpoint controls for line elements ([5e48e7e](https://github.com/nichollascarter/subjx/commit/5e48e7e3a89793ebf3701986ef3893174c63621c))
* typings generated from the TypeScript source ([9d2c8b8](https://github.com/nichollascarter/subjx/commit/9d2c8b88333baa1abc5ee1885d156b45e1af4bed))

# [1.3.0-rc.3](https://github.com/nichollascarter/subjx/compare/v1.3.0-rc.2...v1.3.0-rc.3) (2026-10-08)


### Bug Fixes

* **svg:** cleaner grab area highlight, keep narrow elements draggable ([#99](https://github.com/nichollascarter/subjx/issues/99)) ([20846fd](https://github.com/nichollascarter/subjx/commit/20846fd5cfc9b87bd38e14fab9c3d0043d02599a))

# [1.3.0-rc.2](https://github.com/nichollascarter/subjx/compare/v1.3.0-rc.1...v1.3.0-rc.2) (2026-10-07)


### Bug Fixes

* **transform:** keep the rotator off a flat box ([#98](https://github.com/nichollascarter/subjx/issues/98)) ([3938736](https://github.com/nichollascarter/subjx/commit/393873689fd530b053b6f4f7206a0fc15a95a754))

# [1.3.0-rc.1](https://github.com/nichollascarter/subjx/compare/v1.2.0...v1.3.0-rc.1) (2026-10-06)


### Bug Fixes

* **svg:** `restrict` stops elements exactly at the boundary ([8e01f56](https://github.com/nichollascarter/subjx/commit/8e01f560c1e459d32982a73ead26c6475ea5edea))
* **svg:** drag end threw with applyTranslate enabled ([ff7df2c](https://github.com/nichollascarter/subjx/commit/ff7df2c0efac15f7cc555945a527b719ea110106))
* **clone:** dragEnd listener threw TypeError ([d8ba99d](https://github.com/nichollascarter/subjx/commit/d8ba99d543978f6a3abfa7e970b151ce10648fb2))
* **package:** export the stylesheet and dist files ([87c15f7](https://github.com/nichollascarter/subjx/commit/87c15f7d84df76c44f2709b4b09adff401ff4656))
* **events:** off() threw TypeError ([c21bde5](https://github.com/nichollascarter/subjx/commit/c21bde5ca00d270936d62c32b1a8d631f81adfcd))
* **drag:** partial snap option broke drag/resize/rotate ([77a2e49](https://github.com/nichollascarter/subjx/commit/77a2e496d9044ed2536c229d76de43ff8365a31e))


### Features

* **svg:** `hitRadius` option and handle highlighting ([8eb86d5](https://github.com/nichollascarter/subjx/commit/8eb86d576fafb164e334c26bd8853e0d5f64f0a4))
* **svg:** alignment guides and snapping while dragging ([fbc7eb1](https://github.com/nichollascarter/subjx/commit/fbc7eb1ad5eb72ad32d777b15937fa1a7b591a11))
* **svg:** alignment guides while resizing and moving line endpoints ([c115d28](https://github.com/nichollascarter/subjx/commit/c115d28bbdbf0c4f84af39ea442d9f731efc5d82))
* choose resize handles with the `handles` option ([b7e4f63](https://github.com/nichollascarter/subjx/commit/b7e4f63d09d892aaba34afbbbb23d9be3426271d))
* **svg:** endpoint controls for line elements ([5e48e7e](https://github.com/nichollascarter/subjx/commit/5e48e7e3a89793ebf3701986ef3893174c63621c))
* typings generated from the TypeScript source ([9d2c8b8](https://github.com/nichollascarter/subjx/commit/9d2c8b88333baa1abc5ee1885d156b45e1af4bed))

# [1.2.0](https://github.com/nichollascarter/subjx/compare/v1.1.2...v1.2.0) (2026-09-02)


### Features

* **align:** optional target frame for applyAlignment ([#94](https://github.com/nichollascarter/subjx/issues/94)) ([f06b3ad](https://github.com/nichollascarter/subjx/commit/f06b3ad714f5725f07a3db909c4a5086c792e1ab))

# [1.2.0-rc.1](https://github.com/nichollascarter/subjx/compare/v1.1.2...v1.2.0-rc.1) (2026-06-11)


### Features

* **align:** optional target frame for applyAlignment ([#94](https://github.com/nichollascarter/subjx/issues/94)) ([f06b3ad](https://github.com/nichollascarter/subjx/commit/f06b3ad714f5725f07a3db909c4a5086c792e1ab))

## [1.1.2](https://github.com/nichollascarter/subjx/compare/v1.1.1...v1.1.2) (2025-10-13)


### Bug Fixes

* **types:** make "observable" argument for drag method optional ([04fb831](https://github.com/nichollascarter/subjx/commit/04fb8312a20c9ec451e9ad57541373942f62762c))

## [1.1.2-rc.1](https://github.com/nichollascarter/subjx/compare/v1.1.1...v1.1.2-rc.1) (2025-09-16)


### Bug Fixes

* **types:** make "observable" argument for drag method optional ([04fb831](https://github.com/nichollascarter/subjx/commit/04fb8312a20c9ec451e9ad57541373942f62762c))

## [1.1.1](https://github.com/nichollascarter/subjx/compare/v1.1.0...v1.1.1) (2023-11-04)


### Bug Fixes

* **core:** fixed issue on rotating to 90deg ([163e06d](https://github.com/nichollascarter/subjx/commit/163e06dabbf5ed4e956ad33ce7a0738819c59abb)), closes [#47](https://github.com/nichollascarter/subjx/issues/47)

## [1.1.1-rc.1](https://github.com/nichollascarter/subjx/compare/v1.1.0...v1.1.1-rc.1) (2023-01-06)


### Bug Fixes

* **core:** fixed issue on rotating to 90deg ([163e06d](https://github.com/nichollascarter/subjx/commit/163e06dabbf5ed4e956ad33ce7a0738819c59abb)), closes [#47](https://github.com/nichollascarter/subjx/issues/47)

# [1.1.0-rc.5](https://github.com/nichollascarter/subjx/compare/v1.1.0-rc.4...v1.1.0-rc.5) (2022-10-03)


### Bug Fixes

* **core:** fixed issue on rotating to 90deg ([163e06d](https://github.com/nichollascarter/subjx/commit/163e06dabbf5ed4e956ad33ce7a0738819c59abb)), closes [#47](https://github.com/nichollascarter/subjx/issues/47)

# [1.1.0](https://github.com/nichollascarter/subjx/compare/v1.0.0...v1.1.0) (2022-07-04)


### Bug Fixes

* fix wrong transform-origin position for nested elements ([93af678](https://github.com/nichollascarter/subjx/commit/93af67887834b0c455ab8cbb38b8d7a7765d9ae5))
* **core:** fixed tests ([5d81abe](https://github.com/nichollascarter/subjx/commit/5d81abe94f745b25d4d539d081bcd14a9870003a))
* **src:** fixed undefined containerMatrix value on applying alignment ([6b20349](https://github.com/nichollascarter/subjx/commit/6b20349b3ca408297d923f64646bc69ac860245c))
* **core:** set correct transform origin, allow alignment for groupable html elements ([cf29d29](https://github.com/nichollascarter/subjx/commit/cf29d2910cbea89c83864b98d382cbfdda535531))

### Features

* **src:** add setCenterPoint method ([7995cf5](https://github.com/nichollascarter/subjx/commit/7995cf504434d98e60bfa6e240a7e14eee8372fb)), closes [#56](https://github.com/nichollascarter/subjx/issues/56)
* added transform origin support ([75e33de](https://github.com/nichollascarter/subjx/commit/75e33de273d896b3b3e64593be123bea4dd6d64f))

# [1.1.0-rc.4](https://github.com/nichollascarter/subjx/compare/v1.1.0-rc.3...v1.1.0-rc.4) (2022-03-21)


### Bug Fixes

* **core:** fixed tests ([5d81abe](https://github.com/nichollascarter/subjx/commit/5d81abe94f745b25d4d539d081bcd14a9870003a))
* **core:** set correct transform origin, allow alignment for groupable html elements ([cf29d29](https://github.com/nichollascarter/subjx/commit/cf29d2910cbea89c83864b98d382cbfdda535531))

# [1.1.0-rc.3](https://github.com/nichollascarter/subjx/compare/v1.1.0-rc.2...v1.1.0-rc.3) (2022-03-02)


### Bug Fixes

* **src:** fixed undefined containerMatrix value on applying alignment ([6b20349](https://github.com/nichollascarter/subjx/commit/6b20349b3ca408297d923f64646bc69ac860245c))

# [1.1.0-rc.2](https://github.com/nichollascarter/subjx/compare/v1.1.0-rc.1...v1.1.0-rc.2) (2022-02-14)


### Bug Fixes

* fix wrong transform-origin position for nested elements ([93af678](https://github.com/nichollascarter/subjx/commit/93af67887834b0c455ab8cbb38b8d7a7765d9ae5))

# [1.1.0-rc.2](https://github.com/nichollascarter/subjx/compare/v1.1.0-rc.1...v1.1.0-rc.2) (2022-02-14)


### Bug Fixes

* fix wrong transform-origin position for nested elements ([93af678](https://github.com/nichollascarter/subjx/commit/93af67887834b0c455ab8cbb38b8d7a7765d9ae5))

# [1.1.0-rc.2](https://github.com/nichollascarter/subjx/compare/v1.1.0-rc.1...v1.1.0-rc.2) (2022-02-14)


### Bug Fixes

* fix wrong transform-origin position for nested elements ([93af678](https://github.com/nichollascarter/subjx/commit/93af67887834b0c455ab8cbb38b8d7a7765d9ae5))

# [1.1.0-rc.2](https://github.com/nichollascarter/subjx/compare/v1.1.0-rc.1...v1.1.0-rc.2) (2022-02-14)


### Bug Fixes

* fix wrong transform-origin position for nested elements ([93af678](https://github.com/nichollascarter/subjx/commit/93af67887834b0c455ab8cbb38b8d7a7765d9ae5))

# [1.1.0-rc.1](https://github.com/nichollascarter/subjx/compare/v1.0.0...v1.1.0-rc.1) (2022-02-13)


### Features

* **src:** add setCenterPoint method ([7995cf5](https://github.com/nichollascarter/subjx/commit/7995cf504434d98e60bfa6e240a7e14eee8372fb)), closes [#56](https://github.com/nichollascarter/subjx/issues/56)
* added transform origin support ([75e33de](https://github.com/nichollascarter/subjx/commit/75e33de273d896b3b3e64593be123bea4dd6d64f))

# [1.0.0](https://github.com/nichollascarter/subjx/compare/v0.3.9...v1.0.0) (2021-12-15)


### Bug Fixes

* fix move command issue ([28ef4c7](https://github.com/nichollascarter/subjx/commit/28ef4c7eee521940a48ee54c3c8d4155019fd04d))
* **src:** fix rotation issue on HTML element and rotation point reseting on SVG element ([4e1a5a3](https://github.com/nichollascarter/subjx/commit/4e1a5a36e2e2c6f40e8a549ce8c20f28fdd3eda8)), closes [#58](https://github.com/nichollascarter/subjx/issues/58)
* **src:** prevent rotation point moving when groupable is rotating ([080cf48](https://github.com/nichollascarter/subjx/commit/080cf486bf3749b636610141cd825d989bc35d4e)), closes [#58](https://github.com/nichollascarter/subjx/issues/58)


### Features

* prepare prerelease version for supporting groupable feature ([92abb4b](https://github.com/nichollascarter/subjx/commit/92abb4bc12c78c3739233593adefa8b063b73d62))


### BREAKING CHANGES

* Change API

# [1.0.0-rc.4](https://github.com/nichollascarter/subjx/compare/v1.0.0-rc.3...v1.0.0-rc.4) (2021-12-14)


### Bug Fixes

* **src:** prevent rotation point moving when groupable is rotating ([080cf48](https://github.com/nichollascarter/subjx/commit/080cf486bf3749b636610141cd825d989bc35d4e)), closes [#58](https://github.com/nichollascarter/subjx/issues/58)

# [1.0.0-rc.3](https://github.com/nichollascarter/subjx/compare/v1.0.0-rc.2...v1.0.0-rc.3) (2021-12-12)


### Bug Fixes

* **src:** fix rotation issue on HTML element and rotation point reseting on SVG element ([4e1a5a3](https://github.com/nichollascarter/subjx/commit/4e1a5a36e2e2c6f40e8a549ce8c20f28fdd3eda8)), closes [#58](https://github.com/nichollascarter/subjx/issues/58)

# [1.0.0-rc.2](https://github.com/nichollascarter/subjx/compare/v1.0.0-rc.1...v1.0.0-rc.2) (2021-11-09)


### Bug Fixes

* fix move command issue ([28ef4c7](https://github.com/nichollascarter/subjx/commit/28ef4c7eee521940a48ee54c3c8d4155019fd04d))

# [1.0.0-rc.1](https://github.com/nichollascarter/subjx/compare/v0.3.9...v1.0.0-rc.1) (2021-11-02)


### Features

* prepare prerelease version for supporting groupable feature ([92abb4b](https://github.com/nichollascarter/subjx/commit/92abb4bc12c78c3739233593adefa8b063b73d62))


### BREAKING CHANGES

* Change API
