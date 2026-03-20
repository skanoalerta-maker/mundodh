const WHATSAPP_NUMERO = "56900000000";

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