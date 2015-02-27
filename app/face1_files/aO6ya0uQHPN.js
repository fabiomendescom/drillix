/*!CK:2953928290!*//*1424902503,*/

if (self.CavalryLogger) { CavalryLogger.start_js(["u5w2m"]); }

__d("VideoPlayerLoggerEvents",[],function(a,b,c,d,e,f){e.exports={AUTOPLAY_PREFERENCE_CHANGED:"autoplay_preference_changed",END_STALL_TIME:"end_stall_time",AUTOPLAY_PREFERENCE_STATUS:"autoplay_preference_status",ERROR_ALERT_SHOWN:"video_error_alert_shown",NOT_AUTOPLAYING:"not_autoplaying",VIDEO_ORIENTATION_CHANGED:"video_orientation_changed",ASSETS_LOADED:"assets_loaded",BUFFERED:"buffered",CANCELLED_REQUESTED_PLAYING:"cancelled_requested_playing",CAROUSEL_CHANGE:"carousel_change",DISPLAYED:"displayed",ENTERED_HD:"entered_hd",ENTERED_FALLBACK:"entered_fallback",ENTERED_FS:"entered_fs",EXITED_HD:"exited_hd",EXITED_FS:"exited_fs",ERROR:"error",FINISHED_PLAYING:"finished_playing",IMPRESSION:"impression",INVALID_URL:"invalid_url",MUTED:"muted",PAUSED:"paused",PLAY_REQUESTED:"play_requested",PLAYER_FORMAT_CHANGED:"player_format_changed",PLAYER_LOADED:"player_loaded",PROGRESS:"progress",READY_TO_PLAY:"ready_to_play",REPLAYED:"replayed",REQUESTED:"requested",REQUESTED_PLAYING:"requested_playing",SCRUBBED:"scrubbed",STARTED_PLAYING:"started_playing",STARTED_RECEIVING_BYTES:"started_receiving_bytes",STOPPED_PLAYING:"stopped_playing",UNMUTED:"unmuted",UNPAUSED:"unpaused",VOLUME_CHANGED:"volume_changed",VOLUME_DECREASE:"volume_decrease",VOLUME_INCREASE:"volume_increase",VIDEO_PLAYING:"video_playing",COMPLETION:"completion",VIEW:"view"};},null);
__d("VideoPlayerVersions",[],function(a,b,c,d,e,f){e.exports={HTML5:"html5",SILVERCITY:"silvercity",PLEASANTVILLE:"pleasantville"};},null);
__d("HVideoPlayerMixin",["EventListener","VideoPlayerLoggerEvents"],function(a,b,c,d,e,f,g,h){var i=-1,j={initLogger:function(k){var l=this.getSubscriptions();this._loggedEvents={};this._logFunction=k;var m=this.getVideoElement();this._lastStartTimePosition=i;this._muted=m.muted;this._pausedPosition=i;this._seeking=false;this._seekSourceTimePosition=i;this._volume=m.volume;this._lastPlayedTime=i;if(m.readyState>=m.HAVE_FUTURE_DATA){this._logReadyToPlay();}else l.addSubscriptions(g.listen(m,'canplay',this._logReadyToPlay.bind(this)));l.addSubscriptions(g.listen(m,'pause',this._onPause.bind(this)),g.listen(m,'playing',this._onPlay.bind(this)),g.listen(m,'seeked',this._onSeeked.bind(this)),g.listen(m,'seeking',this._onSeeking.bind(this)),g.listen(m,'timeupdate',this._onTimeUpdate.bind(this)),g.listen(m,'volumechange',this._onVolumeChange.bind(this)));},_logOnce:function(event,k){if(this._loggedEvents[event])return;this._logEvent(event,k);},_logEvent:function(event,k){this._loggedEvents[event]=true;var l=k?k:{};l.video_id=this.getVideoID();if(!l.hasOwnProperty('video_time_position'))l.video_time_position=this.getVideoElement().currentTime;l.time=Math.round(Date.now()/1000);if(this.getAdClientToken){var m=this.getAdClientToken();if(m)l.ad_client_token=m;}if(event==h.UNMUTED)this._unmutedWasLogged=true;this._logFunction(event,l);},_logReadyToPlay:function(){this._logOnce(h.READY_TO_PLAY);},_onPause:function(){var k=this.getVideoElement(),event=k.ended?h.FINISHED_PLAYING:h.PAUSED;this._logEvent(event,{video_last_start_time_position:this._lastStartTimePosition===i?this._lastPlayedTime:this._lastStartTimePosition,video_time_position:this._lastPlayedTime});this._lastStartTimePosition=i;},getLastStartTimePosition:function(){return this._lastStartTimePosition;},getLastPlayReason:function(){return null;},getVideoPlayReason:function(){return null;},_onPlay:function(){var k=this.getLastPlayReason();if(!this._unmutedWasLogged&&!this.getVideoElement().muted&&k=='user_initiated')this._logEvent(h.UNMUTED);var event=this._loggedEvents[h.STARTED_PLAYING]?h.UNPAUSED:h.STARTED_PLAYING,l={reason:k,video_play_reason:this.getVideoPlayReason()};this._logEvent(event,l);this._lastStartTimePosition=this.getVideoElement().currentTime.toFixed(2);this._lastPlayedTime=this.getVideoElement().currentTime.toFixed(2);},_onSeeked:function(){var k={video_seek_source_time_position:this._seekSourceTimePosition};if(this._lastStartTimePosition!==i){k.video_last_start_time_position=this._lastStartTimePosition;}else k.video_last_start_time_position=this._seekSourceTimePosition;this._logEvent(h.SCRUBBED,k);var l=this.getVideoElement();if(l.paused){this._lastStartTimePosition=i;}else this._lastStartTimePosition=l.currentTime;this._seekSourceTimePosition=i;this._seeking=false;},_onSeeking:function(){if(!this._seeking){this._seekSourceTimePosition=this.getVideoElement().currentTime.toFixed(2);this._seeking=true;}},_onTimeUpdate:function(){var k=this.getVideoElement();if(!k.paused)this._lastPlayedTime=k.currentTime.toFixed(2);},_onVolumeChange:function(){var k=this.getVideoElement(),l={},event=null;if(k.muted!==this._muted&&k.volume===this._volume&&k.volume>0){event=k.muted?h.MUTED:h.UNMUTED;}else{event=k.volume>this._volume?h.VOLUME_INCREASE:h.VOLUME_DECREASE;l.current_volume=k.volume;}this._logEvent(event,l);this._muted=k.muted;this._volume=k.volume;}};e.exports=j;},null);
__d("VideoPlayerLoggerErrors",[],function(a,b,c,d,e,f){e.exports={ENTERED_FALLBACK:'entered_fallback',ERROR_CALLING_FLASH:'error_calling_flash'};},null);
__d("XPubcontentRelatedVideoInlineController",["XController"],function(a,b,c,d,e,f){e.exports=b("XController").create("\/pubcontent\/related_video_inline\/",{fbvideo_id:{type:"Int",required:true},root_video_id:{type:"Int"}});},null);
__d("EntstreamAttachmentRelatedFBVideo",["Arbiter","AsyncRequest","AttachmentRelatedShareConstants","csx","cx","CSS","DOM","DOMQuery","Event","ge","Parent","VideoPlayerReason","XPubcontentRelatedVideoInlineController"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s){var t={addHoverListener:function(u,v){var w=p(v),x=m.scry(w,"^div._3f-c")[0];o.listen(x,'mouseover',this.doHover.bind(this,u));o.listen(x,'mouseout',this.doHoverOut.bind(this,u));},addClickOutListener:function(u,v){var w=p(v);o.listen(w,'click',this.doHoverOut.bind(this,u));},doHover:function(u){u.play(r.USER);u.mute();},doHoverOut:function(u,v){u.pause(r.USER);},loadRelatedLSCInlineFBVideoAttachmentInRelatedCard:function(u,v,w,x,y,z){var aa=null;if(typeof v==='string'){aa=p(v);}else aa=v;if(!aa)return;var ba=null;if(typeof u==='string'){ba=p(u);}else ba=u;if(!ba)return;o.listen(ba,'click',function(event){var ca=event.srcElement?event.srcElement:event.target;if(ca)for(var da in z){var ea=p(z[da]);if(ea&&n.contains(ea,ca))return;}if(event.isDefaultRequested())return;event.preventDefault();var fa=null;if(y){var ga=m.scry(aa,"^ul._5h5a")[0];if(!ga)return;fa=ga.previousSibling;}else fa=ba.children[0];setTimeout(function(){var ha=s.getURIBuilder();ha.setInt('fbvideo_id',w);ha.setInt('root_video_id',x);new h().setURI(ha.getURI()).setRelativeTo(fa).send();},1000);});},loadRelatedLSCInlineFBVideoAttachment:function(u,v,w){var x=null;if(!x)return;o.listen(x,'click',function(event){if(event.isDefaultRequested())return;event.preventDefault();var y="^div._4-u2",z="_4zdu",aa=m.scry(x,y),ba=aa.length===1?aa[0]:null,ca=ba.parentNode,da=ca.previousSibling;while(!da){ca=ca.parentNode;da=ca.previousSibling;}if(!l.hasClass(da,z)){var ea=m.create('div',{className:z}),fa=m.insertBefore(ba.parentNode,ea),ga=fa.length>=1?fa[0]:null;}else ga=da;if(ga.childNodes[0])l.hide(ga.childNodes[0]);var ha="div._4icy",ia=m.scry(ca,ha)[0];if(ia){var ja="_4icx";l.setClass(ia,ja);}setTimeout(function(){var ka=s.getURIBuilder();ka.setInt('fbvideo_id',v);new h().setURI(ka.getURI()).setRelativeTo(ga).send();if(w)g.inform(i.FBVIDEO_CLICK,{attachment:x,fbvideo_id:v,continued_chaining:true});if(ia)if(w){m.remove(ia);}else l.setClass(ia,"_4icy");},1000);});},loadRelatedFBVideos:function(u,v){var w=p(u);if(!w)return;var x="_4zdu",y=q.byClass(w,x);if(y)return;var z=o.listen(w,'click',function(){z.remove();g.inform(i.FBVIDEO_CLICK,{attachment:w,fbvideo_id:v});});},loadRelatedFBVideosOnShare:function(u,v){var w=p(u);if(!w)return;var x="_4zdu",y=q.byClass(w,x);if(y)return;var z=m.scry(w,"^._5pat"+' a.share_action_link')[0];if(!z)return;var aa=o.listen(z,'click',function(){aa.remove();g.inform(i.FBVIDEO_CLICK,{attachment:w,fbvideo_id:v});});}};e.exports=t;},null);
__d("VideoPlayerApiEvents",[],function(a,b,c,d,e,f){var g=['buffered','buffering','beginPlayback','updateStatus','logEvent','pausePlayback','clickForTracking','finishPlayback','unmuteVideo','muteVideo','changeVolume','turnOffAutoplay','expandVideo','updateBuffer','updateMetadata','qualityChange','error'];e.exports=g;},null);
__d("AbstractVideoPlayerApi",["EventEmitter","VideoPlayerApiEvents","arrayContains","invariant"],function(a,b,c,d,e,f,g,h,i,j){for(var k in g)if(g.hasOwnProperty(k))m[k]=g[k];var l=g===null?null:g.prototype;m.prototype=Object.create(l);m.prototype.constructor=m;m.__superConstructor__=g;function m(){"use strict";l.constructor.call(this);}m.prototype.addListener=function(){"use strict";for(var n=[],o=0,p=arguments.length;o<p;o++)n.push(arguments[o]);return l.addListener.apply(this,n);};m.prototype.emit=function(){"use strict";for(var n=[],o=0,p=arguments.length;o<p;o++)n.push(arguments[o]);return l.emit.apply(this,n);};m.isImplementationUnavailable=function(){"use strict";return true;};e.exports=m;},null);
__d("VideoData",[],function(a,b,c,d,e,f){function g(h){"use strict";this.$VideoData0=h;}g.prototype.hasHD=function(){"use strict";return !!this.$VideoData0.hd_src;};g.prototype.getEncodingTag=function(){"use strict";return this.$VideoData0.encoding_tag;};g.prototype.getVideoID=function(){"use strict";return this.$VideoData0.video_id;};g.prototype.getRotation=function(){"use strict";return this.$VideoData0.rotation;};g.prototype.hasSubtitles=function(){"use strict";return !!this.$VideoData0.subtitles_src;};g.prototype.getSubtitlesSrc=function(){"use strict";return this.$VideoData0.subtitles_src;};g.prototype.getPlayableSrcSD=function(){"use strict";if(this.$VideoData0.sd_src_no_ratelimit)return this.$VideoData0.sd_src_no_ratelimit;return this.$VideoData0.sd_src;};g.prototype.getPlayableSrcHD=function(){"use strict";if(this.$VideoData0.hd_src_no_ratelimit)return this.$VideoData0.hd_src_no_ratelimit;return this.$VideoData0.hd_src;};g.prototype.hasRateLimit=function(){"use strict";return !!this.$VideoData0.sd_src_no_ratelimit;};g.prototype.isHLS=function(){"use strict";return this.$VideoData0.is_hls;};g.prototype.getHDTag=function(){"use strict";return this.$VideoData0.hd_tag;};g.prototype.getSDTag=function(){"use strict";return this.$VideoData0.sd_tag;};e.exports=g;},null);
__d("VideoPlayerFlashApi",["AbstractVideoPlayerApi","Arbiter","DOMQuery","Flash","SubscriptionsHandler","VideoPlayerApiEvents","VideoPlayerLoggerErrors","destroyOnUnload","invariant"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){function p(u){if(u.hasAttribute('data-flash'))return u.getAttribute('id');return i.find(u,'div[data-flash]').getAttribute('id');}function q(u){var v=i.scry(u,'embed');if(!v.length)v=i.scry(u,'object');o(v.length);return v[0];}for(var r in g)if(g.hasOwnProperty(r))t[r]=g[r];var s=g===null?null:g.prototype;t.prototype=Object.create(s);t.prototype.constructor=t;t.__superConstructor__=g;function t(u,v){"use strict";s.constructor.call(this);this.$VideoPlayerFlashApi0=q(u);this.$VideoPlayerFlashApi1=p(u);this.$VideoPlayerFlashApi2=new k();this.$VideoPlayerFlashApi2.addSubscriptions(h.subscribe(l.map(function(w){return 'flash/'+w;}),this.$VideoPlayerFlashApi3.bind(this)));n(function(){return this.$VideoPlayerFlashApi2.release();}.bind(this));this.$VideoPlayerFlashApi4=v;}t.onImplementationReady=function(u,v){"use strict";var w=p(u),x=h.subscribe('flash/ready',function(y,z){if(z.divID===w){h.unsubscribeCurrentSubscription();h.releaseCurrentPersistentEvent();v(u);}});n(function(){return x.unsubscribe();});};t.isImplementationUnavailable=function(){"use strict";return !j.isAvailable();};t.prototype.$VideoPlayerFlashApi3=function(u,v){"use strict";if(v.divID!==this.$VideoPlayerFlashApi1)return;var w=u.substr('flash/'.length);this.emit(w,v);};t.prototype.pause=function(){"use strict";for(var u=[],v=0,w=arguments.length;v<w;v++)u.push(arguments[v]);this.$VideoPlayerFlashApi5('pauseVideo',u);};t.prototype.play=function(){"use strict";for(var u=[],v=0,w=arguments.length;v<w;v++)u.push(arguments[v]);this.$VideoPlayerFlashApi5('playVideo',u,true);};t.prototype.seek=function(){"use strict";for(var u=[],v=0,w=arguments.length;v<w;v++)u.push(arguments[v]);this.$VideoPlayerFlashApi5('seekVideo',u);};t.prototype.switchVideo=function(){"use strict";for(var u=[],v=0,w=arguments.length;v<w;v++)u.push(arguments[v]);this.$VideoPlayerFlashApi5('switchVideo',u);};t.prototype.unmute=function(){"use strict";for(var u=[],v=0,w=arguments.length;v<w;v++)u.push(arguments[v]);this.$VideoPlayerFlashApi5('unmuteVideo',u);};t.prototype.mute=function(){"use strict";for(var u=[],v=0,w=arguments.length;v<w;v++)u.push(arguments[v]);this.$VideoPlayerFlashApi5('muteVideo',u);};t.prototype.isMuted=function(){"use strict";for(var u=[],v=0,w=arguments.length;v<w;v++)u.push(arguments[v]);return this.$VideoPlayerFlashApi5('isVideoMuted',u);};t.prototype.getPlaybackDuration=function(){"use strict";for(var u=[],v=0,w=arguments.length;v<w;v++)u.push(arguments[v]);return this.$VideoPlayerFlashApi5('getVideoDuration',u);};t.prototype.getVolume=function(){"use strict";for(var u=[],v=0,w=arguments.length;v<w;v++)u.push(arguments[v]);return this.$VideoPlayerFlashApi5('getVideoVolume',u);};t.prototype.setDimensions=function(u,v){"use strict";};t.prototype.getVideoInfo=function(){"use strict";for(var u=[],v=0,w=arguments.length;v<w;v++)u.push(arguments[v]);var x=this.$VideoPlayerFlashApi5('getVideoInfo',u,false);if(x){return JSON.parse(x);}else return null;};t.prototype.setVolume=function(){"use strict";for(var u=[],v=0,w=arguments.length;v<w;v++)u.push(arguments[v]);this.$VideoPlayerFlashApi5('setVolume',u);};t.prototype.hasHD=function(){"use strict";for(var u=[],v=0,w=arguments.length;v<w;v++)u.push(arguments[v]);return this.$VideoPlayerFlashApi5('hasVideoHD',u);};t.prototype.isHD=function(){"use strict";for(var u=[],v=0,w=arguments.length;v<w;v++)u.push(arguments[v]);return this.$VideoPlayerFlashApi5('isVideoHD',u);};t.prototype.toggleHD=function(){"use strict";for(var u=[],v=0,w=arguments.length;v<w;v++)u.push(arguments[v]);this.$VideoPlayerFlashApi5('toggleVideoHD',u);};t.prototype.$VideoPlayerFlashApi5=function(u,v,w){"use strict";try{if(typeof this.$VideoPlayerFlashApi0[u]==='function'){return this.$VideoPlayerFlashApi0[u].apply(this.$VideoPlayerFlashApi0,v);}else throw new Error(u+' is not a valid method on the flash object');}catch(x){if(this.$VideoPlayerFlashApi6)return;this.$VideoPlayerFlashApi6=true;if(this.$VideoPlayerFlashApi4){this.$VideoPlayerFlashApi4(x,w);}else this.emit('error',{error:m.ERROR_CALLING_FLASH,message:x.message,isPlayback:w});this.$VideoPlayerFlashApi6=false;}};e.exports=t;},null);
__d("HTMLMediaElementReadyStates",[],function(a,b,c,d,e,f){var g={HAVE_NOTHING:0,HAVE_METADATA:1,HAVE_CURRENT_DATA:2,HAVE_FUTURE_DATA:3,HAVE_ENOUGH_DATA:4};e.exports=g;},null);
__d("SubRipText",[],function(a,b,c,d,e,f){function g(r){var s=Number(r.substr(0,r.length-1)),t=r.substr(-1);switch(t){case 's':return s;case 'm':return s*60;case 'h':return s*3600;}var u=r.split(':');s=Number(u[u.length-1].replace(/,/,'.'));if(u.length>1)s+=Number(u[u.length-2])*60;if(u.length>2)s+=Number(u[u.length-3])*3600;return s;}function h(r){var s=r.split('\n'),t=[],u=0;do{var v=s.indexOf('',u);if(v<0)v=s.length;var w=j(s.slice(u,v));if(w)t.push(w);u=v+1;}while(u>0&&u<s.length);return t;}function i(r){var s=r.split('-->');if(s.length!=2)return null;var t=g(s[0].trim()),u=g(s[1].trim());if(Number.isNaN(u)||Number.isNaN(t))return null;return {begin:t,end:u};}function j(r){if(r.length<3)return null;var s=k(r[0]),t=i(r[1]);if(!t)return null;return {counter:s,begin:t.begin,end:t.end,text:l(r[2])};}function k(r){return Number(r.trim());}function l(r){return r.trim();}function m(r){var s=r.split('.');if(s[0].length<2)return "0"+s.join('.');return s.join('.');}function n(r){var s=m(Math.floor(r/3600).toString()),t=m(Math.floor(r%3600/60).toString()),u=m((r%60).toFixed(3));return (s+":"+t+":"+u);}function o(r){return (r.counter+"\n"+n(r.begin)+" --> "+n(r.end)+"\n"+r.text+"\n");}function p(r){return ("WEBVTT\n\n"+r.map(function(s){return o(s);}).join('\n'));}function q(r){"use strict";this.$SubRipText0=h(r);this.$SubRipText0.sort(function(s,t){return s.counter-t.counter;});this.$SubRipText1=this.$SubRipText0.map(function(s,t){return t;}).sort(function(s,t){return this.$SubRipText0[s].begin-this.$SubRipText0[t].begin;}.bind(this));this.invalidateCache();}q.prototype.$SubRipText2=function(r){"use strict";return this.$SubRipText0[this.$SubRipText1[r]];};q.prototype.$SubRipText3=function(r){"use strict";var s=this.$SubRipText4;while(s<this.$SubRipText1.length){var t=this.$SubRipText2(s);if(t.begin<=r){this.$SubRipText5.push(t);s++;}else break;}this.$SubRipText4=s;};q.prototype.$SubRipText6=function(r){"use strict";this.$SubRipText5=this.$SubRipText5.filter(function(s){return s.end>r;});};q.prototype.invalidateCache=function(){"use strict";this.$SubRipText7=0;this.$SubRipText5=[];this.$SubRipText4=0;};q.prototype.getSubtitles=function(r){"use strict";if(r<this.$SubRipText7)this.invalidateCache();this.$SubRipText7=r;this.$SubRipText3(r);this.$SubRipText6(r);return this.$SubRipText5.map(function(s){return s.text;});};q.prototype.renderVTT=function(){"use strict";return p(this.$SubRipText0);};e.exports=q;},null);
__d("onCanPlayHTMLMediaElement",["EventListener","HTMLMediaElementReadyStates","invariant","setImmediate"],function(a,b,c,d,e,f,g,h,i,j){function k(m){return m>=h.HAVE_FUTURE_DATA;}function l(m,n){i(m instanceof window.HTMLMediaElement);if(k(m.readyState))j(n);return g.listen(m,'canplay',n);}l.once=function(m,n){var o=l(m,function(){for(var p=[],q=0,r=arguments.length;q<r;q++)p.push(arguments[q]);o.remove();n.apply(this,p);}.bind(this));};e.exports=l;},null);
__d("supportsHTML5Video",["DOM","memoize"],function(a,b,c,d,e,f,g,h){e.exports=h(function(){return !!g.create('video').canPlayType;});},null);
__d("VideoPlayerHTML5Api",["AbstractVideoPlayerApi","Arbiter","BlobFactory","CSS","DOM","DOMDimensions","EventListener","HTMLMediaElementReadyStates","HVideoPlayerMixin","SubscriptionsHandler","SubRipText","VideoData","VideoPlayerLoggerEvents","VideoPlayerReason","VideoPlayerVersions","XHRRequest","classWithMixins","cx","destroyOnUnload","getCrossOriginTransport","mixin","setImmediate","onCanPlayHTMLMediaElement","supportsHTML5Video"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,aa,ba,ca,da){var ea=a.URL||a.webkitURL;function fa(na){switch(na){case 1:return 'The fetching process for the media resource was aborted by the '+'user agent at the users request.';case 2:return 'A network error of some description caused the user agent to '+'stop fetching the media resource, after the resource was '+'established to be usable.';case 3:return 'An error of some description occurred while decoding the '+'media resource, after the resource was established to be usable.';case 4:return 'The media resource indicated by the src attribute was not '+'suitable.';}}function ga(na){switch(na){case 1:return 'MEDIA_ERR_ABORTED';case 2:return 'MEDIA_ERR_NETWORK';case 3:return 'MEDIA_ERR_DECODE';case 4:return 'MEDIA_ERR_SRC_NOT_SUPPORTED';default:return 'Error code '+na+' is unknown';}}function ha(na){if(na.readyState>=n.HAVE_METADATA){return na.muted;}else return !!na.getAttribute('muted')||na.muted;}var ia=-1,ja=w(g,aa(o));for(var ka in ja)if(ja.hasOwnProperty(ka))ma[ka]=ja[ka];var la=ja===null?null:ja.prototype;ma.prototype=Object.create(la);ma.prototype.constructor=ma;ma.__superConstructor__=ja;function ma(na){"use strict";la.constructor.call(this);this.$VideoPlayerHTML5Api0=na;this.$VideoPlayerHTML5Api1=na.id;var oa=l.getElementDimensions(this.$VideoPlayerHTML5Api0);this.$VideoPlayerHTML5Api2=oa.width;this.$VideoPlayerHTML5Api3=oa.height;this.$VideoPlayerHTML5Api4=JSON.parse(na.getAttribute('data-config'));this.$VideoPlayerHTML5Api5={};this.$VideoPlayerHTML5Api6=ia;this.$VideoPlayerHTML5Api7=ha(na);this.$VideoPlayerHTML5Api8=this.$VideoPlayerHTML5Api7;this.$VideoPlayerHTML5Api9=na.volume;this.$VideoPlayerHTML5Apia=false;this.$VideoPlayerHTML5Apib=ia;this.$VideoPlayerHTML5Apic=null;this.$VideoPlayerHTML5Apid=false;this.$VideoPlayerHTML5Apie=this.$VideoPlayerHTML5Api4.disableNativeControls;this.$VideoPlayerHTML5Apif=na.controls;this.$VideoPlayerHTML5Apig=this.$VideoPlayerHTML5Api4.subtitlesActive;this.$VideoPlayerHTML5Apih={};this.restoreControls();this.$VideoPlayerHTML5Apii=new p();y(function(){return this.$VideoPlayerHTML5Apii.release();}.bind(this));this.$VideoPlayerHTML5Apij();this.$VideoPlayerHTML5Apik=this.$VideoPlayerHTML5Api4.defaultHD;this.$VideoPlayerHTML5Apil=this.$VideoPlayerHTML5Api4.autoFullscreenHD;this.switchVideo(0);this.initLogger(this.$VideoPlayerHTML5Apim.bind(this));}ma.prototype.getAdClientToken=function(){"use strict";this.$VideoPlayerHTML5Api4.ad_client_token;};ma.prototype.getVideoID=function(){"use strict";if(this.$VideoPlayerHTML5Apin)return this.$VideoPlayerHTML5Apin.getVideoID();return this.$VideoPlayerHTML5Api4.video_id;};ma.prototype.getDOMElement=function(){"use strict";return this.$VideoPlayerHTML5Api0;};ma.prototype.getVideoElement=function(){"use strict";return this.$VideoPlayerHTML5Api0;};ma.prototype.getSubscriptions=function(){"use strict";return this.$VideoPlayerHTML5Apii;};ma.onImplementationReady=function(na,oa){"use strict";ba(oa);};ma.prototype.getVideoInfo=function(){"use strict";if(!this.$VideoPlayerHTML5Apin)return null;return {isHLS:this.$VideoPlayerHTML5Apin.isHLS(),isHD:this.$VideoPlayerHTML5Apik,hasHD:this.$VideoPlayerHTML5Apin.hasHD(),resourceUrl:this.$VideoPlayerHTML5Apio(),subtitles:this.$VideoPlayerHTML5Apin.hasSubtitles(),hasUnlimitedSrc:this.$VideoPlayerHTML5Apin.hasRateLimit(),useUnlimitedSrc:false,tagSD:this.$VideoPlayerHTML5Apin.getSDTag(),tagHD:this.$VideoPlayerHTML5Apin.getHDTag()};};ma.isImplementationUnavailable=function(){"use strict";return !da();};ma.prototype.pause=function(na){"use strict";this.$VideoPlayerHTML5Apic=na;this.$VideoPlayerHTML5Api0.pause();};ma.prototype.play=function(na){"use strict";if(!this.$VideoPlayerHTML5Apip)this.$VideoPlayerHTML5Apip=na;this.$VideoPlayerHTML5Apiq=na;if(na===t.USER&&this.$VideoPlayerHTML5Api8)this.unmute();this.$VideoPlayerHTML5Apid=true;if(!this.$VideoPlayerHTML5Api0.paused)return this.$VideoPlayerHTML5Apir();if(this.$VideoPlayerHTML5Api0.readyState>=n.HAVE_FUTURE_DATA||this.$VideoPlayerHTML5Api0.currentTime>0){this.$VideoPlayerHTML5Api0.play();}else{ca.once(this.$VideoPlayerHTML5Api0,function(){if(this.$VideoPlayerHTML5Apid)this.$VideoPlayerHTML5Api0.play();}.bind(this));this.$VideoPlayerHTML5Apis();}};ma.prototype.$VideoPlayerHTML5Apis=function(){"use strict";var na=this.$VideoPlayerHTML5Api0.getAttribute('preload');this.$VideoPlayerHTML5Api0.setAttribute('preload','auto');ca.once(this.$VideoPlayerHTML5Api0,function(){return this.$VideoPlayerHTML5Api0.setAttribute('preload',na);}.bind(this));this.$VideoPlayerHTML5Api0.load();this.$VideoPlayerHTML5Api0.muted=this.$VideoPlayerHTML5Api7;};ma.prototype.seek=function(na){"use strict";this.$VideoPlayerHTML5Api0.currentTime=na;};ma.prototype.removeRotation=function(){"use strict";j.removeClass(this.$VideoPlayerHTML5Api0,"_56jr");j.removeClass(this.$VideoPlayerHTML5Api0,"_56js");j.removeClass(this.$VideoPlayerHTML5Api0,"_56jt");this.$VideoPlayerHTML5Api0.style.marginLeft='';this.$VideoPlayerHTML5Api0.style.marginTop='';this.$VideoPlayerHTML5Api0.style.width='';this.$VideoPlayerHTML5Api0.style.height='';};ma.prototype.applyRotation=function(na){"use strict";if(!na)return;j.conditionClass(this.$VideoPlayerHTML5Api0,"_56jr",na==90);j.conditionClass(this.$VideoPlayerHTML5Api0,"_56js",na==180);j.conditionClass(this.$VideoPlayerHTML5Api0,"_56jt",na==270);if(na==180)return;var oa=this.$VideoPlayerHTML5Api3,pa=this.$VideoPlayerHTML5Api2,qa=(oa-pa)/2,ra=(pa-oa)/2;this.$VideoPlayerHTML5Api0.style.marginLeft=ra+'px';this.$VideoPlayerHTML5Api0.style.marginTop=qa+'px';this.$VideoPlayerHTML5Api0.style.height=pa+'px';this.$VideoPlayerHTML5Api0.style.width=oa+'px';};ma.prototype.switchVideo=function(na){"use strict";if(!this.$VideoPlayerHTML5Api4.videoData||this.$VideoPlayerHTML5Api4.videoData.length<=na)return;this.$VideoPlayerHTML5Apin=new r(this.$VideoPlayerHTML5Api4.videoData[na]);this.$VideoPlayerHTML5Api0.src=this.$VideoPlayerHTML5Apik?this.$VideoPlayerHTML5Apin.getPlayableSrcHD():this.$VideoPlayerHTML5Apin.getPlayableSrcSD();this.$VideoPlayerHTML5Apit();if(this.$VideoPlayerHTML5Apin.hasSubtitles())this.$VideoPlayerHTML5Apiu(this.$VideoPlayerHTML5Apin.getSubtitlesSrc());this.removeRotation();this.applyRotation(this.$VideoPlayerHTML5Apin.getRotation());};ma.prototype.$VideoPlayerHTML5Apit=function(){"use strict";k.setContent(this.$VideoPlayerHTML5Api0,null);};ma.prototype.$VideoPlayerHTML5Apiv=function(){"use strict";Array.prototype.forEach.call(this.$VideoPlayerHTML5Api0.textTracks,function(na){return na.mode='showing';});};ma.prototype.$VideoPlayerHTML5Apiw=function(){"use strict";Array.prototype.forEach.call(this.$VideoPlayerHTML5Api0.textTracks,function(na){return na.mode='hidden';});};ma.prototype.$VideoPlayerHTML5Apix=function(na){"use strict";var oa=new q(na),pa=i.getBlob([oa.renderVTT()],{type:'text/vtt'});return ea.createObjectURL(pa);};ma.prototype.$VideoPlayerHTML5Apiy=function(na){"use strict";var oa=k.create('track',{kind:'captions',src:na});m.listen(oa,'load',function(){if(this.$VideoPlayerHTML5Apig)this.$VideoPlayerHTML5Apiv();}.bind(this));oa.track.mode='hidden';k.appendContent(this.$VideoPlayerHTML5Api0,oa);};ma.prototype.$VideoPlayerHTML5Apiu=function(na){"use strict";if(na in this.$VideoPlayerHTML5Apih)return this.$VideoPlayerHTML5Apiy(this.$VideoPlayerHTML5Apih[na]);if(!ea||!i.isSupported())return;new v(na).setTransportBuilder(z).setMethod('GET').setResponseHandler(function(oa){this.$VideoPlayerHTML5Apih[na]=this.$VideoPlayerHTML5Apix(oa);this.$VideoPlayerHTML5Apiy(this.$VideoPlayerHTML5Apih[na]);}.bind(this)).send();};ma.prototype.unmute=function(){"use strict";this.$VideoPlayerHTML5Api8=false;this.$VideoPlayerHTML5Api0.muted=false;};ma.prototype.mute=function(){"use strict";this.$VideoPlayerHTML5Api0.muted=true;};ma.prototype.setDimensions=function(na,oa){"use strict";this.removeRotation();this.$VideoPlayerHTML5Api2=na;this.$VideoPlayerHTML5Api3=oa;this.applyRotation(this.$VideoPlayerHTML5Apin.getRotation());};ma.prototype.showControls=function(){"use strict";this.$VideoPlayerHTML5Api0.controls=!this.$VideoPlayerHTML5Apie;};ma.prototype.restoreControls=function(){"use strict";this.$VideoPlayerHTML5Api0.controls=this.$VideoPlayerHTML5Apif&&!this.$VideoPlayerHTML5Apie;};ma.prototype.$VideoPlayerHTML5Apij=function(){"use strict";this.$VideoPlayerHTML5Apii.addSubscriptions(m.listen(this.$VideoPlayerHTML5Api0,'playing',this.$VideoPlayerHTML5Apiz.bind(this)),m.listen(this.$VideoPlayerHTML5Api0,'play',this.$VideoPlayerHTML5Apir.bind(this)),m.listen(this.$VideoPlayerHTML5Api0,'ended',this.$VideoPlayerHTML5ApiA.bind(this)),m.listen(this.$VideoPlayerHTML5Api0,'error',this.$VideoPlayerHTML5ApiB.bind(this)),m.listen(this.$VideoPlayerHTML5Api0,'waiting',this.$VideoPlayerHTML5ApiC.bind(this)),m.listen(this.$VideoPlayerHTML5Api0,'pause',this.$VideoPlayerHTML5ApiD.bind(this)),m.listen(this.$VideoPlayerHTML5Api0,'volumechange',this.$VideoPlayerHTML5ApiE.bind(this)),m.listen(this.$VideoPlayerHTML5Api0,'mousedown',this.$VideoPlayerHTML5ApiF.bind(this)),m.listen(this.$VideoPlayerHTML5Api0,'mouseup',this.$VideoPlayerHTML5ApiG.bind(this)),m.listen(this.$VideoPlayerHTML5Api0,'timeupdate',this.$VideoPlayerHTML5ApiH.bind(this)),m.listen(this.$VideoPlayerHTML5Api0,'click',this.$VideoPlayerHTML5ApiI.bind(this)),m.listen(this.$VideoPlayerHTML5Api0,'loadedmetadata',this.$VideoPlayerHTML5ApiJ.bind(this)),m.listen(this.$VideoPlayerHTML5Api0,'progress',this.$VideoPlayerHTML5ApiK.bind(this)));};ma.prototype.$VideoPlayerHTML5ApiK=function(){"use strict";var na=this.$VideoPlayerHTML5Api0.buffered,oa=0,pa=0,qa=na.length;while(qa-->0){var ra=na.end(qa),sa=na.start(qa);if(sa<=this.$VideoPlayerHTML5Api0.currentTime){pa=sa;oa=ra-sa;}}this.$VideoPlayerHTML5ApiL('flash/updateBuffer',{duration:oa,offset:pa});};ma.prototype.$VideoPlayerHTML5ApiH=function(){"use strict";this.$VideoPlayerHTML5ApiL('flash/updateStatus',{position:+this.$VideoPlayerHTML5Api0.currentTime.toFixed(3)});};ma.prototype.$VideoPlayerHTML5ApiI=function(na){"use strict";if(na.button!==0)return;if(this.$VideoPlayerHTML5ApiM){this.pause(t.USER);}else this.play(t.USER);na.preventDefault();na.stopPropagation();};ma.prototype.$VideoPlayerHTML5ApiC=function(){"use strict";this.$VideoPlayerHTML5ApiN=true;this.$VideoPlayerHTML5ApiL('flash/buffering');};ma.prototype.setVolume=function(na){"use strict";this.$VideoPlayerHTML5Api0.volume=na;};ma.prototype.$VideoPlayerHTML5ApiE=function(){"use strict";if(this.$VideoPlayerHTML5Api0.muted!==this.$VideoPlayerHTML5Api7&&this.$VideoPlayerHTML5Api0.volume===this.$VideoPlayerHTML5Api9&&this.$VideoPlayerHTML5Api0.volume>0){if(!this.$VideoPlayerHTML5Api0.muted){this.$VideoPlayerHTML5ApiL('flash/turnOffAutoplay');this.$VideoPlayerHTML5ApiL('flash/unmuteVideo');}else this.$VideoPlayerHTML5ApiL('flash/muteVideo');}else this.$VideoPlayerHTML5ApiL('flash/changeVolume',{volume:this.$VideoPlayerHTML5Api0.volume});this.$VideoPlayerHTML5Api7=this.$VideoPlayerHTML5Api0.muted;this.$VideoPlayerHTML5Api9=this.$VideoPlayerHTML5Api0.volume;};ma.prototype.$VideoPlayerHTML5ApiF=function(na){"use strict";if(na.button===0)this.$VideoPlayerHTML5Apia=true;};ma.prototype.$VideoPlayerHTML5ApiG=function(na){"use strict";if(na.button===0)this.$VideoPlayerHTML5Apia=false;};ma.prototype.$VideoPlayerHTML5Apiz=function(){"use strict";if(this.$VideoPlayerHTML5ApiN){this.$VideoPlayerHTML5ApiN=false;this.$VideoPlayerHTML5ApiL('flash/buffered');}};ma.prototype.$VideoPlayerHTML5Apir=function(){"use strict";this.$VideoPlayerHTML5ApiM=true;this.$VideoPlayerHTML5Apid=false;this.showControls();this.$VideoPlayerHTML5ApiL('flash/beginPlayback',{position:this.getLastStartTimePosition(),reason:this.$VideoPlayerHTML5Apiq});};ma.prototype.$VideoPlayerHTML5ApiD=function(na){"use strict";if(this.$VideoPlayerHTML5Api0.ended)return;if(this.$VideoPlayerHTML5Api0.seeking&&this.$VideoPlayerHTML5Apic===t.SEEK)return;if(this.$VideoPlayerHTML5Apia)return;if(this.$VideoPlayerHTML5Apic===t.SEEK){this.$VideoPlayerHTML5Apic=null;return;}if(this.$VideoPlayerHTML5Apic===null||this.$VideoPlayerHTML5Apic===t.USER)this.$VideoPlayerHTML5ApiL('flash/turnOffAutoplay');this.$VideoPlayerHTML5Apic=null;this.$VideoPlayerHTML5ApiM=false;this.restoreControls();this.$VideoPlayerHTML5ApiL('flash/pausePlayback',{position:this.getLastStartTimePosition()});};ma.prototype.$VideoPlayerHTML5ApiO=function(){"use strict";k.setContent(this.$VideoPlayerHTML5Api0,null);};ma.prototype.$VideoPlayerHTML5ApiA=function(){"use strict";this.restoreControls();this.$VideoPlayerHTML5ApiM=false;this.$VideoPlayerHTML5ApiL('flash/finishPlayback');};ma.prototype.$VideoPlayerHTML5ApiJ=function(){"use strict";this.$VideoPlayerHTML5ApiL('flash/updateMetadata');};ma.prototype.$VideoPlayerHTML5ApiB=function(){"use strict";if(!this.$VideoPlayerHTML5Api0.error)return;this.emit('error',{error:ga(this.$VideoPlayerHTML5Api0.error.code),isPlayback:this.$VideoPlayerHTML5Apid,message:fa(this.$VideoPlayerHTML5Api0.error.code)});};ma.prototype.$VideoPlayerHTML5Apim=function(event,na){"use strict";na.player_version=u.PLEASANTVILLE;this.$VideoPlayerHTML5ApiL('flash/logEvent',{logData:Object.assign({event:event},na)});};ma.prototype.$VideoPlayerHTML5ApiL=function(event,na){"use strict";h.inform(event,Object.assign({divID:this.$VideoPlayerHTML5Api1},na));ba(function(){return this.emit(event.substr('flash/'.length),na);}.bind(this));};ma.prototype.getLastPlayReason=function(){"use strict";return this.$VideoPlayerHTML5Apiq;};ma.prototype.getVideoPlayReason=function(){"use strict";return this.$VideoPlayerHTML5Apip;};ma.prototype.isMuted=function(){"use strict";return this.$VideoPlayerHTML5Api7;};ma.prototype.getPlaybackDuration=function(){"use strict";return this.$VideoPlayerHTML5Api0.duration||0;};ma.prototype.getVolume=function(){"use strict";return this.$VideoPlayerHTML5Api0.volume;};ma.prototype.hasHD=function(){"use strict";if(!this.$VideoPlayerHTML5Apin)return false;return this.$VideoPlayerHTML5Apin.hasHD();};ma.prototype.isHD=function(){"use strict";return this.$VideoPlayerHTML5Apik;};ma.prototype.$VideoPlayerHTML5Apio=function(){"use strict";return this.$VideoPlayerHTML5Apik?this.$VideoPlayerHTML5Apin.getPlayableSrcHD():this.$VideoPlayerHTML5Apin.getPlayableSrcSD();};ma.prototype.toggleSubtitles=function(){"use strict";this.$VideoPlayerHTML5Apig=!this.$VideoPlayerHTML5Apig;if(this.$VideoPlayerHTML5Apig){this.$VideoPlayerHTML5Apiv();}else this.$VideoPlayerHTML5Apiw();};ma.prototype.hasSubtitles=function(){"use strict";return this.$VideoPlayerHTML5Apin.hasSubtitles();};ma.prototype.areSubtitlesActive=function(){"use strict";return this.$VideoPlayerHTML5Apig;};ma.prototype.toggleHD=function(){"use strict";if(!this.$VideoPlayerHTML5Apin)return;var na=this.$VideoPlayerHTML5Api0.currentTime;this.$VideoPlayerHTML5Apik=!this.$VideoPlayerHTML5Apik;this.$VideoPlayerHTML5Api0.src=this.$VideoPlayerHTML5Apio();ca.once(this.$VideoPlayerHTML5Api0,function(){this.$VideoPlayerHTML5Api0.currentTime=na;this.$VideoPlayerHTML5Api0.play();this.emit('qualityChange');}.bind(this));this.$VideoPlayerHTML5Apim(s.PAUSED,{reason:'toggle_hd',video_last_start_time_position:this.getLastStartTimePosition(),video_time_position:na.toFixed(2)});this.$VideoPlayerHTML5Apim(s.REQUESTED_PLAYING,{reason:t.USER});this.$VideoPlayerHTML5Apis();};e.exports=ma;},null);
__d("VideoPlayerApiFactory",["VideoPlayerFlashApi","VideoPlayerHTML5Api"],function(a,b,c,d,e,f,g,h){var i={create:function(j,k){var l=this._getImplementationModule(j);return new l(j,k);},_getImplementationModule:function(j){var k=null;if(j.tagName==='VIDEO'){k=h;}else k=g;return k;},onImplementationReady:function(j,k){var l=this._getImplementationModule(j);l.onImplementationReady(j,function(m){return k(m,l);});}};e.exports=i;},null);
__d("logVideosClickTracking",["clickRefAction"],function(a,b,c,d,e,f,g){function h(i){g('click',i,null,'FORCE');}e.exports=h;},null);
__d("VideoCTAEndscreen",["CSS","Event","VideoPlayerReason","SubscriptionsHandler","VideoPlayerLoggerEvents","VideoPlayerReason","logVideosClickTracking"],function(a,b,c,d,e,f,g,h,i,j,k,l,m){function n(o,p){"use strict";this.$VideoCTAEndscreen0=o;this.$VideoCTAEndscreen1=p.endscreenElement;this.$VideoCTAEndscreen2=p.replayElement;this.$VideoCTAEndscreen3=new j();this.$VideoCTAEndscreen3.addSubscriptions(h.listen(this.$VideoCTAEndscreen2,'click',function(){return this.$VideoCTAEndscreen4();}.bind(this)),o.addListener('finishPlayback',function(){return this.$VideoCTAEndscreen5();}.bind(this)),o.addListener('beginPlayback',function(){return this.$VideoCTAEndscreen6();}.bind(this)));}n.prototype.$VideoCTAEndscreen4=function(){"use strict";var o={reason:i.USER};this.$VideoCTAEndscreen0.logEvent(k.REPLAYED,o);m(this.$VideoCTAEndscreen0.getVideoNode());this.$VideoCTAEndscreen0.play(l.USER);};n.prototype.$VideoCTAEndscreen5=function(){"use strict";g.show(this.$VideoCTAEndscreen1);};n.prototype.$VideoCTAEndscreen6=function(){"use strict";g.hide(this.$VideoCTAEndscreen1);};e.exports=n;},null);
__d("supportsHTML5H264BaselineVideo",["DOM","supportsHTML5Video","memoize"],function(a,b,c,d,e,f,g,h,i){e.exports=i(function(){return h()&&g.create('video').canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"').replace(/no/,'');});},null);