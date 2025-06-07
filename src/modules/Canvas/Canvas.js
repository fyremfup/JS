class Canvas {
    constructor({ 
        WIN, 
        id, 
        canvas: providedCanvas,
        width = 600, 
        height = 600, 
        callbacks = {},
        doubleBuffered = false
    }) {
        this.WIN = WIN;
        this.canvas = providedCanvas || (id ? document.getElementById(id) : null);

        if (!this.canvas) {
            throw new Error(`Canvas не найден: id="${id}", canvas=${providedCanvas}`);
        }

        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext('2d');
        
        // Настройка двойной буферизации
        this.doubleBuffered = doubleBuffered;
        if (doubleBuffered) {
            this.virtualCanvas = document.createElement('canvas');
            this.virtualCanvas.width = width;
            this.virtualCanvas.height = height;
            this.virtualContext = this.virtualCanvas.getContext('2d');
            this.ctx = this.virtualContext;  // Рисуем на виртуальном контексте
        } else {
            this.ctx = this.context;  // Рисуем напрямую на основном
        }

        this.canvas.addEventListener('wheel', callbacks.wheel);
        this.canvas.addEventListener('mousemove', callbacks.mousemove);
        this.canvas.addEventListener('mouseup', callbacks.mouseup);
        this.canvas.addEventListener('mousedown', callbacks.mousedown);
        this.canvas.addEventListener('mouseleave', callbacks.mouseleave);
    }

    // Метод для обмена буферов (копирование виртуального канваса на реальный)
    swapBuffers() {
        if (this.doubleBuffered) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.drawImage(this.virtualCanvas, 0, 0);
        }
    }

    xs(x) {
        return this.canvas.width * (x - this.WIN.LEFT) / this.WIN.WIDTH;
    }

    ys(y) {
        return this.canvas.height - (this.canvas.height * (y - this.WIN.BOTTOM) / this.WIN.HEIGHT);
    }

    sx(x) {
        return this.WIN.WIDTH * x / this.canvas.width;
    }

    sy(y) {
        return this.WIN.HEIGHT * y / this.canvas.height;
    }

    line(x1, y1, x2, y2, color, width) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color || 'black';
        this.ctx.lineWidth = width || 4;
        this.ctx.moveTo(this.xs(x1), this.ys(y1));
        this.ctx.lineTo(this.xs(x2), this.ys(y2));
        this.ctx.closePath();
        this.ctx.stroke();
    }

    text(text, x, y, color) {
        this.ctx.fillStyle = color || '#000';
        this.ctx.font = '15px Arial';
        this.ctx.fillText(text, this.xs(x), this.ys(y));
    }

    point(x, y, color = 'red', size = 4) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.arc(this.xs(x), this.ys(y), size, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.fill();
    }

    clear() {
        if (this.doubleBuffered) {
            this.virtualContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    polygon(points = [], color = '#F805') {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.moveTo(this.xs(points[0].x), this.ys(points[0].y));
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(this.xs(points[i].x), this.ys(points[i].y));
        }
        this.ctx.lineTo(this.xs(points[0].x), this.ys(points[0].y));
        this.ctx.closePath();
        this.ctx.fill();
    }

    tablet(x, y, color = 'red', size = 2, reverse) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        if (!reverse) {
            this.ctx.arc(this.xs(x), this.ys(y) + size, size, 0, Math.PI);
            this.ctx.arc(this.xs(x), this.ys(y) - size, size, Math.PI, Math.PI * 2);
        } else {
            this.ctx.arc(this.xs(x) + size, this.ys(y), size, -Math.PI * 0.5, Math.PI * 0.5);
            this.ctx.arc(this.xs(x) - size, this.ys(y), size, Math.PI * 0.5, -Math.PI * 0.5);
        }
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.fill();
    }
}

export default Canvas;