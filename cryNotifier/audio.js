navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||     navigator.mozGetUserMedia || navigator.msGetUserMedia;

var audio = document.querySelector('audio');

if (navigator.getUserMedia) {
    navigator.getUserMedia({
        audio: true,
        video: false
    }, function (stream) {
       audio.src = window.URL.createObjectURL(stream);
    }, onFailSoHard);
} else {
    alert("sorry, not supported in your browser");
}