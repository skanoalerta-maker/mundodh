const PHONE = "56954486171";

let productos = [];
let filtrados = [];

async function cargarProductos() {
  try {
    const res = await fetch("productos.json");
    productos = await res.json();
    filtrados = productos.filter(p => p.estado === "activo");

    llenarFiltros();
    renderProductos();
    actualizarResumen();
  } catch (e) {
    console.error("Error cargando productos:", e);
  }
}

function llenarFiltros() {
  const categorias = [...new Set(productos.map(p => p.categoria).filter(Boolean))];
  const marcas = [...new Set(productos.map(p => p.marca).filter(Boolean))];

  const catSelect = document.getElementById("categoryFilter");
  const brandSelect = document.getElementById("brandFilter");

  catSelect.innerHTML = `<option value="">Todas las categorías</option>`;
  brandSelect.innerHTML = `<option value="">Todas las marcas</option>`;

  categorias.sort().forEach(c => {
    const op = document.createElement("option");
    op.value = c;
    op.textContent = c;
    catSelect.appendChild(op);
  });

  marcas.sort().forEach(m => {
    const op = document.createElement("option");
    op.value = m;
    op.textContent = m;
    brandSelect.appendChild(op);
  });
}

function calcularCostoConIva(p) {
  return Math.round(p.precioNeto * 1.19);
}

function calcularPrecioVenta(p) {
  return Math.round(calcularCostoConIva(p) * (1 + p.margen));
}

function calcularGanancia(p) {
  return calcularPrecioVenta(p) - calcularCostoConIva(p);
}

function getStockClass(stock) {
  if (stock <= 0) return "out";
  if (stock <= 5) return "low";
  return "";
}

function renderProductos() {
  const grid = document.getElementById("catalogGrid");
  grid.innerHTML = "";

  if (filtrados.length === 0) {
    grid.innerHTML = `<div class="empty-state">No hay productos disponibles</div>`;
    return;
  }

  filtrados.forEach(p => {
    const costoConIva = calcularCostoConIva(p);
    const precioVenta = calcularPrecioVenta(p);
    const ganancia = calcularGanancia(p);

    const img = p.imagen || "./assets/fallback-producto.jpg";

    const mensaje = `Hola, quiero cotizar este producto:
Producto: ${p.nombre}
SKU: ${p.sku}
Marca: ${p.marca}
Precio publicado: $${precioVenta.toLocaleString("es-CL")}`;

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image">
        <img src="${img}" alt="${p.nombre}" onerror="this.src='./assets/fallback-producto.jpg'"/>
        <div class="badge-top">${p.marca}</div>
        <div class="badge-stock ${getStockClass(p.stock)}">
          ${p.stock <= 0 ? "Sin stock" : p.stock <= 5 ? "Stock bajo" : "Disponible"}
        </div>
      </div>

      <div class="product-body">
        <div class="product-category">${p.categoria}</div>
        <h3 class="product-name">${p.nombre}</h3>

        <div class="product-meta">
          <div>${p.unidad || "UNI"}</div>
          <div>SKU: ${p.sku}</div>
        </div>

        <div class="product-prices">
          <div class="price-row">
            <span class="price-label">Costo con IVA</span>
            <span class="price-base">$${costoConIva.toLocaleString("es-CL")}</span>
          </div>

          <div class="price-row">
            <span class="price-label">Precio venta</span>
            <span class="price-sale">$${precioVenta.toLocaleString("es-CL")}</span>
          </div>

          <div class="price-row saving-row">
            <span class="price-label">Margen estimado</span>
            <span class="price-saving">$${ganancia.toLocaleString("es-CL")}</span>
          </div>
        </div>

        <div class="product-actions">
          <a
            class="btn-product btn-wa"
            href="https://wa.me/${PHONE}?text=${encodeURIComponent(mensaje)}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cotizar por WhatsApp
          </a>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

function aplicarFiltros() {
  const search = document.getElementById("searchInput").value.toLowerCase().trim();
  const categoria = document.getElementById("categoryFilter").value;
  const marca = document.getElementById("brandFilter").value;
  const stock = document.getElementById("stockFilter").value;

  filtrados = productos.filter(p => {
    if (p.estado !== "activo") return false;

    if (search) {
      const nombre = (p.nombre || "").toLowerCase();
      const sku = (p.sku || "").toLowerCase();
      const marcaTxt = (p.marca || "").toLowerCase();

      if (
        !nombre.includes(search) &&
        !sku.includes(search) &&
        !marcaTxt.includes(search)
      ) {
        return false;
      }
    }

    if (categoria && p.categoria !== categoria) return false;
    if (marca && p.marca !== marca) return false;

    if (stock === "con" && p.stock <= 0) return false;
    if (stock === "bajo" && (p.stock > 5 || p.stock <= 0)) return false;
    if (stock === "sin" && p.stock > 0) return false;

    return true;
  });

  renderProductos();
  actualizarResumen();
}

function actualizarResumen() {
  document.getElementById("summaryProducts").textContent = filtrados.length;

  const categorias = new Set(filtrados.map(p => p.categoria));
  const marcas = new Set(filtrados.map(p => p.marca));

  document.getElementById("summaryCategories").textContent = categorias.size;
  document.getElementById("summaryBrands").textContent = marcas.size;
}

document.getElementById("searchInput").addEventListener("input", aplicarFiltros);
document.getElementById("categoryFilter").addEventListener("change", aplicarFiltros);
document.getElementById("brandFilter").addEventListener("change", aplicarFiltros);
document.getElementById("stockFilter").addEventListener("change", aplicarFiltros);

cargarProductos();
