import { agregarAlCarrito } from "./funcionesCarrito.js";
import { obtenerCarrito } from "./storage.js";
import { actualizarContador } from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("contenedor-productos");

  const carrito = obtenerCarrito();
  actualizarContador(carrito);

  fetch("./data/productos.json")
    .then((response) => response.json())
    .then((productos) => {
      productos.forEach((producto) => {
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