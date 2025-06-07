import Figure from '../entities/Figure';

import Edge from '../entities/Edge';
import Point from '../entities/Point';
import Polygon from '../entities/Polygon';


class Cube extends Figure{
    constructor(size = 5) {
        super();
        this._size = size;
        this.points = [];
        this.edges = [];
        this.polygons = [];
        this.updateGeometry();
    }

    get size() {
        return this._size;
    }

    set size(value) {
        this._size = value;
        this.updateGeometry();
    }

    updateGeometry() {
        const size = this._size;
        this.points = [
            new Point(-size, size, size),
            new Point(size, size, size),
            new Point(size, -size, size),
            new Point(-size, -size, size),
            new Point(-size, size, -size),
            new Point(size, size, -size),
            new Point(size, -size, -size),
            new Point(-size, -size, -size)
        ];
        this.edges = [
            new Edge(0, 1),
            new Edge(0, 3),
            new Edge(0, 4),
            new Edge(2, 1),
            new Edge(5, 1),
            new Edge(3, 2),
            new Edge(3, 7),
            new Edge(6, 7),
            new Edge(4, 7),
            new Edge(5, 6),
            new Edge(5, 4),
            new Edge(2, 6)
        ];

        this.polygons=[
            new Polygon([0, 1, 2, 3], '#ff0000'),
            new Polygon([0, 4, 7, 3], '#0400fa'),
            new Polygon([0, 4, 5, 1], '#fff'),
            new Polygon([1, 2, 6, 5], '#15ff00'),
            new Polygon([2, 3, 7, 6], '#ea00ff'),
            new Polygon([4, 5, 6, 7], '#fbff00')
        ];
        this.setIndexPolygons();
    }

     settings() {
        return (
            <div>
                <label>
                    Размер:
                    <input
                        type="number"
                        defaultValue={this.size}
                        onChange={(e) => {
                            this.size = parseInt(e.target.value);
                        }}
                    />
                </label>
            </div>
        );
     }
}

export default Cube;