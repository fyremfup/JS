import React from 'react';
import './Menu.css'; // Импорт CSS файла

const Menu = ({ showPage }) => {
    return (
        <div className="menu-container">
            <button className="menu-button" onClick={() => showPage('Esse')}>
                Эссе
            </button>
            <button className="menu-button" onClick={() => showPage('Graph3D')}>
                Графика 3д
            </button>
            <button className="menu-button" onClick={() => showPage('Graph2D')}>
                Графика 2д
            </button>
            <button className="menu-button" onClick={() => showPage('Calculator')}>
                Калькулятор
            </button>
        </div>
    );
};

export default Menu;