var nomeCanal = 'jovemnerd';
var upload_id;

$(document).ready(function() {
    console.log("meuscript carregado")
    $.get("https://www.googleapis.com/youtube/v3/channels", {
            part: 'contentDetails',
            forUsername: nomeCanal,
            key: 'AIzaSyDR4h45cOPOl8DbtpwSa4erUuO6SaEQW_U'},
            function(data) {
                console.log(data)
                // upload_id = data.items[0].contentDetails.relatedPlaylists.uploads;
                // pegarVideos(upload_id);
            }
    )
});