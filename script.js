const WHATSAPP_NUMERO = "56954486171";

function openWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function quickWhatsApp() {
  const msg = `Hola, necesito información comercial de Mundo D&H.
Quisiera cotizar productos o coordinar una atención para empresa o pyme en Gran Talcahuano.`;
  openWhatsApp(msg);
}

function val(id) {
  return (document.getElementById(id)?.value || "").trim();
}

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

🏢 Razón social: ${rs}
🧾 RUT empresa: ${rut}

👤 Contacto: ${contacto}
📞 Teléfono: ${fono}
✉️ Correo: ${email || "(no informado)"}

📍 Comuna: ${comuna}
📌 Dirección: ${direccion}

📂 Tipo de atención: ${tipo}
💳 Modalidad / plazo: ${plazo}

🛒 Detalle del requerimiento:
${detalle}

Condiciones generales:
• Atención comercial para empresas, pymes, oficinas, colegios e instituciones
• Foco de cobertura: Gran Talcahuano
• Entrega estimada de 2 a 4 días hábiles según disponibilidad
• Crédito comercial sujeto a evaluación
• Pago contra entrega disponible

Agradeceré confirmación de factibilidad, disponibilidad y pasos siguientes.`;

  openWhatsApp(msg);
}

function clearForm() {
  ["rs", "rut", "contacto", "fono", "email", "comuna", "direccion", "detalle"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  const tipo = document.getElementById("tipo");
  const plazo = document.getElementById("plazo");

  if (tipo) tipo.value = "Cotización empresa";
  if (plazo) plazo.value = "Pago contra entrega";
}

(function setupSlider() {
  const slider = document.getElementById("heroSlider");
  const dotsContainer = document.getElementById("heroDots");
  if (!slider || !dotsContainer) return;

  const slides = Array.from(slider.querySelectorAll(".slide"));
  let current = 0;
  let timer = null;

  function renderDots() {
    dotsContainer.innerHTML = "";
    slides.forEach((_, index) => {
      const dot = document.createElement("button");
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
  }).format(valor || 0);
}

function precioVenta(producto) {
  const neto = Number(producto.precioNeto || 0);
  const margen = typeof producto.margen === "number" ? producto.margen : 0.39;
  return Math.round(neto * (1 + margen));
}

function badgeStock(stock) {
  const s = Number(stock || 0);
  if (s <= 0) return { texto: "Sin stock", clase: "out" };
  if (s <= 5) return { texto: "Stock bajo", clase: "low" };
  return { texto: "Disponible", clase: "" };
}

function imagenFallback(producto) {
  const categoria = (producto.categoria || "").toLowerCase();

  if (categoria.includes("aseo")) {
    return "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80";
  }
  if (categoria.includes("oficina")) {
    return "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80";
  }
  if (categoria.includes("escolar")) {
    return "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80";
  }

  return "https://via.placeholder.com/900x700/f1f5f9/334155?text=Mundo+D%26H";
}

function referenciaUnidad(producto) {
  const unidades = Number(producto.unidadesPorPack || 1);
  const venta = precioVenta(producto);

  if ((producto.tipoVenta || "").toLowerCase() === "pack" && unidades > 1) {
    return `Aprox. ${formatoPeso(Math.round(venta / unidades))} por unidad interna`;
  }

  return "Venta por unidad comercial";
}

function linkProductoWhatsApp(producto) {
  const msg = `Hola, quiero cotizar este producto de Mundo D&H:

SKU: ${producto.sku || "-"}
Producto: ${producto.nombre || "-"}
Marca: ${producto.marca || "-"}
Unidad de venta: ${producto.unidad || "-"}
Precio referencia: ${formatoPeso(precioVenta(producto))}
Stock publicado: ${producto.stock ?? 0}

