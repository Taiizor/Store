/**
 * @author D.Thiele @https://hexx.one
 *
 * @license
 * Copyright (c) 2020 D.Thiele All rights reserved.  
 * Licensed under the GNU GENERAL PUBLIC LICENSE.
 * See LICENSE file in the project root for full license information.  
 * 
 * @description
 * helper for globally injecting "precision" strings into THREE.js shaders.
 * 
*/

ShaderQuality = {

    GetAvailable: function () {
        // @TODO
    },

    Inject: function (precision, shaders) {

        for (var shade in shaders) {
        
            var shader = shaders[shade];

            console.log("Injecting shader: " + shader.shaderID);

            if (shader.vertexShader) {
                shader.vertexShader = this.InjectShader(precision, shader.vertexShader);
            }
            if(shader.fragmentShader) {
                shader.fragmentShader = this.InjectShader(precision, shader.fragmentShader);
            }
        }
    },

    InjectShader: function (precision, shader) {
        // raw string
        var str0 = ""
            + "precision {bprec}p float;\r\n    "
            + "precision {bprec}p int;\r\n    ";

        // replace precisions according to user setting
        switch (precision) {
            case "high":
                str0 = str0.split("{bprec}").join("high");
                str0 += "precision mediump sampler2D;\r\n    "
                      + "precision mediump samplerCube;\r\n    ";
                break;
            case "low":
                str0 = str0.split("{bprec}").join("low");
                break;
            default:
                str0 = str0.split("{bprec}").join("medium");
                break;
        }
        //finish new quality code
        str0 += "//shaderquality";

        // remove old quality code
        var ito = shader.indexOf("//shaderquality");
        if(ito >= 0) shader = shader.substring(ito);

        // inject new quality code
        shader = shader.replace("//shaderquality", str0);
        return shader;
    }
};