import Figure from '../entities/Figure';
import Edge from '../entities/Edge';
import Point from '../entities/Point';
import Polygon from '../entities/Polygon';

class Cylinder extends Figure {
    constructor(count = 20, height = 15, radius = 10) {
        super();
        this.count = count;
        this.height = height;
        this.radius = radius;
        this.points = [];
        this.edges = [];
        this.polygons = [];
        this.updateGeometry();
    }

    updateGeometry() {
        this.points = [];
        this.edges = [];
        this.polygons = [];
        
        // Генерация точек для нижнего и верхнего оснований
        const da = Math.PI * 2 / this.count;
        for (let phi = 0; phi < Math.PI * 2; phi += da) {
            // Нижнее основание
            this.points.push(new Point(
                this.radius * Math.cos(phi),
                this.radius * Math.sin(phi),
                -this.height / 2
            ));
            
            // Верхнее основание
            this.points.push(new Point(
                this.radius * Math.cos(phi),
                this.radius * Math.sin(phi),
                this.height / 2
            ));
        }

        // Генерация рёбер
        for (let i = 0; i < this.count; i++) {
            // Боковые рёбра
            this.edges.push(new Edge(2 * i, 2 * i + 1));
            
            // Рёбра нижнего основания
            this.edges.push(new Edge(2 * i, 2 * ((i + 1) % this.count)));
            
            // Рёбра верхнего основания
            this.edges.push(new Edge(2 * i + 1, 2 * ((i + 1) % this.count) + 1));
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
        }
        
        // Нижнее основание
        const bottomIndices = Array.from({length: this.count}, (_, i) => 2 * i);
        this.polygons.push(new Polygon(bottomIndices, '#00FF00'));
        
        // Верхнее основание
        const topIndices = Array.from({length: this.count}, (_, i) => 2 * i + 1).reverse();
        this.polygons.push(new Polygon(topIndices, '#0000FF'));


        for (let i = 1; i < 10; i++) {
            if (this.polygons[i]) {
                this.polygons[i].color = {
                    r: 128,
                    g: 128,
                    b: 128
                };
            }
        }

        for (let i = 10; i < 12; i++){
            if (this.polygons[i]){
                delete this.polygons[i];
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
                    Радиус:
                    <input
                        type="number"
                        defaultValue={this.radius}
                        min="0.1"
                        onChange={e => {
                            this.radius = parseFloat(e.target.value) || 1;
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
            </div>
        );
    }
}

export default Cylinder;