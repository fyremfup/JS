import React, { Component } from 'react';
import Point from '../../modules/Graph3D/Math3D/entities/Point';
import Cube from '../../modules/Graph3D/Math3D/figurs/Cube';
import Cylinder from '../../modules/Graph3D/Math3D/figurs/Cylinder';
import Sphere from '../../modules/Graph3D/Math3D/figurs/Sphere';
import Math3D from '../../modules/Graph3D/Math3D';
import Canvas from '../../modules/Canvas/Canvas';
import Light from '../../modules/Graph3D/Math3D/entities/Light';
import Torus from '../../modules/Graph3D/Math3D/figurs/Torus';
import Ellipsoid from '../../modules/Graph3D/Math3D/figurs/Ellipsoid';
import EllipticalCylinder from '../../modules/Graph3D/Math3D/figurs/EllipticalCylinder';
import EllipticalParaboloid from '../../modules/Graph3D/Math3D/figurs/EllipticalParaboloid';
import Hyperboliccylinder from '../../modules/Graph3D/Math3D/figurs/Hyperboliccylinder';
import HyperbolicParaboloid from '../../modules/Graph3D/Math3D/figurs/HyperbolicParaboloid';
import OneSheetedHyperboloid from '../../modules/Graph3D/Math3D/figurs/OneSheetedHyperboloid';
import ParabolicCylinder from '../../modules/Graph3D/Math3D/figurs/ParabolicCylinder';
import TwoSheetedHyperboloid from '../../modules/Graph3D/Math3D/figurs/TwoSheetedHyperboloid';
import Conys from '../../modules/Graph3D/Math3D/figurs/Conys';
import Pyramid from '../../modules/Graph3D/Math3D/figurs/Pyramid';

// Глобальное состояние приложения
const appState = {
    printPolygons: true,
    printPoints: true,
    printEdges: true,
    fps: 0,
    lightPower: 50000,
    selectedFigure: 'sphere',
    reqId: null,
    lastFpsUpdate: Date.now(),
    frameCount: 0,
    canRotate: false,
    dx: 0,
    dy: 0,
    scene: [],
    figures: {
        cube: () => new Cube(),
        cylinder: () => new Cylinder(),
        sphere: () => new Sphere(),
        torus: () => new Torus(),
        ellipsoid: () => new Ellipsoid(),
        ellipticalCylinder: () => new EllipticalCylinder(),
        ellipticalParaboloid: () => new EllipticalParaboloid(),
        hyperboliccylinder: () => new Hyperboliccylinder(),
        hyperbolicParaboloid: () => new HyperbolicParaboloid(),
        oneSheetedHyperboloid: () => new OneSheetedHyperboloid(),
        parabolicCylinder: () => new ParabolicCylinder(),
        twoSheetedHyperboloid: () => new TwoSheetedHyperboloid(),
        conys: () => new Conys(),
        pyramid: () => new Pyramid(),
    },
    WIN: {
        LEFT: -5,
        BOTTOM: -5,
        WIDTH: 10,
        HEIGHT: 10,
        CENTER: new Point(0, 0, 30),
        CAMERA: new Point(0, 0, 50),
        get LIGHT() {
            return new Light(-40, 5, 10, appState.lightPower);
        }
    },
    math3D: null
};

// Инициализация глобального состояния
appState.math3D = new Math3D({ WIN: appState.WIN });
appState.scene = [appState.figures[appState.selectedFigure]()];

class Graph3D extends Component {
    constructor(props) {
        super(props);
        this.mainCanvasRef = React.createRef();
        this.settingsContainerRef = React.createRef();
        this.state = {}; // Пустое состояние, используем только для forceUpdate
    }

    componentDidMount() {
        this.initCanvas();
        this.animate();
    }

    componentWillUnmount() {
        if (appState.reqId) {
            cancelAnimationFrame(appState.reqId);
        }
    }

    initCanvas() {
        this.mainCanvas = new Canvas({
            id: 'canvas3D',
            width: 600,
            height: 600,
            WIN: appState.WIN,
            doubleBuffered: true,
            callbacks: {
                wheel: this.handleWheel.bind(this),
                mousemove: this.handleMouseMove.bind(this),
                mouseup: this.handleMouseUp.bind(this),
                mousedown: this.handleMouseDown.bind(this),
                mouseleave: this.handleMouseUp.bind(this)
            }
        });
    }

