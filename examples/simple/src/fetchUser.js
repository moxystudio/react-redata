export default function (id, time = 1000) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id > 10) {
                return reject(new Error('Could not find user: ' + id));
            }

            return resolve({ id, name: `User ${id}` });
        }, time);
    });
}
