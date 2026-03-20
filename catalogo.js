<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Mundo D&H | Catálogo comercial</title>
  <meta
    name="description"
    content="Catálogo comercial de Mundo D&H. Productos para empresas, oficinas, colegios e instituciones con cotización rápida por WhatsApp."
  />
  <meta name="theme-color" content="#c8102e" />
  <link rel="stylesheet" href="style.css" />

  <style>
    .catalog-shell{
      background:
        radial-gradient(circle at top right, rgba(200,16,46,.06), transparent 24%),
        linear-gradient(180deg, #f8fafc 0%, #f3f6fa 100%);
      min-height:100vh;
      padding:28px 0 54px;
    }

    .catalog-top{
      background:
        linear-gradient(135deg, rgba(200,16,46,.96) 0%, rgba(159,15,37,.98) 100%);
      color:#fff;
      border-radius:30px;
      padding:30px;
      box-shadow:0 26px 54px rgba(159,15,37,.18);
      overflow:hidden;
      position:relative;
      margin-top:24px;
    }

    .catalog-top::after{
      content:"";
      position:absolute;
      top:-60px;
      right:-60px;
      width:220px;
      height:220px;
      border-radius:999px;
      background:rgba(255,255,255,.08);
      filter:blur(2px);
    }

    .catalog-top-grid{
      position:relative;
      z-index:1;
      display:grid;
      grid-template-columns:1.1fr .9fr;
      gap:22px;
      align-items:end;
    }

    .catalog-kicker{
      display:inline-flex;
      align-items:center;
      gap:8px;
      padding:9px 14px;
      border-radius:999px;
      background:rgba(255,255,255,.12);
      border:1px solid rgba(255,255,255,.18);
      font-size:12px;
      font-weight:800;
      letter-spacing:.05em;
      text-transform:uppercase;
      margin-bottom:14px;
    }

    .catalog-top h1{
      margin:0 0 10px;
      font-size:46px;
      line-height:1.02;
      letter-spacing:-1.2px;
      max-width:760px;
    }

    .catalog-top p{
      margin:0;
      max-width:760px;
      color:rgba(255,255,255,.92);
      font-size:16px;
      line-height:1.7;
    }

    .catalog-side-note{
      background:rgba(255,255,255,.12);
      border:1px solid rgba(255,255,255,.18);
      border-radius:22px;
      padding:20px;
      backdrop-filter:blur(8px);
      -webkit-backdrop-filter:blur(8px);
    }

    .catalog-side-note strong{
      display:block;
      font-size:18px;
      margin-bottom:6px;
    }

    .catalog-side-note span{
      display:block;
      color:rgba(255,255,255,.9);
      line-height:1.65;
      font-size:14px;
    }

    .catalog-toolbar{
      margin-top:-22px;
      position:relative;
      z-index:3;
    }

    .catalog-toolbar-card{
      background:#fff;
      border:1px solid #e6ebf2;
      border-radius:24px;
      padding:18px;
      box-shadow:0 18px 38px rgba(20,32,51,.08);
    }

    .catalog-tools{
      display:grid;
      grid-template-columns:1.35fr .85fr .85fr .75fr;
      gap:12px;
    }

    .catalog-tools input,
    .catalog-tools select{
      width:100%;
      border:1px solid #dbe3ee;
      border-radius:14px;
      padding:14px 14px;
      font-size:14px;
      background:#fff;
      color:#132033;
      outline:none;
      transition:.18s ease;
    }

    .catalog-tools input:focus,
    .catalog-tools select:focus{
      border-color:#86a9cb;
      box-shadow:0 0 0 4px rgba(15,76,129,.08);
    }

    .catalog-stats{
      display:grid;
      grid-template-columns:repeat(3, 1fr);
      gap:14px;
      margin:18px 0 22px;
    }

    .catalog-stat{
      background:#fff;
      border:1px solid #e6ebf2;
      border-radius:22px;
      padding:18px 20px;
      box-shadow:0 10px 24px rgba(20,32,51,.05);
    }

    .catalog-stat strong{
      display:block;
      font-size:28px;
      line-height:1;
      color:#132033;
      margin-bottom:8px;
      letter-spacing:-.5px;
    }

    .catalog-stat span{
      color:#64748b;
      font-size:14px;
      line-height:1.5;
      font-weight:700;
    }

    .catalog-content{
      display:grid;
      grid-template-columns:280px 1fr;
      gap:18px;
      align-items:start;
    }

    .catalog-aside{
      position:sticky;
      top:18px;
      display:grid;
      gap:14px;
    }

    .aside-card{
      background:#fff;
      border:1px solid #e6ebf2;
      border-radius:22px;
      padding:18px;
      box-shadow:0 10px 24px rgba(20,32,51,.05);
    }

    .aside-card h3{
      margin:0 0 10px;
      font-size:18px;
      color:#132033;
    }

    .aside-card p{
      margin:0;
      color:#64748b;
      line-height:1.65;
      font-size:14px;
    }

    .aside-list{
      margin:0;
      padding-left:18px;
      color:#64748b;
      line-height:1.8;
      font-size:14px;
    }

    .aside-cta{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      width:100%;
      margin-top:14px;
      border-radius:14px;
      padding:13px 14px;
      background:#128C7E;
      color:#fff;
      font-weight:800;
      text-decoration:none;
      box-shadow:0 12px 24px rgba(18,140,126,.18);
    }

    .aside-cta:hover{
      background:#0f766a;
    }

    .catalog-main{
      min-width:0;
    }

    .catalog-grid{
      display:grid;
      grid-template-columns:repeat(3, 1fr);
      gap:16px;
    }

    .product-card{
      background:#fff;
      border:1px solid #e5ebf3;
      border-radius:24px;
      overflow:hidden;
      box-shadow:0 12px 30px rgba(20,32,51,.06);
      display:flex;
      flex-direction:column;
      transition:.18s ease;
      min-height:100%;
    }

    .product-card:hover{
      transform:translateY(-4px);
      box-shadow:0 18px 36px rgba(20,32,51,.10);
    }

    .product-image{
      position:relative;
      height:220px;
      background:
        linear-gradient(180deg, #f8fafc 0%, #eef3f8 100%);
      overflow:hidden;
    }

    .product-image img{
      width:100%;
      height:100%;
      object-fit:contain;
      padding:18px;
      display:block;
    }

    .badge-top{
      position:absolute;
      top:12px;
      left:12px;
      display:inline-flex;
      align-items:center;
      gap:6px;
      background:rgba(19,32,51,.90);
      color:#fff;
      padding:8px 10px;
      border-radius:999px;
      font-size:11px;
      font-weight:800;
      z-index:2;
      max-width:calc(100% - 24px);
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }

    .badge-stock{
      position:absolute;
      top:12px;
      right:12px;
      padding:8px 10px;
      border-radius:999px;
      font-size:11px;
      font-weight:800;
      z-index:2;
      background:#eaf8ee;
      color:#16733d;
      border:1px solid #caecd5;
    }

    .badge-stock.low{
      background:#fff6e8;
      color:#9a6500;
      border-color:#f1d9a8;
    }

    .badge-stock.out{
      background:#fff0f0;
      color:#a11a1a;
      border-color:#f0c4c4;
    }

    .product-body{
      padding:18px;
      display:flex;
      flex-direction:column;
      gap:12px;
      flex:1;
    }

    .product-category{
      font-size:11px;
      font-weight:900;
      color:#c8102e;
      text-transform:uppercase;
      letter-spacing:.08em;
    }

    .product-name{
      margin:0;
      font-size:18px;
      line-height:1.28;
      color:#132033;
      letter-spacing:-.25px;
      min-height:46px;
    }

    .product-meta{
      display:grid;
      gap:5px;
      color:#5f6d80;
      font-size:13px;
      line-height:1.5;
    }

    .product-prices{
      margin-top:auto;
      display:grid;
      gap:6px;
      padding-top:12px;
      border-top:1px solid #edf1f6;
    }

    .price-row{
      display:flex;
      justify-content:space-between;
      gap:10px;
      align-items:center;
      font-size:14px;
    }

    .price-label{
      color:#607086;
    }

    .price-sale{
      font-size:24px;
      color:#c8102e;
      font-weight:900;
      line-height:1;
      letter-spacing:-.5px;
    }

    .product-actions{
      display:grid;
      gap:10px;
      margin-top:12px;
    }

    .btn-product{
      display:inline-flex;
      justify-content:center;
      align-items:center;
      width:100%;
      border:none;
      border-radius:14px;
      padding:13px 14px;
      font-size:14px;
      font-weight:800;
      text-decoration:none;
      cursor:pointer;
      transition:.18s ease;
    }

    .btn-wa{
      background:#128C7E;
      color:#fff;
      box-shadow:0 12px 24px rgba(18,140,126,.16);
    }

    .btn-wa:hover{
      background:#0f766a;
    }

    .empty-state{
      grid-column:1 / -1;
      background:#fff;
      border:1px solid #e5ebf3;
      border-radius:24px;
      padding:40px 24px;
      text-align:center;
      color:#607086;
      box-shadow:0 10px 24px rgba(20,32,51,.05);
    }

    @media (max-width:1180px){
      .catalog-top-grid{
        grid-template-columns:1fr;
      }

      .catalog-content{
        grid-template-columns:1fr;
      }

      .catalog-aside{
        position:static;
        grid-template-columns:repeat(2, 1fr);
      }

      .catalog-grid{
        grid-template-columns:repeat(2, 1fr);
      }

      .catalog-tools{
        grid-template-columns:1fr 1fr;
      }
    }

    @media (max-width:820px){
      .catalog-top{
        padding:24px 20px;
      }

      .catalog-top h1{
        font-size:34px;
      }

      .catalog-stats{
        grid-template-columns:1fr;
      }

      .catalog-aside{
        grid-template-columns:1fr;
      }

      .catalog-grid{
        grid-template-columns:1fr;
      }
    }

    @media (max-width:620px){
      .catalog-tools{
        grid-template-columns:1fr;
      }

      .catalog-top h1{
        font-size:28px;
      }

      .product-name{
        min-height:auto;
      }
    }
  </style>
</head>
<body>
  <div class="topbar">
    <div class="wrap topbar-inner">
      <div class="topbar-left">
        <span>Gran Talcahuano</span>
        <span>Catálogo comercial</span>
      </div>
      <div class="topbar-right">
        <span>Pedidos coordinados</span>
        <span>Cotización por WhatsApp</span>
      </div>
    </div>
  </div>

  <header class="header small-header">
    <div class="wrap nav">
      <a class="brand" href="index.html">
        <img src="./logotipo.png" alt="Mundo D&H" class="brand-logo" />
      </a>

      <nav class="menu">
        <a href="index.html">Inicio</a>
        <a href="catalogo.html">Catálogo</a>
        <a href="empresas.html">Empresas</a>
        <a href="contacto.html">Contacto</a>
      </nav>

      <a class="btn btn-yellow" href="whatsapp.html">Cotizar</a>
    </div>
  </header>

  <main class="catalog-shell">
    <div class="wrap">
      <section class="catalog-top">
        <div class="catalog-top-grid">
          <div>
            <div class="catalog-kicker">Mundo D&amp;H · catálogo comercial</div>
            <h1>Productos para empresas, oficinas y compras recurrentes</h1>
            <p>
              Explora el catálogo y cotiza de forma rápida por WhatsApp. Ideal para oficinas,
              pymes, colegios, instituciones y abastecimiento comercial en Gran Talcahuano.
            </p>
          </div>

          <div class="catalog-side-note">
            <strong>Atención comercial directa</strong>
            <span>
              Catálogo orientado a cotización y coordinación. Revisa marcas, formatos,
              categorías y solicita tu pedido con atención rápida.
            </span>
          </div>
        </div>
      </section>

      <section class="catalog-toolbar">
        <div class="catalog-toolbar-card">
          <div class="catalog-tools">
            <input type="text" id="searchInput" placeholder="Buscar producto, marca o SKU..." />

            <select id="categoryFilter">
              <option value="">Todas las categorías</option>
            </select>

            <select id="brandFilter">
              <option value="">Todas las marcas</option>
            </select>

            <select id="stockFilter">
              <option value="">Todo stock</option>
              <option value="con">Con stock</option>
              <option value="bajo">Stock bajo</option>
              <option value="sin">Sin stock</option>
            </select>
          </div>
        </div>
      </section>

      <section class="catalog-stats">
        <article class="catalog-stat">
          <strong id="summaryProducts">0</strong>
          <span>Productos visibles</span>
        </article>

        <article class="catalog-stat">
          <strong id="summaryCategories">0</strong>
          <span>Categorías activas</span>
        </article>

        <article class="catalog-stat">
          <strong id="summaryBrands">0</strong>
          <span>Marcas visibles</span>
        </article>
      </section>

      <section class="catalog-content">
        <aside class="catalog-aside">
          <article class="aside-card">
            <h3>Compra más simple</h3>
            <p>
              Busca por producto, marca o SKU y cotiza directo desde la misma ficha.
            </p>
          </article>

          <article class="aside-card">
            <h3>Enfoque comercial</h3>
            <ul class="aside-list">
              <li>Productos para oficina y empresa</li>
              <li>Categorías claras</li>
              <li>Cotización rápida por WhatsApp</li>
            </ul>

            <a class="aside-cta" href="whatsapp.html">Ir a cotizar</a>
          </article>
        </aside>

        <section class="catalog-main">
          <div class="catalog-grid" id="catalogGrid"></div>
        </section>
      </section>
    </div>
  </main>

  <footer class="footer">
    <div class="wrap footer-grid">
      <div>
        <img src="./logotipo.png" alt="Mundo D&H" class="footer-logo" />
        <p>Mundo D&amp;H · catálogo comercial con foco en Gran Talcahuano.</p>
      </div>

      <div>
        <h4>Navegación</h4>
        <a href="index.html">Inicio</a>
        <a href="catalogo.html">Catálogo</a>
        <a href="empresas.html">Empresas</a>
        <a href="contacto.html">Contacto</a>
      </div>

      <div>
        <h4>Cobertura</h4>
        <div>Talcahuano</div>
        <div>Hualpén</div>
        <div>Penco · Lirquén · Tomé</div>
      </div>

      <div>
        <h4>Contacto</h4>
        <div>dhasociados25@gmail.com</div>
        <div>hernancorrealara@gmail.com</div>
      </div>
    </div>
  </footer>

  <script src="catalogo.js"></script>
</body>
</html>
