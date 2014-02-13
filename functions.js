var timeout = null;
var pattern = /([\+\/\*\-]?\(?(-?\$?(?:\d*\.\d{1,2}|\d+))+\)?)+/g;

var timedcheck = function () {
    var t = $(this);
    clearTimeout(timeout);
    timeout = setTimeout(function(){checkitout(t);},1000);
}

function checkitout(t) {
    var fromval = true; 
    var content = t.val();
    if (!$.trim(content)){ // think I'm checking for contentEditable here, should actually do that
        fromval = false;
        content = t.getPreText();
    }

    console.log(content);

    var exps = content.match(pattern);
    if (exps) {
        console.log(exps);
        for (var i=0; i<exps.length; i++){
            var el = exps[i];
            var dsig = (el.search(/\$/) > -1);
            var el_esc = el.replace(/\$/g, "");
            //console.log(el_esc);
            var ans = math.round(math.eval(el_esc), 2);
            if (dsig) {
                if (ans < 0){
                    ans = ans.toString().replace("-","-$");
                }else{
                    ans = "$" + ans;
                }
            }
            content = content.replace(el, ans);
            if (fromval){
                t.val(content);
            }else{
                t.html(htmlForTextWithEmbeddedNewlines(content));
            }
        }

        setEndOfContenteditable(t);
    }
}

function smartify(){
    var extid = chrome.i18n.getMessage("@@extension_id"); //-> background.js?
    var classname = "smartbox_" + extid;
    var boxes = jQuery("."+classname);

    console.log("smartify() functions");

    if (boxes.length == 0){

        var iframe = jQuery('iframe');

        try{
            jQuery("textarea,input,[contenteditable]", iframe.contents())
                .css('backgroundColor', '#F8F8F8')
                .addClass(classname)
                .on('keyup', timedcheck);
        }catch(err){
            console.log("err: "+err);
        }

        jQuery("textarea,input,[contenteditable]")
            .css('backgroundColor', '#F8F8F8')
            .addClass(classname)
            .on('keyup', timedcheck);

    }else{

        boxes
            .off('keyup', timedcheck)
            .removeClass(classname)
            .css('backgroundColor', '#FDFDFD');    

    }
}


//http://stackoverflow.com/questions/1125292
function setEndOfContenteditable($contentEditableElement)
{
    if ($contentEditableElement.attr('contenteditable') !== undefined) {
        contentEditableElement = $contentEditableElement.get(0);
        var range,selection;
        if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
        {
            range = document.createRange();//Create a range (a range is a like the selection but invisible)
            range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
            selection = window.getSelection();//get the selection object (allows you to change selection)
            selection.removeAllRanges();//remove any selections already made
            selection.addRange(range);//make the range you have just created the visible selection
        }
        else if(document.selection)//IE 8 and lower
        {      
            range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
            range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
            range.select();//Select the range (make it the visible selection
        }
    }
}

//http://stackoverflow.com/questions/4535888
function htmlForTextWithEmbeddedNewlines(text) {
    var htmls = [];
    var lines = text.split(/\n/);
    var tmpDiv = jQuery(document.createElement('div'));
    for (var i = 0 ; i < lines.length ; i++) {
        htmls.push(tmpDiv.text(lines[i]).html());
    }
    return htmls.join("<br>");
}

//http://stackoverflow.com/questions/3455931
$.fn.getPreText = function () {
    var ce = $("<pre />").html(this.html());
    ce.find("div").replaceWith(function() { return "\n" + this.innerHTML; });
    return ce.text();
};

