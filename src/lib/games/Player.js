
export class Player {
    constructor(id, name, position, color) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.color = color || this.getRandomColor();
    }

    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}