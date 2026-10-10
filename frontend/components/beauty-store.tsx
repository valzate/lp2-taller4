'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Heart, LoaderCircle, Search, Sparkles } from 'lucide-react'

type Product = {
  id: string | number
  nombre?: string
  name?: string
  precio?: number | string
  price?: number | string
  categoria?: string
  category?: string
  descripcion?: string
  description?: string
  imagen?: string
  image?: string
  imagen_url?: string
  image_url?: string
  beneficios?: string[] | string
  benefits?: string[] | string
  modo_uso?: string
  how_to_use?: string
  disponible?: boolean
  available?: boolean
  stock?: number
}

const categories = ['Todos', 'Maquillaje', 'Skincare']
const PRODUCTS_ENDPOINT = process.env.NEXT_PUBLIC_PRODUCTS_API_URL || '/api/productos/'

function getName(product: Product) { return product.nombre ?? product.name ?? 'Producto sin nombre' }
function getCategory(product: Product) {
const category = product.categoria ?? product.category ?? ''

// Si la categoría es un objeto, obtenemos su nombre.
const categoryName =
typeof category === 'object' && category !== null
? category.nombre ?? ''
: category

// Convertimos el nombre a texto y minúsculas.
const name = String(categoryName).toLowerCase()

// Clasificamos el producto.
return name.includes('skin') || name.includes('cuidado')
? 'Skincare'
: 'Maquillaje'
}
function getPrice(product: Product) {
  const value = Number(product.precio ?? product.price ?? 0)
  return Number.isFinite(value) ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value) : 'Consultar'
}
function getDescription(product: Product) { return product.descripcion ?? product.description ?? 'Descubre una fórmula pensada para acompañar tu rutina de belleza.' }
function getImage(product: Product) { return product.imagen_url ?? product.imagen ?? product.image_url ?? product.image }

function ProductImage({ product, large = false }: { product: Product; large?: boolean }) {
  const [failed, setFailed] = useState(false)
  const image = getImage(product)
  return (
    <div className={`product-image ${large ? 'product-image-large' : ''}`}>
      {image && !failed ? <img src={image} alt={getName(product)} onError={() => setFailed(true)} /> : <div className="image-fallback"><Sparkles size={large ? 34 : 24} /><span>Imagen no disponible</span></div>}
    </div>
  )
}

function Header({ count }: { count: number }) {
  return <header className="site-header">
    <div className="announcement">Envíos gratis por compras superiores a $150.000</div>
    <div className="header-inner">
      <Link href="/" className="brand" aria-label="Lúmina inicio"><span className="brand-mark">L</span><span>LÚMINA</span></Link>
      <nav className="desktop-nav" aria-label="Navegación principal"><Link href="#catalogo">Catálogo</Link><Link href="#esencia">Nuestra esencia</Link><Link href="#contacto">Contacto</Link></nav>
      <div className="header-actions"><button className="icon-button" aria-label="Buscar"><Search size={19} /></button><button className="bag-button" aria-label={`${count} productos en el carrito`}>Bag <span>{count}</span></button></div>
    </div>
  </header>
}

