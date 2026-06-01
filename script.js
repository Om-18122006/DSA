class SortingVisualizer {
    constructor() {
        this.array = [];
        this.isSorting = false;
        this.isPaused = false;
        this.animationSpeed = 500; // milliseconds
        this.currentAlgorithm = 'bubble';
        
        this.initializeElements();
        this.setupEventListeners();
        this.generateRandomArray();
    }

    initializeElements() {
        this.numberInput = document.getElementById('numberInput');
        this.randomBtn = document.getElementById('randomBtn');
        this.algorithmSelect = document.getElementById('algorithmSelect');
        this.speedSlider = document.getElementById('speedSlider');
        this.speedValue = document.getElementById('speedValue');
        this.sortBtn = document.getElementById('sortBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.barsContainer = document.getElementById('barsContainer');
        this.algorithmInfo = document.getElementById('algorithmInfo');
    }

    setupEventListeners() {
        this.randomBtn.addEventListener('click', () => this.generateRandomArray());
        this.sortBtn.addEventListener('click', () => this.startSorting());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.speedSlider.addEventListener('input', (e) => this.updateSpeed(e.target.value));
        this.algorithmSelect.addEventListener('change', (e) => this.changeAlgorithm(e.target.value));
        this.numberInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.parseInput();
            }
        });
    }

    generateRandomArray() {
        const size = Math.floor(Math.random() * 20) + 10; // 10-30 elements
        this.array = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
        this.renderBars();
        this.updateAlgorithmInfo();
    }

    parseInput() {
        const input = this.numberInput.value.trim();
        if (!input) return;

        try {
            this.array = input.split(',').map(num => {
                const parsed = parseInt(num.trim());
                if (isNaN(parsed) || parsed < 1 || parsed > 100) {
                    throw new Error('Invalid number');
                }
                return parsed;
            });

            if (this.array.length < 2) {
                alert('Please enter at least 2 numbers');
                return;
            }

            if (this.array.length > 50) {
                alert('Maximum 50 numbers allowed for better visualization');
                this.array = this.array.slice(0, 50);
            }

            this.renderBars();
            this.updateAlgorithmInfo();
        } catch (error) {
            alert('Please enter valid numbers between 1 and 100, separated by commas');
        }
    }

    renderBars() {
        this.barsContainer.innerHTML = '';
        const maxValue = Math.max(...this.array);
        
        this.array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = '${(value / maxValue) * 300}px';
            bar.textContent = value;
            bar.dataset.index = index;
            this.barsContainer.appendChild(bar);
        });
    }

    updateSpeed(value) {
        this.speedValue.textContent = value;
        this.animationSpeed = 1100 - (value * 100); // 100ms to 1000ms
    }

    changeAlgorithm(algorithm) {
        this.currentAlgorithm = algorithm;
        this.updateAlgorithmInfo();
    }

    updateAlgorithmInfo() {
        const algorithms = {
            bubble: {
                name: 'Bubble Sort',
                description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. Time complexity: O(n²)'
            },
            selection: {
                name: 'Selection Sort',
                description: 'Finds the minimum element from the unsorted portion and places it at the beginning. Time complexity: O(n²)'
            },
            insertion: {
                name: 'Insertion Sort',
                description: 'Builds the final sorted array one item at a time by inserting each element into its correct position. Time complexity: O(n²)'
            },
            merge: {
                name: 'Merge Sort',
                description: 'Divides the array into two halves, recursively sorts them, and then merges the sorted halves. Time complexity: O(n log n)'
            },
            quick: {
                name: 'Quick Sort',
                description: 'Picks a pivot element and partitions the array around the pivot, then recursively sorts the sub-arrays. Time complexity: O(n log n) average'
            }
        };

        const info = algorithms[this.currentAlgorithm];
        this.algorithmInfo.innerHTML = `
            <h3>${info.name}</h3>
            <p>${info.description}</p>
        `;
    }

    async startSorting() {
        if (this.isSorting) return;
        
        this.isSorting = true;
        this.isPaused = false;
        this.sortBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.randomBtn.disabled = true;
        this.numberInput.disabled = true;
        this.algorithmSelect.disabled = true;

        try {
            switch (this.currentAlgorithm) {
                case 'bubble':
                    await this.bubbleSort();
                    break;
                case 'selection':
                    await this.selectionSort();
                    break;
                case 'insertion':
                    await this.insertionSort();
                    break;
                case 'merge':
                    await this.mergeSort();
                    break;
                case 'quick':
                    await this.quickSort();
                    break;
            }
        } catch (error) {
            console.error('Sorting error:', error);
        } finally {
            this.finishSorting();
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        this.pauseBtn.textContent = this.isPaused ? 'Resume' : 'Pause';
    }

    reset() {
        this.isSorting = false;
        this.isPaused = false;
        this.sortBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = 'Pause';
        this.randomBtn.disabled = false;
        this.numberInput.disabled = false;
        this.algorithmSelect.disabled = false;
        
        // Reset all bars to default state
        const bars = this.barsContainer.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.className = 'bar';
        });
    }

    finishSorting() {
        this.isSorting = false;
        this.isPaused = false;
        this.sortBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = 'Pause';
        this.randomBtn.disabled = false;
        this.numberInput.disabled = false;
        this.algorithmSelect.disabled = false;

        // Mark all bars as sorted
        const bars = this.barsContainer.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.className = 'bar sorted';
        });
    }

    async waitForAnimation() {
        return new Promise(resolve => {
            setTimeout(resolve, this.animationSpeed);
        });
    }

    async waitForPause() {
        while (this.isPaused) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    highlightBars(indices, className) {
        const bars = this.barsContainer.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            bar.className = 'bar';
            if (indices.includes(index)) {
                bar.classList.add(className);
            }
        });
    }

    swapBars(i, j) {
        [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
        this.renderBars();
    }

    // Bubble Sort
    async bubbleSort() {
        const n = this.array.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (this.isPaused) await this.waitForPause();
                
                this.highlightBars([j, j + 1], 'comparing');
                await this.waitForAnimation();

                if (this.array[j] > this.array[j + 1]) {
                    this.highlightBars([j, j + 1], 'swapping');
                    await this.waitForAnimation();
                    
                    this.swapBars(j, j + 1);
                    await this.waitForAnimation();
                }
            }
            this.highlightBars([n - 1 - i], 'sorted');
        }
        this.highlightBars([0], 'sorted');
    }

    // Selection Sort
    async selectionSort() {
        const n = this.array.length;
        for (let i = 0; i < n - 1; i++) {
            let minIdx = i;
            
            for (let j = i + 1; j < n; j++) {
                if (this.isPaused) await this.waitForPause();
                
                this.highlightBars([i, j], 'comparing');
                await this.waitForAnimation();

                if (this.array[j] < this.array[minIdx]) {
                    minIdx = j;
                }
            }

            if (minIdx !== i) {
                this.highlightBars([i, minIdx], 'swapping');
                await this.waitForAnimation();
                
                this.swapBars(i, minIdx);
                await this.waitForAnimation();
            }
            
            this.highlightBars([i], 'sorted');
        }
        this.highlightBars([n - 1], 'sorted');
    }

    // Insertion Sort
    async insertionSort() {
        const n = this.array.length;
        for (let i = 1; i < n; i++) {
            let key = this.array[i];
            let j = i - 1;

            this.highlightBars([i], 'comparing');
            await this.waitForAnimation();

            while (j >= 0 && this.array[j] > key) {
                if (this.isPaused) await this.waitForPause();
                
                this.highlightBars([j, j + 1], 'comparing');
                await this.waitForAnimation();

                this.array[j + 1] = this.array[j];
                this.renderBars();
                this.highlightBars([j + 1], 'swapping');
                await this.waitForAnimation();

                j--;
            }

            this.array[j + 1] = key;
            this.renderBars();
            this.highlightBars([j + 1], 'sorted');
            await this.waitForAnimation();
        }
    }

    // Merge Sort
    async mergeSort() {
        await this.mergeSortHelper(0, this.array.length - 1);
    }

    async mergeSortHelper(left, right) {
        if (left < right) {
            const mid = Math.floor((left + right) / 2);
            
            await this.mergeSortHelper(left, mid);
            await this.mergeSortHelper(mid + 1, right);
            await this.merge(left, mid, right);
        }
    }

    async merge(left, mid, right) {
        const leftArr = this.array.slice(left, mid + 1);
        const rightArr = this.array.slice(mid + 1, right + 1);
        
        let i = 0, j = 0, k = left;

        while (i < leftArr.length && j < rightArr.length) {
            if (this.isPaused) await this.waitForPause();
            
            this.highlightBars([left + i, mid + 1 + j], 'comparing');
            await this.waitForAnimation();

            if (leftArr[i] <= rightArr[j]) {
                this.array[k] = leftArr[i];
                i++;
            } else {
                this.array[k] = rightArr[j];
                j++;
            }
            
            this.renderBars();
            this.highlightBars([k], 'swapping');
            await this.waitForAnimation();
            k++;
        }

        while (i < leftArr.length) {
            this.array[k] = leftArr[i];
            this.renderBars();
            this.highlightBars([k], 'swapping');
            await this.waitForAnimation();
            i++;
            k++;
        }

        while (j < rightArr.length) {
            this.array[k] = rightArr[j];
            this.renderBars();
            this.highlightBars([k], 'swapping');
            await this.waitForAnimation();
            j++;
            k++;
        }

        // Mark merged section as sorted
        for (let i = left; i <= right; i++) {
            this.highlightBars([i], 'sorted');
        }
        await this.waitForAnimation();
    }

    // Quick Sort
    async quickSort() {
        await this.quickSortHelper(0, this.array.length - 1);
    }

    async quickSortHelper(low, high) {
        if (low < high) {
            const pivotIndex = await this.partition(low, high);
            await this.quickSortHelper(low, pivotIndex - 1);
            await this.quickSortHelper(pivotIndex + 1, high);
        } else if (low === high) {
            this.highlightBars([low], 'sorted');
            await this.waitForAnimation();
        }
    }

    async partition(low, high) {
        const pivot = this.array[high];
        this.highlightBars([high], 'pivot');
        await this.waitForAnimation();

        let i = low - 1;

        for (let j = low; j < high; j++) {
            if (this.isPaused) await this.waitForPause();
            
            this.highlightBars([j, high], 'comparing');
            await this.waitForAnimation();

            if (this.array[j] < pivot) {
                i++;
                if (i !== j) {
                    this.highlightBars([i, j], 'swapping');
                    await this.waitForAnimation();
                    
                    this.swapBars(i, j);
                    await this.waitForAnimation();
                }
            }
        }

        this.highlightBars([i + 1, high], 'swapping');
        await this.waitForAnimation();
        
        this.swapBars(i + 1, high);
        this.highlightBars([i + 1], 'sorted');
        await this.waitForAnimation();

        return i + 1;
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SortingVisualizer();
});