  var searchReady=false;
  var lyricsReady=false;
  var showBackground= false;
  var songPlaying=false;
  var updateLyricFunc= null;

  var isShowingSearchScreen = true;

  var title, artist;
  var lyricsParsed = [];
  var counter = 0;
  var lyricElement = $("#lyrics");
  var mic, fft;



$(document).ready(function(){
    searchReady=true;
    $("#singingScreen").hide();
});



function switchView(){
  counter = 0;

  if(isShowingSearchScreen){
    $("#singingScreen").show();
    $("#searchScreen").hide();
    isShowingSearchScreen=false;
    updateLyricFunc = updateLyric;

  }else{
    $("#singingScreen").hide();
    $("#searchScreen").show();

    if(updateLyricFunc){
        clearInterval(updateLyricFunc);
        updateLyricFunc=null;
    }
    lyricElement.html("");

    isShowingSearchScreen=true;
    songPlaying=false;
  }

}



function newSearch(){	

  lyricsParsed = [];

  if(!searchReady) alert("give us a minute to load");
  
   lyricsReady=false;

   title = $("#songSearch").val();
   artist = $("#artistSearch").val();

  if(!title || !artist){

    alert("please input both fields, title and artist");

  }else{

   $.ajax({
    type: "GET",
    data: {
        apikey:"246e71cd28a61ff6770ac93ec828e024",
        q_artist: artist,
        q_track: title,
        format:"jsonp",
        callback:"jsonp_callback"
    },
    url: "http://api.musixmatch.com/ws/1.1/matcher.lyrics.get",
    dataType: "jsonp",
    jsonpCallback: 'jsonp_callback',
    contentType: 'application/json',

    success: function(data) {

        if(data.message.body.lyrics){

          var lyric = data.message.body.lyrics.lyrics_body; 
          parseLyrics(lyric);
          switchView();
        }else{

          alert("no such song "+title+" by "+ artist+ "!");

        }
   
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
    }    
  });

  }

}


function parseLyrics(lyric){
  
   var n = lyric.indexOf("***")-2;
   lyric = lyric.slice(0,n);
  
   lyricsParsed = lyric.split("\n");
   
   lyricsParsed[ lyricsParsed.length - 1 ] = "End of Lyrics";
   
   for(var i=0; i<lyricsParsed.length; i++){

      if (lyricsParsed[i]==""){
        lyricsParsed[i] = " - - - - Interlude - - - - " ;
      }

   }
   lyricsReady=true;

}



function startLyrics(){

    if(!lyricsParsed){
      alert("lyric not ready yet");
      return 0;
    }

    if(songPlaying){
      console.log("song is already playing");
      return 0;
    }

    songPlaying=true;
    showBackground=true;

    counter=0;
    updateLyricFunc.call();
    setInterval(updateLyricFunc, 3000);

}



function updateLyric() {

  lyricElement.html( lyricsParsed[counter] );

  counter++;

  if (counter >= lyricsParsed.length) {
  
     lyricsReady= false;

  }

}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}



function setup() {

   createCanvas(windowWidth,windowHeight);

   noFill();
   mic = new p5.AudioIn();
   mic.start();
   fft = new p5.FFT();
   fft.setInput(mic);



  // // create a sound recorder
  // recorder = new p5.SoundRecorder();

  // // connect the mic to the recorder
  // recorder.setInput(mic);

  // soundFile = new p5.SoundFile();

}



function draw() {

  if( showBackground ){

     background(255);
     var spectrum = fft.analyze();

     // for(var i=0; i< spectrum.length; i++){

     //    console.log(spectrum[i]);


     // }
  }

 

}


