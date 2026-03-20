const PHONE = "56954486171";

let productos = [];
let filtrados = [];
let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
  iniciarCatalogo();
});

async function iniciarCatalogo() {
  await cargarProductos();
  conectarFiltros();
  conectarCarrito();
  renderCarrito();
}

async function cargarProductos() {
  const grid = document.getElementById("catalogGrid");

  try {
    const res = await fetch("./productos.json", { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`No se pudo cargar productos.json (${res.status})`);
    }

    const data = await res.json();

    if (Array.isArray(data)) {
      productos = data;
    } else if (data && Array.isArray(data.productos)) {
      productos = data.productos;
    } else {
      throw new Error("productos.json no contiene un arreglo válido ni una propiedad 'productos'");
    }

    if (!productos.length) {
      throw new Error("productos.json no contiene productos");
    }

    filtrados = productos.filter(esProductoActivo);

    llenarFiltros();
    renderProductos();
    actualizarResumen();
  } catch (error) {
    console.error("Error cargando catálogo:", error);

    if (grid) {
      grid.innerHTML = `
        <div class="empty-state">
          <strong>No se pudo cargar el catálogo</strong>
          <div>Revisa el archivo <b>productos.json</b> y la ruta de <b>catalogo.js</b>.</div>
        </div>
      `;
    }
  }
}

function conectarFiltros() {
  document.getElementById("searchInput")?.addEventListener("input", aplicarFiltros);
  document.getElementById("categoryFilter")?.addEventListener("change", aplicarFiltros);
  document.getElementById("brandFilter")?.addEventListener("change", aplicarFiltros);
  document.getElementById("stockFilter")?.addEventListener("change", aplicarFiltros);
}

