import { Heart, Minus, Plus, ShoppingBag, X, Check, Sparkles } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Link } from 'wouter';
import type { Product } from '@/data/products';
import { collections, money } from '@/data/products';

export const artworkVars = (product: Product) => {
  const palette: Record<string, [string,string,string]> = {
    'starry-night': ['#1F3A5F','#F2C84B','#3F78A8'],
    sunflowers: ['#D99A2B','#F2C84B','#6F7F3F'],
    irises: ['#28558C','#A6AE72','#3F78A8'],
    wheatfield: ['#6F7F3F','#F2C84B','#D99A2B'],
    'almond-blossoms': ['#3F78A8','#E8D8B8','#A6AE72'],
  };
  const [bg, blob, accent] = palette[product.collection];
  return { '--art-bg': `linear-gradient(145deg, ${bg}, ${accent})`, '--art-blob': blob, '--art-accent': accent } as CSSProperties;
};

export function ProductArtwork({ product, detail = false }: { product: Product; detail?: boolean }) {
  const collection = collections[product.collection];
  return (
    <div className={detail ? 'detail-image' : 'product-image'} style={artworkVars(product)} data-testid={`img-product-${product.id}`}>
      <span className="art-label">{collection.name}<small>{product.category} / {collection.number}</small></span>
      <div aria-hidden="true" />
    </div>
  );
}

export function ProductCard({ product, wished, onWish, onAdd }: { product: Product; wished: boolean; onWish: () => void; onAdd: () => void }) {
  return (
    <article className="product-card entrance" data-testid={`card-product-${product.id}`}>
      <Link href={`/product/${product.id}`} aria-label={`View ${product.name}`}>
        <div className="product-image-wrap">
          <ProductArtwork product={product} />
          {(product.isNew || product.bestSeller) && <span className="badge">{product.isNew ? 'New in' : 'Beloved'}</span>}
          <button type="button" className="icon-btn wish-float" onClick={(event) => { event.preventDefault(); onWish(); }} aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name}`} data-testid={`button-wishlist-${product.id}`}>
            <Heart size={18} fill={wished ? 'currentColor' : 'none'} />
          </button>
        </div>
      </Link>
      <div className="product-info">
        <div>
          <h3><Link href={`/product/${product.id}`}>{product.name}</Link></h3>
          <p className="product-meta">{collections[product.collection].name} · {product.category}</p>
        </div>
        <span className="price">{money(product.price)}</span>
      </div>
      <div className="product-actions">
        <button className="btn btn-primary" type="button" onClick={onAdd} data-testid={`button-add-${product.id}`}><ShoppingBag size={14} /> Add to bag</button>
        <Link className="btn btn-quiet" href={`/product/${product.id}`}>Details</Link>
      </div>
    </article>
  );
}

export function QuantityControl({ quantity, onChange, testId }: { quantity: number; onChange: (quantity: number) => void; testId: string }) {
  return (
    <div className="quantity" data-testid={testId}>
      <button type="button" onClick={() => onChange(Math.max(1, quantity - 1))} aria-label="Decrease quantity" data-testid={`${testId}-minus`}><Minus size={14} /></button>
      <span>{quantity}</span>
      <button type="button" onClick={() => onChange(quantity + 1)} aria-label="Increase quantity" data-testid={`${testId}-plus`}><Plus size={14} /></button>
    </div>
  );
}

export function EmptyState({ title, text, action, href = '/shop' }: { title: string; text: string; action?: string; href?: string }) {
  return (
    <div className="empty-state" data-testid="empty-state">
      <Sparkles size={29} />
      <h2>{title}</h2>
      <p>{text}</p>
      {action && <Link className="btn btn-primary" href={href}>{action}</Link>}
    </div>
  );
}

export function ToastStack({ toasts, onDismiss }: { toasts: { id: number; message: string }[]; onDismiss: (id: number) => void }) {
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((toast) => (
        <div className="toast" key={toast.id} data-testid={`toast-${toast.id}`}>
          <Check size={17} />
          <span>{toast.message}</span>
          <button className="icon-btn" style={{ marginLeft:'auto', width:24, height:24, color:'inherit' }} onClick={() => onDismiss(toast.id)} aria-label="Dismiss notification"><X size={14} /></button>
        </div>
      ))}
    </div>
  );
}
