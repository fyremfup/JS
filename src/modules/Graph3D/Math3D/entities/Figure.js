class Figure{
    constructor(points=[], edge=[], polygons=[]){
        this.points=points;
        this.edge=edge;
        this.polygons=polygons;
    }

     setIndexPolygons() {
        this.polygons.forEach((polygon, index) => {
            polygon.index = index;
        });
    }
}

export default Figure;