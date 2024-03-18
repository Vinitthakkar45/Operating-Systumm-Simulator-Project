let readCount = 0;
let writeCount = 0;
let readersInside = 0;
let writing = false;
let reading = false;

function Semaphore() {
    this.waiting = [];

    this.signal = function() {
        if (this.waiting.length > 0) {
            const next = this.waiting.shift();
            setTimeout(next, 0);
        }
    };

    this.wait = function(callback) {
        this.waiting.push(callback);
    };
}

const mutex = new Semaphore();
const wrt = new Semaphore();
const readersMutex = new Semaphore();

function addReader() {
    reading=true;
    readCount++;
    const readerId = 'Reader ' + readCount;
    const readerButton = document.createElement('button');
    readerButton.textContent = readerId;
    readerButton.onclick = read;
    document.getElementById('readers').appendChild(readerButton);
}

function addWriter() {
    writeCount++;
    const writerId = 'Writer ' + writeCount;
    const writerButton = document.createElement('button');
    writerButton.textContent = writerId;
    writerButton.onclick = write;
    document.getElementById('writers').appendChild(writerButton);
}

function read() {
    if (!writing) {
        mutex.wait(() => {
            function write() {
    if (readersInside === 0 && !writing ) {
        writing = true;
        wrt.wait(() => {
            // The writer has obtained the semaphore
            document.getElementById('file-content').textContent = "Writing...";

            setTimeout(() => {
                // End writing process after 5 seconds
                document.getElementById('file-content').textContent = "No activity";
                wrt.signal();
                writing = false;
            }, 5000);
        });
    } else {
        document.getElementById('file-content').textContent = "Can't write now";
    }
}

            readersInside++;
            if (readersInside === 1) {
                wrt.wait(() => {
                    document.getElementById('file-content').textContent = "Writing...";
                });
            }
            mutex.signal();
        });

        setTimeout(() => {
            mutex.wait(() => {
                readersInside--;
                
                if (readersInside === 0) {
                    reading=false;
                    wrt.signal();
                    document.getElementById('file-content').textContent = "No activity";
                }
                mutex.signal();
            });
        }, 3000);

        document.getElementById('file-content').textContent = "Reading...";

        // End reading process after 5 seconds
        setTimeout(() => {
            reading=false;
            document.getElementById('file-content').textContent = "No activity";
        }, 5000);
    } else {
        document.getElementById('file-content').textContent = "Can't read while writing";
    }
}

function write() {
    if (readersInside === 0 && !writing && !reading) {
        writing = true;
        document.getElementById('file-content').textContent = "Writing...";
        wrt.wait(() => {
            // The writer has finished writing
            setTimeout(() => {
                document.getElementById('file-content').textContent = "No activity";
                wrt.signal();
                writing = false;
            }, 5000); // End writing process after 5 seconds
        });

        // End writing process after 5 seconds
        setTimeout(() => {
            document.getElementById('file-content').textContent = "No activity";
            wrt.signal();
            writing = false;
        }, 5000);
    } else {
        document.getElementById('file-content').textContent = "Can't write now";
    }
}
