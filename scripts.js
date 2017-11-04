var lyricsReady=false;


script = document.createElement("script");
script.type = "text/javascript";
script.src = "https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?format=jsonp&callback=callback&q_track=love%20the%20way%20you%20lie&q_artist=eminem&apikey=246e71cd28a61ff6770ac93ec828e024";




var title, artist;
var lyricsParsed = [];

var counter = 0;
var lyricElement = $("#lyrics");


setInterval(updateLyric, 3000);



function newSearch(){	
 lyricsReady=false;
 title = "love the way you lie";
 artist = "eminem";

}



function callback(dataReceived){

		console.log( dataReceived ); // server response
        lyricsReady=true;
        updateLyric();
}


function updateLyric() {

  lyricElement.html( lyricsParsed[counter] );

  counter++;
  if (counter >= lyricsParsed.length) {
    lyricsReady= false;
  }
}

