import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'
import { apiUrl } from '../../api'

const CATS = ['men', 'women', 'kids', 'baby', 'sale']
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

function readImageAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = error => reject(error);
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 800;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
          else { width = Math.round(width * MAX / height); height = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function ProductForm({ editId }) {
  const navigate = useNavigate()
  const toast = useToast()
  const [form, setForm] = useState({
    name: '',
    category: 'men',
    price: '',
    img: '',
    description: '',
    sizes: ['M'],
    details: [''],
    colours: [
      { name: 'Colour 1', img: '' },
      { name: 'Colour 2', img: '' },
      { name: 'Colour 3', img: '' }
    ]
  })
  
  const [loading, setLoading] = useState(editId ? true : false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editId) {
      fetch(apiUrl('/api/products'))
        .then(res => res.json())
        .then(products => {
          const product = products.find(p => p.id === editId)
          if (product) {
            setForm({
              name: product.name,
              category: product.category,
              price: String(product.price),
              img: product.img,
              description: product.description || '',
              sizes: product.sizes || ['M'],
              details: product.details || [''],
              colours: product.colours || [
                { name: 'Colour 1', img: '' },
                { name: 'Colour 2', img: '' },
                { name: 'Colour 3', img: '' }
              ]
            })
          }
          setLoading(false)
        })
        .catch(err => {
          console.error('Error fetching product for edit:', err)
          setLoading(false)
        })
    }
  }, [editId])

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  function toggleSize(s) {
    set('sizes', form.sizes.includes(s) ? form.sizes.filter(x => x !== s) : [...form.sizes, s])
  }

  async function handleMainImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    try {
      const base64 = await readImageAsBase64(file)
      set('img', base64)
      toast('Main image uploaded successfully!', 'info')
    } catch (err) {
      console.error(err)
      toast('Failed to upload main image.', 'error')
    }
  }

  async function handleColourImageUpload(e, index) {
    const file = e.target.files[0]
    if (!file) return
    try {
      const base64 = await readImageAsBase64(file)
      const updatedColours = [...form.colours]
      updatedColours[index] = { ...updatedColours[index], img: base64 }
      set('colours', updatedColours)
      toast(`Colour ${index + 1} image uploaded successfully!`, 'info')
    } catch (err) {
      console.error(err)
      toast('Failed to upload colour image.', 'error')
    }
  }

  function handleColourNameChange(val, index) {
    const updatedColours = [...form.colours]
    updatedColours[index] = { ...updatedColours[index], name: val }
    set('colours', updatedColours)
  }

  function addColourOption() {
    set('colours', [...form.colours, { name: `Colour ${form.colours.length + 1}`, img: '' }])
  }

  function removeColourOption(index) {
    set('colours', form.colours.filter((_, i) => i !== index))
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Product name required'
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Valid price required'
    if (!form.img.trim()) e.img = 'Image required'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const cleanedColours = form.colours
      .filter(c => c.name.trim() && c.img.trim())
      .map(({ _id, __v, ...rest }) => rest)
    const payload = {
      ...form,
      price: Number(form.price),
      details: form.details.filter(d => d.trim()),
      colours: cleanedColours
    }

    try {
      const url = editId ? apiUrl(`/api/products/${editId}`) : apiUrl('/api/products')
      const method = editId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (!res.ok) {
        toast(data.message || 'Error saving product.', 'error')
        return
      }

      toast(editId ? 'Product updated successfully!' : 'Product added successfully!')
      navigate('/admin/products')
    } catch (err) {
      console.error('Error saving product:', err)
      toast('Server error. Failed to save product.', 'error')
    }
  }

  if (loading) {
    return <div style={{ padding: 32, color: '#8b4513' }}>Loading form...</div>
  }

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <h2 style={{ fontFamily: 'Playfair Display,serif', color: '#6b3a2a', marginBottom: 32 }}>{editId ? 'Edit Product' : 'Add Product'}</h2>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e0c9a6', padding: 28 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} className={`form-input${errors.name ? ' error-border' : ''}`} placeholder="Product name" />
            {errors.name && <p className="error-msg">{errors.name}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className="form-input">
                {CATS.map(c => <option key={c} value={c} style={{ textTransform: 'capitalize' }}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Price (Rs.)</label>
              <input type="number" value={form.price} onChange={e => set('price', e.target.value)} className={`form-input${errors.price ? ' error-border' : ''}`} placeholder="0" />
              {errors.price && <p className="error-msg">{errors.price}</p>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Product Main Image (Upload File or Enter URL)</label>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <input value={form.img.startsWith('data:') ? 'Base64 Encoded Image Data' : form.img} 
                onChange={e => set('img', e.target.value)} 
                disabled={form.img.startsWith('data:')}
                className={`form-input${errors.img ? ' error-border' : ''}`} 
                placeholder="Enter URL or choose file ➔" 
                style={{ flex: 1 }}
              />
              <input type="file" accept="image/*" onChange={handleMainImageUpload} style={{ display: 'none' }} id="main-image-file" />
              <label htmlFor="main-image-file" className="btn-outline" style={{ 
                padding: '10px 20px', 
                fontSize: 14, 
                cursor: 'pointer', 
                background: '#8b4513', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 8,
                whiteSpace: 'nowrap'
              }}>
                Choose File
              </label>
              {form.img.startsWith('data:') && (
                <button type="button" onClick={() => set('img', '')} style={{
                  background: '#c0392b', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer'
                }}>
                  Clear
                </button>
              )}
            </div>
            {errors.img && <p className="error-msg">{errors.img}</p>}
            {form.img && <img src={form.img} alt="" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, marginTop: 8, border: '1px solid #e0c9a6' }} />}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} className="form-input" placeholder="Product description..." style={{ resize: 'vertical' }} />
          </div>

          <div className="form-group">
            <label className="form-label">Available Sizes</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {SIZES.map(s => (
                <button type="button" key={s} onClick={() => toggleSize(s)}
                  className={`size-btn${form.sizes?.includes(s) ? ' active' : ''}`}>{s}</button>
              ))}
            </div>
          </div>

          {/* Color variants upload */}
          <div className="form-group" style={{ marginTop: 24, borderTop: '1px solid #e0c9a6', paddingTop: 20 }}>
            <label className="form-label" style={{ fontSize: 16, fontWeight: 600 }}>Color Variants (3-4 colors recommended)</label>
            <p style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>Provide color names and corresponding clothing pictures.</p>
            
            {form.colours?.map((c, i) => (
              <div key={i} style={{ 
                background: '#fdf6ee', 
                border: '1px solid #e0c9a6', 
                borderRadius: 12, 
                padding: 16, 
                marginBottom: 16,
                display: 'grid',
                gridTemplateColumns: '1fr 1.5fr auto',
                gap: 12,
                alignItems: 'center'
              }}>
                <div>
                  <label className="form-label" style={{ fontSize: 12 }}>Color Name</label>
                  <input 
                    value={c.name} 
                    onChange={e => handleColourNameChange(e.target.value, i)} 
                    placeholder="e.g. Red" 
                    className="form-input" 
                  />
                </div>
                
                <div>
                  <label className="form-label" style={{ fontSize: 12 }}>Color Image</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input 
                      value={c.img.startsWith('data:') ? 'Base64 Encoded Image Data' : c.img} 
                      onChange={e => {
                        const updated = [...form.colours]
                        updated[i] = { ...updated[i], img: e.target.value }
                        set('colours', updated)
                      }}
                      disabled={c.img.startsWith('data:')}
                      placeholder="/image/... or choose file ➔" 
                      className="form-input"
                      style={{ flex: 1 }}
                    />
                    <input type="file" accept="image/*" onChange={e => handleColourImageUpload(e, i)} style={{ display: 'none' }} id={`color-file-${i}`} />
                    <label htmlFor={`color-file-${i}`} style={{
                      padding: '9px 14px',
                      fontSize: 12,
                      cursor: 'pointer',
                      background: '#e0c9a6',
                      color: '#6b3a2a',
                      borderRadius: 8,
                      border: 'none',
                      whiteSpace: 'nowrap'
                    }}>
                      Upload
                    </label>
                    {c.img.startsWith('data:') && (
                      <button type="button" onClick={() => {
                        const updated = [...form.colours]
                        updated[i] = { ...updated[i], img: '' }
                        set('colours', updated)
                      }} style={{
                        background: '#c0392b', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 12px', cursor: 'pointer', fontSize: 12
                      }}>
                        Clear
                      </button>
                    )}
                  </div>
                  {c.img && <img src={c.img} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6, marginTop: 6, border: '1px solid #e0c9a6' }} />}
                </div>

                <div style={{ alignSelf: 'end', paddingBottom: 4 }}>
                  {form.colours.length > 1 && (
                    <button type="button" onClick={() => removeColourOption(i)} style={{
                      background: '#c0392b', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 14px', cursor: 'pointer'
                    }}>
                      ✕ Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            <button type="button" onClick={addColourOption} style={{
              background: 'none',
              border: '2px dashed #8b4513',
              color: '#8b4513',
              borderRadius: 8,
              padding: '8px 20px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13
            }}>
              + Add Color Variant
            </button>
          </div>

          <div className="form-group" style={{ marginTop: 24 }}>
            <label className="form-label">Product Details (one per line)</label>
            {(form.details || ['']).map((d, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input value={d} onChange={e => { const a = [...form.details]; a[i] = e.target.value; set('details', a) }} className="form-input" placeholder={`Detail ${i + 1}`} />
                {form.details.length > 1 && <button type="button" onClick={() => set('details', form.details.filter((_, j) => j !== i))}
                  style={{ background: '#c0392b', color: '#fff', border: 'none', borderRadius: 6, padding: '0 12px', cursor: 'pointer' }}>✕</button>}
              </div>
            ))}
            <button type="button" onClick={() => set('details', [...(form.details || []), ''])}
              style={{ background: 'none', border: '1px dashed #8b4513', color: '#8b4513', borderRadius: 8, padding: '6px 16px', cursor: 'pointer', fontSize: 13 }}>+ Add Detail</button>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button type="submit" className="btn-primary">{editId ? 'Update Product' : 'Add Product'}</button>
            <button type="button" onClick={() => navigate('/admin/products')} style={{ background: '#f0dfc0', color: '#6b3a2a', border: 'none', borderRadius: 10, padding: '13px 32px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
