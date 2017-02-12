function all(items) {
    return {
        handler: Promise.all,
        items,
    };
}

export default all;
