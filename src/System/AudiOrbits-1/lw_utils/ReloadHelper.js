/**
 * @author D.Thiele @https://hexx.one
 */

var ReloadHelper = {

    waitSeconds: 3,
    injected: false,

    injectCSS: function() {
        var st = document.createElement("style");
        st.innerHTML = `
        #reload-bar {
            position: absolute;
            opacity: 0;
            top: 0px;
            height: 10px;
            width: 0%;
            background-color: #989a;
            transition: all ` + this.waitSeconds + `s ease, opacity 0.33s ease;
        }
        #reload-bar.show {
            opacity: 1;
            width: 100%;
            background-color: #e11a;
        }
        #reload-bar.done {
            transition: opacity 0.33s ease;
        }
        #reload-text {
            position: absolute;
            top: -6em;
            width: 100%;
            text-align: center;
            font-weight: 100;
            font-size: 3em;
            color: #fffa;
            transition: all .33s ease, color ` + this.waitSeconds + `s ease, text-shadow ` + this.waitSeconds + `s ease;
        }
        #reload-text.show {
            top: 10px;
            color: #e11a;
            text-shadow: 0 0 20px rgba(255, 50, 50, .5), 0 0 15px rgba(255, 50, 50, .5);
        }
        #reload-text.done {
            transition: position 0.33s linear;
        }
        #reload-text {
            text-shadow: 0 0 20px rgba(255, 255, 255, .5), 0 0 15px rgba(255, 255, 255, .5);
        }
        `;
        document.head.append(st);
    },

    injectHTML: function() {
        var outer = document.createElement("div");
        outer.id = "reloader";
        var bar = document.createElement("div");
        bar.id = "reload-bar";
        var tex = document.createElement("h1");
        tex.id = "reload-text";
        tex.innerHTML = "Reload";
        outer.append(bar, tex);
        document.body.append(outer);
    },

    Show: function() {
        var self = ReloadHelper;
        if(!self.injected) {
            self.injected = true;
            self.injectCSS();
            self.injectHTML();
        }
        $("#reload-bar, #reload-text").removeClass("done").addClass("show");
    },

    Hide: function() {
        $("#reload-bar, #reload-text").removeClass("show").addClass("done");
    }
};