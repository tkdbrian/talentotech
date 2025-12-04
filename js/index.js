import { agregarAlCarrito } from "./funcionesCarrito.js";
import { obtenerCarrito } from "./storage.js";
import { actualizarContador } from "./ui.js";

//El evento "DOMContentLoaded" sirve para que no intentemos acceder a un nodo HTML con el
//  codigo js antes de que el navegador lo cree:
//Por ejemplo: que no lea un getElementById cuando aun no existe ese id.
document.addEventListener("DOMContentLoaded", () => {
  //Accedemos al contenedor donde queremos generar los articles
  const contenedor = document.getElementById("contenedor-productos");

  //Pedimos la info de productos en carrito para mostrar el numero si hay productos
  const carrito = obtenerCarrito();
  actualizarContador(carrito);

  fetch("./data/productos.json")
    .then((response) => response.json())
    .then((productos) => {
      productos.forEach((producto) => {
        // creamos los articles y sus contenidos
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta-producto");

        const img = document.createElement("img");
        img.src = `./${producto.img}`;
        img.alt = producto.nombre;

        const titulo = document.createElement("h3");
        titulo.textContent = producto.nombre;

        const precio = document.createElement("p");
        precio.classList.add("precio-producto");
        precio.textContent = `$${producto.precio.toLocaleString()}`;

        const descripcion = document.createElement("p");
        descripcion.classList.add("descripcion-producto");
        descripcion.textContent = producto.descripcion;

        const boton = document.createElement("button");
        boton.classList.add("btn-agregar");
        boton.textContent = "Agregar al carrito";

        boton.addEventListener("click", () => {
          agregarAlCarrito(producto);
        });

        // Armar la estructura
        tarjeta.appendChild(img);
        tarjeta.appendChild(titulo);
        tarjeta.appendChild(precio);
        tarjeta.appendChild(descripcion);
        tarjeta.appendChild(boton);

        contenedor.appendChild(tarjeta);
      });
    })
    .catch((error) => {
      console.error("Error al cargar los productos:", error);
      contenedor.innerHTML = "<p>Error al cargar los productos. Por favor, intente más tarde.</p>";
    });
});