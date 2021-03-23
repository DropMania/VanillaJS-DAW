function copyableDrum(event){
    drum = event.target;
    if(drum.getAttribute('active') == "true"){
        drum.setAttribute("copyable","true");
    }
}

function dragstartDrum(event){
    var el = event.target;
    event.dataTransfer.setData('vol', el.getAttribute('vol'));
    event.dataTransfer.setData('drum', el.getAttribute('drum'));
    event.dataTransfer.setData('time', el.getAttribute('time'));
    event.dataTransfer.setData('type', el.getAttribute('type'));  
    event.dataTransfer.setData('copy', el.getAttribute('copyable')); 
}

function allowDropDrum(event){
    if(event.target.getAttribute("active") != 'true'){
        event.preventDefault();
    } 
}
function dropDrum(event){ 
    var type =event.dataTransfer.getData('type');
    if(type == 'drum'){
        var oldDrum =event.dataTransfer.getData('drum');
        var oldTime =event.dataTransfer.getData('time');
        var oldEl = document.getElementById("drum_" + oldDrum + "_" + oldTime);
        var copy =event.dataTransfer.getData('copy');
        if(copy == 'false'){ 
            disableDrum(oldEl);
        }
        oldEl.setAttribute('copyable', 'false')
        var vol = event.dataTransfer.getData('vol');
        var drumEl = event.target;
        drumEl.setAttribute("active", "true");
        drumEl.setAttribute("draggable", "true");
        drumEl.setAttribute("vol", vol);
        drumEl.children[0].children[0].style.height = vol+"%";
        drumEl.children[0].children[0].style.marginTop = (100-vol)*2+"%";
        drumEl.children[0].hidden = false; 
    }
}

function activeDrum(el) {   
    if(el.getAttribute("active") == "false"){
        el.setAttribute("active", "true")
        el.setAttribute("vol", "100");
        el.setAttribute("draggable", "true");
        vol = el.getAttribute("vol");
        el.children[0].children[0].style.height = vol+"%";
        el.children[0].children[0].style.marginTop = (100-vol)*2+"%";
        el.children[0].hidden = false; 
    }   
}

function disableDrum(el) {  
    if(el.getAttribute("active")=="true"){
        el.setAttribute("active", "false");
        el.children[0].hidden = true;
    }
}
function changeVolDrum(el){
    window.event.preventDefault();
    var el = el.parentElement;
    var vol = el.getAttribute("vol");
    if(window.event.deltaY == -100){
        if(vol < 100){
            vol = parseInt(vol) + 4;
        } 
    }else{
        if(vol > 0){
            vol = vol - 4;
        } 
    }
    el.setAttribute("vol", vol);
    el.children[0].children[0].style.height = vol+"%";
    el.children[0].children[0].style.marginTop = (100-vol)*2+"%";
}