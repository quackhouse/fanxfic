client_id = "4f28b84aa5e37d60c6b6978d99a6c632";

var AudioContext, audio, audioContext, source, analyser, dataArray, sourceBuffer;
var sourceJs, array;
var analyserMethod = "getByteFrequencyDomainData";
var streamURL;
var playing = false;
var dataArray;

addEventListeners = function() {
  $('#load-it').click(function(){
    $('.spinner').show();
    if(playing) {
      stopPlay();
    } else {
      url = $('#url-input').val();
      grab_track_json(url);
      console.log('loading');
    }
  });
  console.log('added');
};

stopPlay = function(){
  $('.play-pause').hide();
  $('#play-button').unbind();
  $('#stop-button').unbind();
  $('#play-button').prop('disabled', false);
  $('#playback-speed').prop('value', 1);
  $('.speed').html(1);
  source.stop();
  playing = false;
  url = $('#url-input').val();
  grab_track_json(url);
};

parse_url = function(url) {
  partially_parsed = url.split('/').join('%2');
  parsed_url = partially_parsed.split(':').join('%3');
  return parsed_url;
};

grab_track_json = function(parsed_url) {
  get_url = "https://api.soundcloud.com/resolve.json?url=" + parsed_url + "&client_id=" + client_id;
  json_data = undefined;
  $.ajax({
    url: get_url
  }).done(function(data){
    console.log(data);
    init_stream(data);
  });
};

get_url_from_json = function(json_data) {
  // track_data = JSON.parse(json_data);
  stream_url = json_data.stream_url + "?client_id=" + client_id;
  console.log(stream_url);
  return stream_url;
};

init_stream = function(json_data) {
  url = get_url_from_json(json_data);
  console.log(url);
  if(!playing) {
    try {
      console.log('trying new audio context');
      AudioContext = window.AudioContext || window.webkitAudioContext;
      context = new AudioContext();
      audio = new Audio();
      audio.crossOrigin = "anonymous";
      audioContext = new AudioContext();
      playing = true;
      // source = audioContext.createMediaElementSource(audio);
      // source = audioContext.createBufferSource();
      // audioContext.decodeAudioData(audio, )
      // source.connect(sourceBuffer);
      // sourceBuffer.connect(audioContext.destination);
      // analyser = audioContext.createAnalyser();
      // source.connect(analyser);
      $('#play-button').click(function(){
        console.log('clicked play');
        // SHOW SPINNER
        $('.spinner').show();
        $('#play-button').prop('disabled', true);
        source = audioContext.createBufferSource();
        request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        request.onload = function() {
          // HIDE SPINNER
          $('.spinner').hide();
          $('#playback-speed').prop('value', 1);
          $('.speed').html(1);
          var audioData = request.response;
            audioContext.decodeAudioData(audioData, function(buffer){
            myBuffer = buffer;
            analyser = audioContext.createAnalyser();
            sourceJs = audioContext.createScriptProcessor(2048, 1, 1);
            sourceJs.buffer = buffer;
            sourceJs.connect(audioContext.destination);
            analyser.smoothingTimeConstant = 0.6;
            analyser.fftSize = 512;
            source.connect(analyser);
            analyser.connect(sourceJs);
            source.buffer = myBuffer;
            source.playbackRate.value = 1;
            source.connect(audioContext.destination);
            sourceJs.onaudioprocess = function(e) {
              array = new Uint8Array(analyser.frequencyBinCount);
              analyser.getByteFrequencyData(array);
              startVisuals();
            };
          });

        };
        request.send();
        source.start(0);
        // audio.src = url;
        // audio.play();
      });
      $('#pause-button').click(function(){
        source.stop();
        $('#play-button').prop('disabled', false);
        $('#playback-speed').prop('value', 1);
          $('.speed').html(1);
      });
      $('#playback-speed').change(function(){
        new_speed = $(this).val();
        source.playbackRate.value = parseFloat(new_speed);
        console.log(new_speed);
        $('.speed').html(new_speed);
      });
      $('.spinner').hide();
      $('.play-pause').css({
        'display': 'flex'
      });
    }
    catch(e) {
      alert('uh oh - nxc tool isnt supported on this browser. can you try chrome?');
    }

  }
};

startVisuals = function() {

  // use array, go thru array k
  for(var i = 0, len = array.length; i < len; i++) {
    console.log(array[i]);
  }

  // window.requestAnimationFrame(startVisuals);
};

$(document).ready(function(){
  addEventListeners();
});
