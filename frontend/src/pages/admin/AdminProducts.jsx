import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AppTable from '../../components/AppTable'
import Modal from '../../components/Modal'
import { useToast } from '../../context/ToastContext'
import { apiUrl } from '../../api'

export default function AdminProducts() {
  const toast = useToast()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  function loadProducts() {
    setLoading(true)
    fetch(apiUrl('/api/products'))
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching products:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadProducts()
  }, [])

  function deleteProduct(id) {
    fetch(apiUrl(`/api/products/${id}`), {
      method: 'DELETE'
    })
      .then(res => {
        if (res.ok) {
          toast('Product deleted.', 'info')
          loadProducts()
        } else {
          toast('Failed to delete product.', 'error')
        }
      })
      .catch(err => {
        console.error('Error deleting product:', err)
        toast('Failed to delete product.', 'error')
      })
      .finally(() => {
        setDeleteId(null)
      })
  }

  const filteredProducts = products.filter(p =>
    (p.name || '').toLowerCase().includes(searchText.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(searchText.toLowerCase())
  )

  const columns = [
    { 
      key: 'img', 
      label: 'Image', 
      render: function(img) {
        return <img src={img} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} />
      }
    },
    { key: 'name', label: 'Name' },
    { 
      key: 'category', 
      label: 'Category', 
      render: function(category) {
        return <span style={{ textTransform: 'capitalize' }}>{category}</span>
      }
    },
    { 
      key: 'price', 
      label: 'Price', 
      render: function(price) {
        return 'Rs. ' + price
      }
    },
    { 
      key: 'id', 
      label: 'Actions', 
      render: function(id) {
        return (
          <div style={{ display: 'flex', gap: 8 }}>
            <Link 
              to={'/admin/edit-product/' + id} 
              style={{ background: '#8b4513', color: '#fff', padding: '5px 14px', borderRadius: 6, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              Edit
            </Link>
            <button 
              onClick={() => setDeleteId(id)} 
              style={{ background: '#c0392b', color: '#fff', border: 'none', padding: '5px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              Delete
            </button>
          </div>
        )
      }
    }
  ]

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontFamily: 'Playfair Display,serif', color: '#6b3a2a', margin: 0 }}>Products</h2>
        
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input 
            value={searchText} 
            onChange={e => setSearchText(e.target.value)} 
            placeholder="Search products..."
            style={{ padding: '9px 14px', border: '1px solid #e0c9a6', borderRadius: 8, fontSize: 14, fontFamily: 'Poppins,sans-serif', outline: 'none', width: 220 }} 
          />
          <Link to="/admin/add-product" className="btn-primary" style={{ padding: '9px 20px', fontSize: 14 }}>
            + Add Product
          </Link>
        </div>
      </div>
      
      <AppTable columns={columns} data={filteredProducts} emptyMsg="No products found." />

      {deleteId && (
        <Modal title="Delete Product" onClose={() => setDeleteId(null)} width={360}>
          <p style={{ color: '#6b3a2a', marginBottom: 24 }}>
            Are you sure you want to delete this product? This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button 
              onClick={() => deleteProduct(deleteId)} 
              style={{ flex: 1, background: '#c0392b', color: '#fff', border: 'none', borderRadius: 8, padding: 12, fontWeight: 600, cursor: 'pointer' }}>
              Delete
            </button>
            <button 
              onClick={() => setDeleteId(null)} 
              style={{ flex: 1, background: '#f0dfc0', color: '#6b3a2a', border: 'none', borderRadius: 8, padding: 12, fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
