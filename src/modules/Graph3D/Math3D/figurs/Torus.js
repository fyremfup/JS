import Figure from '../entities/Figure';
import Edge from '../entities/Edge';
import Point from '../entities/Point';
import Polygon from '../entities/Polygon';

class Torus extends Figure {
    constructor(count = 20, radius = 10, tubeRadius = 3) {
        super();
        this._count = count;
        this._radius = radius;
        this._tubeRadius = tubeRadius;
        this.points = [];
        this.edges = [];
        this.polygons = [];
        
        this.generateGeometry();
    }

    get count() {
        return this._count;
    }

    set count(value) {
        this._count = Math.max(3, Math.floor(value));
        this.generateGeometry();
    }

    get radius() {
        return this._radius;
    }

    set radius(value) {
        this._radius = value;
        this.generateGeometry();
    }

    get tubeRadius() {
        return this._tubeRadius;
    }

    set tubeRadius(value) {
        this._tubeRadius = value;
        this.generateGeometry();
    }

    generateGeometry() {
        this.points = [];
        this.edges = [];
        this.polygons = [];
        this.generatePoints();
        this.generateEdges();
        this.generatePolygons();
    }

    generatePoints() {
        const step = (2 * Math.PI) / this._count;

        for (let r = 0; r < this._count; r++) {
            const radialAngle = r * step;
            const cosRadial = Math.cos(radialAngle);
            const sinRadial = Math.sin(radialAngle);
            
            for (let t = 0; t < this._count; t++) {
                const tubeAngle = t * step;
                const cosTube = Math.cos(tubeAngle);
                const sinTube = Math.sin(tubeAngle);
                
                this.points.push(new Point(
                    (this._radius + this._tubeRadius * cosTube) * cosRadial,
                    (this._radius + this._tubeRadius * cosTube) * sinRadial,
                    this._tubeRadius * sinTube
                ));
            }
        }
    }

    generateEdges() {
        for (let r = 0; r < this._count; r++) {
            const ringStart = r * this._count;
            for (let t = 0; t < this._count; t++) {
                this.edges.push(new Edge(
                    ringStart + t,
                    ringStart + (t + 1) % this._count
                ));
            }
        }

        for (let t = 0; t < this._count; t++) {
            for (let r = 0; r < this._count; r++) {
                this.edges.push(new Edge(
                    r * this._count + t,
                    ((r + 1) % this._count) * this._count + t
                ));
            }
        }
    }

    generatePolygons() {
        for (let r = 0; r < this._count; r++) {
            for (let t = 0; t < this._count; t++) {
                const a = r * this._count + t;
                const b = r * this._count + (t + 1) % this._count;
                const c = ((r + 1) % this._count) * this._count + (t + 1) % this._count;
                const d = ((r + 1) % this._count) * this._count + t;
                
                this.polygons.push(new Polygon([a, b, c, d], '#00FF00'));
            }
        }
        this.setIndexPolygons();
    }

    settings() {
        return (
            <div>
                <label>
                    Детализация:
                    <input
                        type="number"
                        min="3"
                        step="1"
                        value={this.count}
                        onChange={e => this.count = parseInt(e.target.value, 10)}
                    />
                </label>
                <label>
                    Радиус тора:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.radius}
                        onChange={e => this.radius = parseFloat(e.target.value)}
                    />
                </label>
                <label>
                    Радиус трубки:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.tubeRadius}
                        onChange={e => this.tubeRadius = parseFloat(e.target.value)}
                    />
                </label>
            </div>
        );
    }
}

export default Torus;