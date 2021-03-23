function copyableKey(event){
    key = event.target;
    if(key.getAttribute('active') == "true"){
        key.setAttribute("copyable","true");
    }
}
function dragstartKey(event){
    var el = event.target;
    event.dataTransfer.setData('vol', el.getAttribute('vol'));
    event.dataTransfer.setData('len', el.getAttribute('len'));
    event.dataTransfer.setData('key', el.getAttribute('key'));
    event.dataTransfer.setData('time', el.getAttribute('time'));
    event.dataTransfer.setData('type', el.getAttribute('type'));
    event.dataTransfer.setData('copy', el.getAttribute('copyable'));
}

function allowDropKey(event){
    if(event.target.getAttribute("active") == 'false' && event.target.getAttribute("expanded") == 'false' &&  event.target.getAttribute("type") == "key"){
        event.preventDefault();
    }
}

function dropKey(event){ 
    var type =event.dataTransfer.getData('type');
    if(type == 'key'){
        var oldKey =event.dataTransfer.getData('key');
        var oldTime =event.dataTransfer.getData('time');
        var oldEl = document.getElementById("key_" + oldKey + "_" + oldTime);
        var copy =event.dataTransfer.getData('copy');
        if(copy == 'false'){ 
            disableKey(oldEl);
        }
        oldEl.setAttribute('copyable', 'false')
        var vol = event.dataTransfer.getData('vol');
        var length = event.dataTransfer.getData('len');
        var keyEl = event.target;
        keyEl.setAttribute("active", "true");
        keyEl.setAttribute("len", length);
        keyEl.setAttribute("vol", vol);
        keyEl.setAttribute("draggable", "true");
        keyEl.children[0].children[0].style.height = vol+"%";
        keyEl.children[0].children[0].style.marginTop = (100-vol)*2+"%";
        keyEl.children[0].hidden = false; 
        keyEl.children[1].hidden = false;      
        if(length > 1){
            keyEl.setAttribute("expanded", "expander");
            for(var len = 1; len <length; len++){
                var timeRight = parseInt(keyEl.getAttribute("time")) + parseInt(len);
                var rigthEl =document.querySelector('[key^="' + keyEl.getAttribute("key") + '"][time="' + timeRight + '"]');
                if(rigthEl != null){
                    rigthEl.setAttribute("expanded", "true");                      
                    rigthEl.children[1].hidden = false; 
                }    
            }
        }
    }
}
function activeKey(el) {   
    if(el.getAttribute("expanded") != "true" && el.getAttribute("active") == "false"){
        el.setAttribute("active", "true")
        el.setAttribute("vol", "100");
        el.setAttribute("draggable", "true");
        vol = el.getAttribute("vol");
        el.children[0].children[0].style.height = vol+"%";
        el.children[0].children[0].style.marginTop = (100-vol)*2+"%";
        el.children[0].hidden = false; 
        el.children[1].hidden = false;
    }   
}

function disableKey(el) {  
    var key = el.getAttribute('key');
    var time = el.getAttribute('time');  
    var allRights = [];
    var elRight = el;  
    for(var right = 0; (elRight.getAttribute("expanded") != "false" || elRight.getAttribute("expanded") == "expander") && (parseInt(right)+parseInt(time)) < allTime; right++){    
        elRight = document.getElementById("key_" + key + "_" + (parseInt(time) + parseInt(right)).toString());
        if(elRight.getAttribute("expanded") != "false"){
            allRights[right] = elRight;    
        }            
    }
    var allLefts = [];
    var elLeft = el;
    for(var left = 0; (elLeft.getAttribute("expanded") != "false") && parseInt(time) - parseInt(left) > 0; left++){
        elLeft = document.getElementById("key_" + key + "_" + (parseInt(time) - parseInt(left + 1)).toString());
        if(elLeft.getAttribute("expanded") != "false"){
            allLefts[left] = elLeft;
            if(allLefts[left].getAttribute("expanded") == "expander"){                
                break;
            }                  
        } 
    }
    if(allLefts.length == 1){
        allLefts[0].setAttribute("expanded","false");
    }
    if(el.getAttribute("expanded") == "true"){
        allLefts[allLefts.length-1].setAttribute("len", allLefts.length);
    } 
    if(el.getAttribute("expanded") == "expander"){
        el.setAttribute("len", "1");
    }   
    if(allLefts.length == 0 && allRights.length == 0){
        el.setAttribute("active", "false")
        el.setAttribute("expanded", "false"); 
        el.setAttribute("draggable", "false");
        el.children[0].hidden = true;
        el.children[1].hidden = true;
    }      
    for(var x = 0; x < allRights.length; x++){
        if(allRights[x].getAttribute("expanded") != "expander" || allRights[0].getAttribute("expanded") == "expander"){
            allRights[x].setAttribute("active", "false")
            allRights[x].setAttribute("expanded", "false")
            allRights[x].setAttribute("draggable", "false");
            allRights[x].children[0].hidden = true;
            allRights[x].children[1].hidden = true;
        }else{
            break;
        } 
    }       
}

function expandNote(el){
    var el = el.parentElement;
    var key = el.getAttribute('key');
    var time = el.getAttribute('time');
    var rightTime = parseInt(time) + 1;
    var elRight = document.getElementById("key_" + key + "_" + rightTime);   
    if(rightTime < allTime && elRight.getAttribute("active") != "true"){ 
        if (el.getAttribute("expanded") == "false") {
            
            var len =parseInt(el.getAttribute("len"))+1;
            el.setAttribute("len",len);
            el.setAttribute("expanded","expander");
            
            elRight.setAttribute("expanded","true");
            elRight.children[1].hidden = false;
            
        }else if (el.getAttribute("expanded") == "true") {
            elRight.setAttribute("expanded","true");
            elRight.children[1].hidden = false;
            var elLeft = el;
            var left;
            for(left = 0; elLeft.getAttribute("active") != "true"; left++){
                elLeft = document.getElementById("key_" + key + "_" + (parseInt(time) - parseInt(left)).toString());      
            }
            elLeft.setAttribute("len",parseInt(left)+1);     
        }   
    }  
}

function changeVol(el){
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