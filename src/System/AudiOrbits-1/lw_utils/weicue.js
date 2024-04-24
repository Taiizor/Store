/**
 * @author D.Thiele @https://hexx.one
 *
 * @license
 * Copyright (c) 2020 D.Thiele All rights reserved.  
 * Licensed under the GNU GENERAL PUBLIC LICENSE.
 * See LICENSE file in the project root for full license information.  
 * 
 * @see
 * REQUIRES:
 * - jQuery
 * 
 * @description
 * WEICUE
 * Wallpaper Engine iCUE effects for web wallpapers
 * 
 * Uses several different methods to create
 * Lighting effects for Corsair ICUE devices.
 */

var weicue = {
    // runtime values
    injected: false,
    PAUSED: false,
    isAvailable: false,
    canvasX: 23,
    canvasY: 7,
    icueDevices: [],
    preview: null,
    icueInterval: null,
    mainCanvas: null,
    helperCanvas: null,
    helperContext: null,
    // settings
    settings: {
        icue_mode: 1,
        icue_area_xoff: 50,
        icue_area_yoff: 90,
        icue_area_width: 75,
        icue_area_height: 30,
        icue_area_blur: 5,
        icue_area_decay: 15,
        icue_area_preview: false,
        icue_main_color: "0 0.8 0",
        // AudiOrbits bg Color, used as "decay"-color
        main_color: "0 0 0",
    },

    injectCSS: function () {
        var st = document.createElement("style");
        st.innerHTML = `
        #icueholder {
            position: absolute;
            top: -120px;
            left: 0;
            width: auto;
            height: auto;
            margin: 10px;
            display: none;
        }
        #icuelogo {
            float: left;
            height: 80px;
            width: 80px;
        }
        #icuetext {
            float: left;
            margin: 25px 5px;
            font-size: 175%;
        }
        #icueholder {
            text-shadow: 0 0 20px rgba(255, 255, 255, .5), 0 0 15px rgba(255, 255, 255, .5);
        }
        .cuePreview {
            position: absolute;
            background: rgba(255, 0, 0, .3);
        }
        `;
        document.head.append(st);
    },

    injectHTML: function () {
        var outer = document.createElement("div");
        outer.id = "icueholder";
        var imgg = document.createElement("img");
        imgg.id = "icuelogo";
        imgg.setAttribute("src", `
data:image/png;base64,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
AAAASUVORK5CYII=
       `);
        // make text holder
        var txtt = document.createElement("div");
        txtt.id = "icuetext";
        // append image and text
        outer.append(imgg, txtt);
        document.body.append(outer);
    },

    // show a message by icue
    icueMessage: function (msg) {
        /*
        $("#icueholder").css('opacity', 1);
        $("#icuetext").html(msg);
        $("#icueholder").fadeIn({ queue: false, duration: "slow" });
        $("#icueholder").animate({ top: "0px" }, "slow");
        setTimeout(() => {
            $("#icueholder").fadeOut({ queue: false, duration: "slow" });
            $("#icueholder").animate({ top: "-120px" }, "slow");
        }, 10000);
        */
    },

    // helper
    getArea: function (inPx) {
        var sett = weicue.settings;
        var wwid = window.innerWidth;
        var whei = window.innerHeight;
        var w = wwid * sett.icue_area_width / 100;
        var h = whei * sett.icue_area_height / 100;
        var l = ((wwid - w) * sett.icue_area_xoff / 100);
        var t = ((whei - h) * sett.icue_area_yoff / 100);
        return {
            width: w + (inPx ? "px" : ""),
            height: h + (inPx ? "px" : ""),
            left: l + (inPx ? "px" : ""),
            top: t + (inPx ? "px" : ""),
        };
    },

    // get data for icue
    getEncodedCanvasImageData: function (imageData) {
        var colorArray = [];
        for (var d = 0; d < imageData.data.length; d += 4) {
            var write = d / 4 * 3;
            colorArray[write] = imageData.data[d];
            colorArray[write + 1] = imageData.data[d + 1];
            colorArray[write + 2] = imageData.data[d + 2];
        }
        return String.fromCharCode.apply(null, colorArray);
    },

    // canvas blur helper function
    gBlurCanvas: function (canvas, ctx, blur) {
        var sum = 0;
        var delta = 5;
        var alpha_left = 1 / (2 * Math.PI * delta * delta);
        var step = blur < 3 ? 1 : 2;

        var x, weight;
        for (var y = -blur; y <= blur; y += step) {
            for (x = -blur; x <= blur; x += step) {
                weight = alpha_left * Math.exp(-(x * x + y * y) / (2 * delta * delta));
                sum += weight;
            }
        }
        for (var y = -blur; y <= blur; y += step) {
            for (x = -blur; x <= blur; x += step) {
                ctx.globalAlpha = alpha_left * Math.exp(-(x * x + y * y) / (2 * delta * delta)) / sum * blur * blur;
                ctx.drawImage(canvas, x, y);
            }
        }
        ctx.globalAlpha = 1;
    },

    // show or hide preview
    updatePreview: function () {
        var self = weicue;
        var sett = self.settings;
        // create preview?
        if (!self.preview && sett.icue_area_preview) {
            self.preview = document.createElement("div");
            self.preview.classList.add("cuePreview");
            document.body.appendChild(self.preview);
        }
        // update settings or destroy
        if (self.preview) {
            if (!sett.icue_area_preview) {
                document.body.removeChild(self.preview);
                self.preview = null;
            }
            else Object.assign(self.preview.style, self.getArea(true));
        }
    },

    init: function () {
        var self = weicue;
        var sett = self.settings;

        // dont initialize if disabled
        if (sett.icue_mode == 0) return;

        // inject necessary HTML & CSS
        if (!self.injected) {
            self.injected = true;
            self.injectCSS();
            //self.injectHTML();
        }

        self.showWaiting();
        setTimeout(() => {
            self.hideWaiting();
        }, 30000);

        this.initCUE(0);

        print("weiCUE: init...");

        // recreate if reinit
        if (self.icueInterval) clearInterval(self.icueInterval);
        if (self.helperCanvas) document.body.removeChild(self.helperCanvas);
        // setup canvas
        self.helperCanvas = document.createElement("canvas");
        self.helperCanvas.id = "helpCvs";
        self.helperCanvas.width = self.canvasX;
        self.helperCanvas.height = self.canvasY;
        self.helperCanvas.style.display = "none";
        self.helperContext = self.helperCanvas.getContext("2d");
        document.body.appendChild(self.helperCanvas);

        // update devices about every 33ms/30fps. iCue doesnt really support higher values 
        self.icueInterval = setInterval(self.updateFrame, 1000 / 30);
    },

    // will initialize ICUE api & usage
    initCUE: function (count) {
        var self = weicue;
        // wait for plugins
        if (!self.isAvailable) {
            if (count < 100) {
                $("#icueholder").animate({ 'opacity': 0.1 + (100 - count) / 115 }, 250);
                setTimeout(() => this.initCUE(count + 1), 300);
            }
            else self.icueMessage("LED: Plugin not found!");
            return;
        }
        // setup devices
        self.icueDevices = [];
        window.cue.getDeviceCount((deviceCount) => {
            self.icueMessage("LED: Found " + deviceCount + " devices.");
            for (var xi = 0; xi < deviceCount; xi++) {
                var xl = xi;
                window.cue.getDeviceInfo(xl, (info) => {
                    info.id = xl;
                    window.cue.getLedPositionsByDeviceIndex(xl, function (leds) {
                        info.leds = leds;
                        self.icueDevices[xl] = info;
                    });
                });
            }
        });
    },

    // do the thing...
    updateFrame: function () {
        var self = weicue;
        var sett = self.settings;
        if (self.Paused || !self.isAvailable || sett.icue_mode == 0 || self.icueDevices.length < 1) return;
        // projection mode
        if (sett.icue_mode == 1) {
            // get scaled down image data and encode it for icue
            var encDat = self.getEncodedCanvasImageData(self.helperContext.getImageData(0, 0, self.canvasX, self.canvasY));
            // update all icueDevices with data
            for (var xi = 0; xi < self.icueDevices.length; xi++) {
                window.cue.setLedColorsByImageData(xi, encDat, self.canvasX, self.canvasY);
            }
        }
        // color mode
        if (sett.icue_mode == 2) {
            // get lol objects
            var col = sett.icue_main_color.split(" ");
            var ledColor = {
                r: col[0] * 255,
                g: col[1] * 255,
                b: col[2] * 255
            };;
            // try audio multiplier processing
            if (weas.hasAudio()) {
                var aud = weas.lastAudio;
                var mlt = 255 * aud.average / aud.range / aud.intensity * 10;
                ledColor = {
                    r: Math.min(255, Math.max(0, col[0] * mlt)),
                    g: Math.min(255, Math.max(0, col[1] * mlt)),
                    b: Math.min(255, Math.max(0, col[2] * mlt))
                };
            }
            // update all icueDevices with data
            for (var xi = 0; xi < self.icueDevices.length; xi++) {
                window.cue.setAllLedsColorsAsync(xi, ledColor);
            }
        }
    },

    // prepare canvas
    updateCanvas: function () {
        var self = weicue;
        var sett = self.settings;
        if (!self.isAvailable || !self.mainCanvas || sett.icue_mode == 0 || self.icueDevices.length < 1) return;

        if (sett.icue_mode == 1) {
            // get helper vars
            var cueWid = self.canvasX;
            var cueHei = self.canvasY;
            var area = self.getArea();
            var hctx = self.helperContext;
            // get real rgb values
            var spl = sett.main_color.split(' ');
            for (var i = 0; i < spl.length; i++) spl[i] *= 255;
            // overlay "decay" style
            hctx.fillStyle = "rgba(" + spl.join(", ") + ", " + sett.icue_area_decay / 100 + ")";
            hctx.fillRect(0, 0, cueWid, cueHei);
            // scale down and copy the image to the helper canvas
            hctx.drawImage(self.mainCanvas, area.left, area.top, area.width, area.height, 0, 0, cueWid, cueHei);
            // blur the helper projection canvas
            if (sett.icue_area_blur > 0) self.gBlurCanvas(self.helperCanvas, hctx, sett.icue_area_blur);
        }
    },

    showWaiting: function () {
        $("#icuetext").html("LED: waiting for plugin.");
        $("#icueholder").fadeIn({ queue: false, duration: "fast" });
        $("#icueholder").animate({ top: "0px" }, "fast");
    },

    hideWaiting: function () {
        $("#icueholder").fadeOut({ queue: false, duration: "fast" });
        $("#icueholder").animate({ top: "-120px" }, "fast");
    },
};

// Plugin handler
window.wallpaperPluginListener = {
    onPluginLoaded: function (name, version) {
        print("Plugin: " + name + ", Version: " + version);
        if (name === 'cue') weicue.isAvailable = true;
        if (name === 'led') weicue.isAvailable = true;
    }
};