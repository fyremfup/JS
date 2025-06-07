import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Graph2DLogic } from '../../modules/Graph2D/Graph2D';
import Canvas from '../../modules/Canvas/Canvas';

const Graph2D = () => {
    const canvasRef = useRef(null);
    const logicRef = useRef(null);
    const [functions, setFunctions] = useState([]);
    
    const WIN = useRef({
        LEFT: -10,
        BOTTOM: -10,
        WIDTH: 20,
        HEIGHT: 20
    }).current;

    // Инициализация canvas и логики
    useEffect(() => {
        const canvasInstance = new Canvas({
            WIN,
            id: 'graphCanvas',
            width: 600,
            height: 600,
            callbacks: {
                wheel: e => logicRef.current.handleWheel(e),
                mousemove: e => logicRef.current.handleMouseMove(e),
                mouseup: () => logicRef.current.handleMouseUp(),
                mousedown: () => logicRef.current.handleMouseDown(),
                mouseleave: () => logicRef.current.handleMouseLeave()
            }
        });

        logicRef.current = new Graph2DLogic(WIN, canvasInstance);
    }, [WIN]);

    // Добавление новой функции
    const addFunction = useCallback(() => {
        const num = functions.length;
        setFunctions(prev => [
            ...prev, 
            { id: num, expr: '', color: '#0000ff' }
        ]);
    }, [functions.length]);

    // Обновление функции
    const updateFunction = useCallback((id, expr, color) => {
        try {
            const f = new Function('x', `return ${expr}`);
            logicRef.current.addFunction(f, id, color);
            logicRef.current.render();
        } catch(e) {
            console.error('Некорректная функция:', e);
        }
    }, []);

    // Удаление функции
    const delFunction = useCallback((id) => {
        logicRef.current.delFunction(id);
        setFunctions(prev => prev.filter(f => f.id !== id));
    }, []);

    // Рендер элементов управления функциями
    const renderControls = useCallback(() => (
        functions.map(func => (
            <div key={func.id} className="function-control">
                <input
                    placeholder="f(x)"
                    onChange={e => updateFunction(
                        func.id, 
                        e.target.value, 
                        func.color
                    )}
                />
                <input
                    type="color"
                    value={func.color}
                    onChange={e => updateFunction(
                        func.id, 
                        func.expr, 
                        e.target.value
                    )}
                />
                <button onClick={() => delFunction(func.id)}>
                    Удалить
                </button>
            </div>
        ))
    ), [functions, updateFunction, delFunction]);

    return (
        <div className="graph-2d">
            <canvas 
                id="graphCanvas"
                ref={canvasRef}
                width={600}
                height={600}
                style={{ border: '1px solid #ddd' }}
            />
            
            <div className="controls">
                <button onClick={addFunction} className="add-btn">
                    + Добавить функцию
                </button>
                {renderControls()}
            </div>
        </div>
    );
};

export default Graph2D;