

const maximos_intentos=8,
    columnas=6,
    segundos_voltear_imagen=1,
    NOMBRE_IMAGEN_OCULTA="./image/mono.png";

 new Vue({
    el:'#app',
    data: () =>({
        imagenes:[
            "./image/amor.png",
           "./image/angel.png",
           "./image/beso.png",
           "./image/besocorazon.png",
           "./image/bocabajo.png",
           "./image/duda.png",
           "./image/feliz.png",
           "./image/lengua.png",
           "./image/lenguis.png",
           "./image/loco.png",
           "./image/ojos.png",
           "./image/pensar.png",
        ],
        memorama:[],
        ultimasCoordenadas:{
            indiceFila: null,
            indiceImagen: null
        },
        NOMBRE_IMAGEN_OCULTA: NOMBRE_IMAGEN_OCULTA,
        maximos_intentos: maximos_intentos,
        intentos: 0,
        aciertos: 0,
        esperandoTimeout: false,
    }),
    methods:{
        indicarFracaso() {
            swal.fire({
                    title:"Perdiste",
                    html://html
                    `
                     <img class="img-fluid" src="./image/descarga.jpeg" alt="perdiste">
                     <p class="h4">Terminaron tus intentos</p>       
                    `,
                    confirmButtonText: "Jugar de nuevo",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
            })
            .then(this.reiniciarJuego)
        },
        indicarVictoria() {
            swal.fire({
                    title:"Ganaste",
                    html://html
                    `
                     <img class="img-fluid" src="./image/descarga (1) (4ª copia).jpeg./image/descarga.jpeg" alt="ganaste">
                     <p class="h4">Fantastico</p>       
                    `,
                    confirmButtonText:"Jugar de nuevo",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
            })
            .then(this.reiniciarJuego)
        },
        haGanado(){
            return this.memorama.every(arreglo=>arreglo.every(imagen=>imagen.acertada));
        },
        mezclador(a){
            let j, x, i;
            for(i = a.length-1; i>0;i--){
                j=Math.floor(Math.random()*(i+1));
                x=a[i];
                a[i] = a[j];
                a[j] = x;
            }
            return a;
        },
        aumemtarIntentos(){
            this.intentos++;
            if(this.intentos>=maximos_intentos){
                this.indicarFracaso();
            }
        },
        voltear(indiceFila, indiceImagen){
            if(this.esperandoTimeout){
                return;
            }
            if(this.memorama[indiceFila][indiceImagen].acertada){
                return;
            }
            if(this.ultimasCoordenadas.indiceFila=== null && this.ultimasCoordenadas.indiceImagen===null){
                this.memorama[indiceFila][indiceImagen].mostrar=true;
                this.ultimasCoordenadas.indiceFila=indiceFila;
                this.ultimasCoordenadas.indiceImagen=indiceImagen;
                return;
            }
            let imagenSeleccionada = this.memorama[indiceFila][indiceImagen];
            let ultimaImagenSeleccionada = this.memorama[this.ultimasCoordenadas.indiceFila][this.ultimasCoordenadas.indiceImagen];
            if(indiceFila===this.ultimasCoordenadas.indiceFila &&
               indiceImagen===this.ultimasCoordenadas.indiceImagen){
                    this.memorama[indiceFila][indiceImagen].mostrar=false;
                    this.ultimasCoordenadas.indiceFila=null;
                    this.ultimasCoordenadas.indiceImagen=null;
                    this.aumemtarIntentos();
                    return;
               }
               this.memorama[indiceFila][indiceImagen].mostrar = true;
               if (imagenSeleccionada.ruta === ultimaImagenSeleccionada.ruta) {
                   this.aciertos++;
                   this.memorama[indiceFila][indiceImagen].acertada = true;
                   this.memorama[this.ultimasCoordenadas.indiceFila][this.ultimasCoordenadas.indiceImagen].acertada = true;
                   this.ultimasCoordenadas.indiceFila = null;
                   this.ultimasCoordenadas.indiceImagen = null;
                   if (this.haGanado()) {
                       this.indicarVictoria();
                   }
               } else {
                   this.esperandoTimeout = true;
                   setTimeout(() => {
                       this.memorama[indiceFila][indiceImagen].mostrar = false;
                       this.memorama[indiceFila][indiceImagen].animacion = false;
                       this.memorama[this.ultimasCoordenadas.indiceFila][this.ultimasCoordenadas.indiceImagen].mostrar = false;
                       this.ultimasCoordenadas.indiceFila = null;
                       this.ultimasCoordenadas.indiceImagen = null;
                       this.esperandoTimeout = false;
                   }, segundos_voltear_imagen * 1000);
                   this.aumentarIntento();
               }
           },  
           reiniciarJuego(){
               let memorama=[];
               this.imagenes.forEach((imagen, indice) => {
                   let imagenDeMemorama={
                       ruta: imagen,
                       mostrar: false,
                       acertada: false,
                   };
                   memorama.push(imagenDeMemorama, Object.assign({}, imagenDeMemorama));
               });
               this.mezclador(memorama);
               let memoramaDividido=[];
               for (let i =0; i<memorama.length; i+=columnas){
                   memoramaDividido.push(memorama.slice(i, i +columnas));
               }
               this.intentos=0;
               this.aciertos=0;
               this.memorama=memoramaDividido;
           },
           precargarImagenes(){
               swal.fire({
                   title: "Cargando",
                   html:`Cargando imagenes ...`,
                   allowOutsideClick:false,
                   allowEscapeKey: false,
               })
                  then(this.reiniciarJuego());
               swal.showLoading();

               let total = this.imagenes.length, contador=0;
               let imagenesPrecarga=Array.from(this.imagenes);
               imagenesPrecarga.push(NOMBRE_IMAGEN_OCULTA);
               imagenesPrecarga.forEach(ruta=>{
                   const imagen = document.createElement("img");
                   imagen.src=ruta;
                   imagen.addEventListener("load",()=>{
                       contador++;
                       if(contador>= total){
                           this.reiniciarJuego();
                           swal.close();
                       }
                   });
                   document.body.appendChild(imagen);
                   document.body.removeChild(imagen);
               });
           },
    },
    mounted(){
        this.precargarImagenes();
    }    
});