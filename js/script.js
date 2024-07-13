let modoLectura = 'tradicional';
const capitulosLeidos = {
    tradicional: new Set(JSON.parse(localStorage.getItem('capitulosLeidosTradicional')) || []),
    cortazar: new Set(JSON.parse(localStorage.getItem('capitulosLeidosCortazar')) || []),
    rayuela: new Set(JSON.parse(localStorage.getItem('capitulosLeidosRayuela')) || [])
};

const capitulosActuales = {
    tradicional: JSON.parse(localStorage.getItem('capituloActualTradicional')) || 1,
    cortazar: JSON.parse(localStorage.getItem('capituloActualCortazar')) || 73,
    rayuela: JSON.parse(localStorage.getItem('capituloActualRayuela')) || obtenerCapituloRayuelaInicial()
};

const ordenCortazar = [73, 1, 2, 116, 3, 84, 4, 71, 5, 81, 74, 6, 7, 8, 93, 68, 9, 104, 10, 65, 11, 136, 12, 106, 13, 115, 120, 16, 137, 17, 97, 18, 153, 19, 90, 20, 126, 21, 79, 22, 62, 23, 124, 128, 24, 134, 25, 141, 60, 26, 109, 27, 28, 130, 151, 152, 143, 100, 76, 101, 144, 92, 103, 108, 64, 155, 123, 145, 122, 112, 154, 85, 150, 95, 146, 29, 107, 113, 30, 57, 70, 147, 31, 32, 132, 61, 33, 67, 83, 142, 34, 87, 105, 96, 94, 91, 82, 99, 35, 121, 36, 37, 98, 38, 39, 86, 78, 40, 59, 41, 148, 42, 75, 43, 125, 44, 102, 45, 80, 46, 47, 110, 48, 111, 49, 118, 50, 119, 51, 69, 52, 89, 53, 66, 149, 54, 129, 139, 133, 140, 138, 127, 56, 135, 63, 88, 72, 77, 131, 58];

let ordenRayuela = JSON.parse(localStorage.getItem('ordenRayuela')) || generarOrdenAleatorio(155);

function generarOrdenAleatorio(max) {
    const array = Array.from({ length: max }, (_, i) => i + 1);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    localStorage.setItem('ordenRayuela', JSON.stringify(array));
    return array;
}

function obtenerCapituloRayuelaInicial() {
    for (let i = 0; i < ordenRayuela.length; i++) {
        if (!capitulosLeidos.rayuela.has(ordenRayuela[i])) {
            return ordenRayuela[i];
        }
    }
    return null;
}

function setModoLectura(modo) {
    modoLectura = modo;
    document.querySelectorAll('.menu-modo').forEach(menu => menu.style.display = 'none');
    document.getElementById(`menu-${modo}`).style.display = 'block';
    if (modo === 'rayuela') {
        capitulosActuales[modo] = obtenerCapituloRayuelaInicial();
    } else if (modo === 'tradicional') {
        capitulosActuales[modo] = 1;
    }
    actualizarCapituloActual(modo);
    actualizarFormatoListaCapitulosLeidos(modo);
    alert(`Modo de lectura cambiado a: ${modo}`);
}

function siguienteCapitulo(modo) {
    const capituloAnterior = capitulosActuales[modo];
    const capitulo = getCapituloSiguiente(modo);
    if (capitulo !== null) {
        capitulosLeidos[modo].add(capituloAnterior);
        capitulosActuales[modo] = capitulo;
        actualizarCapituloActual(modo);
        agregarCapituloLeido(modo, capituloAnterior);
        guardarDatos(modo);
    } else {
        alert('No hay más capítulos disponibles.');
    }
}

function guardarCapitulo(modo) {
    guardarDatos(modo);
    alert(`Capítulo ${capitulosActuales[modo]} guardado para el modo ${modo}`);
}

function volverEmpezar(modo) {
    capitulosLeidos[modo].clear();
    capitulosActuales[modo] = modo === 'cortazar' ? 73 : (modo === 'tradicional' ? 1 : obtenerCapituloRayuelaInicial());
    if (modo === 'rayuela') {
        ordenRayuela = generarOrdenAleatorio(155); // Regenerar el orden aleatorio
    }
    actualizarCapituloActual(modo);
    actualizarFormatoListaCapitulosLeidos(modo);
    alert(`Modo ${modo} reiniciado.`);
    guardarDatos(modo);
}

