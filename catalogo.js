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
  const categorias = [...new Set(productos.map(p => p.categoria))];
  const marcas = [...new Set(productos.map(p => p.marca))];

  const catSelect = document.getElementById("categoryFilter");
  const brandSelect = document.getElementById("brandFilter");

  categorias.forEach(c => {
    const op = document.createElement("option");
    op.value = c;
    op.textContent = c;
    catSelect.appendChild(op);
  });

  marcas.forEach(m => {
    const op = document.createElement("option");
    op.value = m;
    op.textContent = m;
    brandSelect.appendChild(op);
  });
}

function calcularPrecio(p) {
  return Math.round(p.precioNeto * (1 + p.margen));
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
    grid.innerHTML = `<div class="empty-state">No hay productos</div>`;
    return;
  }

  filtrados.forEach(p => {
    const precio = calcularPrecio(p);

    const img = p.imagen || "./assets/fallback-producto.jpg";

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image">
        <img src="${img}" onerror="this.src='./assets/fallback-producto.jpg'"/>
        <div class="badge-top">${p.marca}</div>
        <div class="badge-stock ${getStockClass(p.stock)}">
          ${p.stock <= 0 ? "Sin stock" : p.stock <= 5 ? "Stock bajo" : "Disponible"}
        </div>
      </div>

      <div class="product-body">
        <div class="product-category">${p.categoria}</div>
        <h3 class="product-name">${p.nombre}</h3>

        <div class="product-meta">
          <div>${p.unidad}</div>
          <div>SKU: ${p.sku}</div>
        </div>

        <div class="product-prices">
          <div class="price-row">
            <span class="price-label">Precio</span>
            <span class="price-sale">$${precio.toLocaleString()}</span>
          </div>
        </div>

        <div class="product-actions">
          <a class="btn-product btn-wa"
            href="https://wa.me/${PHONE}?text=${encodeURIComponent(
              `Hola, quiero cotizar:\n${p.nombre}\nSKU: ${p.sku}\nPrecio: $${precio}`
            )}"
            target="_blank"
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
  const search = document.getElementById("searchInput").value.toLowerCase();
  const categoria = document.getElementById("categoryFilter").value;
  const marca = document.getElementById("brandFilter").value;
  const stock = document.getElementById("stockFilter").value;

  filtrados = productos.filter(p => {
    if (p.estado !== "activo") return false;

    if (search && !p.nombre.toLowerCase().includes(search)) return false;
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
