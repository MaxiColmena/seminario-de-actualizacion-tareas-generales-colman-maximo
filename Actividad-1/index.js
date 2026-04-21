const input = document.getElementById("input");
const btnColores = document.getElementById("colores");
const cuerpo = document.body;
const displayResultado = document.getElementById("resultado");
let estadoColor = 0;

input.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const mensaje = input.value;
    if (mensaje.trim() !== "") {
      alert("Texto ingresado: " + mensaje);
      displayResultado.innerText = `Texto: ${mensaje}`;
    } else {
      alert("Por favor, escribe algo antes de presionar Enter.");
    }
  }
});

btnColores.addEventListener("click", () => {
  estadoColor = (estadoColor + 1) % 3;

  switch (estadoColor) {
    case 0:
      cuerpo.style.backgroundColor = "#b36262ff";
      cuerpo.style.color = "#504e4eff";
      displayResultado.style.borderColor = "#121e2bff";
      break;
    case 1:
      cuerpo.style.backgroundColor = "#000000";
      cuerpo.style.color = "#ffffff";
      displayResultado.style.borderColor = "#fff";
      break;
    case 2:
      cuerpo.style.backgroundColor = "#7926a8ff";
      cuerpo.style.color = "#729c2dff";
      displayResultado.style.borderColor = "#afcf1dff";
      break;
  }
});