function setCapituloManual(modo) {
    const input = document.getElementById(`input-${modo}`);
    const capitulo = parseInt(input.value, 10);
    if (!isNaN(capitulo) && capitulo > 0) {
        capitulosLeidos[modo].add(capitulosActuales[modo]);
        capitulosActuales[modo] = capitulo;
        actualizarCapituloActual(modo);
        agregarCapituloLeido(modo, capitulo);
        alert(`Capítulo establecido en ${capitulo} para el modo ${modo}`);
        guardarDatos(modo);
    } else {
        alert('Por favor, ingrese un número de capítulo válido.');
    }
}

function actualizarCapituloActual(modo) {
    document.getElementById(`capitulo-${modo}`).innerText = capitulosActuales[modo];
}

function getCapituloSiguiente(modo) {
    let capitulo;
    switch (modo) {
        case 'tradicional':
            capitulo = obtenerCapituloTradicional();
            break;
        case 'cortazar':
            capitulo = obtenerCapituloCortazar();
            break;
        case 'rayuela':
            capitulo = obtenerCapituloRayuela();
            break;
    }
    if (capitulo !== null) {
        return capitulo;
    }
    return null;
}

function obtenerCapituloTradicional() {
    for (let i = capitulosActuales.tradicional + 1; i <= 56; i++) {
        if (!capitulosLeidos.tradicional.has(i)) {
            return i;
        }
    }
    return null;
}

function obtenerCapituloCortazar() {
    const currentIndex = ordenCortazar.indexOf(capitulosActuales.cortazar);
    for (let i = currentIndex + 1; i < ordenCortazar.length; i++) {
        if (!capitulosLeidos.cortazar.has(ordenCortazar[i])) {
            return ordenCortazar[i];
        }
    }
    return null;
}

function obtenerCapituloRayuela() {
    const currentIndex = ordenRayuela.indexOf(capitulosActuales.rayuela);
    for (let i = currentIndex + 1; i < ordenRayuela.length; i++) {
        if (!capitulosLeidos.rayuela.has(ordenRayuela[i])) {
            return ordenRayuela[i];
        }
    }
    return null;
}

function agregarCapituloLeido(modo, capitulo) {
    actualizarFormatoListaCapitulosLeidos(modo);
}

function actualizarFormatoListaCapitulosLeidos(modo) {
    const lista = document.getElementById(`lista-${modo}`);
    lista.innerHTML = '';
    let capitulosArray = Array.from(capitulosLeidos[modo]);

    if (modo === 'cortazar' || modo === 'rayuela') {
        const orden = modo === 'cortazar' ? ordenCortazar : ordenRayuela;
        capitulosArray = capitulosArray.sort((a, b) => orden.indexOf(a) - orden.indexOf(b));
    } else {
        capitulosArray = capitulosArray.sort((a, b) => a - b);
    }

    const columnas = 20;
    let contenidoHTML = '';
    for (let i = 0; i < capitulosArray.length; i += columnas) {
        const fila = capitulosArray.slice(i, i + columnas).join('-') + '-';
        contenidoHTML += `<div>${fila}</div>`;
    }
    lista.innerHTML = contenidoHTML;
}

function guardarDatos(modo) {
    localStorage.setItem(`capituloActual${capitalize(modo)}`, JSON.stringify(capitulosActuales[modo]));
    localStorage.setItem(`capitulosLeidos${capitalize(modo)}`, JSON.stringify(Array.from(capitulosLeidos[modo])));
    if (modo === 'rayuela') {
        localStorage.setItem('ordenRayuela', JSON.stringify(ordenRayuela));
    }
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Restaurar capítulos guardados y actualizar listas de capítulos leídos
window.onload = function() {
    ['tradicional', 'cortazar', 'rayuela'].forEach(modo => {
        const capituloGuardado = localStorage.getItem(`capituloActual${capitalize(modo)}`);
        if (capituloGuardado) {
            capitulosActuales[modo] = JSON.parse(capituloGuardado);
            actualizarCapituloActual(modo);
        }
        actualizarFormatoListaCapitulosLeidos(modo);
    });
}