export default function BeautyStore() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todos')
  const [selected, setSelected] = useState<Product | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')

    fetch(PRODUCTS_ENDPOINT, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
      .then(async response => {
        if (!response.ok) throw new Error(`Error ${response.status}`)
        const data = await response.json()
        const list = Array.isArray(data) ? data : data.productos ?? data.products ?? data.results ?? []
        if (!Array.isArray(list)) throw new Error('Formato de respuesta no válido')
        setProducts(list.slice(0, 8))
      })
      .catch(reason => {
        if (reason.name !== 'AbortError') setError('No pudimos conectar con el catálogo. Intenta nuevamente en unos minutos.')
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [])

  const filtered = useMemo(() => products.filter(product => {
    const matchesCategory = category === 'Todos' || getCategory(product) === category
    return matchesCategory && getName(product).toLowerCase().includes(query.toLowerCase())
  }), [products, category, query])

  if (selected) return <main className="store-shell"><Header count={0} /><section className="detail-section"><button className="back-link" onClick={() => setSelected(null)}><ArrowLeft size={16} /> Volver al catálogo</button><div className="detail-grid"><ProductImage product={selected} large /><div className="detail-copy"><span className="eyebrow">{getCategory(selected)}</span><h1>{getName(selected)}</h1><p className="detail-price">{getPrice(selected)}</p><p className="detail-description">{getDescription(selected)}</p><div className="detail-block"><h3>Beneficios</h3><ul>{(Array.isArray(selected.beneficios ?? selected.benefits) ? (selected.beneficios ?? selected.benefits) : [selected.beneficios ?? selected.benefits ?? 'Fórmula cuidadosamente seleccionada para tu rutina.']).map((benefit, index) => <li key={index}>{benefit}</li>)}</ul></div><div className="detail-block"><h3>Modo de uso</h3><p>{selected.modo_uso ?? selected.how_to_use ?? 'Aplicar sobre la piel limpia según las indicaciones de tu rutina habitual.'}</p></div><div className="availability">{selected.disponible === false || selected.available === false || selected.stock === 0 ? 'Agotado temporalmente' : 'Disponible para compra'}<span className="availability-dot" /></div><button className="primary-button">Agregar a la bolsa <ArrowRight size={17} /></button></div></div></section></main>

  return <main className="store-shell"><Header count={0} /><section className="hero"><div className="hero-copy"><span className="eyebrow">Belleza, a tu manera</span><h1>Tu ritual,<br /><em>tu brillo.</em></h1><p>Fórmulas que celebran tu piel y productos elegidos para hacer de cada día un momento especial.</p><a href="#catalogo" className="hero-button">Explorar colección <ArrowRight size={17} /></a></div><div className="hero-art" aria-label="Colección de belleza"><div className="art-circle" /><div className="art-bottle art-bottle-one"><span>LÚMINA</span></div><div className="art-bottle art-bottle-two" /><div className="art-flower">✦</div></div></section><section className="catalog-section" id="catalogo"><div className="section-heading"><div><span className="eyebrow">Selección para ti</span><h2>Elige tu esencial</h2></div><span className="product-count">{products.length || 0} productos</span></div><div className="toolbar"><div className="search-box"><Search size={17} /><input aria-label="Buscar productos" placeholder="Buscar por nombre" value={query} onChange={event => setQuery(event.target.value)} /></div><div className="category-tabs" role="group" aria-label="Filtrar por categoría">{categories.map(item => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div></div>{loading ? <div className="status-message"><LoaderCircle className="spin" size={24} /><p>Cargando nuestra selección...</p></div> : error ? <div className="status-message error-message"><p>{error}</p><button onClick={() => window.location.reload()}>Reintentar</button></div> : filtered.length === 0 ? <div className="status-message"><p>No encontramos productos con esos criterios.</p></div> : <div className="product-grid">{filtered.map(product => <article className="product-card" key={product.id}><div className="card-image-wrap"><ProductImage product={product} /><button className="favorite" aria-label={`Guardar ${getName(product)}`}><Heart size={17} /></button><span className="category-label">{getCategory(product)}</span></div><div className="card-content"><h3>{getName(product)}</h3><p>{getDescription(product)}</p><div className="card-footer"><strong>{getPrice(product)}</strong><button onClick={() => setSelected(product)}>Ver detalles <ArrowRight size={15} /></button></div></div></article>)}</div>}</section><section className="essence" id="esencia"><Sparkles size={20} /><p>Creemos que la belleza no se trata de transformar quién eres, sino de revelar todo lo que ya está ahí.</p></section><footer id="contacto">© 2025 Lúmina Beauty <span>Hecho para tu ritual diario.</span></footer></main>
}
