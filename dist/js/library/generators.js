export function* colorCycleGenerator() {
    const colors = ["#6aaa64", "#c9b458", "#787c7e", "#538d4e"];
    let index = 0;
    while (true) {
        yield colors[index];
        index++;
        if (index >= colors.length) {
            index = 0;
        }
    }
}