function conectarCarrito() {
  document.getElementById("sendCartBtn")?.addEventListener("click", enviarPedidoWhatsApp);
  document.getElementById("clearCartBtn")?.addEventListener("click", vaciarCarrito);

  document.getElementById("floatingCartBtn")?.addEventListener("click", () => {
    const sidebar = document.querySelector(".catalog-sidebar");
    if (sidebar) {
      sidebar.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

function esProductoActivo(producto) {
  const estado = String(
    producto.estado ??
    producto.status ??
    producto.activo ??
    ""
  ).toLowerCase().trim();

  if (estado === "") return true;
  if (estado === "activo") return true;
  if (estado === "active") return true;
  if (estado === "true") return true;
  return false;
}

function llenarFiltros() {
  const catSelect = document.getElementById("categoryFilter");
  const brandSelect = document.getElementById("brandFilter");

  if (!catSelect || !brandSelect) return;

  const categorias = [...new Set(
    productos
      .filter(esProductoActivo)
      .map(p => obtenerCategoria(p))
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, "es"));

  const marcas = [...new Set(
    productos
      .filter(esProductoActivo)
      .map(p => obtenerMarca(p))
      .filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, "es"));

  catSelect.innerHTML = `<option value="">Todas las categorías</option>`;
  brandSelect.innerHTML = `<option value="">Todas las marcas</option>`;

  categorias.forEach(categoria => {
    const option = document.createElement("option");
    option.value = categoria;
    option.textContent = categoria;
    catSelect.appendChild(option);
  });

  marcas.forEach(marca => {
    const option = document.createElement("option");
    option.value = marca;
    option.textContent = marca;
    brandSelect.appendChild(option);
  });
}

function aplicarFiltros() {
  const texto = (document.getElementById("searchInput")?.value || "").toLowerCase().trim();
  const categoria = document.getElementById("categoryFilter")?.value || "";
  const marca = document.getElementById("brandFilter")?.value || "";
  const stock = document.getElementById("stockFilter")?.value || "";

  filtrados = productos.filter(producto => {
    if (!esProductoActivo(producto)) return false;

    const nombre = obtenerNombre(producto).toLowerCase();
    const marcaTexto = obtenerMarca(producto).toLowerCase();
    const categoriaTexto = obtenerCategoria(producto).toLowerCase();
    const sku = obtenerSku(producto).toLowerCase();
    const descripcion = obtenerDescripcion(producto).toLowerCase();
    const stockTexto = obtenerStockTexto(producto).toLowerCase();

    const coincideTexto =
      !texto ||
      nombre.includes(texto) ||
      marcaTexto.includes(texto) ||
      sku.includes(texto) ||
      descripcion.includes(texto) ||
      categoriaTexto.includes(texto);

    const coincideCategoria =
      !categoria || obtenerCategoria(producto) === categoria;

    const coincideMarca =
      !marca || obtenerMarca(producto) === marca;

    let coincideStock = true;

    if (stock === "con") {
      coincideStock =
        stockTexto.includes("con") ||
        stockTexto.includes("disp") ||
        stockTexto.includes("stock") ||
        stockTexto.includes("sí") ||
        stockTexto.includes("si");
    }

    if (stock === "bajo") {
      coincideStock = stockTexto.includes("bajo");
    }

    if (stock === "sin") {
      coincideStock =
        stockTexto.includes("sin") ||
        stockTexto.includes("agot") ||
        stockTexto.includes("no disponible");
    }

    return coincideTexto && coincideCategoria && coincideMarca && coincideStock;
  });

  renderProductos();
  actualizarResumen();
}

function renderProductos() {
  const grid = document.getElementById("catalogGrid");
  if (!grid) return;

  if (!filtrados.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <strong>No encontramos productos</strong>
        <div>Prueba cambiando la búsqueda o los filtros.</div>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtrados.map((producto, index) => {
    const nombre = escapeHtml(obtenerNombre(producto));
    const categoria = escapeHtml(obtenerCategoria(producto) || "General");
    const marca = escapeHtml(obtenerMarca(producto) || "Mundo D&H");
    const sku = escapeHtml(obtenerSku(producto));
    const descripcion = escapeHtml(obtenerDescripcion(producto));
    const imagen = obtenerImagen(producto);
    const precio = formatearPrecio(obtenerPrecio(producto));
    const stockTexto = escapeHtml(obtenerStockTexto(producto));
    const stockClase = obtenerStockClase(producto);

    return `
      <article class="product-card">
        <div class="product-image">
          ${imagen ? `<img src="${escapeAttribute(imagen)}" alt="${nombre}" loading="lazy" onerror="this.style.display='none'">` : ""}
          <div class="badge-top">${marca}</div>
          <div class="badge-stock ${stockClase}">${stockTexto}</div>
        </div>

        <div class="product-body">
          <div class="product-category">${categoria}</div>
          <h3 class="product-name">${nombre}</h3>

          <div class="product-meta">
            ${sku ? `<div><strong>SKU:</strong> ${sku}</div>` : ""}
            ${marca ? `<div><strong>Marca:</strong> ${marca}</div>` : ""}
            ${descripcion ? `<div>${descripcion}</div>` : ""}
          </div>

          <div class="product-prices">
            <div class="price-row">
              <span class="price-label">Precio</span>
              <strong class="price-sale">${precio}</strong>
            </div>
          </div>

          <div class="qty-row">
            <div class="qty-box">
              <button class="qty-btn" type="button" onclick="cambiarCantidadVista(${index}, -1)">−</button>
              <input id="qty-${index}" class="qty-input" type="number" min="1" step="1" value="1" />
              <button class="qty-btn" type="button" onclick="cambiarCantidadVista(${index}, 1)">+</button>
            </div>

            <button class="btn-product btn-add-cart" type="button" onclick="agregarAlPedido(${index})">
              Agregar
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function cambiarCantidadVista(index, delta) {
  const input = document.getElementById(`qty-${index}`);
  if (!input) return;

  let valor = parseInt(input.value || "1", 10);
  if (Number.isNaN(valor) || valor < 1) valor = 1;

  valor += delta;
  if (valor < 1) valor = 1;

  input.value = valor;
}

function agregarAlPedido(index) {
  const producto = filtrados[index];
  if (!producto) return;

  const input = document.getElementById(`qty-${index}`);
  let cantidad = parseInt(input?.value || "1", 10);

  if (Number.isNaN(cantidad) || cantidad < 1) {
    cantidad = 1;
  }

  const key = obtenerClaveProducto(producto);
  const existente = carrito.find(item => item.key === key);

  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({
      key,
      nombre: obtenerNombre(producto),
      marca: obtenerMarca(producto),
      categoria: obtenerCategoria(producto),
      sku: obtenerSku(producto),
      precio: obtenerPrecio(producto),
      stock: obtenerStockTexto(producto),
      cantidad
    });
  }

  if (input) input.value = "1";
  renderCarrito();
}

function renderCarrito() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const floatingCartCount = document.getElementById("floatingCartCount");

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  if (cartCount) cartCount.textContent = totalItems;
  if (floatingCartCount) floatingCartCount.textContent = totalItems;

  if (!cartItems) return;

  if (!carrito.length) {
    cartItems.innerHTML = `
      <div class="cart-empty">Aún no agregas productos al pedido.</div>
    `;
    return;
  }

  cartItems.innerHTML = carrito.map((item, index) => `
    <div class="cart-item">
      <div class="cart-item-row">
        <div>
          <strong>${escapeHtml(item.nombre)}</strong>
          <span>${item.sku ? `SKU: ${escapeHtml(item.sku)}` : "Sin SKU"}</span>
          <span>${item.marca ? `Marca: ${escapeHtml(item.marca)}` : ""}</span>
          <span>Cantidad: ${item.cantidad} unidades</span>
        </div>
      </div>

      <div class="cart-item-actions">
        <button class="cart-mini-btn" type="button" onclick="restarCarrito(${index})">−</button>
        <button class="cart-mini-btn" type="button" onclick="sumarCarrito(${index})">+</button>
        <button class="cart-mini-btn" type="button" onclick="eliminarDelCarrito(${index})">Quitar</button>
      </div>
    </div>
  `).join("");
}

function sumarCarrito(index) {
  if (!carrito[index]) return;
  carrito[index].cantidad += 1;
  renderCarrito();
}

function restarCarrito(index) {
  if (!carrito[index]) return;

  carrito[index].cantidad -= 1;

  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  }

  renderCarrito();
}

function eliminarDelCarrito(index) {
  if (!carrito[index]) return;
  carrito.splice(index, 1);
  renderCarrito();
}

function vaciarCarrito() {
  carrito = [];
  renderCarrito();
}

function enviarPedidoWhatsApp() {
  if (!carrito.length) {
    alert("Primero agrega productos al pedido.");
    return;
  }

  const lineas = carrito.map(item => {
    const partes = [
      `- ${item.nombre}`,
      item.sku ? `SKU: ${item.sku}` : "",
      item.marca ? `Marca: ${item.marca}` : "",
      `Cantidad: ${item.cantidad} unidades`
    ].filter(Boolean);

    return partes.join(" | ");
  });

  const mensaje = [
    "Hola, quiero hacer el siguiente pedido de Mundo D&H:",
    "",
    ...lineas,
    "",
    "Quedo atento(a) a confirmación de stock, precios y coordinación."
  ].join("\n");

  const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function actualizarResumen() {
  const summaryProducts = document.getElementById("summaryProducts");
  const summaryCategories = document.getElementById("summaryCategories");
  const summaryBrands = document.getElementById("summaryBrands");

  const categorias = new Set(
    filtrados.map(p => obtenerCategoria(p)).filter(Boolean)
  );

  const marcas = new Set(
    filtrados.map(p => obtenerMarca(p)).filter(Boolean)
  );

  if (summaryProducts) summaryProducts.textContent = filtrados.length;
  if (summaryCategories) summaryCategories.textContent = categorias.size;
  if (summaryBrands) summaryBrands.textContent = marcas.size;
}

function obtenerClaveProducto(producto) {
  return (
    obtenerSku(producto) ||
    `${obtenerNombre(producto)}-${obtenerMarca(producto)}-${obtenerCategoria(producto)}`
  );
}

function obtenerNombre(producto) {
  return (
    producto.nombre ||
    producto.producto ||
    producto.title ||
    producto.titulo ||
    "Producto sin nombre"
  );
}

function obtenerCategoria(producto) {
  return (
    producto.categoria ||
    producto.category ||
    producto.rubro ||
    ""
  ).toString().trim();
}

function obtenerMarca(producto) {
  return (
    producto.marca ||
    producto.brand ||
    ""
  ).toString().trim();
}

function obtenerSku(producto) {
  return (
    producto.sku ||
    producto.codigo ||
    producto.codigo_interno ||
    producto.cod ||
    producto.id_producto ||
    ""
  ).toString().trim();
}

function obtenerDescripcion(producto) {
  return (
    producto.descripcion ||
    producto.description ||
    producto.detalle ||
    producto.formato ||
    ""
  ).toString().trim();
}

function obtenerImagen(producto) {
  const imagenReal = (
    producto.imagen ||
    producto.image ||
    producto.foto ||
    producto.img ||
    producto.imagen_url ||
    ""
  ).toString().trim();

  if (imagenReal) return imagenReal;

  return obtenerImagenFallback(producto);
}

function obtenerImagenFallback(producto) {
  const categoria = obtenerCategoria(producto).toLowerCase();
  const nombre = obtenerNombre(producto).toLowerCase();

  if (categoria.includes("aseo")) {
    return "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80";
  }

  if (categoria.includes("oficina") || categoria.includes("papeler")) {
    return "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80";
  }

  if (categoria.includes("tecnolog")) {
    return "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80";
  }

  if (categoria.includes("ferreter")) {
    return "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80";
  }

  if (categoria.includes("hogar")) {
    return "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80";
  }

  if (categoria.includes("escolar")) {
    return "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80";
  }

  if (nombre.includes("basura") || nombre.includes("esponja") || nombre.includes("atomizador")) {
    return "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80";
  }

  if (nombre.includes("alargador") || nombre.includes("cable") || nombre.includes("adaptador")) {
    return "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80";
  }

  if (nombre.includes("lapiz") || nombre.includes("marcador") || nombre.includes("cuaderno") || nombre.includes("goma")) {
    return "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80";
  }

  return "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80";
}

function obtenerPrecio(producto) {
  return (
    producto.precio ??
    producto.precio_web_con_iva ??
    producto.precio_venta ??
    producto.valor ??
    producto.price ??
    producto.precio_final ??
    0
  );
}

function obtenerStockTexto(producto) {
  const stock = (
    producto.stock_estado ??
    producto.stock ??
    producto.disponibilidad ??
    producto.estado_stock ??
    ""
  ).toString().trim();

  return stock || "Disponible";
}

function obtenerStockClase(producto) {
  const texto = obtenerStockTexto(producto).toLowerCase();

  if (texto.includes("sin") || texto.includes("agot")) {
    return "out";
  }

  if (texto.includes("bajo")) {
    return "low";
  }

  return "";
}

function formatearPrecio(valor) {
  const numero = Number(
    String(valor ?? 0).replace(/[^\d.-]/g, "")
  );

  if (!numero || Number.isNaN(numero)) {
    return "Consultar";
  }

  return numero.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  });
}

function escapeHtml(texto) {
  return String(texto ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(texto) {
  return String(texto ?? "").replaceAll('"', "&quot;");
}
