const Apify = require('apify');
const rp = require('request-promise');
const tools = require('./tools');

const {
    utils: { log },
} = Apify;


// Create crawler
Apify.main(async () => {
    log.info('PHASE -- STARTING ACTOR.');

    global.userInput = await Apify.getInput();

    log.info('ACTOR OPTIONS: -- ', global.userInput);

    // Create request queue
    const requestQueue = await Apify.openRequestQueue();

    // Initialize first request
    const startPage = await tools.getSources();
    await requestQueue.addRequest({ ...startPage });

    // Create route
    const router = tools.createRouter({ requestQueue });

    log.info('PHASE -- SETTING UP CRAWLER.');
    const crawler = new Apify.BasicCrawler({
        requestQueue,
        maxConcurrency: global.userInput.maxConcurrency,
        minConcurrency: global.userInput.minConcurrency,
        maxRequestRetries: 50,
        handleRequestTimeoutSecs: 99999,
        handleRequestFunction: async (context) => {
            const { request } = context;
            log.debug(`CRAWLER -- Processing ${request.url}`);

            // let flag = false
            // Request resource
            const resp = await rp({
                method: 'GET',
                url: request.url,
                proxy: tools.createProxyUrl(),
                headers: {
                    'asos-s-ver': '2.1.0.366',
                    'asos-ttpm': '1909',
                    'asos-cid': 'a6ab3c56-890a-47a1-8146-923dcb847589',
                    ...(request.userData.headers ? request.userData.headers : {}),
                },
                resolveWithFullResponse: true,
                json: true,
            }).catch(async (err) => {
                // Sanity check for product group route
                if (request.userData.label === 'PRODUCT_GROUP' && err.statusCode === 404) {
                    const { product } = request.userData;
                    await Apify.pushData({ ...product });
                } else {
                    throw new Error(err);
                }
            });

            if (!resp || resp.statusCode !== 200 || !resp.body) {
                throw new Error(`We got blocked by target on ${request.url}`);
            }

            // Add response body to context
            context.data = resp.body;

            // Redirect to route
            await router(request.userData.label, context);
        },
    });

    log.info('PHASE -- STARTING CRAWLER.');

    await crawler.run();

    log.info('PHASE -- ACTOR FINISHED.');
});
