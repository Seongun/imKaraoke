  var searchReady=false;
  var lyricsReady=false;
  var showBackground= false;
  var songPlaying=false;
  var updateLyricId= null;
  var isShowingSearchScreen = true;
  var pitches=[];
  var title, artist;
  var lyricsParsed = [];
  var counter = 0;
  var lyricElement = $("#lyrics");
  var speedElement = $("#speed");
  var mic, fft;
  var speed =3000;
 



$(document).ready(function(){

    for(var i=0; i<1024; i++){
      pitches[i]= new Scribble();
    }

    searchReady=true;


});



function switchView(){

  counter = 0;

  if(isShowingSearchScreen){

    $("#singingScreen").show();
    $("#searchScreen").hide();
    isShowingSearchScreen=false;
    $("#yourSong").html(title);
    $("#yourArtist").html(artist);

  }else{

    $("#singingScreen").hide();
    $("#searchScreen").show();
    $("#startLyricsButton").show();
    $("#instructions").show();

    isShowingSearchScreen=true;

    if(updateLyricId){
        clearInterval(updateLyricId);
        updateLyricId=null;
    }
    lyricElement.html( "" );
    speedElement.html("");
    songPlaying=false;
    showBackground=false;
  }

}



function newSearch(){	
   $("#returnButton").css("opacity", "1");


  lyricsParsed = [];

  if(!searchReady){
    alert("give us a minute to load");
    return null;
  }else{


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


    if (confirm('Are you sure you want to give your eyes spasms?')) {
      if (confirm('Are you sure sure?')) {
         if (confirm("Okay...but you can't say I didn't warn you!")) {

        $("#returnButton").css("opacity", "");

        if(!lyricsParsed){
          alert("lyric not ready yet");
          return 0;
        }

        if(songPlaying){
          console.log("song is already playing");
          return 0;
        }
        lyricElement.html("Get Ready, lyrics are loading soon.<br> Press <- , -> to decrease & increase lyrics' speed!");
        speedElement.html("Speed: " + (6000-speed).toString() );

        songPlaying=true;
        showBackground=true;
        speed = 3000;
        counter=0;


        if(updateLyricId){
            clearInterval(updateLyricId);
            updateLyricId=null;
        }
        updateLyricId = setInterval(updateLyric, speed);
        $("#startLyricsButton").hide();
         $("#instructions").hide();



           }
        }
    }
    
}


function updateLyric() {
  console.log("updateLyric");

  lyricElement.html( lyricsParsed[counter] );

  counter++;

  if (counter >= lyricsParsed.length) {
  
     lyricsReady= false;
     showBackground=false;
     if(updateLyricId){
       clearInterval(updateLyricId);
     }
     updateLyricFunc=null;
     console.log("we're done");
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

function keyPressed() {
  if(updateLyricId){

      if (keyCode === LEFT_ARROW && songPlaying && speed < 6000) {
            console.log("changing speed");

          speed +=100;
           clearInterval(updateLyricId);
           updateLyricId = setInterval(updateLyric, speed);
          speedElement.html("Speed: " + (6000-speed).toString() );

      } else if (keyCode === RIGHT_ARROW && speed > 0) {
            console.log("changing speed");

          speed -=100;  
          clearInterval(updateLyricId);
          updateLyricId = setInterval(updateLyric, speed );
               speedElement.html("Speed: " + (6000-speed) );

      }

     

  }
  
}



function draw() {

       var r = random(50);
      //  var g,b;
      // background(r*5);
       var g = random(50);
       var b = random(50);
       background(r*5, b*5, g*5);
    if(showBackground){
      

     var spectrum = fft.analyze();
     var temp=0;

     for(var i=0; i<spectrum.length; i++){
          

        temp+=spectrum[i];

        if(i%3==0){
           r = random(windowWidth);
           g = random(windowHeight);
           if(i%2==0){

             pitches[i].scribbleEllipse( r, g, b, temp);

           }else{

             pitches[i].scribbleEllipse( r, g, temp, b);

           }
        }
        if(i%4==0){

           r = random(50);
           g = random(50);
           b = random(50);

           pitches[i].scribbleLine(i * windowWidth/1024, windowHeight, i* windowWidth/1024, windowHeight - temp );
          
           stroke(r*5, g*5, b*5);
           var w = random(4);
           strokeWeight(w);
           temp=0;
        } 

       // pitches[i].scribbleLine(i * windowWidth/1024, windowHeight, windowWidth/1024, windowHeight- spectrum[i]*50);
     }
     // scribble.scribbleLine( x1, y1, x2, y2 );

     // for(var i=0; i< spectrum.length; i++){

     //    console.log(spectrum[i]);


     // }
  

 
   }else{
    background(255);
   }
}


