var nomeCanal = 'jovemnerd';
var upload_id;
const API_KEY = 'AIzaSyDR4h45cOPOl8DbtpwSa4erUuO6SaEQW_U'
const CLIENT_ID_OAUTH = '362539803504-ggrq7ip7u9aaal9si92d4e0g3qgi5d7g.apps.googleusercontent.com'

$(document).ready(function() {
    console.log("meuscript carregado")
    $('.fancybox').fancybox();
    $('.fancybox-media').attr('rel', 'media-gallery').fancybox({
        arrows: false,
        maxWidth: 720,
        width: 720,
        maxHeight: 480,
        height: 480,
        helpers: {
            media: {},
            buttons: {}
        }
    })

    function pegarIdCanal(nomeUsuarioDoCanal) {
        const userName = nomeUsuarioDoCanal
        $.get("https://www.googleapis.com/youtube/v3/channels", {
                part: 'contentDetails',
                forUsername: userName,
                key: API_KEY
            },
            function(data) {
                let idPlayList = data.items[0].contentDetails.relatedPlaylists.uploads
                pegarVideos(idPlayList)
            }
        );
    }

    function pegarVideos(idDaPlaylist) {
        $.get("https://www.googleapis.com/youtube/v3/playlistItems", {
                part: 'snippet',
                maxResults: 3,
                playlistId: idDaPlaylist,
                key: API_KEY
            },
            function(data) {
                let videoData = { imagem: '', arquivo: '', titulo: '', desc: '', dataPub: '', videoID: '' }
                console.log(data)
                $('li').remove()
                $.each(data.items, function(i, item) {
                    videoData.videoID = item.snippet.resourceId.videoId
                    videoData.titulo = item.snippet.title
                    videoData.desc = item.snippet.description
                    videoData.dataPub = formatarData(item.snippet.publishedAt)
                    videoData.imagem = item.snippet.thumbnails.medium.url

                    videoData.arquivo = `<li class="principal"><a class="fancybox-media" rel="media-gallery" href="https://www.youtube.com/watch?v=${videoData.videoID}"><div class="foto"><img src="${videoData.imagem}" /><div class="legenda"><h5>${videoData.titulo}</h5><p>${videoData.desc}</p><p class="dataPub">Data: ${videoData.dataPub}</p></div></div></a></li>`
                    $('#janela ul').append(videoData.arquivo)

                })
            })
    }

    function formatarData(data) {
        let dataCrua = data
        let dataNova = new Date(dataCrua.slice(0, 10).replace('-', ',').replace('-', ','))
        let dia = dataNova.getDay();
        let mes = dataNova.getMonth();
        let ano = dataNova.getFullYear();

        function colocarZeroNaFrente(numero) {
            if (numero > 10) {
                return numero + 1
            } else {
                return `0${numero + 1}`
            }
        }
        let dataFormatada = `${colocarZeroNaFrente(dia)}/${colocarZeroNaFrente(mes)}/${colocarZeroNaFrente(ano)}`
        return dataFormatada
    }

    function getNome_canal() {
        $('#form_canal').submit(e => e.preventDefault())
        nomeCanal = $("#nome_canal").val()
        console.log(nomeCanal)
        pegarIdCanal(nomeCanal)
    }

    $('#getNome_canal').click(() => getNome_canal())
});