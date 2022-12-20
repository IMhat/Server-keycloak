const session = require('express-session')
const keycloak = require('keycloak-connect')

let _keycloak

var keycloakConfig = {
    clientId: 'dev_client',
    bearerOnly: true,
    publicClient: true,
    confidentialPort: 0,
    sslRequired: "external",
    // disableTrustManager: true,
    // allowAnyHostname: true,
    // sslRequired: "external",
    // useResourceRoleMappings: true,
    // enableCors: true,
    // corsAllowedMethods: "POST, PUT, DELETE, GET",
    // exposeToken: true,
    // verifyTokenAudience: true,
    serverUrl: 'http://192.168.5.165:8080/',
    authServerUrl: "http://192.168.5.165:8080/",
    realm: 'Dev',

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