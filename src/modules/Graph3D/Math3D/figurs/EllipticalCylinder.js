import Figure from '../entities/Figure';
import Edge from '../entities/Edge';
import Point from '../entities/Point';
import Polygon from '../entities/Polygon';

class EllipticalCylinder extends Figure {
    constructor(count = 20, height = 15, radiusX = 6, radiusZ = 10) {
        super();
        this.count = count;
        this.height = height;
        this.radiusX = radiusX;
        this.radiusZ = radiusZ;
        this.points = [];
        this.edges = [];
        this.polygons = [];
        
        this.updateGeometry();
    }

    updateGeometry() {
        this.points = [];
        this.edges = [];
        this.polygons = [];
        
        const angleStep = (2 * Math.PI) / this.count;
        const halfHeight = this.height / 2;

        // Генерация точек для нижнего и верхнего оснований
        for (let i = 0; i < this.count; i++) {
            const angle = i * angleStep;
            const x = this.radiusX * Math.cos(angle);
            const z = this.radiusZ * Math.sin(angle);
            
            // Нижнее основание
            this.points.push(new Point(x, -halfHeight, z));
            
            // Верхнее основание
            this.points.push(new Point(x, halfHeight, z));
        }

        // Центральные точки для крышек
        const bottomCenter = this.points.length;
        this.points.push(new Point(0, -halfHeight, 0));
        const topCenter = this.points.length;
        this.points.push(new Point(0, halfHeight, 0));

        // Генерация рёбер
        for (let i = 0; i < this.count; i++) {
            // Боковые рёбра
            this.edges.push(new Edge(2 * i, 2 * i + 1));
            
            // Рёбра нижнего основания
            this.edges.push(new Edge(2 * i, 2 * ((i + 1) % this.count)));
            
            // Рёбра верхнего основания
            this.edges.push(new Edge(2 * i + 1, 2 * ((i + 1) % this.count) + 1));
            
            // Рёбра от центров к основаниям
            this.edges.push(new Edge(2 * i, bottomCenter));
            this.edges.push(new Edge(2 * i + 1, topCenter));
        }

        // Генерация полигонов
        for (let i = 0; i < this.count; i++) {
            const next = (i + 1) % this.count;
            
            // Боковая поверхность
            this.polygons.push(new Polygon([
                2 * i,
                2 * next,
                2 * next + 1,
                2 * i + 1
            ], '#FFA500'));
            
            // Нижняя крышка (треугольники)
            this.polygons.push(new Polygon([
                2 * i,
                2 * next,
                bottomCenter
            ], '#00FF00'));
            
            // Верхняя крышка (треугольники)
            this.polygons.push(new Polygon([
                2 * i + 1,
                2 * next + 1,
                topCenter
            ], '#00FF00'));
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
                        defaultValue={this.count}
                        min="3"
                        onChange={e => {
                            this.count = parseInt(e.target.value) || 3;
                            this.updateGeometry();
                        }}
                    />
                </label>
                <label>
                    Высота:
                    <input
                        type="number"
                        defaultValue={this.height}
                        min="0.1"
                        onChange={e => {
                            this.height = parseFloat(e.target.value) || 1;
                            this.updateGeometry();
                        }}
                    />
                </label>
                <label>
                    Радиус X:
                    <input
                        type="number"
                        defaultValue={this.radiusX}
                        min="0.1"
                        onChange={e => {
                            this.radiusX = parseFloat(e.target.value) || 1;
                            this.updateGeometry();
                        }}
                    />
                </label>
                <label>
                    Радиус Z:
                    <input
                        type="number"
                        defaultValue={this.radiusZ}
                        min="0.1"
                        onChange={e => {
                            this.radiusZ = parseFloat(e.target.value) || 1;
                            this.updateGeometry();
                        }}
                    />
                </label>
            </div>
        );
    }
}

export default EllipticalCylinder;