Quedo atento a disponibilidad y condiciones comerciales.`;

  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(msg)}`;
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
    if (!response.ok) throw new Error("No se pudo cargar productos.json");
    productos = await response.json();
  } catch (error) {
    grid.innerHTML = `
      <div class="empty-state">
        <h3>No se pudo cargar el catálogo</h3>
        <p>Revisa que el archivo <strong>productos.json</strong> exista en la misma carpeta del sitio.</p>
      </div>
    `;
    return;
  }

  productos = productos.map(p => ({
    ...p,
    precioNeto: Number(p.precioNeto || 0),
    stock: Number(p.stock || 0),
    unidadesPorPack: Number(p.unidadesPorPack || 1),
    margen: typeof p.margen === "number" ? p.margen : 0.39
  }));

  const categorias = [...new Set(productos.map(p => p.categoria).filter(Boolean))].sort();
  const marcas = [...new Set(productos.map(p => p.marca).filter(Boolean))].sort();

  if (categoryFilter) {
    categoryFilter.innerHTML = `<option value="">Todas las categorías</option>`;
    categorias.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categoryFilter.appendChild(option);
    });
  }

  if (brandFilter) {
    brandFilter.innerHTML = `<option value="">Todas las marcas</option>`;
    marcas.forEach(marca => {
      const option = document.createElement("option");
      option.value = marca;
      option.textContent = marca;
      brandFilter.appendChild(option);
    });
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

      if (summaryProducts) summaryProducts.textContent = "0";
      if (summaryCategories) summaryCategories.textContent = "0";
      if (summaryBrands) summaryBrands.textContent = "0";
      return;
    }

    lista.forEach(producto => {
      const stock = badgeStock(producto.stock);
      const imagen = (producto.imagen || "").trim() || imagenFallback(producto);

      const card = document.createElement("article");
      card.className = "product-card";

      card.innerHTML = `
        <div class="product-image">
          <span class="badge-top">${(producto.tipoVenta || "unidad").toUpperCase()}</span>
          <span class="badge-stock ${stock.clase}">${stock.texto}</span>
          <img src="${imagen}" alt="${producto.nombre}" loading="lazy"
               onerror="this.src='https://via.placeholder.com/900x700/f1f5f9/334155?text=Mundo+D%26H';">
        </div>

        <div class="product-body">
          <div class="product-category">${producto.categoria || "Sin categoría"}</div>
          <h3 class="product-name">${producto.nombre || "Producto"}</h3>

          <div class="product-meta">
            <div><strong>SKU:</strong> ${producto.sku || "-"}</div>
            <div><strong>Marca:</strong> ${producto.marca || "-"}</div>
            <div><strong>Unidad:</strong> ${producto.unidad || "-"}</div>
            <div><strong>Stock:</strong> ${producto.stock}</div>
            <div>${producto.descripcion || ""}</div>
          </div>

          <div class="product-prices">
            <div class="price-row">
              <span class="price-label">Precio neto</span>
              <span class="price-value">${formatoPeso(producto.precioNeto)}</span>
            </div>
            <div class="price-row">
              <span class="price-label">Precio venta</span>
              <span class="price-sale">${formatoPeso(precioVenta(producto))}</span>
            </div>
            <div class="price-row">
              <span class="price-label">Referencia</span>
              <span class="price-value">${referenciaUnidad(producto)}</span>
            </div>
          </div>

          <div class="product-actions">
            <a class="btn-product btn-wa" href="${linkProductoWhatsApp(producto)}" target="_blank" rel="noopener">
              Cotizar por WhatsApp
            </a>
            <button class="btn-product btn-secondary-lite" type="button">
              ${(producto.tipoVenta || "unidad").toLowerCase() === "pack" ? "Venta por pack / bobina" : "Venta unitaria"}
            </button>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });

    if (summaryProducts) summaryProducts.textContent = String(lista.length);
    if (summaryCategories) summaryCategories.textContent = String(new Set(lista.map(p => p.categoria).filter(Boolean)).size);
    if (summaryBrands) summaryBrands.textContent = String(new Set(lista.map(p => p.marca).filter(Boolean)).size);
  }

  function aplicarFiltros() {
    const texto = (searchInput?.value || "").trim().toLowerCase();
    const categoria = categoryFilter?.value || "";
    const marca = brandFilter?.value || "";
    const filtroStock = stockFilter?.value || "";

    const filtrados = productos.filter(producto => {
      if (producto.estado && producto.estado !== "activo") return false;

      const coincideTexto =
        !texto ||
        (producto.nombre || "").toLowerCase().includes(texto) ||
        (producto.marca || "").toLowerCase().includes(texto) ||
        (producto.sku || "").toLowerCase().includes(texto);

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

  render(productos.filter(p => !p.estado || p.estado === "activo"));
}

document.addEventListener("DOMContentLoaded", cargarCatalogo);
