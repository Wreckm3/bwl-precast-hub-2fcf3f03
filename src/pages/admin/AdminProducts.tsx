import { useState, useRef } from "react";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, Product } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatKES } from "@/lib/currency";
import { Plus, Pencil, Trash2, X, Upload, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AdminProducts() {
  const { data: products, isLoading } = useProducts();
  const { toast } = useToast();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const handleSave = async () => {
    if (!editingProduct?.name) return;
    
    const productData = {
      name: editingProduct.name,
      description: editingProduct.description || null,
      base_price: Number(editingProduct.base_price) || 0,
      transport_cost: Number(editingProduct.transport_cost) || 0,
      images: editingProduct.images || [],
      is_available: editingProduct.is_available ?? true,
    };

    if (editingProduct.id) {
      await updateProduct.mutateAsync({ id: editingProduct.id, ...productData });
    } else {
      await createProduct.mutateAsync(productData);
    }
    setIsEditing(false);
    setEditingProduct(null);
  };

  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !editingProduct) return;
    setUploading(true);
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("images").upload(path, file);
      if (error) {
        toast({ title: "Upload failed", description: error.message, variant: "destructive" });
        continue;
      }
      const { data: urlData } = supabase.storage.from("images").getPublicUrl(path);
      newUrls.push(urlData.publicUrl);
    }

    setEditingProduct({
      ...editingProduct,
      images: [...(editingProduct.images || []), ...newUrls],
    });
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (index: number) => {
    if (!editingProduct) return;
    const updated = [...(editingProduct.images || [])];
    updated.splice(index, 1);
    setEditingProduct({ ...editingProduct, images: updated });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this product?")) {
      await deleteProduct.mutateAsync(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-4xl text-foreground">Products</h1>
        <Button onClick={() => { setEditingProduct({}); setIsEditing(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      {isEditing && editingProduct && (
        <div className="bg-card p-6 rounded-lg shadow-md border border-border mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-2xl">{editingProduct.id ? "Edit Product" : "New Product"}</h2>
            <Button variant="ghost" size="icon" onClick={() => { setIsEditing(false); setEditingProduct(null); }}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid gap-4">
            <Input
              placeholder="Product Name"
              value={editingProduct.name || ""}
              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
            />
            <Textarea
              placeholder="Description"
              value={editingProduct.description || ""}
              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
            />
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Base Price (KES)"
                value={editingProduct.base_price || ""}
                onChange={(e) => setEditingProduct({ ...editingProduct, base_price: parseFloat(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="Transport Cost (KES)"
                value={editingProduct.transport_cost || ""}
                onChange={(e) => setEditingProduct({ ...editingProduct, transport_cost: parseFloat(e.target.value) })}
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editingProduct.is_available ?? true}
                onChange={(e) => setEditingProduct({ ...editingProduct, is_available: e.target.checked })}
              />
              <span>Available</span>
            </label>

            {/* Image Upload */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Product Images</label>
              <div className="flex flex-wrap gap-3">
                {(editingProduct.images || []).map((url, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-accent hover:text-accent transition-colors"
                >
                  {uploading ? (
                    <span className="text-xs">Uploading...</span>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span className="text-xs">Add</span>
                    </>
                  )}
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleUploadImages}
              />
            </div>

            <Button onClick={handleSave}>Save Product</Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-semibold">Name</th>
                <th className="text-left p-4 font-semibold">Price</th>
                <th className="text-left p-4 font-semibold">Transport</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-right p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => (
                <tr key={product.id} className="border-t border-border">
                  <td className="p-4">{product.name}</td>
                  <td className="p-4">{formatKES(product.base_price)}</td>
                  <td className="p-4">{formatKES(product.transport_cost)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${product.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.is_available ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
