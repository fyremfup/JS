import Figure from '../entities/Figure';
import Edge from '../entities/Edge';
import Point from '../entities/Point';
import Polygon from '../entities/Polygon';

class OneSheetedHyperboloid extends Figure {
    constructor(
        count = 20,
        a = 1,
        b = 1,
        c = 1,
        heightScale = 1.5
    ) {
        super();
        this.count = Math.max(3, Math.floor(count));
        this.a = Math.max(0.1, a);
        this.b = Math.max(0.1, b);
        this.c = Math.max(0.1, c);
        this.heightScale = Math.max(0.1, heightScale);

        this.points = [];
        this.edges = [];
        this.polygons = [];

        this.updateGeometry();
    }

    updateGeometry() {
        this.points = [];
        this.edges = [];
        this.polygons = [];

        const uStep = (2 * Math.PI) / this.count;
        const vMin = -this.heightScale;
        const vMax = this.heightScale;
        const vStep = (vMax - vMin) / this.count;

        // Генерация точек
        for (let i = 0; i <= this.count; i++) {
            const v = vMin + i * vStep;
            const coshV = Math.cosh(v);
            const sinhV = Math.sinh(v);

            for (let j = 0; j <= this.count; j++) {
                const u = j * uStep;
                const x = this.a * coshV * Math.cos(u);
                const y = this.c * sinhV;
                const z = this.b * coshV * Math.sin(u);
                this.points.push(new Point(x, y, z));
            }
        }

        const pointsPerRow = this.count + 1;

        // Горизонтальные рёбра
        for (let i = 0; i <= this.count; i++) {
            for (let j = 0; j < this.count; j++) {
                const current = i * pointsPerRow + j;
                const next = current + 1;
                this.edges.push(new Edge(current, next));
            }
        }

        // Вертикальные рёбра
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
                        min="3"
                        value={this.count}
                        onChange={e => {
                            this.count = parseInt(e.target.value) || 3;
                            this.updateGeometry();
                        }}
                    />
                </label>
                <label>
                    Коэффициент A:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.a}
                        onChange={e => {
                            this.a = parseFloat(e.target.value) || 1;
                            this.updateGeometry();
                        }}
                    />
                </label>
                <label>
                    Коэффициент B:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.b}
                        onChange={e => {
                            this.b = parseFloat(e.target.value) || 1;
                            this.updateGeometry();
                        }}
                    />
                </label>
                <label>
                    Коэффициент C:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.c}
                        onChange={e => {
                            this.c = parseFloat(e.target.value) || 1;
                            this.updateGeometry();
                        }}
                    />
                </label>
                <label>
                    Масштаб высоты:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.heightScale}
                        onChange={e => {
                            this.heightScale = parseFloat(e.target.value) || 1;
                            this.updateGeometry();
                        }}
                    />
                </label>
            </div>
        );
    }
}

export default OneSheetedHyperboloid;
