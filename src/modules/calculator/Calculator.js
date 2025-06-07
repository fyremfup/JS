import Complex from './classes/Complex';
import Matrix from './classes/Matrix';
import Member from './classes/Member';
import Polynomial from './classes/Polynomial';
import Vector from './classes/Vector';

import ComplexCalculator from './сalculators/ComplexCalculator';
import MatrixCalculator from './сalculators/MatrixCalculator';
import VectorCalculator from './сalculators/VectorCalculator';
import PolynomialCalculator from './сalculators/PolynomialCalculator';
import RealCalculator from './сalculators/RealCalculator';

class CalculatorCore {
    // Фабричные методы
    complex(re, im) {
        return new Complex(re, im);
    }

    vector(values) {
        return new Vector(values);
    }

    matrix(values) {
        return new Matrix(values);
    }

    // Основной метод парсинга
    getEntity(str) {
        const cleanedStr = str.replace(/\s/g, '');
        if (cleanedStr.includes('[')) return this.getMatrix(cleanedStr);
        if (cleanedStr.includes('(')) return this.getVector(cleanedStr);
        if (cleanedStr.includes('x') || cleanedStr.includes('^')) return this.getPolynomial(cleanedStr);
        return this.getComplex(cleanedStr);
    }

    // Метод для совместимости с компонентом
    getValue(str) {
        try {
            return this.getEntity(str);
        } catch (e) {
            console.error('Parsing error:', e);
            return this.complex(0, 0); // Возвращаем значение по умолчанию
        }
    }

    // Методы парсинга конкретных типов
    getMatrix(str) {
        const rows = str
            .slice(1, -1)
            .split('|')
            .map(row => row.split(';').map(elem => this.getEntity(elem)));
        return new Matrix(rows);
    }

    getVector(str) {
        const values = str
            .slice(1, -1)
            .split(',')
            .map(elem => this.getEntity(elem));
        return new Vector(values);
    }

    getComplex(str) {
        if (str === 'i') return this.complex(0, 1);
        if (str === '-i') return this.complex(0, -1);
        
        const match = str.match(/([+-]?\d*\.?\d*)([+-]\d*\.?\d*i)?/);
        const re = parseFloat(match[1] || 0);
        const im = match[2] ? parseFloat(match[2].replace('i', '')) || (match[2].includes('i') ? 1 : 0) : 0;
        
        return this.complex(re, im);
    }

    getPolynomial(str) {
        const normalizedStr = str
            .replace(/\s+/g, '')
            .replace(/-/g, '+-')
            .replace(/^\+/, '');

        return new Polynomial(
            normalizedStr.split('+')
                .filter(term => term)
                .map(term => this.getMember(term))
        );
    }

    getMember(term) {
        if (!term) return new Member(0, 0);
        
        const [coefficientPart, powerPart] = term.split('x');
        let coefficient = coefficientPart ? 
            parseFloat(coefficientPart) || (coefficientPart === '-' ? -1 : 1) 
            : 1;
            
        const power = powerPart ?
            parseInt(powerPart.replace('^', '')) || 1 
            : 0;

        return new Member(coefficient, power);
    }

    // Методы выбора калькулятора
    getCalculator(entity) {
        if (entity instanceof Matrix) return new MatrixCalculator(this.getCalculator(entity.values[0][0]));
        if (entity instanceof Vector) return new VectorCalculator(this.getCalculator(entity.values[0]));
        if (entity instanceof Complex) return new ComplexCalculator();
        if (entity instanceof Polynomial) return new PolynomialCalculator();
        return new RealCalculator();
    }

    // Основные математические операции
    add(a, b) {
        return this.getCalculator(a).add(a, b);
    }

    sub(a, b) {
        return this.getCalculator(a).sub(a, b);
    }

    mult(a, b) {
        return this.getCalculator(a).mult(a, b);
    }

    div(a, b) {
        return this.getCalculator(a).div(a, b);
    }

    pow(a, n) {
        return this.getCalculator(a).pow(a, n);
    }

    prod(a, p) {
        return this.getCalculator(a).prod(a, p);
    }

    zero(entity) {
        return this.getCalculator(entity).zero(entity);
    }

    one(entity) {
        return this.getCalculator(entity).one(entity);
    }
}

export default CalculatorCore;