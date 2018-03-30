(function () {

    var rando = btoa(Math.random());

    var alreadyDone = false; 

    window.loadScript = () => {
        fetch('./bigfile.js').then(res => res.text()).then(text => {
            text += `
    onDone()
    // ${rando}
    `;
            var script = document.createElement('script');
            script.textContent = text;
            marky.mark('script');
            document.body.appendChild(script);
        })
    }

    window.onDone = () => {
        var entry = marky.stop('script');

        document.getElementById('display').textContent += `
  Script load took ${entry.duration}ms`;

        if (!alreadyDone) {
            loadScript();
        }
        alreadyDone = true;
    }

    loadScript();

})()