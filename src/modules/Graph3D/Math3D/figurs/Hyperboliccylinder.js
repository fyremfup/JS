import Point from '../entities/Point.js';
import Polygon from '../entities/Polygon.js';
import Edge from '../entities/Edge.js';

export default class HyperbolicCylinder {
    constructor(count = 10, size = 5) {
        this._count = Math.max(3, Math.floor(count));
        this._size = size;
        this.points = [];
        this.edges = [];
        this.polygons = [];
        this.updateGeometry();
    }

    get count() {
        return this._count;
    }

    set count(value) {
        this._count = Math.max(3, Math.floor(value));
        this.updateGeometry();
    }

    get size() {
        return this._size;
    }

    set size(value) {
        this._size = value;
        this.updateGeometry();
    }

    updateGeometry() {
        this.points = [];
        this.edges = [];
        this.polygons = [];
        this.generatePoints(this._count, this._size);
        this.generateEdges(this._count);
        this.generatePolygons(this._count);
    }

    generatePoints(count, size) {
        // Первая половина цилиндра (size положительный)
        for (let i = -count; i < count; i++) {
            for (let j = 0; j < count; j++) {
                const x = i + size / count;
                const y = (x * x) / size;
                const z = j - size;
                this.points.push(new Point(x, y, z));
            }
        }

        // Вторая половина цилиндра (size отрицательный)
        size = -size;
        for (let i = -count; i < count; i++) {
            for (let j = 0; j < count; j++) {
                const x = i - size / count;
                const y = (x * x) / size;
                const z = j + size;
                this.points.push(new Point(x, y, z));
            }
        }
    }

    generateEdges(count) {
        const half = this.points.length / 2;

        // Первая часть
        for (let i = 0; i < half - count; i++) {
            if ((i + 1) % count !== 0) {
                this.edges.push(new Edge(i, i + 1));
            } else {
                this.edges.push(new Edge(i, i + 1 - count));
            }
            this.edges.push(new Edge(i, i + count));
        }

        // Вторая часть
        for (let i = half; i < this.points.length - count; i++) {
            const rel = i - half;
            if ((rel + 1) % count !== 0) {
                this.edges.push(new Edge(i, i + 1));
            } else {
                this.edges.push(new Edge(i, i + 1 - count));
            }
            this.edges.push(new Edge(i, i + count));
        }
    }

    generatePolygons(count) {
        const half = this.points.length / 2;

        // Первая часть
        for (let i = 0; i < half - count; i++) {
            if ((i + 1) % count !== 0) {
                this.polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count]));
            } else {
                this.polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count]));
            }
        }

        // Вторая часть
        for (let i = half; i < this.points.length - count; i++) {
            const rel = i - half;
            if ((rel + 1) % count !== 0) {
                this.polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count]));
            } else {
                this.polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count]));
            }
        }
        
    }
}
