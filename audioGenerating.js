var context = new AudioContext(); 
var masterAudio = context.createGain();
var anal = context.createAnalyser();
masterAudio.connect(anal);
anal.connect(context.destination);



function playKey(key,length,vol) {
    var o = context.createOscillator();
    var g = context.createGain();
    o.type = wave;
    o.frequency.value = getFrequency(key);
    o.connect(g);
    g.connect(masterAudio);
    var curve = [vol/100,0];
    g.gain.setValueCurveAtTime(curve,context.currentTime, (60 /(bpm*4))*length)
    o.start();
    o.stop(context.currentTime + (60 /(bpm*4))*length);
}
function playDrum(drum, vol){
    switch(drum){
        case "Kick":
            playKick(vol)
            break;
        case "Snare":
            playSnare(vol);
            break;
        case "Hat":
            playHat(vol);
            break;
    }
}
function playKick(vol) {
    var o = context.createOscillator();
    var g = context.createGain();
    o.type = "sine";
    o.frequency.setValueCurveAtTime([1000,30,100,50,0],context.currentTime,(60 /(bpm*4)));
    o.connect(g);
    g.connect(masterAudio);
    g.gain.setValueCurveAtTime([vol/100,0],context.currentTime,(60 /(bpm*4)))
    o.start();
    o.stop(context.currentTime + (60 /(bpm*4)));
}

function playSnare(vol) {
    var bufferSize = 512;
    var w = context.createScriptProcessor(bufferSize,1,1);
    var g = context.createGain();
    w.onaudioprocess = function(e){
        var output = e.outputBuffer.getChannelData(0);
        for (var i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
    }
    g.gain.setValueCurveAtTime([vol/100,0],context.currentTime,(60 /(bpm*2)));
    w.connect(g);
    g.connect(masterAudio);    
}

function playHat(vol) {
    var bufferSize = 512;
    var o = context.createScriptProcessor(bufferSize,1,1);
    var g = context.createGain();
    var f = context.createBiquadFilter();
    o.onaudioprocess = function(e){
        var output = e.outputBuffer.getChannelData(0);
        for (var i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
    }
    g.gain.setValueCurveAtTime([vol/100,0],context.currentTime,(60 /(bpm*4)));
    f.type = "highpass";
    f.frequency.setTargetAtTime(8000,context.currentTime,0);
    o.connect(g);
    g.connect(f);
    f.connect(masterAudio);
}

function getFrequency(key) {
    var c = 32.7, cS = 34.65, d = 36.71, dS = 38.89, e = 41.2, f = 43.65, fS = 46.25, g = 49, gS = 51.91, a = 55, aS = 58.27, b = 61.74;
    var frequency;
    if (key.includes("#")) {
        if (key.startsWith("C#")) {
            frequency = multiply(cS, key.charAt(key.length - 1));
        } else if (key.startsWith("D#")) {
            frequency = multiply(dS, key.charAt(key.length - 1));
        } else if (key.startsWith("F#")) {
            frequency = multiply(fS, key.charAt(key.length - 1));
        } else if (key.startsWith("G#")) {
            frequency = multiply(gS, key.charAt(key.length - 1));
        } else if (key.startsWith("A#")) {
            frequency = multiply(aS, key.charAt(key.length - 1));
        }
    } else {
        if (key.startsWith("C")) {
            frequency = multiply(c, key.charAt(key.length - 1));
        } else if (key.startsWith("D")) {
            frequency = multiply(d, key.charAt(key.length - 1));
        } else if (key.startsWith("E")) {
            frequency = multiply(e, key.charAt(key.length - 1));
        } else if (key.startsWith("F")) {
            frequency = multiply(f, key.charAt(key.length - 1));
        } else if (key.startsWith("G")) {
            frequency = multiply(g, key.charAt(key.length - 1));
        } else if (key.startsWith("A")) {
            frequency = multiply(a, key.charAt(key.length - 1));
        } else if (key.startsWith("B")) {
            frequency = multiply(b, key.charAt(key.length - 1));
        }
    }
    return frequency;
}

function multiply(frequency, times) {
    var result = frequency;
    for (var i = 0; i < times - 1; i++) {
        result *= 2;
    }
    return result;
}

document.body.addEventListener("keypress",function (evt){
    switch(evt.key){
        case "z":
            playKey("C5", 1, 100)
        break;
        case "x":
            playKey("D5", 1, 100)
        break;
        case "c":
            playKey("E5", 1, 100)
        break;
        case "v":
            playKey("F5", 1, 100)
        break;
        case "b":
            playKey("G5", 1, 100)
        break;
        case "n":
            playKey("A5", 1, 100)
        break;
        case "m":
            playKey("B5", 1, 100)
        break;
        case "s":
            playKey("C#5", 1, 100)
        break;
        case "d":
            playKey("D#5", 1, 100)
        break;
        case "g":
            playKey("F#5", 1, 100)
        break;
        case "h":
            playKey("G#5", 1, 100)
        break;
        case "j":
            playKey("A#5", 1, 100)
        break;
    }
})