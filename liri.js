require("dotenv").config();
const keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");

const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);

function commandLine() {
    if (process.argv[2] === "my-tweets") {
        client.get('statuses/user_timeline', function (error, tweets, response) {            
            if (!error) {
                //would like to .map this later
                for (var i = 0; i < tweets.length; i++) {
                    const tweet = tweets[i].text
                    console.log(tweet);
                }
            } else return console.log(error);
        });        
        return
    } if (process.argv[2] === "spotify-this-song") {
        const searchSong = process.argv[3];
        if (searchSong === undefined) {
            return console.log("Please enter a song title..");
        } if (searchSong) {
            return spotifySearch(searchSong);
        }
    } if (process.argv[2] === "movie-this") {
        let searchMovie = process.argv[3];

        if (searchMovie === undefined) {
            searchMovie = "Mr. Nobody";
            imdbSearch(searchMovie);
            return;
        }
        imdbSearch(searchMovie);
        return
    } if (process.argv[2] === "do-what-it-says") {
        fs.readFile("random.txt", "utf-8", function (error, data) {
            if (!error) {
                const splitData = data.split(",");
                let searchSong = splitData[1]
                spotifySearch(searchSong);
            }
        })

    } else
        console.log
            ("**Not a valid command.. \n \
             Commands[my-tweets; spotify-this-song 'song name'; movie-this 'movie name'; do-what-it-says;]");

}//function close

function spotifySearch(searchSong) {
    spotify.search({ type: "track", query: searchSong }, function (error, data) {        
        if (!error) {
            let info = {
                Artist: data.tracks.items[0].album.artists[0].name,
                Track: data.tracks.items[0].name,
                Link: data.tracks.items[0].preview_url,
                Album: data.tracks.items[0].album.name
            }
            return console.log(info);

        } else return console.log(error.error);
    })
    return console.log(searchSong);
}//function close

function imdbSearch(searchMovie) {
    const apikey = "trilogy";
    request(`http://www.omdbapi.com/?t=${searchMovie}&y=&plot=short&apikey=${apikey}`,
        function (error, response, body) {
            // console.log(JSON.parse(body));
            if (!error) {
                let info = {
                    Title: JSON.parse(body).Title,
                    Year: JSON.parse(body).Year,
                    IMDBRating: JSON.parse(body).Ratings[0].Value,
                    RottenTomatoesRating: JSON.parse(body).Ratings[1].Value,
                    Country: JSON.parse(body).Country,
                    Language: JSON.parse(body).Language,
                    Plot: body.Plot,
                    Actors: body.Actors
                }
                return console.log(info);
            } else console.log(error);
        });
}//function close

commandLine();