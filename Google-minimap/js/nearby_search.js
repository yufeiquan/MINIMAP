$(function() {
    var DEFAULT_ZOOM = 15;
    var GOOGLE_API_KEY = 'AIzaSyDMHhUmJYxgR9e4ZZ_OHW18r7D4fJVDrfc';
    var DETAIL_INFO_ROWS = {
        adr_address: 'place',
        website: 'public',
        formatted_phone_number: 'call'
    };
    var DEFAULT_DETAIL_INFO_ROWS = {
        flag: 'Add a label',
        create: 'Suggest an edit',
        verified_user: 'Claim the business'
    }
    var position = {
        lat: 37.773972,
        lng: -122.43129
    };

    var current_infowindow;
    var markers_shown;

    function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: DEFAULT_ZOOM,
            center: position,
            mapTypeControlOptions: {
                position: google.maps.ControlPosition.BOTTOM_RIGHT
            }
        });

        map.addListener('idle', function(ev) {
            position.lat = this.getCenter().lat();
            position.lng = this.getCenter().lng();
        });

        $('.place-info-visibility-toggle').on('click', function() {
            $('#place-info-wrapper').toggleClass('invisible');
            $('#place-info-wrapper .triangle-icon').toggleClass('left');
        });

        var search_bar = new SearchBar(function(keyword) {
            var params = {
                 'location': new google.maps.LatLng(position.lat, position.lng),
                 'radius': 500,
                 'keyword': keyword
            };
            getNearByPlaces(map, params);
        });
        search_bar.addTo($('#place-info-wrapper'));
    };

    function showDetailedInfo(place) {
        var params = {
            placeId: place['place_id']
        };
        service.getDetails(params, function(place) {
            $('#hero-header-wrapper img').removeAttr('src');

            if (place.photos) {
                $('#hero-header-wrapper img').attr('src', place.photos[0].getUrl({'maxWidth': 408, 'maxheight': 407}));
            }
            $('.place-name').text(place['name']);
            var rating = parseFloat(place['rating']).toFixed(1);
            $('.place-review-score').text(rating);
            for (i = 0; i < Math.floor(rating); i++) {
                $('.place-review-stars-wrapper').append('<i class="material-icons" style="font-size:14px">star</i>');
            }
            if (rating % 1 > 0.5) {
                $('.place-review-stars-wrapper').append('<i class="material-icons" style="font-size:14px">star_half</i>');
            }
            $('.place-type').text(place['types'][0]);
            $('#place-info-wrapper').addClass('is-active');

            _.each(DETAIL_INFO_ROWS, function(value, key) {
                if (key in place) {
                    $('.place-info-details').append(
                        '<div class="place-info-details-row">' +
                            '<i class="place-info-details-icon material-icons" style="font-size:20px">' + value + '</i>' +
                            '<div class="place-info-details-description">' + place[key] + '</div>' +
                        '</div>'
                    );
                }
            }, this);

            _.each(DEFAULT_DETAIL_INFO_ROWS, function(value, key) {
                $('.place-info-details').append(
                    '<div class="place-info-details-row">' +
                        '<i class="place-info-details-icon material-icons" style="font-size:20px">' + key + '</i>' +
                        '<div class="place-info-details-description">' + value + '</div>' +
                    '</div>'
                );
            }, this);

            $('.loading-view-wrapper').removeClass('visible');
            $('.place-info-content-wrapper').addClass('visible');
        });
    };

    function getNearByPlaces(map, params) {
        if (markers_shown) {
            _.each(markers_shown, function(marker) {
                marker.setMap(null);
            });
        }
        markers_shown = [];

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(params, function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                _.each(results, function(place) {
                    var marker = new google.maps.Marker({
                        position: {
                            'lat': place.geometry.location.lat(),
                            'lng': place.geometry.location.lng()
                        },
                        map: map,
                        title: place.name
                    });
                    var infowindow_content = '<div id="content">' +
                                            '<h1 id="firstHeading" class="firstHeading">' + place.name + '</h1>'+
                                             '</div>';
                    var infowindow = new google.maps.InfoWindow({
                        content: infowindow_content
                    });

                    marker.addListener('click', function() {
                        if (current_infowindow) {
                            current_infowindow.close();
                        }
                        infowindow.open(map, marker);
                        current_infowindow = infowindow;

                        showDetailedInfo(place);

                        $('.place-review-stars-wrapper').empty();
                        $('.place-info-details').empty();

                        $('.loading-view-wrapper').addClass('visible');
                        $('.place-info-content-wrapper').removeClass('visible');
                    });

                    markers_shown.push(marker);
                });
            }
        });
    }

    function dismissDetailedInfo() {
        $('#place-info-wrapper').removeClass('is-active');
    }

    initMap();
});
