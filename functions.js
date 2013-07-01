var timeout = null;
var pattern = /-?\$?(?:\d*\.\d{1,2}|\d+)[\+\/\*\-]-?\$?(?:\d*\.\d{1,2}|\d+)/g;
//decimal regex source: http://stackoverflow.com/q/468655

var timedcheck = function () {
    var t = $(this);
    clearTimeout(timeout);
    timeout = setTimeout(function(){checkitout(t);},1000);
}

function checkitout(t) {
    var fromval = true; 
    var content = t.val();
    if (!$.trim(content)){
        fromval = false;
        content = t.text();
    }

    //console.log(content);

    var exps = content.match(pattern);
    if (exps) {
        var el = exps[0];
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
            t.text(content);
        }
    }
}

function smartify(){
    var extid = chrome.i18n.getMessage("@@extension_id"); //-> background.js?
    var classname = "smartbox_" + extid;
    var boxes = jQuery("."+classname);
    console.log("smartify() functions");
    if (boxes.length == 0){

        var iframe = jQuery('iframe');
        jQuery("textarea,input,[contenteditable]", iframe.contents())
            .css('backgroundColor', '#F8F8F8')
            .addClass(classname)
            .on('keyup', timedcheck);

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



