var nomeCanal = 'jovemnerd';
var upload_id;
const API_KEY = 'AIzaSyDR4h45cOPOl8DbtpwSa4erUuO6SaEQW_U'
const CLIENT_ID_OAUTH = '362539803504-ggrq7ip7u9aaal9si92d4e0g3qgi5d7g.apps.googleusercontent.com'

$(document).ready(function () {
    console.log("meuscript carregado")

    $.get("https://www.googleapis.com/youtube/v3/channels", {
        part: 'contentDetails',
        forUsername: nomeCanal,
        key: API_KEY
    },
        function (data) {
            pegarVideos(getUploadID(data)).then($('#loadingDiv').css({ backgroundColor: 'rgb(51, 200, 0)' }))
        }
    );
    $('.fancybox').fancybox();
    $('.fancybox-media').attr('rel','media-galery').fancybox({
        arrows: false,
        'maxWidth': 720,
        'width': 720,
        'maxHeigth': 480,
        'heigth': 480,
        'helpers': {
            media:{},
            buttons: {}
        }
    })
    function getUploadID(data) {
        return new Promise(resolve => {
            resolve(upload_id = data.items[0].contentDetails.relatedPlaylists.uploads)
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
    async function pegarVideos(listId) {
        $.get("https://www.googleapis.com/youtube/v3/playlistItems", {
            part: 'snippet',
            maxResults: 9,
            playlistId: await listId,
            key: API_KEY
        },
            function (data) {
                let videoData = { imagem: '', arquivo: '', titulo: '', desc: '', dataPub: '', videoID: '' }
                console.log(data)
                $.each(data.items, function (i, item) {
                    videoData.titulo = item.snippet.title
                    videoData.desc = item.snippet.description
                    videoData.dataPub = formatarData(item.snippet.publishedAt)
                    videoData.imagem = item.snippet.thumbnails.medium.url

                    videoData.arquivo = `<li class="principal"><div class="foto"><img src="${videoData.imagem}" /><div class="legenda"><h5>${videoData.titulo}</h5><p>${videoData.desc}</p><p class="dataPub">Data: ${videoData.dataPub}</p></div></div></li>`
                    $('#janela ul').append(videoData.arquivo)

                })
            })
    }

    $('#get_uploadID').click(() => getUploadID())
    $('#get_playlistItem').click(() => pegarVideos())
});