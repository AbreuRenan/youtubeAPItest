var nomeCanal = 'jovemnerd';
var upload_id;
const API_KEY = ''
const CLIENT_ID_OAUTH = ''

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

    function getIDbyName(nomeUsuarioDoCanal) {
        const userName = nomeUsuarioDoCanal
        $.get("https://www.googleapis.com/youtube/v3/channels", {
                part: 'contentDetails',
                forUsername: userName,
                key: API_KEY
            },
            function(data) {
                let idPlayList = data.items[0].contentDetails.relatedPlaylists.uploads
                getSnippet(idPlayList)
            }
        );
    }

    function getStatistics(videoId) {
        let stats = {
            comments: "",
            dislikes: "",
            favorites: "",
            likes: "",
            views: "",
        }
        $.get("https://www.googleapis.com/youtube/v3/videos", {
                part: 'statistics',
                id: videoId,
                key: API_KEY
            },
            function(data) {
                stats.comments = data.items[0].statistics.commentCount
                stats.dislikes = data.items[0].statistics.dislikeCount
                stats.favorites = data.items[0].statistics.favoriteCount
                stats.likes = data.items[0].statistics.likeCount
                stats.views = data.items[0].statistics.viewCount

                console.log(stats)
            }
        )
    }

    function getSnippet(idDaPlaylist) {
        $.get("https://www.googleapis.com/youtube/v3/playlistItems", {
                part: 'snippet',
                maxResults: 3,
                playlistId: idDaPlaylist,
                key: API_KEY
            },
            function(data) {
                console.log(data)
                $('li').remove()
                $.each(data.items, function(i, item) {
                    let videoData = { imagem: '', arquivo: '', titulo: '', desc: '', dataPub: '', videoID: '' }
                    let a = item.snippet.resourceId.videoId
                    videoData.videoID = item.snippet.resourceId.videoId
                    videoData.titulo = item.snippet.title
                    videoData.desc = item.snippet.description
                    videoData.dataPub = formatarData(item.snippet.publishedAt)
                    videoData.imagem = item.snippet.thumbnails.medium.url

                    videoData.arquivo = `<li id="${videoData.videoID}" class="principal"><a class="fancybox-media" rel="media-gallery" href="https://www.youtube.com/watch?v=${videoData.videoID}"><div class="foto"><img src="${videoData.imagem}" /><div class="legenda"><h5>${videoData.titulo}</h5><p>${videoData.desc}</p><p class="dataPub">Data: ${videoData.dataPub}</p></div></div></a></li>`
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

    function getInput_nomeCanal() {
        $('#form_canal').submit(e => e.preventDefault())
        nomeCanal = $("#nome_canal").val()
        console.log(nomeCanal)
        getIDbyName(nomeCanal)
    }

    $('#getNome_canal').click(() => getInput_nomeCanal())


});