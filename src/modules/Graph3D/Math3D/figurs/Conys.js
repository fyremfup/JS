import Figure from '../entities/Figure';
import Point from '../entities/Point';
import Edge from '../entities/Edge';
import Polygon from '../entities/Polygon';

class Cone extends Figure {
    constructor(
        count = 20,
        radius = 2.5,
        height = 5,
        color = '#FFA500'
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

        const apexIndex = 0;
        this.points.push(new Point(0, this.height / 2, 0));

        for (let i = 0; i < this.count; i++) {
            const angle = (2 * Math.PI * i) / this.count;
            const x = this.radius * Math.cos(angle);
            const z = this.radius * Math.sin(angle);
            this.points.push(new Point(x, -this.height / 2, z));
        }

        const baseCenterIndex = this.points.length;
        this.points.push(new Point(0, -this.height / 2, 0));

        for (let i = 1; i <= this.count; i++) {
            this.edges.push(new Edge(apexIndex, i));
        }

        for (let i = 1; i <= this.count; i++) {
            const next = i < this.count ? i + 1 : 1;
            this.edges.push(new Edge(i, next));
        }

        for (let i = 1; i <= this.count; i++) {
            this.edges.push(new Edge(baseCenterIndex, i));
        }

        for (let i = 1; i <= this.count; i++) {
            const next = i < this.count ? i + 1 : 1;
            this.polygons.push(new Polygon([apexIndex, i, next], this.color));
        }

        for (let i = 1; i <= this.count; i++) {
            const next = i < this.count ? i + 1 : 1;
            this.polygons.push(new Polygon([baseCenterIndex, next, i], this.color));
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
                        value={this.count}
                        onChange={e => {
                            this.count = Math.max(3, parseInt(e.target.value, 10) || 3);
                            this.updateGeometry();
                        }}
                    />
                </label>
                <label>
                    Радиус:
                    <input
                        type="number"
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

export default Cone;