    animate() {
        const animateFrame = () => {
            this.renderFrame();
            appState.reqId = requestAnimationFrame(animateFrame);
        };
        appState.reqId = requestAnimationFrame(animateFrame);
    }

    renderFrame() {
        if (!appState.scene.length) return;
        this.mainCanvas?.clear();

        const allPolygons = [];
        appState.scene.forEach((figure, index) => {
            appState.math3D.calcRadius(figure);
            appState.math3D.calcDistance(figure, appState.WIN.CAMERA, 'distance');
            appState.math3D.calcDistance(figure, appState.WIN.LIGHT, 'lumen');

            figure.polygons.forEach(polygon => {
                polygon.figureIndex = index;
                allPolygons.push(polygon);
            });
        });

        appState.math3D.sortByArtistAlgorithm(allPolygons);

        if (appState.printPolygons) {
        allPolygons.forEach(polygon => {
            const figure = appState.scene[polygon.figureIndex];
            const points = polygon.points.map(index => figure.points[index]);
            const projected = points.map(point => ({
                x: appState.math3D.xs(point),
                y: appState.math3D.ys(point)
            }));

            //отвечает за затенение полигонов
            let color;
            if (polygon.unshaded) {
                // Для незатеняемых полигонов используем исходный цвет без освещения
                color = polygon.color;
            } else {
                // Для остальных полигонов применяем освещение
                const { isShadow, dark } = appState.math3D.calcShadow(
                    polygon, 
                    appState.scene, 
                    appState.WIN.LIGHT
                );

                let { r, g, b } = polygon.color;
                const lumen = appState.math3D.calcIllumination(
                    polygon.lumen,
                    appState.lightPower * (isShadow ? dark : 1)
                );

                r = Math.round(r * lumen);
                g = Math.round(g * lumen);
                b = Math.round(b * lumen);
                color = `rgb(${r},${g},${b})`;
            }

            this.mainCanvas.polygon(projected, color);
            
            // Отображение номера полигона (опционально)
            // let center = {x: 0, y: 0, z: 0};
            // points.forEach(p => {
            //     center.x += p.x;
            //     center.y += p.y;
            //     center.z += p.z;
            // });
            // center.x /= points.length;
            // center.y /= points.length;
            // center.z /= points.length;
            // this.mainCanvas.text(
            //     polygon.index,
            //     appState.math3D.xs(center),
            //     appState.math3D.ys(center),
            //     'red'
            // );
        });
    }

        if (appState.printEdges) {
            appState.scene.forEach(figure => {
                figure.edges.forEach(edge => {
                    const p1 = figure.points[edge.p1];
                    const p2 = figure.points[edge.p2];
                    this.mainCanvas.line(
                        appState.math3D.xs(p1),
                        appState.math3D.ys(p1),
                        appState.math3D.xs(p2),
                        appState.math3D.ys(p2),
                        '#000',
                        1
                    );
                });
            });
        }

        if (appState.printPoints) {
            appState.scene.forEach(figure => {
                figure.points.forEach(point => {
                    this.mainCanvas.point(
                        appState.math3D.xs(point),
                        appState.math3D.ys(point),
                        '#ff0000',
                        3
                    );
                });
            });
        }

        this.mainCanvas.text(
            `FPS: ${appState.fps}`,
            appState.WIN.LEFT,
            appState.WIN.BOTTOM + appState.WIN.HEIGHT - 1,
            "green"
        );

        this.mainCanvas?.swapBuffers();

        const now = Date.now();
        appState.frameCount++;
        if (now - appState.lastFpsUpdate >= 1000) {
            appState.fps = appState.frameCount;
            appState.frameCount = 0;
            appState.lastFpsUpdate = now;
        }
    }

    scheduleRender() {
        if (!appState.reqId) {
            appState.reqId = requestAnimationFrame(() => {
                this.renderFrame();
                appState.reqId = null;
            });
        }
    }

    handleWheel(event) {
        const delta = event.deltaY > 0 ? 0.95 : 1.05;
        appState.scene.forEach(figure => {
            figure.points.forEach(point => appState.math3D.zoom(delta, point));
        });
        this.scheduleRender();
    }

    handleMouseDown(event) {
        appState.canRotate = true;
        appState.dx = event.offsetX;
        appState.dy = event.offsetY;
    }

    handleMouseUp() {
        appState.canRotate = false;
    }

