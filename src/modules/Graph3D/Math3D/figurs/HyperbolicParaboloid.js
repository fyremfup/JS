import Figure from '../entities/Figure';
import Edge from '../entities/Edge';
import Point from '../entities/Point';
import Polygon from '../entities/Polygon';

class HyperbolicParaboloid extends Figure {
    constructor(
        count = 20,
        size = 10,
        a = 3,
        b = 2
    ) {
        super();
        this._count = count;
        this._size = size;
        this._a = a;
        this._b = b;
        this.points = [];
        this.edges = [];
        this.polygons = [];
        
        this.generateGeometry();
    }

    // Геттеры и сеттеры с валидацией
    get count() {
        return this._count;
    }

    set count(value) {
        this._count = Math.max(2, Math.floor(value));
        this.generateGeometry();
    }

    get size() {
        return this._size;
    }

    set size(value) {
        this._size = Math.max(0.1, value);
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
        const count = this._count;
        const size = this._size;
        const step = (2 * size) / (count - 1);
        
        for (let i = 0; i < count; i++) {
            const x = -size + i * step;
            
            for (let j = 0; j < count; j++) {
                const y = -size + j * step;
                const z = (x * x) / (this._a * this._a) - (y * y) / (this._b * this._b);
                
                this.points.push(new Point(x, y, z));
            }
        }
    }

    generateEdges() {
        const count = this._count;
        
        // Горизонтальные ребра (по x)
        for (let i = 0; i < count; i++) {
            const rowStart = i * count;
            for (let j = 0; j < count - 1; j++) {
                this.edges.push(new Edge(
                    rowStart + j,
                    rowStart + j + 1
                ));
            }
        }
        
        // Вертикальные ребра (по y)
        for (let j = 0; j < count; j++) {
            for (let i = 0; i < count - 1; i++) {
                this.edges.push(new Edge(
                    i * count + j,
                    (i + 1) * count + j
                ));
            }
        }
    }

    generatePolygons() {
        const count = this._count;
        
        for (let i = 0; i < count - 1; i++) {
            for (let j = 0; j < count - 1; j++) {
                const a = i * count + j;
                const b = a + 1;
                const c = (i + 1) * count + j + 1;
                const d = (i + 1) * count + j;
                
                this.polygons.push(new Polygon([a, b, c, d], '#FFA500'));
            }
        }
        this.setIndexPolygons();
    }

    settings() {
        return (
            <div>
                <label>
                    Количество сегментов:
                    <input
                        type="number"
                        min="2"
                        step="1"
                        value={this.count}
                        onChange={e => this.count = parseInt(e.target.value, 10)}
                    />
                </label>
                <label>
                    Размер:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.size}
                        onChange={e => this.size = parseFloat(e.target.value)}
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

export default HyperbolicParaboloid;