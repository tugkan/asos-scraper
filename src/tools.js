const Apify = require('apify');
const routes = require('./routes');

const {
    utils: { log },
} = Apify;

// Creates category URL with category id
const getCategoryURL = (categoryId) => {
    return `https://api.asos.com/product/search/v2/categories/${categoryId}?lang=en&currency=USD&sizeSchema=US&store=us&country=US&channel=mobile-app&keyStoreDataversion=jqvkhhb-21&limit=48&includeGroups=true`;
};

// Strips HTML tags from given text input
exports.stripHTML = (text) => {
    return text.replace(/<[^>]*>?/gm, '');
};

// Retrieves categories
exports.getSources = async () => {
    const { startUrls } = global.userInput;

    if (startUrls.length === 0) {
        throw new Error('Start URLs must be defined');
    } else {
        return startUrls.map((startUrl) => {
            const categoryId = startUrl.url.split('cid=')[1].split('&')[0];
            const category1 = startUrl.url.split('/')[4];
            const category2 = startUrl.url.split('/')[5];
            return {
                url: getCategoryURL(categoryId),
                userData: {
                    label: 'INITIAL_LIST',
                    categoryId,
                    category1,
                    category2,
                },
            };
        });
    }
};

// Create router
exports.createRouter = (globalContext) => {
    return async function (routeName, requestContext) {
        const route = routes[routeName];
        if (!route) throw new Error(`No route for name: ${routeName}`);
        log.debug(`Invoking route: ${routeName}`);
        return route(requestContext, globalContext);
    };
};

// Creates proxy URL with user input
exports.createProxyUrl = () => {
    if (global.userInput.proxy.proxyUrls) {
        return global.userInput.proxy.proxyUrls[0];
    }

    if (global.userInput.proxy.apifyProxyGroups) {
        const proxyGroups = global.userInput.process.apifyProxyGroups.join('+');
        return `http://groups-${proxyGroups},session-${Math.random()}:${process.env.APIFY_PROXY_PASSWORD}@proxy.apify.com:8000`;
    }

    return `http://session-${Math.random()}:${process.env.APIFY_PROXY_PASSWORD}@proxy.apify.com:8000`;
};
