const WHATSAPP_NUMERO = "56954486171";

/* =========================
   HELPERS GENERALES
========================= */

function safeText(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function escapeHtml(value) {
  return safeText(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function openWhatsApp(message) {
  const text = safeText(message);
  const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(text)}`;
  window.location.href = url;
}

function quickWhatsApp() {
  const msg = `Hola, necesito información comercial de Mundo D&H.
Quisiera cotizar productos o coordinar una atención para empresa o pyme en Gran Talcahuano.`;
  openWhatsApp(msg);
}

/* =========================
   FORMULARIO EMPRESAS
========================= */

function sendCompanyRequest() {
  const rs = val("rs");
  const rut = val("rut");
  const contacto = val("contacto");
  const fono = val("fono");
  const email = val("email");
  const comuna = val("comuna");
  const direccion = val("direccion");
  const tipo = document.getElementById("tipo")?.value || "Cotización empresa";
  const plazo = document.getElementById("plazo")?.value || "Pago contra entrega";
  const detalle = val("detalle");

  if (!rs || !rut || !contacto || !fono || !comuna || !direccion || !detalle) {
    alert("Completa los campos obligatorios: razón social, RUT, contacto, teléfono, comuna, dirección y detalle.");
    return;
  }

  const msg = `Solicitud comercial — Mundo D&H

Razón social: ${rs}
RUT empresa: ${rut}

Contacto: ${contacto}
Teléfono: ${fono}
Correo: ${email || "(no informado)"}

Comuna: ${comuna}
Dirección: ${direccion}

Tipo de atención: ${tipo}
Modalidad / plazo: ${plazo}

Detalle del requerimiento:
${detalle}

Condiciones generales:
- Atención comercial para empresas, pymes, oficinas, colegios e instituciones
- Foco de cobertura: Gran Talcahuano
- Entrega estimada de 2 a 4 días hábiles según disponibilidad
- Crédito comercial sujeto a evaluación
- Pago contra entrega disponible

Agradeceré confirmación de factibilidad, disponibilidad y pasos siguientes.`;

  openWhatsApp(msg);
}

function clearForm() {
  ["rs", "rut", "contacto", "fono", "email", "comuna", "direccion", "detalle"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  const tipo = document.getElementById("tipo");
  const plazo = document.getElementById("plazo");

  if (tipo) tipo.value = "Cotización empresa";
  if (plazo) plazo.value = "Pago contra entrega";
}

/* =========================
   SLIDER GENÉRICO
========================= */

(function setupSlider() {
  const slider = document.getElementById("heroSlider");
  const dotsContainer = document.getElementById("heroDots");

  if (!slider || !dotsContainer) return;

  const slides = Array.from(slider.querySelectorAll(".slide"));
  if (!slides.length) return;

  let current = 0;
  let timer = null;

  function renderDots() {
    dotsContainer.innerHTML = "";

    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = index === current ? "active" : "";

      dot.addEventListener("click", () => {
        goTo(index);
        restart();
      });

      dotsContainer.appendChild(dot);
    });
  }

  function show(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });

    current = index;
    renderDots();
  }

  function goTo(index) {
    show(index);
  }

  function next() {
    const nextIndex = (current + 1) % slides.length;
    show(nextIndex);
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(next, 3500);
  }

  show(0);
  restart();
})();

/* =========================
   CATÁLOGO DE PRODUCTOS
========================= */

function formatoPeso(valor) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  }).format(Number(valor || 0));
}

function precioVenta(producto) {
  const neto = Number(producto.precioNeto || 0);
  const margen = Number(producto.margen ?? 0.39);
  return Math.round(neto * (1 + margen));
}

function badgeStock(stock) {
  const s = Number(stock || 0);

  if (s <= 0) return { texto: "Sin stock", clase: "out" };
  if (s <= 5) return { texto: "Stock bajo", clase: "low" };

  return { texto: "Disponible", clase: "" };
}

function imagenFallback(producto) {
  const categoria = safeText(producto.categoria).toLowerCase();

  if (categoria.includes("aseo")) return "./assets/fallback-aseo.jpg";
  if (categoria.includes("oficina")) return "./assets/fallback-oficina.jpg";
  if (categoria.includes("escolar")) return "./assets/fallback-escolar.jpg";

  return "./assets/fallback-producto.jpg";
}

function referenciaUnidad(producto) {
  const unidades = Number(producto.unidadesPorPack || 1);
  const venta = precioVenta(producto);
  const tipoVenta = safeText(producto.tipoVenta).toLowerCase();

  if (tipoVenta === "pack" && unidades > 1) {
    return `Aprox. ${formatoPeso(Math.round(venta / unidades))} por unidad interna`;
  }

  return "Venta por unidad comercial";
}

function linkProductoWhatsApp(producto) {
  const msg = `Hola, quiero cotizar este producto de Mundo D&H:

SKU: ${safeText(producto.sku) || "-"}
Producto: ${safeText(producto.nombre) || "-"}
Marca: ${safeText(producto.marca) || "-"}
Unidad de venta: ${safeText(producto.unidad) || "-"}
Precio referencia: ${formatoPeso(precioVenta(producto))}
Stock publicado: ${Number(producto.stock ?? 0)}

Quedo atento a disponibilidad y condiciones comerciales.`;

  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(msg)}`;
}

function normalizarProducto(p) {
  return {
    ...p,
    nombre: safeText(p.nombre),
    marca: safeText(p.marca),
    sku: safeText(p.sku),
    unidad: safeText(p.unidad),
    categoria: safeText(p.categoria),
    descripcion: safeText(p.descripcion),
    imagen: safeText(p.imagen),
    tipoVenta: safeText(p.tipoVenta || "unidad"),
    estado: safeText(p.estado || "activo").toLowerCase(),
    precioNeto: Number(p.precioNeto || 0),
    stock: Number(p.stock || 0),
    unidadesPorPack: Number(p.unidadesPorPack || 1),
    margen: Number(p.margen ?? 0.39)
  };
}

async function cargarCatalogo() {
  const grid = document.getElementById("catalogGrid");
  if (!grid) return;

  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const brandFilter = document.getElementById("brandFilter");
  const stockFilter = document.getElementById("stockFilter");

  const summaryProducts = document.getElementById("summaryProducts");
  const summaryCategories = document.getElementById("summaryCategories");
  const summaryBrands = document.getElementById("summaryBrands");

  let productos = [];

  try {
    const response = await fetch("productos.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("No se pudo cargar productos.json");
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("productos.json no tiene formato de lista");
    }

    productos = data
      .filter((p) => p && typeof p === "object")
      .map(normalizarProducto)
      .filter((p) => p.precioNeto > 0);
  } catch (error) {
    console.error(error);
    grid.innerHTML = `
      <div class="empty-state">
        <h3>No se pudo cargar el catálogo</h3>
        <p>Revisa que <strong>productos.json</strong> exista y tenga formato JSON válido.</p>
      </div>
    `;
    return;
  }

  const categorias = [...new Set(productos.map((p) => p.categoria).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const marcas = [...new Set(productos.map((p) => p.marca).filter(Boolean))].sort((a, b) => a.localeCompare(b));

  if (categoryFilter) {
    categoryFilter.innerHTML = `<option value="">Todas las categorías</option>`;
    categorias.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categoryFilter.appendChild(option);
    });
  }

  if (brandFilter) {
    brandFilter.innerHTML = `<option value="">Todas las marcas</option>`;
    marcas.forEach((marca) => {
      const option = document.createElement("option");
      option.value = marca;
      option.textContent = marca;
      brandFilter.appendChild(option);
    });
  }

  function actualizarResumen(lista) {
    if (summaryProducts) summaryProducts.textContent = String(lista.length);
    if (summaryCategories) summaryCategories.textContent = String(new Set(lista.map((p) => p.categoria).filter(Boolean)).size);
    if (summaryBrands) summaryBrands.textContent = String(new Set(lista.map((p) => p.marca).filter(Boolean)).size);
  }

  function render(lista) {
    grid.innerHTML = "";

    if (!lista.length) {
      grid.innerHTML = `
        <div class="empty-state">
          <h3>No encontramos productos</h3>
          <p>Prueba con otra búsqueda o cambia los filtros.</p>
        </div>
      `;
      actualizarResumen([]);
      return;
    }

    lista.forEach((producto) => {
      const stock = badgeStock(producto.stock);
      const imagen = producto.imagen || imagenFallback(producto);

      const card = document.createElement("article");
      card.className = "product-card";

      card.innerHTML = `
        <div class="product-image">
          <span class="badge-top">${escapeHtml((producto.tipoVenta || "unidad").toUpperCase())}</span>
          <span class="badge-stock ${escapeHtml(stock.clase)}">${escapeHtml(stock.texto)}</span>
          <img
            src="${escapeHtml(imagen)}"
            alt="${escapeHtml(producto.nombre || "Producto Mundo D&H")}"
            loading="lazy"
            onerror="this.onerror=null;this.src='./assets/fallback-producto.jpg';"
          >
        </div>

        <div class="product-body">
          <div class="product-category">${escapeHtml(producto.categoria || "Sin categoría")}</div>
          <h3 class="product-name">${escapeHtml(producto.nombre || "Producto")}</h3>

          <div class="product-meta">
            <div><strong>SKU:</strong> ${escapeHtml(producto.sku || "-")}</div>
            <div><strong>Marca:</strong> ${escapeHtml(producto.marca || "-")}</div>
            <div><strong>Unidad:</strong> ${escapeHtml(producto.unidad || "-")}</div>
            <div><strong>Stock:</strong> ${escapeHtml(String(producto.stock))}</div>
            <div>${escapeHtml(producto.descripcion || "")}</div>
          </div>

          <div class="product-prices">
            <div class="price-row">
              <span class="price-label">Precio</span>
              <span class="price-sale">${escapeHtml(formatoPeso(precioVenta(producto)))}</span>
            </div>
            <div class="price-row">
              <span class="price-label">Referencia</span>
              <span class="price-value">${escapeHtml(referenciaUnidad(producto))}</span>
            </div>
          </div>

          <div class="product-actions">
            <a class="btn-product btn-wa" href="${linkProductoWhatsApp(producto)}" target="_blank" rel="noopener noreferrer">
              Cotizar por WhatsApp
            </a>
            <button class="btn-product btn-secondary-lite" type="button">
              ${escapeHtml((producto.tipoVenta || "unidad").toLowerCase() === "pack" ? "Venta por pack / bobina" : "Venta unitaria")}
            </button>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });

    actualizarResumen(lista);
  }

  function aplicarFiltros() {
    const texto = safeText(searchInput?.value).toLowerCase();
    const categoria = safeText(categoryFilter?.value);
    const marca = safeText(brandFilter?.value);
    const filtroStock = safeText(stockFilter?.value);

    const filtrados = productos.filter((producto) => {
      if (producto.estado && producto.estado !== "activo") return false;

      const coincideTexto =
        !texto ||
        producto.nombre.toLowerCase().includes(texto) ||
        producto.marca.toLowerCase().includes(texto) ||
        producto.sku.toLowerCase().includes(texto);

      const coincideCategoria = !categoria || producto.categoria === categoria;
      const coincideMarca = !marca || producto.marca === marca;

      let coincideStock = true;
      if (filtroStock === "con") coincideStock = producto.stock > 0;
      if (filtroStock === "bajo") coincideStock = producto.stock > 0 && producto.stock <= 5;
      if (filtroStock === "sin") coincideStock = producto.stock <= 0;

      return coincideTexto && coincideCategoria && coincideMarca && coincideStock;
    });

    render(filtrados);
  }

  searchInput?.addEventListener("input", aplicarFiltros);
  categoryFilter?.addEventListener("change", aplicarFiltros);
  brandFilter?.addEventListener("change", aplicarFiltros);
  stockFilter?.addEventListener("change", aplicarFiltros);

  render(productos.filter((p) => p.estado === "activo"));
}

document.addEventListener("DOMContentLoaded", () => {
  cargarCatalogo();
});
