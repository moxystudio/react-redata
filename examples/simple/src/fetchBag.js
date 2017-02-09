const bags = {
    1: [
        { id: 1, name: 'First item' },
        { id: 2, name: 'Second item' },
        { id: 3, name: 'Third item' },
        { id: 4, name: 'Fourth item' },
        { id: 5, name: 'Fifth item' },
    ],
    a: [
        { id: 6, name: 'A item' },
        { id: 7, name: 'B item' },
        { id: 8, name: 'C item' },
        { id: 9, name: 'D item' },
        { id: 10, name: 'E item' },
    ],
};

export default function (id, time = 500) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!bags[id]) {
                return reject(new Error('Could not find bag: ' + id));
            }

            return resolve(bags[id]);
        }, time);
    });
}
