import Figure from '../entities/Figure';
import Point from '../entities/Point.js';
import Polygon from '../entities/Polygon.js';
import Edge from '../entities/Edge.js';



class Sphere extends Figure {
    constructor(radius = 10, count = 30) {
        super();
        this._radius = radius;
        this._count = count;
        this.points = [];
        this.edges = [];
        this.polygons = [];
        this.updateGeometry();
    }

    get radius() {
        return this._radius;
    }

    set radius(value) {
        this._radius = value;
        this.updateGeometry();
    }

    get count() {
        return this._count;
    }

    set count(value) {
        this._count = value;
        this.updateGeometry();
    }

    updateGeometry() {
        this.points = [];
        this.edges = [];
        this.polygons = [];
        this.generatePoints(this._radius, this._count);
        this.generateEdges(this._count);
        this.generatePolygons(this._count);
    }

    generatePoints(radius, count) {
        for (let i = 0; i <= count; i++) {
            const theta = Math.PI * i / count;
            for (let j = 0; j <= count; j++) {
                const phi = 2 * Math.PI * j / count;
                const x = radius * Math.sin(theta) * Math.cos(phi);
                const y = radius * Math.sin(theta) * Math.sin(phi);
                const z = radius * Math.cos(theta);
                this.points.push(new Point(x, y, z));
            }
        }
    }

    generateEdges(count) {
        for (let i = 0; i < this.points.length; i++) {
            if (i % (count + 1) !== count) {
                this.edges.push(new Edge(i, i + 1));
            }
            if (i + count + 1 < this.points.length) {
                this.edges.push(new Edge(i, i + count + 1));
            }
        }
    }

     generatePolygons(count) {
        for (let i = 0; i < this.points.length - count - 2; i++) {
            if (i % (count + 1) !== count) {
                this.polygons.push(new Polygon([i, i + 1, i + count + 2, i + count + 1]));
            }
            this.setIndexPolygons();
        }

        

        // for (let i = 162; i < 165; i++) {
        //     if (this.polygons[i]) {
        //         this.polygons[i].color = {
        //             r: 128,
        //             g: 128,
        //             b: 128
        //         };
        //     }
        // }

        // for (let i = 200; i < 201; i++){
        //     if (this.polygons[i]){
        //         delete this.polygons[i];
        //     }
        // }
     }

        

    
    settings() {
        return (
            <div>
                <label>
                    Радиус:
                    <input
                        type="number"
                        defaultValue={this.radius}
                        onChange={(e) => {
                            this.radius = parseFloat(e.target.value);
                           
                        }}
                    />
                </label>
                <label>
                    Количество полигонов:
                    <input
                        type="number"
                        defaultValue={this.count}
                        onChange={(e) => {
                            this.count = parseInt(e.target.value, 10);
                           
                        }}
                    />
                </label>
            </div>
        );
    }
}

export default Sphere;