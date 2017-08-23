/* ============================================================================
 * Paxnet
 * ============================================================================
 * AUTHOR      : 김경희, avrilinaus@pulipinc.com
 * DESCRIPTION : UI-Script
 * ============================================================================
 * Revision History
 * Author   Date            Description
 * ------   ----------      ---------------------------------------------------
 * 김경희  	2017-04-10		initial version
 * ============================================================================ */


/**
 * UI
 * @param typeId
 * @param grouId
 */
var UI = (function () {
    // UI data
    var keyTab = false; // Tab확인
    var keySft = false; // Sft확인
    var WIDTH = 0; //브라우저 넓이
    var HEIGHT = 0; //브라우저 높이

    // Init
    var initHandle = function() {

        //브라우저 체크
        var browserName = undefined;
        var userAgent = navigator.userAgent;
        switch (true) {
            case /Trident|MSIE/.test(userAgent):
                var word;
                var version = "N/A";
                var agent = userAgent.toLowerCase();
                var name = navigator.appName;
                // IE old version ( IE 10 or Lower )
                if (name == "Microsoft Internet Explorer") word = "msie ";
                else {
                    if (agent.search("trident") > -1) word = "trident/.*rv:";// IE 11
                    else if (agent.search("edge/") > -1) word = "edge/";// Microsoft Edge
                }
                var reg = new RegExp(word + "([0-9]{1,})(\\.{0,}[0-9]{0,1})");
                if (reg.exec(agent) != null) version = RegExp.$1 + RegExp.$2;
                browserName = 'ms ie' + ~~version;
                break;
            case /Edge/.test(userAgent):
                browserName = 'edge';
                break;
            case /Chrome/.test(userAgent):
                browserName = 'webkit';
                break;
            case /Safari/.test(userAgent):
                browserName = 'safari';
                break;
            case /Firefox/.test(userAgent):
                browserName = 'moz';
                break;
            case /Opera/.test(userAgent):
                browserName = 'o';
                break;
            default:
                browserName = 'unknown';
        }
        $('html').addClass(browserName);

        //디바이스 OS체크
        if (navigator.userAgent.indexOf('Android') !== -1) {
            $('html').addClass('android');
        } else if (navigator.userAgent.indexOf('iPhone') !== -1) {
            $('html').addClass('ios');
        }
    }

    var eventHandle = function() {

        $(window).on('resize', function (e) {
            WIDTH = $(window).width();
            HEIGHT = $(window).height();
            $(window).trigger('userResize');
        });
    }();

    /**
     * UI.Slider
     * @param typeId
     * @param grouId
     */
    var Slider = function () {


        /*
         *   rollSlider
         *   @param content : 슬라이더아이디
         *   @param showCnt : 초기 보여질 슬라이더 갯수
         */
        var rollSlider = function (option) {
            var op = {};
            $.extend(op, option);
            var init = function () {
                op.con = $(op.content);
                op.btnPrev = op.con.find('.prev').attr('disabled', 'disabled').prop('disabled', true);
                op.btnNext = op.con.find('.next');
                op.slide = op.con.find('ul>li');
                op.sildeLen = op.slide.length;
                op.playCnt = op.showCnt;
                op.slide.eq(op.playCnt-1).nextAll().hide();
            }();

            var eventHandler = function () {
                op.con.find('button').on('click', function (e) {
                    var _this = $(this);
                    if(_this.is('.next')) {
                        op.slide.eq(op.playCnt-op.showCnt).hide();
                        op.playCnt++;
                        op.slide.eq(op.playCnt-1).show();
                        if(op.playCnt == op.sildeLen) op.btnNext.attr('disabled', 'disabled').prop('disabled', true);
                        op.btnPrev.removeAttr('disabled').prop('disabled', false);
                    }else{
                        op.slide.eq(op.playCnt-1).hide();
                        op.playCnt--;
                        op.slide.eq(op.playCnt-op.showCnt).show();
                        if(op.playCnt <= op.showCnt) op.btnPrev.attr('disabled', 'disabled').prop('disabled', true);
                        op.btnNext.removeAttr('disabled').prop('disabled', false);
                    }
                });
                $(window).on('userResize', function () {
                    if(WIDTH <= 965) {
                        op.slide.show();
                    }else{
                        op.slide.eq(op.playCnt-1).nextAll().hide();
                        op.slide.eq(op.playCnt-op.showCnt).prevAll().hide();
                    }
                });
            }();
        }
        return {
            rollSlider : rollSlider
        }
    }();


    return {
        initHandle : initHandle,
        Slider : Slider
    }
})();


