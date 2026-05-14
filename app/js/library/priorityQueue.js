export class BiDirectionalPriorityQueue {
    constructor() {
        this.items = [];
        this.orderCounter = 0;
    }
    enqueue(item, priority) {
        this.items.push({
            item: item,
            priority: priority,
            order: this.orderCounter,
        });
        this.orderCounter++;
        console.log("Queue enqueue:", item, "priority:", priority);
        console.log("Queue size:", this.items.length);
    }
    peek(mode) {
        if (this.items.length === 0) {
            console.log("Queue is empty");
            return null;
        }
        const index = this.findIndex(mode);
        const queueItem = this.items[index];
        console.log("Queue peek " + mode + ":", queueItem);
        return queueItem.item;
    }

    dequeue(mode) {
        if (this.items.length === 0) {
            console.log("Queue is empty");
            return null;
        }
        const index = this.findIndex(mode);
        const removedItem = this.items.splice(index, 1)[0];
        console.log("Queue dequeue " + mode + ":", removedItem);
        console.log("Queue size:", this.items.length);
        return removedItem.item;
    }

    findIndex(mode) {
        let selectedIndex = 0;
        for (let i = 1; i < this.items.length; i++) {
            const currentItem = this.items[i];
            const selectedItem = this.items[selectedIndex];
            if (
                mode === "highest" &&
                currentItem.priority > selectedItem.priority
            ) {
                selectedIndex = i;
            }
            if (
                mode === "lowest" &&
                currentItem.priority < selectedItem.priority
            ) {
                selectedIndex = i;
            }
            if (mode === "oldest" && currentItem.order < selectedItem.order) {
                selectedIndex = i;
            }
            if (mode === "newest" && currentItem.order > selectedItem.order) {
                selectedIndex = i;
            }
        }
        return selectedIndex;
    }

    getSize() {
        return this.items.length;
    }
    clear() {
        this.items = [];
        this.orderCounter = 0;
        console.log("Queue cleared");
    }
}
