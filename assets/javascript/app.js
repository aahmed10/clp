jQuery.ajaxPrefilter(function (options) {
  if (options.crossDomain && jQuery.support.cors) {
    options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
  }
});

//initialize variables
var latitude = 0;

var longitude = 0;

//gets brewery
var queryURLrandom = "http://api.brewerydb.com/v2/brewery/random?key=35eff59e52d0da84d5ba657eab46cc81&countryIsoCode=US";

var queryUrlBrewery = "";

var queryUrlBreweryLoc = "";
//gets breweries in radius
var queryURLradius = "http://api.brewerydb.com/v2/search/geo/point?lat=" + latitude + "&lng=" + longitude + "&key=35eff59e52d0da84d5ba657eab46cc81";

var queryURLbeers = "";

var breweryId = "";

var breweryResult;

var brewLat = 0;

var brewLng = 0;

$(document).ready(function () {
  // AJAX get beers
  //gets beers at brewery

  //getting the brewery info
randomBrewery();

$("#logo").on("click", function(){
  randomBrewery();
})

});

   function randomBrewery(){
    $.ajax({
        url: queryURLrandom,
        method: "GET"
      }).done(function (response) {
        randomResult = response.data;
        breweryId = randomResult.id;
        brewLoc(breweryId);

   });

    }

function brewLoc(bId){

queryUrlBreweryLoc = "http://api.brewerydb.com/v2/brewery/" + bId + "/locations?key=35eff59e52d0da84d5ba657eab46cc81";

 $.ajax({
          url: queryUrlBreweryLoc,
          method: "GET"
        }).done(function (response) {
          var breweryLocResult = response.data;
          console.log(breweryLocResult);

          if (breweryLocResult[0] === undefined){
              brewLat = breweryLocResult.latitude;
              brewLng = breweryLocResult.longitude;
             } else if (breweryLocResult[0] != undefined){
              brewLat = breweryLocResult[0].latitude;
              brewLng = breweryLocResult[0].longitude;
          }
          console.log(brewLat+" "+brewLng);

          
          getBreweryInfo(bId);

        });

      }

function getBreweryInfo(bId){

  initMap();

queryUrlBrewery = "http://api.brewerydb.com/v2/brewery/" + bId + "?key=35eff59e52d0da84d5ba657eab46cc81";
    $.ajax({
        url: queryUrlBrewery,
        method: "GET"
      }).done(function (response) {
        var breweryResult = response.data;

  if (breweryResult.name === undefined){
      randomBrewery();
    } else if (breweryResult.images === undefined){
      randomBrewery();
    } else {
      $("#brewery-name").text(breweryResult.name);
      $("#brewery-img").html("<img src='" + breweryResult.images.squareMedium + "'>");
    };

    if (breweryResult.description === undefined){
      $("#brewery-desc").html();
    } else {
      $("#brewery-desc").html("<p>" + breweryResult.description +"</p>");
    };

    if (breweryResult.website === undefined){
      $("#brewery-website").html();
    } else {
      $("#brewery-website").html("<p>Website: <a href='"+breweryResult.website+"'>"+breweryResult.name + "</a></p>");
    }  
     getBeers(bId);
  });
};

function getBeers(bId){
  queryURLbeers = "http://api.brewerydb.com/v2/brewery/" + bId + "/beers?key=35eff59e52d0da84d5ba657eab46cc81";
        $.ajax({
          url: queryURLbeers,
          method: "GET"
        })
                // After the data comes back from the API
                .done(function (response) {
                    // Storing an array of results in the results variable
                    var results = response.data;
                    console.log(results);

                    for (var i = 0; i < results.length; i += 1) {
                      if (results[i].labels != undefined) {
                        $("#beer-list").append("<div class = 'col-4'><img id = 'beer-" + i + "' src = '" + results[i].labels.medium + "'><br><p>" + results[i].name + "</p></div>");
                      } else {
                        $("#beer-list").append("<div class = 'col-4'><img id = 'beer-" + i + "' src = 'assets/images/beer_PNG2388.png'><br><p>" + results[i].name + "</p></div>");
                      }
                    }
                  });
}


  //insert google maps stuff

  function initMap() {
    var myLatLng = {lat: brewLat, lng: brewLng};
    console.log(myLatLng);

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      center: myLatLng
    });

    var marker = new google.maps.Marker({
      position: myLatLng,
      map: map

      

    });
var infoWindow = new google.maps.InfoWindow({
  position: myLatLng,
  map: map,
  content: randomResult.name
})

  }






