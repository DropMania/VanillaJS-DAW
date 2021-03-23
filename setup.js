var searchParams = new URLSearchParams(window.location.href.split("?")[1]);
var interval;
var canvas = document.getElementById("OscillatorDisplay");
ctx = canvas.getContext("2d");
var wave = "sine";
var time = 0;
var allTime = 16;
var bpm = 130;   
var matrixlen;
var patternString;
var octaves = 2;
var startOctave = 5;
var controlMode = "draw";
if (searchParams.has("bpm")) { bpm = searchParams.get("bpm")};
if (searchParams.has("time")) { allTime = searchParams.get("time") };
if (searchParams.has("wave")) { wave = searchParams.get("wave") };
if (searchParams.has("oct")) { octaves = searchParams.get("oct") };
if (searchParams.has("start")) { startOctave = searchParams.get("start") };

document.getElementById('load').addEventListener('change', load, false);

function darkMode(){
    var css = document.getElementById("cssFile");
    var curcss = css.href.split("/")[css.href.split("/").length -1];
    if(curcss == "style.css"){
        css.href = "darkStyle.css";
    }else{
        css.href = "style.css";
    } 
}

function changeMode(mode,button){
    controlMode = mode;
    var allButtons = button.parentNode.children;
    for(var i = 0; i < allButtons.length; i++){
        if(allButtons[i] != button){
            allButtons[i].style.background = ''
            allButtons[i].style.color = 'black'
        }else{
            button.style.background = 'rgb(85, 85, 255)'
            button.style.color = '#ccc'
        }
    }
    
}

