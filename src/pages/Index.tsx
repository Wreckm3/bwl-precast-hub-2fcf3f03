import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { formatKES } from "@/lib/currency";
import { Shield, Clock, Award, Truck, ArrowRight, CheckCircle, MessageCircle } from "lucide-react";
import heroImage from "@/assets/hero-construction.jpg";
import concreteTexture from "@/assets/concrete-texture.jpg";

export default function Index() {
  const { data: products } = useProducts();
  const featuredProducts = products?.slice(0, 3) || [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
        </div>
        
        <div className="container-custom relative z-10 py-20">
          <div className="max-w-3xl">
            <p className="text-accent font-semibold uppercase tracking-widest mb-4 animate-fade-in">
              Premium Precast Solutions
            </p>
            <h1 className="heading-xl text-primary-foreground mb-6 animate-fade-in-up">
              Durable. Precision-Built.<br />Precast Concrete Solutions.
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-xl animate-fade-in-up animation-delay-200">
              Building Kenya's future with superior precast concrete products. Quality engineering meets unmatched durability.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-300">
              <Button variant="hero" size="lg" asChild>
                <Link to="/products">View Products <ArrowRight className="w-5 h-5" /></Link>
              </Button>
              <Button variant="accent" size="lg" asChild>
                <a href="https://wa.me/254799994758" target="_blank" rel="noopener noreferrer"><MessageCircle className="w-5 h-5" /> WhatsApp Us</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-card py-12 border-b border-border">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, label: "Quality Guaranteed", value: "ISO Certified" },
              { icon: Clock, label: "Years Experience", value: "5+" },
              { icon: Award, label: "Projects Completed", value: "50+" },
              { icon: Truck, label: "Delivery Service", value: "Nationwide" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <item.icon className="w-10 h-10 text-accent mx-auto mb-3" />
                <p className="font-display text-2xl text-foreground">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-muted">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-accent font-semibold uppercase tracking-widest mb-2">Our Products</p>
            <h2 className="heading-lg text-foreground">Featured Precast Solutions</h2>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="aspect-video bg-secondary">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <img src={concreteTexture} alt={product.name} className="w-full h-full object-cover opacity-50" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-2xl text-foreground mb-2">{product.name}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-accent font-bold text-lg">{formatKES(product.base_price)}</span>
                      <Link to="/products" className="text-primary font-medium hover:text-accent transition-colors">
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Products coming soon. Contact us for a custom quote.</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button variant="default" size="lg" asChild>
              <Link to="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-accent font-semibold uppercase tracking-widest mb-2">Why Choose Us</p>
              <h2 className="heading-lg text-foreground mb-6">Built to Last, Delivered with Precision</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                At BWL Precast Construction, we combine years of expertise with modern manufacturing to deliver precast concrete solutions that stand the test of time.
              </p>
              <ul className="space-y-4">
                {[
                  "Factory-controlled quality assurance",
                  "Faster installation than cast-in-place",
                  "Custom designs to meet your specifications",
                  "Nationwide delivery and installation support",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-accent flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img src={concreteTexture} alt="Concrete texture" className="rounded-lg shadow-xl" />
              <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 rounded-lg shadow-xl">
                <p className="font-display text-4xl">5+</p>
                <p className="text-sm uppercase tracking-wide">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20">
        <div className="container-custom text-center">
          <h2 className="heading-lg text-primary-foreground mb-4">Ready to Start Your Project?</h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Get in touch with our team for a free consultation and quote on your precast concrete needs.
          </p>
          <Button variant="accent" size="xl" asChild>
            <Link to="/contact">Request a Quote Today</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
