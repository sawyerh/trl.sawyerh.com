
var Video=(function(){"use strict";var videoId;var player;var provider;var permalink;var playerElement=document.getElementById('player');var Module={init:function(options){if(options.video.youtube){videoId=options.video.youtube;provider='youtube';}else if(options.video.vimeo){videoId=options.video.vimeo;provider='vimeo';}
embed();},destroy:function(){if(provider=='youtube'){player.destroy();}}}
function embed(){playerElement.innerHTML='';if(provider=='youtube'){createYoutube();}else if(provider=='vimeo'){createVimeo();}}
function videoEnded(){$(window).trigger('videoEnded');}
function createYoutube(){var ytWrap=document.createElement('div');playerElement.appendChild(ytWrap);player=new YT.Player(ytWrap,{videoId:videoId,origin:window.location.origin,rel:0,playerVars:{"showinfo":0,"color":"white","rel":0,"autoplay":1,"iv_load_policy":3,"controls":0},events:{"onReady":youtubeReady,"onStateChange":youtubeStateChange}});}
function youtubeReady(){player.setVolume(100);}
function youtubeStateChange(e){if(e.data==YT.PlayerState.ENDED){videoEnded();}}
function post(action,value){var data={method:action};var url=player.getAttribute('src').split('?')[0]
if(value){data.value=value;}
player.contentWindow.postMessage(JSON.stringify(data),url);}
function createVimeo(){var iframeURL="http://player.vimeo.com/video/"+videoId+"?api=1&player_id=vimeoplayer&color=ffffff&autoplay=1&byline=0&portrait=0&title=0";var iframe=document.createElement('iframe');iframe.setAttribute('src',iframeURL);iframe.setAttribute('frameborder',0);iframe.setAttribute('width',500);iframe.setAttribute('height',281);iframe.setAttribute('webkitAllowFullScreen',true);iframe.setAttribute('mozallowfullscreen',true);iframe.setAttribute('allowFullScreen',true);playerElement.appendChild(iframe);player=iframe;setupVimeoEvents();}
function setupVimeoEvents(){window.addEventListener('message',vimeoMessageReceived,false);}
function vimeoMessageReceived(e){var data=JSON.parse(e.data);switch(data.event){case'ready':post('addEventListener','finish');post('setVolume',1);break;case'finish':videoEnded();break;}}
return Module;}());var App=(function(){"use strict";var currentVideoIndex;var currentVideo;var videos;var Module={init:function(options){videos=options.videos;var randomVideoIndex=Math.floor(Math.random()*videos.length);createVideo(randomVideoIndex);$(window).on('videoEnded',function(){videoEnded();});}}
function createVideo(i){console.log(videos[i]);if(currentVideo){currentVideo.destroy;}
currentVideo=Object.create(Video);currentVideo.init({video:videos[i]});currentVideoIndex=i;}
function nextVideo(){createVideo(currentVideoIndex+1);}
function videoEnded(){if(currentVideoIndex==videos.length-1){createVideo(0);}else{nextVideo();}}
return Module;}());var app;function onYouTubeIframeAPIReady(){app=Object.create(App);app.init({videos:videos});}