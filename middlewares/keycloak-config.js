const session = require('express-session')
const keycloak = require('keycloak-connect')

let _keycloak

var keycloakConfig = {
    clientId: 'smiley-microservice',
    bearerOnly: true,
    serverUrl: 'http://localhost:8080',
    realm: 'smiley',
    credentials: {
        secret: 'l64J3s2s3QA9CIqfdFgGlY7b5vL4bbul'
    }
};

function initKeycloak(){
    if(_keycloak){
        console.warn("Trying to init Keycloack again!");
        return _keycloak;
    } else {
        console.log("Initializing Keycloak...");
        var memoryStore = new session.MemoryStore();
        _keycloak = new keycloak({ store: memoryStore }, keycloakConfig);
        return _keycloak;
    }
}

function getKeycloak() {
    if(!_keycloak){
        console.error('Keycloak has not been initialized. Please called init first.!');
    }
    return _keycloak;
}

module.exports = {
    initKeycloak,
    getKeycloak
};