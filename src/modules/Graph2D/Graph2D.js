export class Graph2DLogic {
  constructor(WIN, canvas) {
    this.WIN = WIN;
    this.canvas = canvas;
    this.funcs = [];
    this.canMove = false;
    this.derivativeX = 0;
    this.DX = 0.001;
  }

  // Преобразование пикселей в координаты окна WIN (для смещения)
  sx(px) {
    return (px * this.WIN.WIDTH) / this.canvas.canvas.width;
  }

  sy(py) {
    return (py * this.WIN.HEIGHT) / this.canvas.canvas.height;
  }

  // Управление функциями
  addFunction(f, num, color = 'blue', printDer = false) {
    this.funcs[num] = { f, color, printDer };
  }

  delFunction(num) {
    this.funcs[num] = null;
  }

  // Обработчики мыши
  handleMouseDown = () => {
    this.canMove = true;
  };

  handleMouseUp = () => {
    this.canMove = false;
  };

  handleMouseLeave = () => {
    this.canMove = false;
  };

  handleMouseMove(e) {
    if (this.canMove) {
      // Панорамирование - смещаем окно в обратную сторону движения мыши
      this.WIN.LEFT -= this.sx(e.movementX);
      this.WIN.BOTTOM += this.sy(e.movementY);
      this.render();
    }
    this.derivativeX = this.WIN.LEFT + this.sx(e.offsetX);
  }

  // Зум с центром на курсоре мыши
  handleWheel(e) {
    e.preventDefault();
    const zoomIntensity = 0.1;
    const { offsetX, offsetY, deltaY } = e;

    // Координаты мыши в системе координат окна WIN
    const mouseX = this.WIN.LEFT + (offsetX / this.canvas.canvas.width) * this.WIN.WIDTH;
    const mouseY = this.WIN.BOTTOM + ((this.canvas.canvas.height - offsetY) / this.canvas.canvas.height) * this.WIN.HEIGHT;

    // Фактор масштабирования
    const scale = deltaY > 0 ? 1 + zoomIntensity : 1 - zoomIntensity;

    // Новые размеры окна
    const newWidth = this.WIN.WIDTH * scale;
    const newHeight = this.WIN.HEIGHT * scale;

    // Смещаем окно, чтобы масштабирование было относительно курсора
    this.WIN.LEFT = mouseX - (mouseX - this.WIN.LEFT) * (newWidth / this.WIN.WIDTH);
    this.WIN.BOTTOM = mouseY - (mouseY - this.WIN.BOTTOM) * (newHeight / this.WIN.HEIGHT);

    this.WIN.WIDTH = newWidth;
    this.WIN.HEIGHT = newHeight;

    this.render();
  }

  // Отрисовка
  render() {
    this.canvas.clear();
    this.drawGrid();
    this.funcs.forEach((func) => func && this.drawFunction(func));
  }

  drawGrid() {
    // Сетка по X
    for (let x = Math.ceil(this.WIN.LEFT); x < this.WIN.LEFT + this.WIN.WIDTH; x++) {
      this.canvas.line(x, this.WIN.BOTTOM, x, this.WIN.BOTTOM + this.WIN.HEIGHT, '#EEE', 1);
    }
    // Сетка по Y
    for (let y = Math.ceil(this.WIN.BOTTOM); y < this.WIN.BOTTOM + this.WIN.HEIGHT; y++) {
      this.canvas.line(this.WIN.LEFT, y, this.WIN.LEFT + this.WIN.WIDTH, y, '#EEE', 1);
    }

    // Оси
    this.canvas.line(this.WIN.LEFT, 0, this.WIN.LEFT + this.WIN.WIDTH, 0, 'green', 2);
    this.canvas.line(0, this.WIN.BOTTOM, 0, this.WIN.BOTTOM + this.WIN.HEIGHT, 'green', 2);

    // Стрелки на осях
    this.canvas.line(this.WIN.LEFT + this.WIN.WIDTH, 0, this.WIN.LEFT + this.WIN.WIDTH - 0.5, 0.5, 'green', 2);
    this.canvas.line(this.WIN.LEFT + this.WIN.WIDTH, 0, this.WIN.LEFT + this.WIN.WIDTH - 0.5, -0.5, 'green', 2);
    this.canvas.line(0, this.WIN.BOTTOM + this.WIN.HEIGHT, 0.5, this.WIN.BOTTOM + this.WIN.HEIGHT - 0.5, 'green', 2);
    this.canvas.line(0, this.WIN.BOTTOM + this.WIN.HEIGHT, -0.5, this.WIN.BOTTOM + this.WIN.HEIGHT - 0.5, 'green', 2);
  }

  drawFunction(func) {
    const dx = this.WIN.WIDTH / 500;
    let x = this.WIN.LEFT;
    while (x < this.WIN.LEFT + this.WIN.WIDTH) {
      try {
        const y1 = func.f(x);
        const y2 = func.f(x + dx);
        this.canvas.line(x, y1, x + dx, y2, func.color, 2);
      } catch (e) {
        // Игнорируем ошибки вычисления функции
      }
      x += dx;
    }

    if (func.printDer) {
      const k = (func.f(this.derivativeX + this.DX) - func.f(this.derivativeX)) / this.DX;
      const b = func.f(this.derivativeX) - k * this.derivativeX;
      this.canvas.line(
        this.WIN.LEFT,
        k * this.WIN.LEFT + b,
        this.WIN.LEFT + this.WIN.WIDTH,
        k * (this.WIN.LEFT + this.WIN.WIDTH) + b,
        'black',
        1
      );
      this.canvas.point(this.derivativeX, func.f(this.derivativeX), 'green');
    }
  }
}
