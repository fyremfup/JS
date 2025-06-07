import Point from "./Math3D/entities/Point";

class Math3D {
    constructor({ WIN }) {
        this.WIN = WIN;
    }
    
    calcCenter(figure) {
        const points = figure.points;
        figure.center = points.reduce((acc, point) => {
            acc.x += point.x;
            acc.y += point.y;
            acc.z += point.z;
            return acc;
        }, new Point(0, 0, 0));

        const numPoints = points.length;
        figure.center.x /= numPoints;
        figure.center.y /= numPoints;
        figure.center.z /= numPoints;
    }
    
    xs(point) {
        const zs = this.WIN.CENTER.z;
        const z0 = this.WIN.CAMERA.z;
        const x0 = this.WIN.CAMERA.x;
        return ((point.x - x0) / (point.z - z0) * (zs - z0) + x0);
    }

    ys(point) {
        const zs = this.WIN.CENTER.z;
        const z0 = this.WIN.CAMERA.z;
        const y0 = this.WIN.CAMERA.y;
        return ((point.y - y0) / (point.z - z0) * (zs - z0) + y0);
    }

    multMatrix(T, m) {
        const c = [0, 0, 0, 0];
        for (let i = 0; i < 4; i++) {
            let s = 0;
            for (let j = 0; j < 4; j++) {
                s += T[j][i] * m[j];
            }
            c[i] = s;
        }
        return c;
    }
    
     zoom(delta,point){
        const array=this.multMatrix([
        [delta,0,0,0],
        [0,delta,0,0],
        [0,0,delta,0],
        [0,0,0,1]],[point.x,point.y,point.z,1]);
    point.x=array[0];
    point.y=array[1];
    point.z=array[2];
    }

    move(sx, sy, sz, point) {
        const array = this.multMatrix([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [sx, sy, sz, 1]
        ], [point.x, point.y, point.z, 1]);
        point.x = array[0];
        point.y = array[1];
        point.z = array[2];
    }

    rotateOx(alpha, point) {
        const array = this.multMatrix([
            [1, 0, 0, 0],
            [0, Math.cos(alpha), Math.sin(alpha), 0],
            [0, -Math.sin(alpha), Math.cos(alpha), 0],
            [0, 0, 0, 1]
        ], [point.x, point.y, point.z, 1]);
        point.x = array[0];
        point.y = array[1];
        point.z = array[2];
    }

    rotateOy(alpha, point) {
        const array = this.multMatrix([
            [Math.cos(alpha), 0, -Math.sin(alpha), 0],
            [0, 1, 0, 0],
            [Math.sin(alpha), 0, Math.cos(alpha), 0],
            [0, 0, 0, 1]
        ], [point.x, point.y, point.z, 1]);
        point.x = array[0];
        point.y = array[1];
        point.z = array[2];
    }

    rotateOz(alpha, point) {
        const array = this.multMatrix([
            [Math.cos(alpha), Math.sin(alpha), 0, 0],
            [-Math.sin(alpha), Math.cos(alpha), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ], [point.x, point.y, point.z, 1]);
        point.x = array[0];
        point.y = array[1];
        point.z = array[2];
    }
    calcDistance(figure, camera, name) {
        figure.polygons.forEach(polygon => {
            let x = 0, y = 0, z = 0;
            polygon.points.forEach(index => {
                x += figure.points[index].x;
                y += figure.points[index].y;
                z += figure.points[index].z;
            });
            x /= polygon.points.length;
            y /= polygon.points.length;
            z /= polygon.points.length;
            polygon[name] = Math.sqrt(
                (camera.x - x) ** 2 +
                (camera.y - y) ** 2 +
                (camera.z - z) ** 2
            );
        });
    }

    sortByArtistAlgorithm(polygons) {
        polygons.sort((a, b) => b.distance - a.distance);
    }
    calcIllumination(distance, lumen) {
        const illum = distance ? lumen / distance ** 3 : 1;
        return illum > 1 ? 1 : illum;
    }

    calcShadow(polygon, scene, LIGHT) {
        if (!polygon?.center || !LIGHT) return { isShadow: false };
        
        const M1 = polygon.center;
        const r = polygon.R * 1.2;
        const S = this.calcVector(M1, LIGHT);

        for (let figure of scene) {
            if (!figure.polygons) continue;
            for (let poly of figure.polygons) {
                if (!poly?.center || poly === polygon) continue;
                const M0 = poly.center;
                const dark = this.calcVectorModule(
                    this.vectorProd(
                        this.calcVector(M0, M1),
                        S
                    )
                ) / this.calcVectorModule(S);
                
                if (dark < r) {
                    return { isShadow: true, dark: dark / (r * 0.8) };
                }
            }
        }
        return { isShadow: false };
    }
    
    calcVector(a, b) {
        if (!a || !b) return { x: 0, y: 0, z: 0 };
        return {
            x: b.x - a.x,
            y: b.y - a.y,
            z: b.z - a.z
        };
    }

    vectorProd(a, b) {
        return {
            x: a.y * b.z - a.z * b.y,
            y: a.z * b.x - a.x * b.z,
            z: a.x * b.y - a.y * b.x
        };
    }

    calcVectorModule(v) {
        return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
    }

    calcRadius(figure, recalcRadius = false) {
        figure.polygons.forEach(polygon => {
            let points = polygon.points.map(index => figure.points[index]);
            if (points.some(p => !p)) return;

            const center = new Point(0, 0, 0);
            points.forEach(p => {
                center.x += p.x;
                center.y += p.y;
                center.z += p.z;
            });
            center.x /= points.length;
            center.y /= points.length;
            center.z /= points.length;
            polygon.center = center;

            let total = 0;
            points.forEach(point => {
                total += this.calcVectorModule(this.calcVector(center, point));
            });
            polygon.R = total / points.length;
        });
    }
}

export default Math3D;