    handleMouseMove(event) {
        if (appState.canRotate) {
            const sensitivity = 0.005;
            appState.scene.forEach(figure => {
                figure.points.forEach(point => {
                    appState.math3D.rotateOy(
                        (appState.dx - event.offsetX) * sensitivity,
                        point
                    );
                    appState.math3D.rotateOx(
                        (event.offsetY - appState.dy) * sensitivity,
                        point   
                    );
                });
            });
            appState.dx = event.offsetX;
            appState.dy = event.offsetY;
            this.scheduleRender();
        }
    }

    updateLightPower(value) {
        appState.lightPower = value;
        this.scheduleRender();
    }

    handleSettingsChange() {
        this.forceUpdate(); // Принудительное обновление компонента
        this.scheduleRender();
    }

    handleFigureChange(e) {
        const figureKey = e.target.value;
        appState.selectedFigure = figureKey;
        appState.scene = [appState.figures[figureKey]()];
        
        // Принудительное обновление UI
        this.forceUpdate();
        this.scheduleRender();
    }

    renderSettings() {
        if (!appState.scene.length) return null;
        
        return (
            <div 
                key={appState.selectedFigure}
                style={{ 
                    marginTop: 15,
                    padding: 10,
                    border: '1px solid #eee',
                    borderRadius: 8
                }}
            >
                <h4 style={{ margin: '0 0 10px 0' }}>Настройки фигуры</h4>
                {appState.scene[0]?.settings?.(this.handleSettingsChange.bind(this))}
            </div>
        );
    }

    render() {
        return (
            <div style={{ padding: 20 }}>
                <canvas 
                    id="canvas3D" 
                    ref={this.mainCanvasRef}
                    style={{ border: '1px solid #ddd' }} 
                />
                
                <div style={{ marginTop: 20 }}>
                    <div style={{ marginBottom: 15 }}>
                        <label style={{ display: 'block', marginBottom: 5 }}>
                            Мощность света:
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="50000"
                            defaultValue={appState.lightPower}
                            onChange={e => this.updateLightPower(Number(e.target.value))}
                            style={{ width: '30%' }}
                        />
                    </div>
                    
                    <div style={{ margin: '10px 0' }}>
                        <label>
                            <input
                                type="checkbox"
                                defaultChecked={appState.printPolygons}
                                onChange={e => {
                                    appState.printPolygons = e.target.checked;
                                    this.scheduleRender();
                                }}
                            />
                            Полигоны
                        </label>
                        
                        <label style={{ marginLeft: 15 }}>
                            <input
                                type="checkbox"
                                defaultChecked={appState.printPoints}
                                onChange={e => {
                                    appState.printPoints = e.target.checked;
                                    this.scheduleRender();
                                }}
                            />
                            Точки
                        </label>
                        
                        <label style={{ marginLeft: 15 }}>
                            <input
                                type="checkbox"
                                defaultChecked={appState.printEdges}
                                onChange={e => {
                                    appState.printEdges = e.target.checked;
                                    this.scheduleRender();
                                }}
                            />
                            Ребра
                        </label>
                    </div>

                    <div>
                        <select
                            value={appState.selectedFigure}
                            onChange={this.handleFigureChange.bind(this)}
                            style={{ margin: '10px 0', padding: 5, width: '20%' }}
                        >
                            <option value="cube">Куб</option>
                            <option value="cylinder">Цилиндр</option>
                            <option value="sphere">Сфера</option>
                            <option value="torus">Тор</option>
                            <option value="ellipsoid">Эллипсоид</option>
                            <option value="ellipticalCylinder">Эллиптический Цилиндр</option>
                            <option value="ellipticalParaboloid">Эллиптический Параболойд</option>
                            <option value="hyperboliccylinder">Гиперболический Цилиндр</option>
                            <option value="hyperbolicParaboloid">Гиперболический Параболойд</option>
                            <option value="oneSheetedHyperboloid">Однополосный Гиперболойд</option>
                            <option value="parabolicCylinder">Параболический Цилиндр</option>
                            <option value="twoSheetedHyperboloid">Двухполосный Гиперболоид</option>
                            <option value="conys">Конус</option>
                            <option value="pyramid">Пирамида</option>
                        </select>
                    </div>

                    {this.renderSettings()}
                </div>
            </div>
        );
    }
}

export default Graph3D;