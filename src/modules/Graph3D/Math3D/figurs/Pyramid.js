import Figure from '../entities/Figure';
import Point from '../entities/Point';
import Edge from '../entities/Edge';
import Polygon from '../entities/Polygon';

class Pyramid extends Figure {
    constructor(
        count = 4,
        radius = 2.5,
        height = 5,
        color = '#00ff00'
    ) {
        super();

        this.count = Math.max(3, Math.floor(count));
        this.radius = Math.max(0.1, radius);
        this.height = Math.max(0.1, height);
        this.color = color;

        this.points = [];
        this.edges = [];
        this.polygons = [];

        this.updateGeometry();
    }

    updateGeometry() {
        this.points = [];
        this.edges = [];
        this.polygons = [];

        // Генерация вершин основания
        for (let i = 0; i < this.count; i++) {
            // Угол сдвинут для правильного расположения вершин
            const angle = (2 * Math.PI * i) / this.count;
            const x = this.radius * Math.cos(angle);
            const z = this.radius * Math.sin(angle);
            const y = -this.height / 3;
            this.points.push(new Point(x, y, z));
        }

        // Вершина пирамиды
        const apexIndex = this.points.length;
        this.points.push(new Point(0, this.height * 2 / 3, 0));

        // Рёбра основания (замкнутый многоугольник)
        for (let i = 0; i < this.count; i++) {
            this.edges.push(new Edge(i, (i + 1) % this.count));
        }

        // Рёбра от основания к вершине
        for (let i = 0; i < this.count; i++) {
            this.edges.push(new Edge(i, apexIndex));
        }

        // Полигоны боковых граней (треугольники)
        for (let i = 0; i < this.count; i++) {
            this.polygons.push(new Polygon([
                i,
                (i + 1) % this.count,
                apexIndex
            ], this.color));
        }

        // Полигон основания (многоугольник)
        const baseIndices = [];
        for (let i = 0; i < this.count; i++) {
            baseIndices.push(i);
        }
        this.polygons.push(new Polygon(baseIndices, this.color));
        

        this.setIndexPolygons();
    }

    settings() {
        return (
            <div>
                <label>
                    Количество граней:
                    <input
                        type="number"
                        min="3"
                        value={this.count}
                        onChange={e => {
                            this.count = Math.max(3, parseInt(e.target.value, 10) || 3);
                            this.updateGeometry();
                        }}
                    />
                </label>
                <label>
                    Радиус основания:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.radius}
                        onChange={e => {
                            this.radius = Math.max(0.1, parseFloat(e.target.value) || 0.1);
                            this.updateGeometry();
                        }}
                    />
                </label>
                <label>
                    Высота:
                    <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={this.height}
                        onChange={e => {
                            this.height = Math.max(0.1, parseFloat(e.target.value) || 0.1);
                            this.updateGeometry();
                        }}
                    />
                </label>
            </div>
        );
    }
}

export default Pyramid;
