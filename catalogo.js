const PHONE = "56954486171";

let productos = [];
let filtrados = [];

async function cargarProductos() {
  try {
    const res = await fetch("productos.json");
    const data = await res.json();

    productos = Array.isArray(data.productos) ? data.productos : [];
    filtrados = productos.filter(p => p.estado === "activo");

    llenarFiltros();
    renderProductos();
    actualizarResumen();
  } catch (e) {
    console.error("Error cargando productos:", e);
    const grid = document.getElementById("catalogGrid");
    if (grid) {
      grid.innerHTML = `<div class="empty-state">No se pudo cargar el catálogo</div>`;
    }
  }
}

function llenarFiltros() {
  const categorias = [...new Set(productos.map(p => p.categoria).filter(Boolean))].sort();
  const marcas = [...new Set(productos.map(p => p.marca).filter(Boolean))].sort();

  const catSelect = document.getElementById("categoryFilter");
  const brandSelect = document.getElementById("brandFilter");

  if (!catSelect || !brandSelect) return;

  catSelect.innerHTML = `<option value="">Todas las categorías</option>`;
  brandSelect.innerHTML = `<option value="">Todas las marcas</option>`;

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
  if (typeof p.precio_web_con_iva === "number") {
    return Math.round(p.precio_web_con_iva);
  }

  if (typeof p.precio === "number") {
    return Math.round(p.precio);
  }

  if (typeof p.precio_proveedor_neto === "number") {
    const costoConIva = p.precio_proveedor_neto * 1.19;
    const margen = typeof p.margen === "number" ? p.margen : 0.2;
    return Math.round(costoConIva * (1 + margen));
  }

  return 0;
}

function getStockValue(p) {
  if (typeof p.stock === "number") return p.stock;
  return 100;
}

function getStockClass(stock) {
  if (stock <= 0) return "out";
  if (stock <= 5) return "low";
  return "";
}

function getStockText(stock) {
  if (stock <= 0) return "Sin stock";
  if (stock <= 5) return "Stock bajo";
  return "Disponible";
}

function renderProductos() {
  const grid = document.getElementById("catalogGrid");
  if (!grid) return;

  grid.innerHTML = "";

  if (filtrados.length === 0) {
    grid.innerHTML = `<div class="empty-state">No hay productos</div>`;
    return;
  }

  filtrados.forEach(p => {
    const precio = calcularPrecio(p);
    const stock = getStockValue(p);
    const img = p.imagen && String(p.imagen).trim() !== ""
      ? p.imagen
      : "./assets/fallback-producto.jpg";

    const codigo = p.codigo || "";
    const nombre = p.nombre || "Producto sin nombre";
    const marca = p.marca || "Sin marca";
    const categoria = p.categoria || "Sin categoría";
    const unidad = p.unidad || "UNI";

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image">
        <img src="${img}" alt="${nombre}" onerror="this.src='./assets/fallback-producto.jpg'"/>
        <div class="badge-top">${marca}</div>
        <div class="badge-stock ${getStockClass(stock)}">
          ${getStockText(stock)}
        </div>
      </div>

      <div class="product-body">
        <div class="product-category">${categoria}</div>
        <h3 class="product-name">${nombre}</h3>

        <div class="product-meta">
          <div>${unidad}</div>
          <div>SKU: ${codigo}</div>
        </div>

        <div class="product-prices">
          <div class="price-row">
            <span class="price-label">Precio</span>
            <span class="price-sale">$${precio.toLocaleString("es-CL")}</span>
          </div>
        </div>

        <div class="product-actions">
          <a
            class="btn-product btn-wa"
            href="https://wa.me/${PHONE}?text=${encodeURIComponent(
              `Hola, quiero cotizar:\n${nombre}\nSKU: ${codigo}\nPrecio: $${precio.toLocaleString("es-CL")}`
            )}"
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
  const search = (document.getElementById("searchInput")?.value || "").toLowerCase().trim();
  const categoria = document.getElementById("categoryFilter")?.value || "";
  const marca = document.getElementById("brandFilter")?.value || "";
  const stockFiltro = document.getElementById("stockFilter")?.value || "";

  filtrados = productos.filter(p => {
    if (p.estado !== "activo") return false;

    const nombre = (p.nombre || "").toLowerCase();
    const codigo = String(p.codigo || "").toLowerCase();
    const marcaTxt = (p.marca || "").toLowerCase();
    const stock = getStockValue(p);

    if (search && !nombre.includes(search) && !codigo.includes(search) && !marcaTxt.includes(search)) {
      return false;
    }

    if (categoria && p.categoria !== categoria) return false;
    if (marca && p.marca !== marca) return false;

    if (stockFiltro === "con" && stock <= 0) return false;
    if (stockFiltro === "bajo" && (stock > 5 || stock <= 0)) return false;
    if (stockFiltro === "sin" && stock > 0) return false;

    return true;
  });

  renderProductos();
  actualizarResumen();
}

function actualizarResumen() {
  const summaryProducts = document.getElementById("summaryProducts");
  const summaryCategories = document.getElementById("summaryCategories");
  const summaryBrands = document.getElementById("summaryBrands");

  if (summaryProducts) summaryProducts.textContent = filtrados.length;

  const categorias = new Set(filtrados.map(p => p.categoria).filter(Boolean));
  const marcas = new Set(filtrados.map(p => p.marca).filter(Boolean));

  if (summaryCategories) summaryCategories.textContent = categorias.size;
  if (summaryBrands) summaryBrands.textContent = marcas.size;
}

document.getElementById("searchInput")?.addEventListener("input", aplicarFiltros);
document.getElementById("categoryFilter")?.addEventListener("change", aplicarFiltros);
document.getElementById("brandFilter")?.addEventListener("change", aplicarFiltros);
document.getElementById("stockFilter")?.addEventListener("change", aplicarFiltros);

cargarProductos();
