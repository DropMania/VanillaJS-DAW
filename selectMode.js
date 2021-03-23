var firstmark = true;
var startEl;
var endEl;
function select(el, type){
    
    if(firstmark){
        startEl =el;
        startEl.setAttribute('selected', 'true')
        firstmark =false;
    }else{
        if(startEl.getAttribute('type') == type){
        endEl= el;
        endEl.setAttribute('selected', 'true')
        startPoint = {x: startEl.getAttribute('time'), y: startEl.getAttribute('height')};
        endPoint = {x: endEl.getAttribute('time'), y: endEl.getAttribute('height')};
        
        var subMatrix = [];
        
     
        var gotoX = endPoint.x ;
        var gotoY = endPoint.y ;
        for(var  xIndex = startPoint.x; xIndex != gotoX; xIndex =IncOrDec(xIndex, gotoX, false)){
            for(var  yIndex = startPoint.y; yIndex != gotoY; yIndex =IncOrDec(yIndex, gotoY, false)){
                var thisEl = document.querySelector('[height="'+yIndex+'"][time="'+xIndex+'"]');
                thisEl.setAttribute('selected', 'true')
                subMatrix.push(thisEl);
            }
        }
       
        
        firstmark = true;
        }
    }

    function IncOrDec(from, to, away){
        if(away){
            if(from > to){
                from ++;
            }else if(from < to){
                from --;
            }
        }else{
            if(from > to){
                from --;
            }else if(from < to){
                from ++;
            }
        }
        return from;
    }
    
}