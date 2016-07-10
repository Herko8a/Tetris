// Tetris
// Version 1.0  Mayo 2015
// Héctor Ochoa
// hercokayahoo.com

var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

var JuegoTetris;

function CargarTetris(){
	JuegoTetris = Tetris();
	JuegoTetris.estado = 'detenido';
	JuegoTetris.GeneraControles();
	loadMedia();
	agregarEventosTeclado();
}

function loadMedia(){

	JuegoTetris.blocks.src = 'img/tetris/Blocks.png';
	JuegoTetris.controles.src = 'img/tetris/Controles.png';
	JuegoTetris.fondo.src = 'img/tetris/bgTetris.png';

	JuegoTetris.fondo.onload = function(){
		var intervalo = window.setInterval(frameLoop, 100);
		var intervalo2 = window.setInterval(avanceLoop, 1000);
	}

}

function frameLoop(){
	detectaTecla();
	JuegoTetris.dibujaJuego();
}

function avanceLoop(){
	if (JuegoTetris.estado == 'iniciado')
		JuegoTetris.avanzaFigura('abajo');
}

function agregarEventosTeclado(){


	agregarEventos(document, "keydown", function(e){
		JuegoTetris.teclado[e.keyCode] = true;
	});

	agregarEventos(document, "keyup", function(e){
		JuegoTetris.teclado[e.keyCode] = false;
	});

	canvas.addEventListener("mousedown", function(evt){
		var Pos = getMousePos(evt);
		diClickEnBoton(Pos, true);
	}, false);

	canvas.addEventListener("mouseup", function(evt){
		var Pos = getMousePos(evt);
		diClickEnBoton(Pos, false);
	}, false);


	function agregarEventos(elemento, nombreEvento, funcion){
		if(elemento.addEventListener)
		{
			elemento.addEventListener(nombreEvento, funcion, false);
		}
		else if(elemento.attachEvent){
			elemento.attachEvent(nombreEvento, funcion);
		}
	}
}

function detectaTecla(){

	// F2
	if(JuegoTetris.estado == 'detenido' || JuegoTetris.estado == 'juegoFinalizado'){
		if (JuegoTetris.teclado[113]) {
			JuegoTetris.iniciarJuego();
		}
	}

	if(JuegoTetris.estado == 'iniciado'){

		if (JuegoTetris.teclado[40]) { 
			JuegoTetris.avanzaFigura('abajo');
		}
		if (JuegoTetris.teclado[39]){
			JuegoTetris.avanzaFigura('derecha');
		}
		if (JuegoTetris.teclado[37]){
			JuegoTetris.avanzaFigura('izquierda');
		}	
		if (JuegoTetris.teclado[38]){
			JuegoTetris.avanzaFigura('arriba');
		}
	}

}

function getMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
	}
}

function diClickEnBoton(Pos, accion)
{

	for(i in JuegoTetris.controlesBtn) {
		var cnt = JuegoTetris.controlesBtn[i];

		if ((cnt.pX <= Pos.x && ((cnt.pX + cnt.pW) >= Pos.x)) &&
			(cnt.pY <= Pos.y && ((cnt.pY + cnt.pH) >= Pos.y)))
		{
			var boton;

			switch (cnt.id)
			{
				case 1: 	// Arriba
					boton = 38;
					break;
				case 2: 	// Enmedio
					if (accion && JuegoTetris.estado == 'iniciado')
						JuegoTetris.estado = 'pausa'
					else if (accion && JuegoTetris.estado == 'pausa')
						JuegoTetris.estado = 'iniciado'
					else if (accion && JuegoTetris.estado == 'detenido')
						JuegoTetris.iniciarJuego();
					
					return;
				case 3: 	// Abajo
					boton = 40;
					break;
				case 4: 	// Izquierda
					boton = 37;
					break;
				case 5: 	// Derecha
					boton = 39;
					break;					
			}
			JuegoTetris.teclado[boton] = accion;
			break;
		}

	};

}


