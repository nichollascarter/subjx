import { helper } from './Helper';
import EventDispatcher from './EventDispatcher';

export default class SubjectModel {

    constructor(el) {
        this.el = el;
        this.storage = null;
        this.proxyMethods = null;

        this.eventDispatcher = new EventDispatcher();

        this._onMouseDown = this._onMouseDown.bind(this);
        this._onTouchStart = this._onTouchStart.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onTouchMove = this._onTouchMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);
        this._animate = this._animate.bind(this);
    }

    enable(options) {
        this._processOptions(options);
        this._init(this.el);
        this.proxyMethods.onInit.call(this, this.el);
    }

    disable() {
        throwNotImplementedError();
    }

    _init() {
        throwNotImplementedError();
    }

    _destroy() {
        throwNotImplementedError();
    }
    
    _processOptions() {
        throwNotImplementedError();
    }

    _start() {
        throwNotImplementedError();
    }

    _moving() {
        throwNotImplementedError();
    }

    _end() {
        throwNotImplementedError();
    }

    _animate() {
        throwNotImplementedError();
    }

    _drag({ dx, dy, ...rest }) {
        const transform = this._processMove(dx, dy);

        const finalArgs = {
            dx,
            dy,
            transform,
            ...rest
        };

        this.proxyMethods.onMove.call(this, finalArgs);
        this._emitEvent('drag', finalArgs);
    }

    _draw() {
        this._animate();
    }

    _onMouseDown(e) {
        this._start(e);
        helper(document)
            .on('mousemove', this._onMouseMove)
            .on('mouseup', this._onMouseUp);
    }

    _onTouchStart(e) {
        this._start(e.touches[0]);
        helper(document)
            .on('touchmove', this._onTouchMove)
            .on('touchend', this._onTouchEnd);
    }

    _onMouseMove(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        this._moving(
            e,
            this.el
        );
    }

    _onTouchMove(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        this._moving(
            e.touches[0],
            this.el
        );
    }

    _onMouseUp(e) {
        helper(document)
            .off('mousemove', this._onMouseMove)
            .off('mouseup', this._onMouseUp);

        this._end(
            e,
            this.el
        );
    }

    _onTouchEnd(e) {
        helper(document)
            .off('touchmove', this._onTouchMove)
            .off('touchend', this._onTouchEnd);

        if (e.touches.length === 0) {
            this._end(
                e.changedTouches[0],
                this.el
            );
        }
    }

    _emitEvent() {
        this.eventDispatcher.emit(this, ...arguments);
    }

    on(name, cb) {
        this.eventDispatcher.addEventListener(name, cb);
        return this;
    }

    off(name, cb) {
        this.eventDispatcher.removeEventListener(name, cb);
        return this;
    }

}

const throwNotImplementedError = () => {
    throw Error(`Method not implemented`);
};