function OscillatorDisplay(){
    window.requestAnimationFrame(OscillatorDisplay);
    fbc = new Uint8Array(anal.frequencyBinCount);
    anal.getByteTimeDomainData(fbc);
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.fillStyle = '#00CCFF';
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgb(0, 0, 0)';
    ctx.beginPath();
    var sliceWidth = canvas.width * 1.0 / anal.frequencyBinCount;
    var x = 0;
    for(var i = 0; i < anal.frequencyBinCount; i++) {
        var v = fbc[i] / 128.0;
        var y = v * canvas.height/2;
        if(i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        x += sliceWidth;
    }
    ctx.lineTo(canvas.width, canvas.height/2);
    ctx.stroke();
}

function setConfig(form){
    var data = [];
    var pS = getPatternString();
    for(var x = 0; x < form.length; x++){
        data.push(form[x].firstElementChild.value);  
    }
    if(data[0] != ""){
        bpm = data[0];
    }if(data[1] != ""){
        octaves = data[1];
    }if(data[2] != ""){
        startOctave = data[2];
    }if(data[3] != ""){
        allTime = data[3];
    }if(data[4] != ""){
        wave = data[4];
    }
    createMatrix();
    loadPatternString(pS);
}
function NewSong(){
    if(confirm("Sind sie sicher, dass sie alles loeschen wollen?")){
        clearAll();
    }
}
function clearAll(){
    var activeKeyEls = document.querySelectorAll('[id^="key"][active="true"]');
    var activeDrumEls = document.querySelectorAll('[id^="drum"][active="true"]');
    for (var x = 0; x < activeKeyEls.length; x++) {
        disableKey(activeKeyEls[x])
    }
    for (var x = 0; x < activeDrumEls.length; x++) {
        disableDrum(activeDrumEls[x])
    }
}
function mainVol(slider){
    masterAudio.gain.setValueAtTime(slider.value/100, context.currentTime);
}

function saveURL(){
    var url = location.href.split("?")[0];
    location.href = url+"?bpm="+bpm+"&time="+allTime+"&oct="+octaves+"&start="+startOctave+"&wave="+wave+"&p="+getPatternString();
}

function save() {
    var fileName = document.getElementById("saveName").value;
    if (fileName == "") { fileName = "Song" }
    var saveString = bpm+","+octaves+","+startOctave+","+allTime+","+wave+"$"+getPatternString();
    document.getElementById("save").download = fileName;
    document.getElementById("save").href = "data:text/plain;charset=utf-8," + saveString;
}

function load(evt) {
    const reader = new FileReader();
    reader.onload = handleFileLoad;
    reader.readAsText(evt.target.files[0])
}
function handleFileLoad(evt) {
    var content = evt.target.result;
    content = content.split("$");
    var config = content[0].split(',');
    bpm = config[0];
    octaves = config[1];
    startOctave = config[2];
    allTime = config[3];
    wave = config[4];
    createMatrix();
    loadPatternString(content[1]);
}

function getPatternString(){
    var result = '';
    for (var y = 0; y < allTime; y++) {
        var activeKeyEls = document.querySelectorAll('.matrixCol_' + y + '> [id^="key"][active="true"]');
        for (var x = 0; x < activeKeyEls.length; x++) {
            result += activeKeyEls[x].getAttribute("key") + "," + activeKeyEls[x].getAttribute("time") + "," + activeKeyEls[x].getAttribute("len") + "," + activeKeyEls[x].getAttribute("vol") + ";";
        }
    }
    result = result.slice(0, -1);
    result += "%";
    for (var y = 0; y < allTime; y++) {
        var activedrumEls = document.querySelectorAll('.matrixCol_' + y + '> [id^="drum"][active="true"]');
        for (var x = 0; x < activedrumEls.length; x++) {
            result += activedrumEls[x].getAttribute("drum") + "," + activedrumEls[x].getAttribute("time") + "," + activedrumEls[x].getAttribute("vol") + ";";
        }
    }
    if(result.charAt(result.length-1) != "%"){
        result = result.slice(0, -1);
    }
    result = result.replace(/#/g, "Q");
    
    return result;
}
function loadPatternString(pS) {
    pS = pS.replace(/Q/g, "#")
    var type = pS.split("%");
    var drums = type[1].split(";");
    var notes = type[0].split(";");
    for(var x = 0; x<drums.length;x++){
        var drum = drums[x].split(",");
        var drumEl = document.querySelector('[drum^="' + drum[0] + '"][time="' + drum[1] + '"]');
        if(drumEl != null){
            drumEl.setAttribute("active", "true");
            drumEl.setAttribute("draggable", "true");
            drumEl.setAttribute("vol", drum[2]);
            drumEl.children[0].children[0].style.height = drum[2]+"%";
            drumEl.children[0].children[0].style.marginTop = (100-drum[2])*2+"%";
            drumEl.children[0].hidden = false; 
        }
    }
    for (var x = 0; x < notes.length; x++) {
        var note = notes[x].split(",");
        var keyEl = document.querySelector('[key^="' + note[0] + '"][time="' + note[1] + '"]');
        if (keyEl != null) {
            keyEl.setAttribute("active", "true");
            keyEl.setAttribute("draggable", "true");
            keyEl.setAttribute("len", note[2]);
            keyEl.setAttribute("vol", note[3]);
            keyEl.children[0].children[0].style.height = note[3]+"%";
            keyEl.children[0].children[0].style.marginTop = (100-note[3])*2+"%";
            keyEl.children[0].hidden = false; 
            keyEl.children[1].hidden = false;      
            if(note[2] > 1){
                keyEl.setAttribute("expanded", "expander");
                for(var len = 1; len < note[2]; len++){
                    var timeRight = parseInt(note[1]) + parseInt(len);
                    var rigthEl =document.querySelector('[key^="' + note[0] + '"][time="' + timeRight + '"]');
                    rigthEl.setAttribute("expanded", "true");                      
                    rigthEl.children[1].hidden = false; 
                }
            }
        }
    }
}

function createMatrix() {
    document.getElementById("octField").value = octaves;
    document.getElementById("bpmField").value = bpm;
    document.getElementById("soctField").value = startOctave;
    document.getElementById("waveField").value = wave;
    document.getElementById("lenField").value = allTime;
    matrixlen = allTime;
    var matrixOctaves = octaves;
    var keys = [];
    var classNameKey;
    var classNameDisplay;
    var drums = ['Kick', 'Hat', 'Snare'];
    for (var i = startOctave; i < startOctave + matrixOctaves; i++) {
        
        keys.push("C" + i, "C#" + i, "D" + i, "D#" + i, "E" + i, "F" + i, "F#" + i, "G" + i, "G#" + i, "A" + i, "A#" + i, "B" + i)
    }
    var output = "<div class='matrixCol_Names'>";
    for (var d = 0 ; d < drums.length; d++) {
        output += "<div id='key_Names' class='DrumDisplayName'>" + drums[d] + "</div>";
    }
    for (var j = matrixOctaves * 12 - 1; j >= 0; j--) {
        if(keys[j].includes("#")){
                classNameDisplay = "blackDisplay";
            }else{
                classNameDisplay = "whiteDisplay";
            }
        output += "<div id='key_Names' class='"+classNameDisplay+"'>" + keys[j] + "</div>";
    }
    output += "</div>";
    for (var x = 0; x < matrixlen; x++) {
        output += "<div class='matrixCol_" + x + "'>";
        for (var d = 0 ; d < drums.length; d++) {
            output += 
            "<div active='false'"+
                "type = 'drum'"+
                "drum='" + drums[d] +"'"+
                "time='" + x + "'"+
                "height='" + d + "'"+
                "vol='100'"+
                "selected='false'"+
                "onclick='FunctionHandler(null,this,&quot;onclick&quot;,&quot;drum&quot;)'"+ 
                "oncontextmenu='FunctionHandler(null,this,&quot;oncontextmenu&quot;,&quot;drum&quot;)'"+
                "ondragstart='FunctionHandler(event,null,&quot;ondragstart&quot;,&quot;drum&quot;)'"+
                "ondragover='FunctionHandler(event,null,&quot;ondragover&quot;,&quot;drum&quot;)'"+
                "ondrop='FunctionHandler(event,null,&quot;ondrop&quot;,&quot;drum&quot;)'"+
                "ondblclick='FunctionHandler(event,null,&quot;ondblclick&quot;,&quot;drum&quot;)'"+
                "draggable = 'false'"+
                "copyable = 'false'"+
                "id='drum_" + drums[d] + "_" + x + "'"+
                "class='drumHit'"+
            ">"+  
                "<div class='changevolDrum' onwheel='FunctionHandler(null,this,&quot;onwheel&quot;,&quot;drum&quot;)' hidden><div class='volDrum'></div></div>"+                             
                    
            "</div>"
        }
        for (var y = matrixOctaves * 12 - 1; y >= 0; y--) {
            if(keys[y].includes("#")){
                classNameKey = "blackKey";
            }else{
                classNameKey = "whiteKey";
            }
            output += 
            "<div active='false'"+
                "expanded='false'"+
                "type = 'key'"+
                "key='" + keys[y] +"'"+
                "time='" + x + "'"+
                "height='" + y + "'"+
                "len='1'"+
                "vol='100'"+
                "selected='false'"+
                "onclick='FunctionHandler(null,this,&quot;onclick&quot;,&quot;key&quot;)'"+ 
                "oncontextmenu='FunctionHandler(null,this,&quot;oncontextmenu&quot;,&quot;key&quot;)'"+
                "ondragstart='FunctionHandler(event,null,&quot;ondragstart&quot;,&quot;key&quot;)'"+
                "ondragover='FunctionHandler(event,null,&quot;ondragover&quot;,&quot;key&quot;)'"+
                "ondrop='FunctionHandler(event,null,&quot;ondrop&quot;,&quot;key&quot;)'"+
                "ondblclick='FunctionHandler(event,null,&quot;ondblclick&quot;,&quot;key&quot;)'"+
                "draggable = 'false'"+
                "copyable = 'false'"+
                "id='key_" + keys[y] + "_" + x + "'"+
                "class='"+ classNameKey+"'"+
            ">"+  
                "<div class='changevol' onwheel='FunctionHandler(null,this,&quot;onwheel&quot;,&quot;key&quot;)' hidden><div class='vol'></div></div>"+                             
                "<div class='expand' onclick='FunctionHandler(null,this,&quot;onexpandclick&quot;,&quot;key&quot;)' hidden></div>"+    
            "</div>"
        }
        var displayTime = x + 1;
        output += "<div id='key_Time'>" + displayTime + "</div></div>"
    }
    document.getElementById("matrix").innerHTML = output;
    if (searchParams.has("p")) { patternString = searchParams.get("p"); loadPatternString(patternString)};
}
function FunctionHandler(event, data, from, type){
    if(controlMode == 'draw'){
        switch (type){
            case 'key':
                switch (from){   
                    case 'ondragstart': dragstartKey(event);break;
                    case 'ondragover': allowDropKey(event);break;
                    case 'ondrop': dropKey(event);break;
                    case 'ondblclick': copyableKey(event);break;
                    case 'oncontextmenu': disableKey(data);break;
                    case 'onclick': activeKey(data);break;
                    case 'onwheel': changeVol(data);break;
                    case 'onexpandclick': expandNote(data);break;
                }
            break;
            case 'drum':
                switch (from){  
                    case 'ondragstart': dragstartDrum(event);break;
                    case 'ondragover': allowDropDrum(event);break;
                    case 'ondrop': dropDrum(event);break;
                    case 'ondblclick': copyableDrum(event);break;
                    case 'oncontextmenu': disableDrum(data);break;
                    case 'onclick': activeDrum(data);break;
                    case 'onwheel': changeVolDrum(data);break;
                }
            break;
        }
    }else if(controlMode == 'select'){
        switch (type){
            case 'key':
                switch (from){   
                    case 'ondblclick': ;break;
                    case 'oncontextmenu': ;break;
                    case 'onclick': select(data, 'key');break;
                }
            break;
            case 'drum':
                switch (from){  
                    case 'ondblclick': ;break;
                    case 'oncontextmenu': ;break;
                    case 'onclick': select(data, 'drum');break;
                }
            break;
        }
    }   
}


function play() {
    interval = setInterval(function () {
        run()
    }, ((60 / (bpm*4))*1000));
}

function stop() {
    clearInterval(interval)
    time = 0;
    var grid = document.querySelectorAll('[class^="matrixCol"]');
    for (i = 0; i < grid.length; i++) {
        grid[i].style.background = "white";
    }
}
function pause() {
    clearInterval(interval)
}

function run() {
    if (time == matrixlen) { time = 0 };
    var other = document.querySelectorAll('[class^="matrixCol"]:not(.matrixCol_' + time + ')');
    for (i = 0; i < other.length; i++) {
        other[i].style.background = "white";
    }
    document.querySelector(".matrixCol_" + time).style.background = "#aaa";
    var activeKeyEls = document.querySelectorAll('.matrixCol_' + time + '> [id^="key"][active="true"]');
    var activeDrumEls = document.querySelectorAll('.matrixCol_' + time + '> [id^="drum"][active="true"]');
    for (var x = 0; x < activeKeyEls.length; x++) {
        playKey(activeKeyEls[x].getAttribute("key"),activeKeyEls[x].getAttribute("len"),activeKeyEls[x].getAttribute("vol"));
    }
    for (var x = 0; x < activeDrumEls.length; x++) {
        playDrum(activeDrumEls[x].getAttribute("drum"),activeDrumEls[x].getAttribute("vol"));
    }
    time++;
}