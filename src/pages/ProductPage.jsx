"use client";

import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { products } from "../utils/mockData";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const product = products.find((p) => p.id === Number.parseInt(id));

  if (!product) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-4">
          Product not found
        </h2>
        <button
          onClick={() => navigate("/")}
          className="text-[hsl(var(--accent))] hover:underline"
        >
          Return to home
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    addToCart(product);
    toast.success("Product added to cart!");
  };

  return (
    <div>
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-[hsl(var(--muted))] rounded-lg overflow-hidden">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <span className="text-sm text-[hsl(var(--muted-foreground))] mb-2 block">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-4">
            {product.title}
          </h1>
          <p className="text-4xl font-bold text-[hsl(var(--foreground))] mb-6">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-[hsl(var(--muted-foreground))] mb-8 leading-relaxed">
            {product.description}
          </p>

          <button
            onClick={handleAddToCart}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-8 py-3 rounded-md hover:opacity-90 transition-opacity font-semibold"
          >
            <ShoppingCart className="h-5 w-5" />
            Add to Cart
          </button>

          <div className="mt-8 pt-8 border-t border-[hsl(var(--border))]">
            <h3 className="font-semibold text-[hsl(var(--foreground))] mb-4">
              Product Details
            </h3>
            <ul className="space-y-2 text-[hsl(var(--muted-foreground))]">
              <li>• Free shipping on orders over $50</li>
              <li>• 30-day return policy</li>
              <li>• 1-year warranty included</li>
              <li>• Secure checkout</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
