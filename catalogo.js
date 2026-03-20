const PHONE = "56954486171";

let productos = [];
let filtrados = [];

document.addEventListener("DOMContentLoaded", () => {
  iniciarCatalogo();
});

async function iniciarCatalogo() {
  await cargarProductos();
  conectarFiltros();
}

async function cargarProductos() {
  const grid = document.getElementById("catalogGrid");

  try {
    const res = await fetch("./productos.json", { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`No se pudo cargar productos.json (${res.status})`);
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error("productos.json no contiene un arreglo válido");
    }

    productos = data;

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
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const brandFilter = document.getElementById("brandFilter");
  const stockFilter = document.getElementById("stockFilter");

  searchInput?.addEventListener("input", aplicarFiltros);
  categoryFilter?.addEventListener("change", aplicarFiltros);
  brandFilter?.addEventListener("change", aplicarFiltros);
  stockFilter?.addEventListener("change", aplicarFiltros);
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

          <div class="product-actions">
            <button class="btn-product btn-wa" type="button" onclick="cotizarProducto(${index})">
              Cotizar por WhatsApp
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
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

function cotizarProducto(index) {
  const producto = filtrados[index];
  if (!producto) return;

  const nombre = obtenerNombre(producto);
  const marca = obtenerMarca(producto);
  const categoria = obtenerCategoria(producto);
  const sku = obtenerSku(producto);
  const precio = formatearPrecio(obtenerPrecio(producto));
  const stock = obtenerStockTexto(producto);

  const mensaje = [
    "Hola, quiero cotizar este producto de Mundo D&H:",
    "",
    `Producto: ${nombre}`,
    marca ? `Marca: ${marca}` : "",
    categoria ? `Categoría: ${categoria}` : "",
    sku ? `SKU: ${sku}` : "",
    `Precio: ${precio}`,
    `Stock: ${stock}`,
    "",
    "Quedo atento(a) a disponibilidad y coordinación del pedido."
  ].filter(Boolean).join("\n");

  const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank", "noopener,noreferrer");
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
  return (
    producto.imagen ||
    producto.image ||
    producto.foto ||
    producto.img ||
    producto.imagen_url ||
    ""
  ).toString().trim();
}

function obtenerPrecio(producto) {
  return (
    producto.precio ??
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
    "Disponible"
  ).toString().trim();

  if (!stock) return "Disponible";
  return stock;
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
