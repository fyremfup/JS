import Figure from '../entities/Figure';
import Edge from '../entities/Edge';
import Point from '../entities/Point';
import Polygon from '../entities/Polygon';

class Ellipsoid extends Figure {
    constructor(count = 20, radiusX = 18, radiusY = 14, radiusZ = 10) {
        super();
        this.count = count;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
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
        
        const verticalStep = Math.PI / this.count;
        const horizontalStep = (2 * Math.PI) / this.count;

        // Генерация точек
        for (let i = 0; i <= this.count; i++) {
            const theta = i * verticalStep;  // Вертикальный угол [0, PI]
            
            for (let j = 0; j <= this.count; j++) {
                const phi = j * horizontalStep;  // Горизонтальный угол [0, 2PI]
                
                // Параметрические уравнения для эллипсоида
                const x = this.radiusX * Math.sin(theta) * Math.cos(phi);
                const y = this.radiusY * Math.sin(theta) * Math.sin(phi);
                const z = this.radiusZ * Math.cos(theta);
                
                this.points.push(new Point(x, y, z));
            }
        }

        // Генерация рёбер
        const pointsPerRow = this.count + 1;
        
        // Горизонтальные рёбра (параллели)
        for (let i = 0; i <= this.count; i++) {
            for (let j = 0; j < this.count; j++) {
                const current = i * pointsPerRow + j;
                const next = current + 1;
                this.edges.push(new Edge(current, next));
            }
        }
        
        // Вертикальные рёбра (меридианы)
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
                        defaultValue={this.count}
                        min="3"
                        onChange={e => {
                            this.count = parseInt(e.target.value) || 3;
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
                    Радиус Y:
                    <input
                        type="number"
                        defaultValue={this.radiusY}
                        min="0.1"
                        onChange={e => {
                            this.radiusY = parseFloat(e.target.value) || 1;
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

export default Ellipsoid;