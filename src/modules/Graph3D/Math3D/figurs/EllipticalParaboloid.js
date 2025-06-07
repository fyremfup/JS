import Figure from '../entities/Figure';
import Edge from '../entities/Edge';
import Point from '../entities/Point';
import Polygon from '../entities/Polygon';

class EllipticalParaboloid extends Figure {
    constructor(
        count = 20,
        maxHeight = 10,
        a = 7,
        b = 4
    ) {
        super();
        this.count = Math.max(3, Math.floor(count));
        this.maxHeight = Math.max(0.1, maxHeight);
        this.a = Math.max(0.1, a);
        this.b = Math.max(0.1, b);

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

    get maxHeight() {
        return this._maxHeight;
    }
    set maxHeight(value) {
        this._maxHeight = Math.max(0.1, value);
        this.generateGeometry();
    }

    get a() {
        return this._a;
    }
    set a(value) {
        this._a = Math.max(0.1, value);
        this.generateGeometry();
    }

    get b() {
        return this._b;
    }
    set b(value) {
        this._b = Math.max(0.1, value);
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
        const radialStep = (2 * Math.PI) / this.count;
        const maxU = Math.sqrt(this.maxHeight);
        const heightStep = maxU / (this.count - 1);

        for (let h = 0; h < this.count; h++) {
            const u = h * heightStep;

            for (let r = 0; r < this.count; r++) {
                const angle = r * radialStep;
                const x = this.a * u * Math.cos(angle);
                const y = u * u;
                const z = this.b * u * Math.sin(angle);

                this.points.push(new Point(x, y, z));
            }
        }
    }

    generateEdges() {
        for (let h = 0; h < this.count; h++) {
            const ringStart = h * this.count;
            for (let r = 0; r < this.count; r++) {
                this.edges.push(new Edge(
                    ringStart + r,
                    ringStart + (r + 1) % this.count
                ));
            }
        }

        for (let r = 0; r < this.count; r++) {
            for (let h = 0; h < this.count - 1; h++) {
                this.edges.push(new Edge(
                    h * this.count + r,
                    (h + 1) * this.count + r
                ));
            }
        }
    }

    generatePolygons() {
        for (let h = 0; h < this.count - 1; h++) {
            for (let r = 0; r < this.count; r++) {
                const current = h * this.count + r;
                const next = h * this.count + (r + 1) % this.count;
                const below = (h + 1) * this.count + r;
                const nextBelow = (h + 1) * this.count + (r + 1) % this.count;

                this.polygons.push(new Polygon([current, next, nextBelow, below], '#FFA500'));
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
                    Максимальная высота:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.maxHeight}
                        onChange={e => this.maxHeight = parseFloat(e.target.value)}
                    />
                </label>
                <label>
                    Коэффициент A:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.a}
                        onChange={e => this.a = parseFloat(e.target.value)}
                    />
                </label>
                <label>
                    Коэффициент B:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.b}
                        onChange={e => this.b = parseFloat(e.target.value)}
                    />
                </label>
            </div>
        );
    }
}

export default EllipticalParaboloid;
