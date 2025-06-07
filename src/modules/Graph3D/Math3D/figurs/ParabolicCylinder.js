import Figure from '../entities/Figure';
import Edge from '../entities/Edge';
import Point from '../entities/Point';
import Polygon from '../entities/Polygon';

class ParabolicCylinder extends Figure {
    constructor(count = 20, size = 5) {
        super();
        this.count = Math.max(2, Math.floor(count));
        this.size = Math.max(0.1, size);

        this.points = [];
        this.edges = [];
        this.polygons = [];

        this.updateGeometry();
    }

    updateGeometry() {
        this.points = [];
        this.edges = [];
        this.polygons = [];

        const step = (2 * this.size) / this.count;

        // Генерация точек
        for (let i = 0; i <= this.count; i++) {
            const x = -this.size + i * step;
            const y = (x * x) / this.size;
            for (let j = 0; j <= this.count; j++) {
                const z = -this.size + j * step;
                this.points.push(new Point(x, y, z));
            }
        }

        const pointsPerRow = this.count + 1;

        // Генерация рёбер
        for (let i = 0; i <= this.count; i++) {
            for (let j = 0; j < this.count; j++) {
                const current = i * pointsPerRow + j;
                const next = current + 1;
                this.edges.push(new Edge(current, next));
            }
        }
        for (let j = 0; j <= this.count; j++) {
            for (let i = 0; i < this.count; i++) {
                const current = i * pointsPerRow + j;
                const next = (i + 1) * pointsPerRow + j;
                this.edges.push(new Edge(current, next));
            }
        }

        // Генерация полигонов
        for (let i = 0; i < this.count; i++) {
            for (let j = 0; j < this.count; j++) {
                const a = i * pointsPerRow + j;
                const b = i * pointsPerRow + j + 1;
                const c = (i + 1) * pointsPerRow + j + 1;
                const d = (i + 1) * pointsPerRow + j;
                this.polygons.push(new Polygon([a, b, c, d], '#FFA500'));
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
                        min="2"
                        value={this.count}
                        onChange={e => {
                            this.count = parseInt(e.target.value, 10) || 2;
                            this.updateGeometry();
                        }}
                    />
                </label>
                <label>
                    Размер области:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.size}
                        onChange={e => {
                            this.size = parseFloat(e.target.value) || 0.1;
                            this.updateGeometry();
                        }}
                    />
                </label>
            </div>
        );
    }
}

export default ParabolicCylinder;
