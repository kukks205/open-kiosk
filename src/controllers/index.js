const axios = require('axios');
var moment = require('moment'); // require
const {
    BrowserWindow
} = require('@electron/remote')
moment.locale('th');

$(function () {

    document.getElementById("cardRead").onclick = () => {


        location.href='../pages/readcard.html';

    }
});