client_id = "4f28b84aa5e37d60c6b6978d99a6c632";

var AudioContext, audio, audioContext, source, analyser, dataArray, sourceBuffer;
var analyserMethod = "getByteFrequencyDomainData";
var streamURL;

addEventListeners = function() {
  $('#load-it').click(function(){
    url = $('#url-input').val();
    grab_track_json(url);
    console.log('loading');
  });
  console.log('added');
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
  try {
    AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
    audio = new Audio();
    audio.crossOrigin = "anonymous";
    audioContext = new AudioContext();
    // source = audioContext.createMediaElementSource(audio);
    // source = audioContext.createBufferSource();
    // audioContext.decodeAudioData(audio, )
    // source.connect(sourceBuffer);
    // sourceBuffer.connect(audioContext.destination);
    // analyser = audioContext.createAnalyser();
    // source.connect(analyser);
    $('#play-button').show();
    $('#play-button').click(function(){
      // SHOW SPINNER
      $('#play-button').prop('disabled', true);
      source = audioContext.createBufferSource();
      request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';
      request.onload = function() {
        // HIDE SPINNER
        var audioData = request.response;
        audioContext.decodeAudioData(audioData, function(buffer){
          myBuffer = buffer;
          source.buffer = myBuffer;
          source.playbackRate.value = 1;
          source.connect(audioContext.destination);
        });
      };
      request.send();
      source.start(0);
      // audio.src = url;
      // audio.play();
    });
    $('#pause-button').show();
    $('#pause-button').click(function(){
      audio.pause();
    });
    $('#playback-speed').change(function(){
      new_speed = $(this).val();
      source.playbackRate.value = parseFloat(new_speed);
      console.log(new_speed);
    });
  }
  catch(e) {
    alert('uh oh - nxc tool isnt supported on this browser. can you try chrome?');
  }

};



$(document).ready(function(){
  addEventListeners();
});
