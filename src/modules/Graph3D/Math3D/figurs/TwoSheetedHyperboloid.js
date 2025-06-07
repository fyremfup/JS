import Figure from '../entities/Figure';
import Edge from '../entities/Edge';
import Point from '../entities/Point';
import Polygon from '../entities/Polygon';

class TwoSheetedHyperboloid extends Figure {
    constructor(
        count = 20,
        a = 1,
        b = 1,
        c = 1,
        vMax = Math.PI
    ) {
        super();
        this.count = Math.max(3, Math.floor(count));
        this.a = Math.max(0.1, a);
        this.b = Math.max(0.1, b);
        this.c = Math.max(0.1, c);
        this.vMax = Math.max(0.1, vMax);

        this.points = [];
        this.edges = [];
        this.polygons = [];

        this.updateGeometry();
    }

    updateGeometry() {
        this.points = [];
        this.edges = [];
        this.polygons = [];

        const vMin = 0.1; // чтобы избежать слияния листов в центре
        const uStep = (2 * Math.PI) / this.count;
        const vStep = (this.vMax - vMin) / (this.count - 1);

        // Верхний лист
        for (let i = 0; i < this.count; i++) {
            const v = vMin + i * vStep;
            for (let j = 0; j < this.count; j++) {
                const u = j * uStep;
                this.points.push(new Point(
                    this.a * Math.sinh(v) * Math.cos(u),
                    this.b * Math.sinh(v) * Math.sin(u),
                    this.c * Math.cosh(v)
                ));
            }
        }

        // Нижний лист (зеркально по оси z)
        for (let i = 0; i < this.count; i++) {
            const v = vMin + i * vStep;
            for (let j = 0; j < this.count; j++) {
                const u = j * uStep;
                this.points.push(new Point(
                    -this.a * Math.sinh(v) * Math.cos(u),
                    -this.b * Math.sinh(v) * Math.sin(u),
                    -this.c * Math.cosh(v)
                ));
            }
        }

        const pointsPerSheet = this.count * this.count;

        // Генерация рёбер
        // Верхний лист
        for (let i = 0; i < this.count; i++) {
            for (let j = 0; j < this.count; j++) {
                const current = i * this.count + j;
                // Вдоль u (по j)
                if (j < this.count - 1) {
                    this.edges.push(new Edge(current, current + 1));
                } else {
                    this.edges.push(new Edge(current, i * this.count)); // замыкание по u
                }
                // Вдоль v (по i)
                if (i < this.count - 1) {
                    this.edges.push(new Edge(current, current + this.count));
                }
            }
        }
        // Нижний лист
        for (let i = 0; i < this.count; i++) {
            for (let j = 0; j < this.count; j++) {
                const current = pointsPerSheet + i * this.count + j;
                if (j < this.count - 1) {
                    this.edges.push(new Edge(current, current + 1));
                } else {
                    this.edges.push(new Edge(current, pointsPerSheet + i * this.count));
                }
                if (i < this.count - 1) {
                    this.edges.push(new Edge(current, current + this.count));
                }
            }
        }

        // Генерация полигонов
        // Верхний лист
        for (let i = 0; i < this.count - 1; i++) {
            for (let j = 0; j < this.count; j++) {
                const a = i * this.count + j;
                const b = i * this.count + ((j + 1) % this.count);
                const c = (i + 1) * this.count + ((j + 1) % this.count);
                const d = (i + 1) * this.count + j;
                this.polygons.push(new Polygon([a, b, c, d], '#FFA500'));
            }
        }
        // Нижний лист
        for (let i = 0; i < this.count - 1; i++) {
            for (let j = 0; j < this.count; j++) {
                const a = pointsPerSheet + i * this.count + j;
                const b = pointsPerSheet + i * this.count + ((j + 1) % this.count);
                const c = pointsPerSheet + (i + 1) * this.count + ((j + 1) % this.count);
                const d = pointsPerSheet + (i + 1) * this.count + j;
                this.polygons.push(new Polygon([a, b, c, d], '#FF69B4'));
            }
        }
        

        this.setIndexPolygons();
    }

    settings() {
        return (
            <div>
                <label>
                    Детализация (count):
                    <input
                        type="number"
                        min="3"
                        step="1"
                        value={this.count}
                        onChange={e => {
                            this.count = parseInt(e.target.value, 10) || 3;
                            this.updateGeometry();
                        }}
                    />
                </label>
                <label>
                    Коэффициент a:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.a}
                        onChange={e => {
                            this.a = parseFloat(e.target.value) || 0.1;
                            this.updateGeometry();
                        }}
                    />
                </label>
                <label>
                    Коэффициент b:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.b}
                        onChange={e => {
                            this.b = parseFloat(e.target.value) || 0.1;
                            this.updateGeometry();
                        }}
                    />
                </label>
                <label>
                    Коэффициент c:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.c}
                        onChange={e => {
                            this.c = parseFloat(e.target.value) || 0.1;
                            this.updateGeometry();
                        }}
                    />
                </label>
                <label>
                    Диапазон v (vMax):
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.vMax}
                        onChange={e => {
                            this.vMax = parseFloat(e.target.value) || 0.1;
                            this.updateGeometry();
                        }}
                    />
                </label>
            </div>
        );
    }
}

export default TwoSheetedHyperboloid;
