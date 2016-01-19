(function() {

    var path = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));

    angular.module('constants', [])
        .constant('SERVER', {
            apiUrl: path, // 'http://localhost/hetic/backend/php/PHP04'
            wifiApiUrl: '',
            socketsUrl: 'https://wtfaynodeserver.herokuapp.com/',
            dataUrl: path + '/data'
        });

})();