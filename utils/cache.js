const cache = new Map();

const setCache = (key, object) => {
	const cacheObj = cache.get(key);

	if (cacheObj) cacheObj.object = object;
	else cache.set(key, { object });
};

const getCache = (key) => {
	const cacheObj = cache.get(key);

	if (cacheObj) return cacheObj.object;

	return undefined;
};

const clearCache = () => {
	cache.clear();
};

const deleteCache = (key) => {
	cache.delete(key);
};

module.exports = {
	setCache,
	getCache,
	clearCache,
	deleteCache,
};
