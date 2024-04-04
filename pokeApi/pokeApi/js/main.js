$(document).ready(function () {
    const botonaActivarVoz = document.getElementById("activar-voz");

    const reconocervoz = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!reconocervoz) {
        console.error("El navegador no es compatible con la API de reconocimiento de voz.");
    } else {
        const reconocimiento = new reconocervoz();
        reconocimiento.lang = 'es-ES';

        reconocimiento.onstart = function () {
            console.log("El micrófono está activado");
        }

        reconocimiento.onresult = function (event) {
            const current = event.resultIndex;
            const transcripcion = event.results[current][0].transcript;
            $("#txt-buscar").val(transcripcion);
            buscarPokemon(transcripcion);
        }

        botonaActivarVoz.addEventListener('click', () => {
            reconocimiento.start();
        });

        reconocimiento.onend = function () {
            const transcripcion = $("#txt-buscar").val();
            if (transcripcion.trim() !== '') {
                buscarPokemon(transcripcion);
            }
        };
    }


    $("#boton").on("click", function () {
        var pokemonName = $("#txt-buscar").val();
        if (!pokemonName) {
            alert("Por favor, ingrese un nombre de Pokémon.");
            return;
        }

        $.ajax({
            url: "https://pokeapi.co/api/v2/pokemon/" + pokemonName.toLowerCase(),
            type: "GET",
            contentType: "application/json",
            success: function (data) {
                console.log(data.sprites.other.home.front_default);
                $("#imagen_pokemon").html(`<img src="${data.sprites.other.home.front_default}">`);

                var habilidades = data.abilities.map(function (habilidad) {
                    return habilidad.ability.name;
                }).join(', ');
                var tipo = data.types.map(function (tipo) {
                    return tipo.type.name;
                }).join(', ');
                var movimientos = data.moves.map(function (movimiento) {
                    return movimiento.move.name;
                }).join(', ');
                $("#ficha_tecnica").html(`
                   <div class="blue-box">
                      <p>Nombre: ${data.name} </p>
                   </div>
                   <div class="blue-box">
                     <p>Número de Pokédex:${data.id} </p>
                   </div>
                   <div class="blue-box">
                     <p>Habilidades: ${habilidades}</p>
                  </div>
                  <div class="blue-box">
                     <p>Tipo: ${tipo}</p>
                  </div>
                 <div class="blue-box">
                    <p>Movimientos:${movimientos} </p>
                 </div>
                `);
            },
            error: function (xhr, status, error) {
                if (xhr.status === 404) {
                    alert("El Pokémon buscado no se encuentra en la PokeAPI. Por favor, ingrese otro nombre.");
                } else {
                    alert("Se produjo un error al buscar el Pokémon. Por favor, inténtelo de nuevo más tarde.");
                }
            }
        });
    });

     
});