var util =  (function () {
    var _public = {};
    var _private = {};

    // IE가 location.origin 안먹어서 아래로 변경
    var originUrl = window.location.protocol + '//' + window.location.host;

    // var pagePath = location.origin + location.pathname;
    var pagePath = originUrl + location.pathname;

    //var weblog = {};
    //if (pagePath.indexOf('paxnet.co.kr') > 0) {
    // 운영 웹로그 적재
    //weblog.url = 'paxnet.devtree.co.kr';
    //} else {
    // 개발 웹로그 적재
    //weblog.url = '10.60.20.9';
    //}

    var cookieDomain = '';
    if (pagePath.indexOf('paxnet.co.kr') > 0) {
        cookieDomain = 'paxnet.co.kr';
    } else {
        cookieDomain = location.host;
    }

    /**
     * 쿠키를 저장한다.
     * @param strCkName	String - 쿠키에 저장될 키값
     * @param strCkValue	String - 쿠키에 저잘될 키값에 해당하는 값
     */
    _public.setCookie = function (strCkName, strCkValue, strCkOption, dmIndex){

        strCkOption = strCkOption || '';
        var expireDay = 365;

        if ( !(_private.chkReturn(strCkOption.expires, "s") == "") ) {
            expireDay = strCkOption.expires;
        }

        var expire = new Date();
        expire.setDate(expire.getDate() + expireDay);
        cookies = strCkName + '=' + escape(strCkValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(strCkValue)를 합니다.
        cookies += ';expires=' + expire.toGMTString() + ';';
        if(dmIndex == 0) cookies += 'domain=paxnet.devtree.co.kr;';
        else cookies += 'domain=devtree.co.kr;';

        _private.cookie = cookies;
    };

    /**
     * 쿠키를 꺼낸다.
     * @param strCkName	String - 꺼낼 키값
     * @returns
     */
    _public.getCookie = function (strCkName){
        strCkName = strCkName + '=';
        var cookieData = _private.cookie;
        var start = cookieData.indexOf(strCkName);
        var strCkValue = '';

        if(start != -1){
            start += strCkName.length;
            var end = cookieData.indexOf(';', start);
            if(end == -1)end = cookieData.length;
            strCkValue = cookieData.substring(start, end);
        }

        return unescape(strCkValue);
    };


    /**
     * window popup
     * @param width=800, height=700, toolbar=no, menubar=no, scrollbars=no, resizable=yes
     */

    _public.winPopup  = function (url, tit, op) {
        window.open(url, tit, op);
    }

    //
    _private.chkReturn = function (data, strReKey, returnData, rePlusEnd) {

        var strType = jQuery.type(data);
        var bCheck = true;
        var bReturnData = true;
        var bRePlusEnd = false;
        var strRePlusEnd = "";

        if (strType == "null" || strType == "undefined") {
            bCheck = false;
        }

        if (jQuery.type(returnData) == "null" || jQuery.type(returnData) == "undefined"){
            bReturnData = false;
        }

        strType = jQuery.type(strReKey);

        if (strType == "null" || strType == "undefined" || strReKey == "b" || strReKey == "") {
            return bCheck;
        }

        if (rePlusEnd != null && rePlusEnd != undefined) {
            bRePlusEnd = true;
            strRePlusEnd = rePlusEnd;
        }

        if (bCheck == true) {
            if (strReKey == "s"){
                if (bRePlusEnd == true && data == ""){
                    return returnData;
                } else if (bRePlusEnd == true){
                    return data + strRePlusEnd;
                } else {
                    if (data == "" && bReturnData == true){
                        return returnData;
                    } else {
                        return data + "";
                    }

                }
            } else {
                return data;
            }
        } else {
            if (strReKey == "s") {
                if (bReturnData){
                    return returnData;
                } else {
                    return "";
                }
            } else if (strReKey == "n") {
                if (bReturnData){
                    return returnData;
                } else {
                    return 0;
                }
            }
        }

        return bCheck;
    };

    /**
     * 쿠키처리함수
     * */
    _private.cookie = function (name, value, options) {
        if (typeof value != 'undefined') { // name and value given, set cookie
            options = options || {};
            if (value === null) {
                value = '';
                options.expires = -1; //options.path = "/";
            }
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
            }
            var path = options.path ? '; path=' + options.path : '';
            var domain = options.domain ? '; domain=' + options.domain : '';
            var secure = options.secure ? '; secure' : '';
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        } else { // only name given, get cookie
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }
    };

    return _public;
})();


$(function () {
    UI.initHandle();
    //var newsRollSlider = UI.Slider.rollSlider({content:'#photo-news',showCnt:4});

    if($('.open_modal').length) $('.open_modal').modalLayer(); //모달레이어 팝업
});
