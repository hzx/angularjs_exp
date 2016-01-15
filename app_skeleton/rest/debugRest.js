
angular.module('pmc')
.config(function() {
    var staticUrlRe = /(\.html|\.js|\.css)/gi;

    var restServer = new FakeRest.Server();
    
    restServer.toggleLogging();
    restServer.init(restData);

    var server = sinon.fakeServer.create();
    server.autoRespond = true;
    server.respondWith(restServer.getHandler());

    sinon.fakeServer.xhr.useFilters = true;
    sinon.fakeServer.xhr.addFilter(function(method, url) {
        staticUrlRe.lastIndex = 0;
        return staticUrlRe.test(url);
    });
}) // redirect remote rest request to local server
.factory('debugRestInterceptor', ['$log', function($log) {
    const redirects = {
        'https://dev.parkmycloud.com/dashboard/time_zones': '/dashboard/time_zones',
        '/dashboard/time_zones': '/time_zones',
        'https://dev.parkmycloud.com/dashboard/pmc_roles': '/dashboard/pmc_roles',
        '/dashboard/pmc_roles': '/pmc_roles',
    };

    return {
        request: function (config) {
            // DEBUG
            $log.log('debugRest, request config.url: ', config.url, config);

            // replace urls
            if (config.url in redirects) config.url = redirects[config.url];

            return config;
        }
    };
}])
.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('debugRestInterceptor');
}])
;