function Tetris()
{
	return {
		estado: 'detenido',
		margenIzq: 200,
		margenSup: 40,
		tamano: 20,
		velocidadJuego: 100,
		velocidadNivel: 1000,
		fondo: new Image(),
		blocks: new Image(),
		controles: new Image(),
		teclado: {},
		figura: {},
		proximaFigura: {},
		controlesBtn: [],
		cuadrados: [],
		moviendo: false,
		iniciarJuego: function(){
			this.figura = this.GeneraFigura();
			this.proximaFigura = this.GeneraFigura();
			this.cuadrados = [];
			this.controlesBtn = [];
			this.GeneraControles();
			this.estado = 'iniciado';
		},
		dibujaJuego: function (){
			this.dibjarFondo();
			this.dibujarFigura();
			this.dibujarProximaFigura();
			this.dibujarCuadros();
			this.dibujaControles();
			this.dibujaTexto();
		},
		dibjarFondo: function (){
			ctx.drawImage(this.fondo, 0, 0);
		},
		dibujaTexto: function (){
			var alpha = 0.90;

			ctx.save();
			ctx.globalAlpha = alpha;

			if(this.estado == 'juegoFinalizado'){
				ctx.fillStyle = 'white';
				ctx.font = 'Bold 20pt Lucida Console';
				ctx.fillText('GAME OVER', 225, 190);
				ctx.font = '10pt Lucida Console';
				ctx.fillText('PRESS F2 TO CONTINUE', 220, 220);

			}

			if(this.estado == 'detenido'){
				ctx.fillStyle = 'black';
				ctx.font = 'Bold 10pt Lucida Console';
				ctx.fillText('PRESS F2 TO START', 237, 417);				
				ctx.fillStyle = 'yellow';
				ctx.font = 'Bold 10pt Lucida Console';
				ctx.fillText('PRESS F2 TO START', 235, 415);

			}

			if(this.estado == 'detenido' || this.estado == 'pausa'){
				ctx.fillStyle = 'white';
				ctx.font = 'Bold 10pt Lucida Console';
				ctx.fillText('START', 80, 405);		
				ctx.font = 'Bold 13pt Lucida Console';
				ctx.fillText('NEXT', 640, 37);		
			}

			if(this.estado == 'iniciado'){
				ctx.fillStyle = 'white';
				ctx.font = 'Bold 10pt Lucida Console';
				ctx.fillText('PAUSE', 80, 405);
				ctx.font = 'Bold 13pt Lucida Console';
				ctx.fillText('NEXT', 640, 37);		
			}			


			ctx.restore();
		},
		dibujarFigura: function (){
			var xPos;

			switch (this.figura.tipo) {
				case 1: // Cuadrado
					xPos = 120;
					break;
				case 2: // Flit Derecha
					xPos = 100;
					break;
				case 3: // Flit Izquierda
					xPos = 80;
					break;
				case 4: // Ele Derecha
					xPos = 60;
					break;
				case 5: // Ele Izquierda
					xPos = 40;
					break;
				case 6: // Barra
					xPos = 20;
					break;
				case 7: // Piramide
					xPos = 0;
					break;
			}

			ctx.drawImage(this.blocks, xPos, 0, 	this.tamano, this.tamano, this.margenIzq + ((this.figura.C1x - 1) * this.tamano), 
											this.margenSup + ((this.figura.C1y - 1) * this.tamano), this.tamano, this.tamano);
			ctx.drawImage(this.blocks, xPos, 0, 	this.tamano, this.tamano, this.margenIzq + ((this.figura.C2x - 1) * this.tamano), 
											this.margenSup + ((this.figura.C2y - 1) * this.tamano), this.tamano, this.tamano);
			ctx.drawImage(this.blocks, xPos, 0, 	this.tamano, this.tamano, this.margenIzq + ((this.figura.C3x - 1) * this.tamano), 
											this.margenSup + ((this.figura.C3y - 1) * this.tamano), this.tamano, this.tamano);
			ctx.drawImage(this.blocks, xPos, 0, 	this.tamano, this.tamano, this.margenIzq + ((this.figura.C4x - 1) * this.tamano), 
											this.margenSup + ((this.figura.C4y - 1) * this.tamano), this.tamano, this.tamano);
		},
		dibujarProximaFigura: function (){
			var xPos;
			var mSup = 	67;
			var mIzq = 567;

			switch (this.proximaFigura.tipo) {
				case 1: // Cuadrado
					xPos = 120;
					mSup = 77;
					break;
				case 2: // Flit Derecha
					xPos = 100;
					break;
				case 3: // Flit Izquierda
					xPos = 80;
					break;
				case 4: // Ele Derecha
					xPos = 60;
					break;
				case 5: // Ele Izquierda
					xPos = 40;
					break;
				case 6: // Barra
					xPos = 20;
					mSup = 57;
					mIzq = 576;
					break;
				case 7: // Piramide
					xPos = 0;
					break;
			}


			ctx.drawImage(this.blocks, xPos, 0, 	this.tamano, this.tamano, mIzq + ((this.proximaFigura.C1x - 1) * this.tamano), 
											mSup + ((this.proximaFigura.C1y - 1) * this.tamano), this.tamano, this.tamano);
			ctx.drawImage(this.blocks, xPos, 0, 	this.tamano, this.tamano, mIzq + ((this.proximaFigura.C2x - 1) * this.tamano), 
											mSup + ((this.proximaFigura.C2y - 1) * this.tamano), this.tamano, this.tamano);
			ctx.drawImage(this.blocks, xPos, 0, 	this.tamano, this.tamano, mIzq + ((this.proximaFigura.C3x - 1) * this.tamano), 
											mSup + ((this.proximaFigura.C3y - 1) * this.tamano), this.tamano, this.tamano);
			ctx.drawImage(this.blocks, xPos, 0, 	this.tamano, this.tamano, mIzq + ((this.proximaFigura.C4x - 1) * this.tamano), 
											mSup + ((this.proximaFigura.C4y - 1) * this.tamano), this.tamano, this.tamano);
		},
		dibujaControles: function (){
			for(var i in this.controlesBtn){
				var cBoton = this.controlesBtn[i];
				ctx.drawImage(this.controles, cBoton.sX, cBoton.sY, cBoton.sW, cBoton.sH, cBoton.pX, cBoton.pY, cBoton.pW, cBoton.pH);
			}
		},
		botonControl: function(idC, vsX, vsY, vsW, vsH, vpX, vpY, vpW, vpH) {
			return {
				id: idC,
				sX: vsX,
				sY: vsY,
				sW: vsW,
				sH: vsH,
				pX: vpX,
				pY: vpY,
				pW: vpW,
				pH: vpH
			}
		},
		dibujarCuadros: function (){
			var xPos;

			for(var i in this.cuadrados){
				var cuadrado = this.cuadrados[i];

				switch (cuadrado.tipo) {
					case 1: // Cuadrado
						xPos = 120;
						break;
					case 2: // Flit Derecha
						xPos = 100;
						break;
					case 3: // Flit Izquierda
						xPos = 80;
						break;
					case 4: // Ele Derecha
						xPos = 60;
						break;
					case 5: // Ele Izquierda
						xPos = 40;
						break;
					case 6: // Barra
						xPos = 20;
						break;
					case 7: // Piramide
						xPos = 0;
						break;
				}

				ctx.drawImage(this.blocks, xPos, 0,	this.tamano, this.tamano, 
													(this.margenIzq + ((cuadrado.x - 1) * this.tamano)),
													(this.margenSup + ((cuadrado.y - 1) * this.tamano)), 
													this.tamano, this.tamano);
			}
		},
		GeneraFigura: function (){
			var icon = {	tipo: this.siguienteFigura(),
							posicion: 'parado',
							x: 5,
							y: 1,
							C1x: 1,
							C1y: 1,
							C2x: 1,
							C2y: 1,
							C3x: 1,
							C3y: 1,
							C4x: 1,
							C4y: 1
						};

			this.calculaCuadrosFigura(icon);

			return icon;
		},
		GeneraControles: function (){
			this.controlesBtn.push(this.botonControl(1, 60, 0, 60, 60, 70, 310, 60, 60));		// Arriba
			this.controlesBtn.push(this.botonControl(2, 60, 60, 60, 60, 70, 370, 60, 60));		// En medio
			this.controlesBtn.push(this.botonControl(3, 60, 120, 60, 60, 70, 430, 60, 60));		// Abajo
			this.controlesBtn.push(this.botonControl(4, 0, 60, 60, 60, 10, 370, 60, 60));		// Izquierda
			this.controlesBtn.push(this.botonControl(5, 120, 60, 60, 60, 130, 370, 60, 60));	// Derecha
		},
		calculaCuadrosFigura: function (icon){

			switch (icon.tipo) {

				case 1: //Cuadrado

					switch (icon.posicion) {
						case 'parado':
						case 'deCabeza':
						case 'bocaArriba':
						case 'bocaAbajo':
							icon.C1x = icon.x;
							icon.C1y = icon.y;
							icon.C2x = icon.x;
							icon.C2y = icon.y + 1;
							icon.C3x = icon.x + 1;
							icon.C3y = icon.y;
							icon.C4x = icon.x + 1;
							icon.C4y = icon.y + 1;
							break;
					}
					break;

				case 2: // Flit Derecha

					switch (icon.posicion) {
						case 'parado':
						case 'deCabeza':
							icon.C1x = icon.x;
							icon.C1y = icon.y;
							icon.C2x = icon.x;
							icon.C2y = icon.y + 1;
							icon.C3x = icon.x + 1;
							icon.C3y = icon.y + 1;
							icon.C4x = icon.x + 1;
							icon.C4y = icon.y + 2;
							break;
						case 'bocaArriba':
						case 'bocaAbajo':
							icon.C1x = icon.x;
							icon.C1y = icon.y + 1;
							icon.C2x = icon.x + 1;
							icon.C2y = icon.y;
							icon.C3x = icon.x + 1;
							icon.C3y = icon.y + 1;
							icon.C4x = icon.x + 2;
							icon.C4y = icon.y;
							break;
					}
					break;

				case 3: // Flit Izquierda

					switch (icon.posicion) {
						case 'parado':
						case 'deCabeza':
							icon.C1x = icon.x;
							icon.C1y = icon.y + 1;
							icon.C2x = icon.x;
							icon.C2y = icon.y + 2;
							icon.C3x = icon.x + 1;
							icon.C3y = icon.y;
							icon.C4x = icon.x + 1;
							icon.C4y = icon.y + 1;
							break;
						case 'bocaArriba':
						case 'bocaAbajo':
							icon.C1x = icon.x;
							icon.C1y = icon.y;
							icon.C2x = icon.x + 1;
							icon.C2y = icon.y;
							icon.C3x = icon.x + 1;
							icon.C3y = icon.y + 1;
							icon.C4x = icon.x + 2;
							icon.C4y = icon.y + 1;
							break;
					}
					
					break;

				case 4: // Ele Derecha

			 		switch (icon.posicion) {
						case 'parado':
							icon.C1x = icon.x;
							icon.C1y = icon.y;
							icon.C2x = icon.x;
							icon.C2y = icon.y + 1;
							icon.C3x = icon.x;
							icon.C3y = icon.y + 2;
							icon.C4x = icon.x + 1;
							icon.C4y = icon.y + 2;
							break;				
						case 'deCabeza':
							icon.C1x = icon.x;
							icon.C1y = icon.y;
							icon.C2x = icon.x + 1;
							icon.C2y = icon.y;
							icon.C3x = icon.x + 1;
							icon.C3y = icon.y + 1;
							icon.C4x = icon.x + 1;
							icon.C4y = icon.y + 2;
							break;
						case 'bocaArriba':
							icon.C1x = icon.x;
							icon.C1y = icon.y + 1;
							icon.C2x = icon.x + 1;
							icon.C2y = icon.y + 1;
							icon.C3x = icon.x + 2;
							icon.C3y = icon.y;
							icon.C4x = icon.x + 2;
							icon.C4y = icon.y + 1;
							break;				
						case 'bocaAbajo':
							icon.C1x = icon.x;
							icon.C1y = icon.y;
							icon.C2x = icon.x;
							icon.C2y = icon.y + 1;
							icon.C3x = icon.x + 1;
							icon.C3y = icon.y;
							icon.C4x = icon.x + 2;
							icon.C4y = icon.y;
							break;
					}

					break;

				case 5: // Ele Izquierda

					switch (icon.posicion) {
						case 'parado':
							icon.C1x = icon.x;
							icon.C1y = icon.y + 2;
							icon.C2x = icon.x + 1;
							icon.C2y = icon.y;
							icon.C3x = icon.x + 1;
							icon.C3y = icon.y + 1;
							icon.C4x = icon.x + 1;
							icon.C4y = icon.y + 2;
							break;				
						case 'deCabeza':
							icon.C1x = icon.x;
							icon.C1y = icon.y;
							icon.C2x = icon.x;
							icon.C2y = icon.y + 1;
							icon.C3x = icon.x;
							icon.C3y = icon.y + 2;
							icon.C4x = icon.x + 1;
							icon.C4y = icon.y;
							break;
						case 'bocaArriba':
							icon.C1x = icon.x;
							icon.C1y = icon.y;
							icon.C2x = icon.x + 1;
							icon.C2y = icon.y;
							icon.C3x = icon.x + 2;
							icon.C3y = icon.y;
							icon.C4x = icon.x + 2;
							icon.C4y = icon.y + 1;
							break;				
						case 'bocaAbajo':
							icon.C1x = icon.x;
							icon.C1y = icon.y;
							icon.C2x = icon.x;
							icon.C2y = icon.y + 1;
							icon.C3x = icon.x + 1;
							icon.C3y = icon.y + 1;
							icon.C4x = icon.x + 2;
							icon.C4y = icon.y + 1;
							break;
					}

					break;
				
				case 6: // Barra

					switch (icon.posicion) {
						case 'parado':
						case 'deCabeza':
							icon.C1x = icon.x;
							icon.C1y = icon.y;
							icon.C2x = icon.x;
							icon.C2y = icon.y + 1;
							icon.C3x = icon.x;
							icon.C3y = icon.y + 2;
							icon.C4x = icon.x;
							icon.C4y = icon.y + 3;
							break;
						case 'bocaArriba':
						case 'bocaAbajo':
							icon.C1x = icon.x - 1;
							icon.C1y = icon.y;
							icon.C2x = icon.x;
							icon.C2y = icon.y;
							icon.C3x = icon.x + 1;
							icon.C3y = icon.y;
							icon.C4x = icon.x + 2;
							icon.C4y = icon.y;
							break;
					}

					break;

				case 7: // Piramide

					switch (icon.posicion) {
						case 'parado':
							icon.C1x = icon.x;
							icon.C1y = icon.y;
							icon.C2x = icon.x;
							icon.C2y = icon.y + 1;
							icon.C3x = icon.x;
							icon.C3y = icon.y + 2;
							icon.C4x = icon.x + 1;
							icon.C4y = icon.y + 1;
							break;				
						case 'deCabeza':
							icon.C1x = icon.x;
							icon.C1y = icon.y + 1;
							icon.C2x = icon.x + 1;
							icon.C2y = icon.y;
							icon.C3x = icon.x + 1;
							icon.C3y = icon.y + 1;
							icon.C4x = icon.x + 1;
							icon.C4y = icon.y + 2;
							break;
						case 'bocaArriba':
							icon.C1x = icon.x;
							icon.C1y = icon.y + 1;
							icon.C2x = icon.x + 1;
							icon.C2y = icon.y;
							icon.C3x = icon.x + 1;
							icon.C3y = icon.y + 1;
							icon.C4x = icon.x + 2;
							icon.C4y = icon.y + 1;
							break;				
						case 'bocaAbajo':
							icon.C1x = icon.x;
							icon.C1y = icon.y;
							icon.C2x = icon.x + 1;
							icon.C2y = icon.y;
							icon.C3x = icon.x + 1;
							icon.C3y = icon.y + 1;
							icon.C4x = icon.x + 2;
							icon.C4y = icon.y;
							break;
					}			
					
					break;
			}	
		},
		avanzaFigura: function (tipoMovimiento){

			if (this.moviendo)
				return;

			this.moviendo = true;

			switch (tipoMovimiento) {

				case 'abajo':

					var icon =  $.extend( {}, this.figura );

					icon.y++;
					icon.C1y++;
					icon.C2y++;
					icon.C3y++;
					icon.C4y++;

					if (!this.revisaColisionFigura(icon) && (icon.C1y <= 20 
														 && icon.C2y <= 20 
														 && icon.C3y <= 20 
														 && icon.C4y <= 20)){
						this.figura.y++;
						this.figura.C1y++;
						this.figura.C2y++;
						this.figura.C3y++;
						this.figura.C4y++;
					}
					else
					{
						// Descargamos figura en tablero
						this.cuadrados.push(this.agregarcuadros(this.figura.C1x, this.figura.C1y, this.figura.tipo));
						this.cuadrados.push(this.agregarcuadros(this.figura.C2x, this.figura.C2y, this.figura.tipo));
						this.cuadrados.push(this.agregarcuadros(this.figura.C3x, this.figura.C3y, this.figura.tipo));
						this.cuadrados.push(this.agregarcuadros(this.figura.C4x, this.figura.C4y, this.figura.tipo));

						// Agregamos siguiente figura
						this.figura = this.proximaFigura;
						this.proximaFigura = this.GeneraFigura();

						if (this.revisaColisionFigura(this.figura))
							this.estado = 'juegoFinalizado'
						else{
							var iniciar = true;

							while (iniciar){
								iniciar = false;

								for (var i = 20; i > 2; i--) {

									var Linea = this.cuadrados.filter(function(cuadrado){
										return cuadrado.y == i;
									});

									if (Linea.length == 10){
										this.eliminaLinea(i);
										this.recorreLineas(i);
										iniciar = true;
										break;
									}

								}
							}
						}
					}
					break;
				
				case 'derecha':

					var icon =  $.extend( {}, this.figura );

					icon.x++;
					icon.C1x++;
					icon.C2x++;
					icon.C3x++;
					icon.C4x++;

					if (!this.revisaColisionFigura(icon) && (icon.C1x <= 10 
														 && icon.C2x <= 10 
														 && icon.C3x <= 10 
														 && icon.C4x <= 10)){
						this.figura.x++;
						this.figura.C1x++;
						this.figura.C2x++;
						this.figura.C3x++;
						this.figura.C4x++;
					}
					break;

				case 'izquierda':

					var icon =  $.extend( {}, this.figura );

					icon.x--;
					icon.C1x--;
					icon.C2x--;
					icon.C3x--;
					icon.C4x--;

					if (!this.revisaColisionFigura(icon) && (icon.C1x >= 1 
														 && icon.C2x >= 1 
														 && icon.C3x >= 1 
														 && icon.C4x >= 1)){
						this.figura.x--;
						this.figura.C1x--;
						this.figura.C2x--;
						this.figura.C3x--;
						this.figura.C4x--;
					}
					break;

				case 'arriba':

					this.giraFigura();
					break;

			}

			this.moviendo = false;
		},
		giraFigura: function (){

			switch (this.figura.posicion) {
				case 'parado':
					this.figura.posicion = 'bocaArriba';
					break;
				case 'bocaArriba':
					this.figura.posicion = 'deCabeza';
					break;
				case 'deCabeza':
					this.figura.posicion = 'bocaAbajo';
					break;			
				case 'bocaAbajo':
					this.figura.posicion = 'parado';
					break;
			}

			var icon =  $.extend( {}, this.figura );
			this.calculaCuadrosFigura(icon);

			if (!this.revisaColisionFigura(icon)	&& (icon.C1y <= 20 
														&& icon.C2y <= 20 
														&& icon.C3y <= 20 
														&& icon.C4y <= 20)
													&& (icon.C1x <= 10 
														&& icon.C2x <= 10 
														&& icon.C3x <= 10 
														&& icon.C4x <= 10) 
													&& (icon.C1x >= 1 
														&& icon.C2x >= 1 
														&& icon.C3x >= 1 
														&& icon.C4x >= 1)){
				this.figura.C1x = icon.C1x;
				this.figura.C1y = icon.C1y;
				this.figura.C2x = icon.C2x;
				this.figura.C2y = icon.C2y;
				this.figura.C3x = icon.C3x;
				this.figura.C3y = icon.C3y;
				this.figura.C4x = icon.C4x;
				this.figura.C4y = icon.C4y;
			}
		},		
		agregarcuadros: function (pX, pY, t){
			return{
				x: pX,
				y: pY,
				tipo: t
			}
		},
		eliminaLinea: function (ln){

			var Linea = this.cuadrados.filter(function(cuadrado){
				return cuadrado.y == ln;
			});	

			while (Linea.length > 0)
			{

				for(i = 0; i < this.cuadrados.length; i++)
				{
					if(this.cuadrados[i].y == ln){
						this.cuadrados.splice(i, 1);
						break;
					}
				}

				Linea = this.cuadrados.filter(function(cuadrado){
					return cuadrado.y == ln;
				});	

			}
		},
		recorreLineas: function(ln){
			var lc = this.cuadrados.filter(function(cuadrado){
				return cuadrado.y < ln;
			});	

			for(i = 0; i < lc.length; i++)
			{
				lc[i].y++;
			}
		},
		revisaColisionFigura: function(icon){

			if (this.colisionaFigura(icon.C1x, icon.C1y)) return true;
			if (this.colisionaFigura(icon.C2x, icon.C2y)) return true;
			if (this.colisionaFigura(icon.C3x, icon.C3y)) return true;
			if (this.colisionaFigura(icon.C4x, icon.C4y)) return true;

			return false;
		},
		colisionaFigura: function (x, y){

			for (var i in this.cuadrados) {
				var cuadrado = this.cuadrados[i];
				if (cuadrado.x == x && cuadrado.y == y)	return true;
			};	
			return false;
		},
		siguienteFigura: function (){
			return this.aleatorio(1, 8);
		},
		aleatorio: function (inferior, superior){
			var posibilidades = superior - inferior;
			var a = Math.random() * posibilidades;
			a = Math.floor(a);
			return parseInt(inferior) + a;
		}
	}
}
