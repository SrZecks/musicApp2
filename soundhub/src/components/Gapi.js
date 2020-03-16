const gapiF = {
    gapiReady: async function (script) {
        return new Promise(function (resolve, reject) {
            if (script.getAttribute('gapi_processed')) {
                console.log('Client is ready! Now you can access gapi. :)');
                resolve(true)
            } else {
                console.log('Client wasn\'t ready, trying again in 100ms');
                setTimeout(() => { gapiF.gapiReady(script) }, 100);
            }
        });
    },
    loadGapi: async function () {
        return new Promise(function (resolve, reject) {
            const script = document.createElement("script");
            script.onload = async () => {
                console.log('Loaded script, now loading our api...')
                // Gapi isn't available immediately so we have to wait until it is to use gapi.
                let ready = await gapiF.gapiReady(script)
                resolve(ready)
            };
            script.src = "https://apis.google.com/js/platform.js";
            document.body.appendChild(script);
        })
    },
    init: function () {
        let gapi = window.gapi;
        gapi.load('auth2', function () {
            gapi.auth2.init({
                client_id: '558477949158-a9g4lrb4s4jhan64vfcdhji8nhfr0u89.apps.googleusercontent.com'
            }).then(result => {
                var GoogleAuth = result;
            }).catch(err => {
                console.log(err)
            })
        });
    },
    signOut: function () {
        let gapi = window.gapi;

        let auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
        });
    }
}

export default gapiF;

