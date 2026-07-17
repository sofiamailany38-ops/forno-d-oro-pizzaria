import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Phone,
  MapPin,
  User,
  Clock,
  CreditCard,
  ChevronRight,
  Menu as MenuIcon,
  X,
  Utensils,
  Flame,
  ShoppingBag,
  Plus,
  Minus,
  Send,
  Check,
  Award,
  Leaf,
  Wine,
  HelpCircle,
  TrendingUp,
  DollarSign,
  Copy
} from 'lucide-react';
import {
  pizzaSizes,
  pizzasSalgadas,
  pizzasDoces,
  bebidasCategories,
  PizzaItem,
  DrinkItem
} from './data/menu';
import {
  OvenAndPizzaIllustration,
  PizzaSilhouetteIcon,
  ChefHatIllustration
} from './components/ArtisanalGraphics';

// Define structure for items in the client-side order cart
interface CartItem {
  id: string; // combination of item id + size (for pizzas) or just name
  name: string;
  type: 'salgada' | 'doce' | 'bebida';
  sizeName?: 'Pequena' | 'Média' | 'Grande' | 'Extra Grande';
  price: number;
  quantity: number;
}

export default function App() {
  const [activePage, setActivePage] = useState<'home' | 'menu'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuFilter, setMenuFilter] = useState<'all' | 'salgadas' | 'doces' | 'bebidas'>('all');
  
  // Cart state and internal checkout flow
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment' | 'success'>('cart');
  
  // Checkout form details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [customerNeighborhood, setCustomerNeighborhood] = useState('');
  const [customerPaymentMethod, setCustomerPaymentMethod] = useState<'pix' | 'credit' | 'debit' | 'cash'>('pix');
  
  // Pix Key copy confirmation helper
  const [pixCopied, setPixCopied] = useState(false);
  
  // Cash details
  const [needsChange, setNeedsChange] = useState<boolean | null>(null);
  const [changeAmount, setChangeAmount] = useState('');
  
  // Credit card mockup details
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  // Simulated success progress order variables
  const [orderNumber, setOrderNumber] = useState('');
  const [prepProgress, setPrepProgress] = useState(0);
  const [prepStatus, setPrepStatus] = useState('');

  // Scroll to top when changing pages
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  // Real-time animated tracker for the pizza preparation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (checkoutStep === 'success') {
      setPrepProgress(15);
      setPrepStatus('Massa fresca sendo aberta e moldada à mão pelo chef...');
      
      interval = setInterval(() => {
        setPrepProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setPrepStatus('Seu pedido já saiu para entrega! Bom apetite! 🛵🍕');
            return 100;
          }
          const next = prev + 17;
          if (next >= 100) {
            setPrepStatus('Seu pedido já saiu para entrega! Bom apetite! 🛵🍕');
            return 100;
          } else if (next >= 80) {
            setPrepStatus('Finalizando os últimos detalhes e embalando sua pizza quentinha...');
          } else if (next >= 55) {
            setPrepStatus('Assando no forno a lenha clássico em altíssima temperatura...');
          } else if (next >= 30) {
            setPrepStatus('Recheando com molho artesanal e ingredientes premium...');
          }
          return next;
        });
      }, 6000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [checkoutStep]);

  // WhatsApp numbers & formatting
  const phoneFormatted = "(19) 99876-5432";
  const whatsappUrlBase = "https://wa.me/5519998765432";

  const addToCart = (item: PizzaItem | DrinkItem, isPizza: boolean, sizeKey?: 'pequena' | 'media' | 'grande' | 'extraGrande') => {
    let cartId = '';
    let name = item.name;
    let price = 0;
    let sizeName: 'Pequena' | 'Média' | 'Grande' | 'Extra Grande' | undefined;

    if (isPizza && sizeKey) {
      const pizza = item as PizzaItem;
      price = pizza.prices[sizeKey];
      sizeName = sizeKey === 'pequena' ? 'Pequena' : sizeKey === 'media' ? 'Média' : sizeKey === 'grande' ? 'Grande' : 'Extra Grande';
      cartId = `${pizza.id}-${sizeKey}`;
      name = `${pizza.name} (${sizeName})`;
    } else {
      const drink = item as DrinkItem;
      price = drink.price;
      cartId = `drink-${drink.name.replace(/\s+/g, '-').toLowerCase()}`;
    }

    setCart(prevCart => {
      const existing = prevCart.find(i => i.id === cartId);
      if (existing) {
        return prevCart.map(i => i.id === cartId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prevCart, {
        id: cartId,
        name,
        type: isPizza ? ((item as PizzaItem).id > 100 ? 'doce' : 'salgada') : 'bebida',
        sizeName,
        price,
        quantity: 1
      }];
    });

    // Pulse feedback / Open cart automatically so the user knows they added something
    setIsCartOpen(true);
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prevCart => {
      return prevCart.map(i => {
        if (i.id === cartId) {
          const newQty = i.quantity + delta;
          return newQty > 0 ? { ...i, quantity: newQty } : null;
        }
        return i;
      }).filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Generate a premium WhatsApp order message containing details
  const getWhatsAppOrderLink = () => {
    if (cart.length === 0) {
      const defaultText = encodeURIComponent("Olá! Gostaria de falar com a Forno D’Oro Pizzaria.");
      return `${whatsappUrlBase}?text=${defaultText}`;
    }

    let text = `🍕 *NOVO PEDIDO - FORNO D’ORO* 🍕\n\n`;
    text += `Olá! Gostaria de fazer o seguinte pedido:\n\n`;
    
    cart.forEach(item => {
      const sub = (item.price * item.quantity).toFixed(2);
      text += `• *${item.quantity}x* ${item.name} - R$ ${sub.replace('.', ',')}\n`;
    });

    text += `\n💰 *Total: R$ ${cartTotal.toFixed(2).replace('.', ',')}*`;
    text += `\n\n📍 *Por favor, confirme a taxa de entrega e o tempo de preparo!*`;
    text += `\n💳 *Forma de pagamento:* [Indicar Dinheiro/Pix/Cartão]`;

    return `${whatsappUrlBase}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1E1A17] selection:bg-[#C93C20]/20 selection:text-[#C93C20] relative flex flex-col font-sans">
      
      {/* TOP DECORATIVE ITALIAN STRIP */}
      <div className="h-1.5 w-full flex">
        <div className="bg-[#4F5D2F] h-full flex-1" /> {/* Green */}
        <div className="bg-white h-full flex-1" />    {/* White */}
        <div className="bg-[#C93C20] h-full flex-1" /> {/* Red */}
      </div>

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#FAF6EE]/95 backdrop-blur-md border-b border-[#1E1A17]/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Brand Name */}
          <button 
            onClick={() => { setActivePage('home'); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 group text-left cursor-pointer"
            id="logo-button"
          >
            <div className="w-11 h-11 bg-[#C93C20] rounded-xl flex items-center justify-center text-white shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <span className="font-serif font-bold text-2xl tracking-tighter">F</span>
              <span className="font-serif font-bold text-2xl tracking-tighter text-[#FFE082]">D</span>
            </div>
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1E1A17] group-hover:text-[#C93C20] transition-colors duration-200">
                Forno D’Oro
              </h1>
              <p className="text-[10px] sm:text-xs font-mono tracking-widest text-[#4F5D2F] uppercase -mt-1 font-semibold">
                Pizzaria Artesanal
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => setActivePage('home')}
              className={`font-medium text-sm tracking-wide transition-colors relative py-2 cursor-pointer ${
                activePage === 'home' 
                  ? 'text-[#C93C20]' 
                  : 'text-[#1E1A17]/70 hover:text-[#C93C20]'
              }`}
              id="nav-home"
            >
              Apresentação
              {activePage === 'home' && (
                <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C93C20]" />
              )}
            </button>
            
            <button
              onClick={() => setActivePage('menu')}
              className={`font-medium text-sm tracking-wide transition-colors relative py-2 cursor-pointer ${
                activePage === 'menu' 
                  ? 'text-[#C93C20]' 
                  : 'text-[#1E1A17]/70 hover:text-[#C93C20]'
              }`}
              id="nav-menu"
            >
              Cardápio
              {activePage === 'menu' && (
                <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C93C20]" />
              )}
            </button>
          </nav>

          {/* Right Header Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Quick Phone info */}
            <a 
              href="tel:19998765432" 
              className="flex items-center gap-2 text-xs font-mono text-[#1E1A17]/80 hover:text-[#C93C20] transition-colors"
            >
              <Phone size={14} className="text-[#C93C20]" />
              <span>(19) 99876-5432</span>
            </a>

            {/* Switch Page CTA */}
            <button
              onClick={() => setActivePage(activePage === 'home' ? 'menu' : 'home')}
              className="border-2 border-[#C93C20] text-[#C93C20] hover:bg-[#C93C20] hover:text-white transition-all duration-300 px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer shadow-sm"
              id="header-cta"
            >
              {activePage === 'home' ? 'Ver Cardápio' : 'Voltar para Home'}
            </button>
          </div>

          {/* Mobile Actions Combo */}
          <div className="flex md:hidden items-center gap-3">
            {/* Tiny cart badge for mobile if items exist */}
            {cartTotalItems > 0 && (
              <button 
                onClick={() => setIsCartOpen(true)}
                className="bg-[#C93C20] text-white p-2.5 rounded-full relative flex items-center justify-center animate-bounce shadow-md"
              >
                <ShoppingBag size={18} />
                <span className="absolute -top-1 -right-1 bg-[#FFE082] text-[#1E1A17] font-mono text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#C93C20]">
                  {cartTotalItems}
                </span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#1E1A17] hover:bg-[#C93C20]/5 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle Menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X size={26} /> : <MenuIcon size={26} />}
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#FAF6EE] border-b border-[#1E1A17]/10"
          >
            <div className="px-4 py-6 space-y-4 flex flex-col">
              <button
                onClick={() => { setActivePage('home'); setMobileMenuOpen(false); }}
                className={`py-3 text-lg font-serif font-semibold text-left transition-colors border-b border-[#1E1A17]/5 ${
                  activePage === 'home' ? 'text-[#C93C20]' : 'text-[#1E1A17]/80'
                }`}
              >
                Início & Apresentação
              </button>
              <button
                onClick={() => { setActivePage('menu'); setMobileMenuOpen(false); }}
                className={`py-3 text-lg font-serif font-semibold text-left transition-colors border-b border-[#1E1A17]/5 ${
                  activePage === 'menu' ? 'text-[#C93C20]' : 'text-[#1E1A17]/80'
                }`}
              >
                Nosso Cardápio
              </button>

              <div className="pt-4 space-y-3">
                <p className="text-xs font-mono text-gray-500 uppercase">Contato & Delivery</p>
                <button
                  onClick={() => { setActivePage('menu'); setMobileMenuOpen(false); }}
                  className="flex items-center justify-center gap-2 bg-[#C93C20] text-white py-3 rounded-lg font-bold text-sm shadow-md cursor-pointer"
                >
                  <Utensils size={16} />
                  Fazer Pedido Online
                </button>
                <a
                  href="tel:19998765432"
                  className="flex items-center justify-center gap-2 border border-[#1E1A17]/20 text-[#1E1A17] py-3 rounded-lg font-medium text-sm"
                >
                  <Phone size={16} className="text-gray-500" />
                  Ligar: (19) 99876-5432
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE CONTENT SWITCHER */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activePage === 'home' ? (
            <motion.div
              key="home-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              
              {/* HERO SECTION */}
              <section className="relative pt-8 pb-16 md:py-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    
                    {/* Left Grid: Presentation Content */}
                    <div className="lg:col-span-7 space-y-8 text-center lg:text-left z-10">
                      
                      {/* Premium Badge */}
                      <div className="inline-flex items-center gap-2 bg-[#4F5D2F]/10 border border-[#4F5D2F]/20 text-[#4F5D2F] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider font-mono uppercase">
                        <Flame size={12} className="animate-pulse text-[#C93C20]" />
                        Forno a Lenha desde 2026
                      </div>

                      {/* Main Titles */}
                      <div className="space-y-4">
                        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1E1A17] leading-none">
                          Forno D’Oro <br />
                          <span className="text-[#C93C20]">Pizzaria</span>
                        </h1>
                        <p className="font-serif text-lg sm:text-xl md:text-2xl text-[#C93C20]/85 italic tracking-wide">
                          "O sabor da tradição em cada fatia."
                        </p>
                      </div>

                      {/* Presentation Paragraph */}
                      <p className="text-sm sm:text-base md:text-lg text-[#1E1A17]/85 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                        Na Forno D’Oro Pizzaria, acreditamos que uma boa pizza começa com ingredientes selecionados, massa preparada artesanalmente e muito cuidado em cada detalhe. Nossa missão é transformar momentos simples em experiências especiais através do verdadeiro sabor da pizza.
                      </p>

                      {/* Custom Key Buttons */}
                      <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                        
                        {/* 1. Ver Cardápio */}
                        <button
                          onClick={() => setActivePage('menu')}
                          className="w-full sm:w-auto px-8 py-4 bg-[#C93C20] hover:bg-[#A32A15] text-white rounded-xl font-bold text-base transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-3 cursor-pointer group"
                        >
                          <Utensils size={18} />
                          Ver Cardápio
                          <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </button>

                        {/* 2. Monte Seu Pedido */}
                        <button
                          onClick={() => setActivePage('menu')}
                          className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-[#1E1A17]/20 text-[#1E1A17] hover:border-[#C93C20] hover:text-[#C93C20] rounded-xl font-bold text-base transition-all duration-300 shadow-sm flex items-center justify-center gap-3 cursor-pointer"
                        >
                          <ShoppingBag size={18} className="text-[#C93C20]" />
                          Monte Seu Pedido
                        </button>

                        {/* 3. Como Chegar */}
                        <a
                          href="#onde-estamos"
                          className="w-full sm:w-auto px-6 py-4 text-[#1E1A17]/70 hover:text-[#C93C20] font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 hover:underline"
                        >
                          <MapPin size={18} className="text-[#C93C20]" />
                          Como Chegar
                        </a>

                      </div>

                      {/* Quick Badges of Quality */}
                      <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#1E1A17]/10 max-w-lg mx-auto lg:mx-0">
                        <div className="text-center lg:text-left">
                          <p className="font-serif text-2xl font-bold text-[#C93C20]">48h</p>
                          <p className="text-xs text-gray-500 font-mono">Fermentação Lenta</p>
                        </div>
                        <div className="text-center lg:text-left border-x border-[#1E1A17]/10 px-4">
                          <p className="font-serif text-2xl font-bold text-[#C93C20]">100%</p>
                          <p className="text-xs text-gray-500 font-mono">Lenha Sustentável</p>
                        </div>
                        <div className="text-center lg:text-left">
                          <p className="font-serif text-2xl font-bold text-[#C93C20]">Artisanal</p>
                          <p className="text-xs text-gray-500 font-mono">Feito com Amor</p>
                        </div>
                      </div>

                    </div>

                    {/* Right Grid: Artisanal Graphic Area (Oven/Ingredients SVG) */}
                    <div className="lg:col-span-5 flex justify-center items-center relative">
                      {/* Subtle golden background glow */}
                      <div className="absolute w-72 h-72 rounded-full bg-amber-500/10 blur-3xl -z-10" />
                      <OvenAndPizzaIllustration />
                    </div>

                  </div>
                </div>
              </section>



              {/* OUR PIZZAIOLO AND OWNER SECTION */}
              <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="bg-[#1E1A17] text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-xl border border-white/5">
                    
                    {/* Decorative backgrounds */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#C93C20]/10 rounded-full blur-3xl -z-0" />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                      
                      {/* Left: Chef visual element or detailed vector */}
                      <div className="lg:col-span-4 text-center">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#FAF6EE]/5 flex items-center justify-center mx-auto border-4 border-[#C93C20] shadow-lg mb-4">
                          <ChefHatIllustration />
                        </div>
                        <h4 className="font-serif text-xl font-bold text-[#FFE082]">Matheus Oliveira</h4>
                        <p className="text-xs font-mono tracking-widest text-[#4F5D2F] uppercase font-bold">Chef Proprietário & Pizzaiolo</p>
                      </div>

                      {/* Right: Message & Signature */}
                      <div className="lg:col-span-8 space-y-6">
                        <div className="flex justify-center lg:justify-start">
                          <span className="text-5xl font-serif text-[#C93C20] leading-none -mr-2">“</span>
                        </div>
                        <p className="text-base sm:text-lg md:text-xl text-[#FAF6EE]/90 font-light italic leading-relaxed">
                          Como proprietário e apaixonado por gastronomia, meu compromisso com a Forno D’Oro é inabalável. Quero que cada cliente, ao morder uma de nossas fatias, sinta não apenas os sabores frescos, mas a dedicação de um trabalho verdadeiramente feito à mão. Cada pizza que sai do nosso forno é uma celebração da tradição familiar que temos o orgulho de servir em Campinas.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-white/10 gap-4">
                          <div>
                            <p className="text-xs font-mono text-gray-400">RECEITA ORIGINAL</p>
                            <p className="text-sm font-semibold text-[#FFE082]">Massa Autoral Hidratada a 70%</p>
                          </div>
                          <div>
                            <p className="text-xs font-mono text-gray-400">CONTATO DIRETO</p>
                            <p className="text-sm font-semibold text-white">suporte@fornodoropizzaria.com</p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </section>

              {/* LOCATION & CONTACT SECTION */}
              <section id="onde-estamos" className="bg-[#FAF6EE] border-t border-[#1E1A17]/10 py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
                    
                    {/* Left: Contact Info details */}
                    <div className="lg:col-span-5 space-y-8 flex flex-col justify-center">
                      <div className="space-y-3">
                        <span className="text-xs font-mono text-[#C93C20] uppercase tracking-wider font-bold">Venha nos visitar</span>
                        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E1A17]">Onde Estamos</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Nossa charmosa pizzaria está localizada no coração de Campinas. Venha sentir o calor de nosso forno a lenha de perto ou faça o seu pedido diretamente via delivery!
                        </p>
                      </div>

                      <div className="space-y-6">
                        {/* Address info item */}
                        <div className="flex gap-4 items-start">
                          <div className="w-10 h-10 rounded-xl bg-[#C93C20]/10 flex items-center justify-center text-[#C93C20] shrink-0">
                            <MapPin size={20} />
                          </div>
                          <div>
                            <h4 className="font-serif font-bold text-[#1E1A17]">Localização Privilegiada</h4>
                            <p className="text-sm text-gray-600">
                              Rua das Oliveiras, 245
                            </p>
                            <p className="text-xs text-gray-500">
                              Jardim Central - Campinas/SP
                            </p>
                          </div>
                        </div>

                        {/* Telephone & WhatsApp info item */}
                        <div className="flex gap-4 items-start">
                          <div className="w-10 h-10 rounded-xl bg-[#C93C20]/10 flex items-center justify-center text-[#C93C20] shrink-0">
                            <Phone size={20} />
                          </div>
                          <div>
                            <h4 className="font-serif font-bold text-[#1E1A17]">Telefone & WhatsApp</h4>
                            <p className="text-sm text-gray-600 font-semibold hover:text-[#C93C20] transition-colors">
                              <a href="tel:19998765432">(19) 99876-5432</a>
                            </p>
                            <p className="text-xs text-gray-500">
                              Disponível também para pedidos e reservas
                            </p>
                          </div>
                        </div>

                        {/* Opening hours info item */}
                        <div className="flex gap-4 items-start">
                          <div className="w-10 h-10 rounded-xl bg-[#4F5D2F]/10 flex items-center justify-center text-[#4F5D2F] shrink-0">
                            <Clock size={20} />
                          </div>
                          <div>
                            <h4 className="font-serif font-bold text-[#1E1A17]">Horário de Funcionamento</h4>
                            <p className="text-sm text-gray-600">
                              Terça a Domingo: <span className="font-semibold">18:00 às 23:30</span>
                            </p>
                            <p className="text-xs text-amber-600 font-semibold">
                              Fechado às Segundas-feiras
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Como Chegar Buttons combo */}
                      <div className="pt-4 flex flex-wrap gap-4">
                        <a
                          href="https://maps.google.com/?q=Rua+das+Oliveiras,+245+-+Jardim+Central+-+Campinas/SP"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3.5 bg-[#C93C20] hover:bg-[#A32A15] text-white font-bold rounded-xl text-sm transition-all duration-300 shadow-md flex items-center gap-2"
                        >
                          <MapPin size={16} />
                          Abrir no Google Maps
                        </a>
                        <a
                          href={`tel:19998765432`}
                          className="px-6 py-3.5 bg-white border border-[#1E1A17]/10 hover:border-[#1E1A17]/30 text-[#1E1A17] font-semibold rounded-xl text-sm transition-all duration-300 shadow-sm flex items-center gap-2"
                        >
                          <Phone size={16} className="text-gray-400" />
                          Ligar Agora
                        </a>
                      </div>

                    </div>

                    {/* Right: Elegant Vector Map Mockup */}
                    <div className="lg:col-span-7 bg-white p-4 rounded-3xl border border-[#1E1A17]/10 shadow-lg flex flex-col justify-between overflow-hidden relative group">
                      
                      {/* Styled Vector Map Backdrop using pure CSS and layout shapes */}
                      <div className="bg-[#1E1A17] rounded-2xl w-full h-80 sm:h-96 relative overflow-hidden flex items-center justify-center">
                        
                        {/* Styled roads lines */}
                        <div className="absolute w-full h-2 bg-white/5 top-1/4 rotate-12" />
                        <div className="absolute w-full h-3 bg-white/5 top-2/3 -rotate-6" />
                        <div className="absolute w-1.5 h-full bg-white/5 left-1/3 top-0 rotate-45" />
                        <div className="absolute w-2 h-full bg-white/5 left-2/3 top-0 -rotate-12" />
                        
                        {/* Scenic parks as green circles */}
                        <div className="absolute w-32 h-32 rounded-full bg-[#4F5D2F]/10 -top-8 -left-8 blur-sm" />
                        <div className="absolute w-40 h-40 rounded-full bg-[#4F5D2F]/10 bottom-4 right-10 blur-sm" />

                        {/* Neighboring locations */}
                        <div className="absolute top-1/3 left-10 text-white/40 text-[10px] font-mono select-none">
                          Av. das Palmeiras
                        </div>
                        <div className="absolute bottom-1/4 right-24 text-white/40 text-[10px] font-mono select-none">
                          Rua das Oliveiras
                        </div>

                        {/* Central Target Radar Pulse (Pizzaria marker) */}
                        <div className="relative z-10 flex flex-col items-center">
                          {/* Animated radar rings */}
                          <div className="absolute w-16 h-16 rounded-full bg-[#C93C20]/30 animate-ping" />
                          <div className="absolute w-28 h-28 rounded-full bg-[#C93C20]/15 animate-pulse" />
                          
                          {/* Map Pin core */}
                          <div className="w-12 h-12 rounded-full bg-[#C93C20] border-2 border-white flex items-center justify-center text-white shadow-xl relative z-20">
                            <Utensils size={20} className="animate-bounce" />
                          </div>

                          {/* Pin Shadow */}
                          <div className="w-6 h-1.5 bg-black/40 rounded-full blur-xs mt-1" />

                          {/* Popup info overlay */}
                          <div className="bg-white text-[#1E1A17] px-4 py-2 rounded-xl mt-3 shadow-2xl border border-[#C93C20]/20 text-center relative z-20 max-w-xs transition-transform duration-300 group-hover:scale-105">
                            <p className="font-serif text-sm font-bold text-[#C93C20]">Forno D’Oro Pizzaria</p>
                            <p className="text-[10px] text-gray-500 font-mono mt-0.5">Rua das Oliveiras, 245</p>
                          </div>
                        </div>

                        {/* Compass rose or aesthetic map grids */}
                        <div className="absolute bottom-4 left-4 border border-white/10 rounded-lg p-2 flex items-center gap-1.5 text-white/40 font-mono text-[9px] select-none bg-black/30">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>GPS ATIVO (19) 99876-5432</span>
                        </div>

                      </div>

                      {/* Map Bottom description */}
                      <div className="pt-4 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-mono text-gray-500 uppercase">Campinas - SP</p>
                          <p className="text-sm font-semibold text-[#1E1A17]">Jardim Central (Fácil acesso com estacionamento gratuito)</p>
                        </div>
                        <a
                          href="https://maps.google.com/?q=Rua+das+Oliveiras,+245+-+Jardim+Central+-+Campinas/SP"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 p-3 bg-[#FAF6EE] text-[#C93C20] hover:bg-[#C93C20] hover:text-white rounded-xl transition-all duration-300 border border-[#C93C20]/10 shadow-sm"
                          title="Como Chegar"
                        >
                          <ChevronRight size={20} />
                        </a>
                      </div>

                    </div>

                  </div>
                </div>
              </section>

            </motion.div>
          ) : (
            <motion.div
              key="menu-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="py-12 md:py-16"
            >
              
              {/* MENU HEADER */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-12">
                <span className="text-xs font-mono text-[#C93C20] uppercase tracking-wider font-bold">Explore nossos sabores</span>
                <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E1A17]">Nosso Cardápio</h2>
                <div className="w-16 h-1 bg-[#C93C20] mx-auto rounded-full" />
                <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Trabalhamos com ingredientes premium selecionados. Monte seu pedido adicionando suas pizzas ou bebidas e finalize o pagamento diretamente em nosso site para agilizarmos a entrega!
                </p>
              </div>

              {/* PIZZA SIZES INFORMATION SECTION */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="bg-[#FAF6EE] border border-[#1E1A17]/10 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <PizzaSilhouetteIcon />
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1A17]">Tamanhos das Pizzas</h3>
                      <p className="text-xs sm:text-sm text-gray-500">Escolha a proporção ideal para sua fome ou compartilhamento</p>
                    </div>
                  </div>

                  {/* Sizes Responsive Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {pizzaSizes.map((size, index) => (
                      <div 
                        key={index}
                        className="bg-white p-5 rounded-2xl border border-[#1E1A17]/5 hover:border-[#C93C20]/20 transition-all duration-300 flex flex-col justify-between shadow-sm relative group"
                      >
                        {/* Slice Indicator Bubble */}
                        <span className="absolute top-4 right-4 bg-[#4F5D2F]/10 text-[#4F5D2F] text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase">
                          {size.slices} pedaços
                        </span>

                        <div className="space-y-2 pt-2">
                          <h4 className="font-serif text-lg font-bold text-[#1E1A17] group-hover:text-[#C93C20] transition-colors">
                            {size.name}
                          </h4>
                          <p className="text-xs text-gray-500">Massa artesanal assada a lenha</p>
                        </div>

                        <div className="pt-6 border-t border-[#1E1A17]/5 mt-4 flex items-baseline justify-between">
                          <span className="text-xs text-gray-400 font-mono">A partir de</span>
                          <span className="font-mono text-base font-bold text-[#C93C20]">
                            R$ {size.priceFrom.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* CATEGORY SELECTOR TABS */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
                <div className="flex flex-wrap items-center justify-center gap-2 border-b border-[#1E1A17]/10 pb-6">
                  <button
                    onClick={() => setMenuFilter('all')}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      menuFilter === 'all'
                        ? 'bg-[#1E1A17] text-[#FAF6EE] shadow-md'
                        : 'bg-white text-[#1E1A17]/70 hover:bg-[#1E1A17]/5 hover:text-[#1E1A17]'
                    }`}
                  >
                    Tudo ({pizzasSalgadas.length + pizzasDoces.length + 14} itens)
                  </button>

                  <button
                    onClick={() => setMenuFilter('salgadas')}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      menuFilter === 'salgadas'
                        ? 'bg-[#C93C20] text-white shadow-md'
                        : 'bg-white text-[#1E1A17]/70 hover:bg-[#C93C20]/5 hover:text-[#C93C20]'
                    }`}
                  >
                    🍕 Salgadas ({pizzasSalgadas.length})
                  </button>

                  <button
                    onClick={() => setMenuFilter('doces')}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      menuFilter === 'doces'
                        ? 'bg-[#C93C20] text-white shadow-md'
                        : 'bg-white text-[#1E1A17]/70 hover:bg-[#C93C20]/5 hover:text-[#C93C20]'
                    }`}
                  >
                    🍓 Doces ({pizzasDoces.length})
                  </button>

                  <button
                    onClick={() => setMenuFilter('bebidas')}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      menuFilter === 'bebidas'
                        ? 'bg-[#4F5D2F] text-white shadow-md'
                        : 'bg-white text-[#1E1A17]/70 hover:bg-[#4F5D2F]/5 hover:text-[#4F5D2F]'
                    }`}
                  >
                    🥤 Bebidas ({bebidasCategories.reduce((acc, c) => acc + c.items.length, 0)})
                  </button>
                </div>
              </div>

              {/* DYNAMIC CARDAPIO GRID */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                
                {/* 1. PIZZAS SALGADAS SUBSECTION */}
                {(menuFilter === 'all' || menuFilter === 'salgadas') && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-[#1E1A17]/5 pb-3">
                      <span className="w-3 h-3 rounded-full bg-[#C93C20]" />
                      <h3 className="font-serif text-2xl font-bold text-[#1E1A17]">Pizzas Salgadas</h3>
                      <span className="text-xs font-mono text-gray-500 font-medium">Forno a Lenha Clássico</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pizzasSalgadas.map((pizza) => (
                        <div 
                          key={pizza.id}
                          className="bg-white rounded-2xl border border-[#1E1A17]/5 p-5 hover:border-[#C93C20]/20 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                        >
                          {/* Item header */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-start gap-4">
                              <h4 className="font-serif text-lg font-bold text-[#1E1A17]">
                                {pizza.id}. {pizza.name}
                              </h4>
                              {/* Classic/Traditional label decoration */}
                              {pizza.id <= 3 && (
                                <span className="bg-[#4F5D2F]/10 text-[#4F5D2F] text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                                  Mais Pedida
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed font-light">
                              {pizza.description}
                            </p>
                          </div>

                          {/* Pricing Table Detail with Instant Cart Buttons */}
                          <div className="mt-6 pt-4 border-t border-[#1E1A17]/5 space-y-3">
                            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-semibold">Tamanhos & Preços</p>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {/* Pequena */}
                              <button 
                                onClick={() => addToCart(pizza, true, 'pequena')}
                                className="flex items-center justify-between p-1.5 rounded-lg bg-[#FAF6EE] hover:bg-[#C93C20]/10 hover:text-[#C93C20] transition-all font-mono text-left group"
                                title="Adicionar Pequena ao Pedido"
                              >
                                <span>P: <span className="text-gray-500 font-sans text-[10px]">4f</span></span>
                                <span className="font-bold text-[#1E1A17] group-hover:text-[#C93C20] transition-colors">
                                  R$ {pizza.prices.pequena.toFixed(2)}
                                </span>
                              </button>

                              {/* Média */}
                              <button 
                                onClick={() => addToCart(pizza, true, 'media')}
                                className="flex items-center justify-between p-1.5 rounded-lg bg-[#FAF6EE] hover:bg-[#C93C20]/10 hover:text-[#C93C20] transition-all font-mono text-left group"
                                title="Adicionar Média ao Pedido"
                              >
                                <span>M: <span className="text-gray-500 font-sans text-[10px]">8f</span></span>
                                <span className="font-bold text-[#1E1A17] group-hover:text-[#C93C20] transition-colors">
                                  R$ {pizza.prices.media.toFixed(2)}
                                </span>
                              </button>

                              {/* Grande */}
                              <button 
                                onClick={() => addToCart(pizza, true, 'grande')}
                                className="flex items-center justify-between p-1.5 rounded-lg bg-[#FAF6EE] hover:bg-[#C93C20]/10 hover:text-[#C93C20] transition-all font-mono text-left group"
                                title="Adicionar Grande ao Pedido"
                              >
                                <span>G: <span className="text-gray-500 font-sans text-[10px]">12f</span></span>
                                <span className="font-bold text-[#1E1A17] group-hover:text-[#C93C20] transition-colors">
                                  R$ {pizza.prices.grande.toFixed(2)}
                                </span>
                              </button>

                              {/* Extra Grande */}
                              <button 
                                onClick={() => addToCart(pizza, true, 'extraGrande')}
                                className="flex items-center justify-between p-1.5 rounded-lg bg-[#FAF6EE] hover:bg-[#C93C20]/10 hover:text-[#C93C20] transition-all font-mono text-left group"
                                title="Adicionar Extra Grande ao Pedido"
                              >
                                <span>EG: <span className="text-gray-500 font-sans text-[10px]">24f</span></span>
                                <span className="font-bold text-[#1E1A17] group-hover:text-[#C93C20] transition-colors">
                                  R$ {pizza.prices.extraGrande.toFixed(2)}
                                </span>
                              </button>
                            </div>

                            <p className="text-[9px] text-gray-400 text-center italic mt-1 font-mono">
                              Clique em um tamanho acima para montar seu pedido!
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. PIZZAS DOCES SUBSECTION */}
                {(menuFilter === 'all' || menuFilter === 'doces') && (
                  <div className="space-y-6 pt-4">
                    <div className="flex items-center gap-3 border-b border-[#1E1A17]/5 pb-3">
                      <span className="w-3 h-3 rounded-full bg-[#C93C20]" />
                      <h3 className="font-serif text-2xl font-bold text-[#1E1A17]">Pizzas Doces</h3>
                      <span className="text-xs font-mono text-gray-500 font-medium">Artesanais & Recheadas</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pizzasDoces.map((pizza) => (
                        <div 
                          key={pizza.id}
                          className="bg-white rounded-2xl border border-[#1E1A17]/5 p-5 hover:border-[#C93C20]/20 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                        >
                          {/* Item header */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-start gap-4">
                              <h4 className="font-serif text-lg font-bold text-[#1E1A17]">
                                {pizza.name}
                              </h4>
                              {pizza.name.includes("Nutella") && (
                                <span className="bg-amber-500/15 text-amber-700 text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                                  Sucesso de Vendas
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed font-light">
                              {pizza.description}
                            </p>
                          </div>

                          {/* Pricing Table Detail with Instant Cart Buttons */}
                          <div className="mt-6 pt-4 border-t border-[#1E1A17]/5 space-y-3">
                            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-semibold">Tamanhos & Preços</p>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {/* Pequena */}
                              <button 
                                onClick={() => addToCart(pizza, true, 'pequena')}
                                className="flex items-center justify-between p-1.5 rounded-lg bg-[#FAF6EE] hover:bg-[#C93C20]/10 hover:text-[#C93C20] transition-all font-mono text-left group"
                                title="Adicionar Pequena ao Pedido"
                              >
                                <span>P: <span className="text-gray-500 font-sans text-[10px]">4f</span></span>
                                <span className="font-bold text-[#1E1A17] group-hover:text-[#C93C20] transition-colors">
                                  R$ {pizza.prices.pequena.toFixed(2)}
                                </span>
                              </button>

                              {/* Média */}
                              <button 
                                onClick={() => addToCart(pizza, true, 'media')}
                                className="flex items-center justify-between p-1.5 rounded-lg bg-[#FAF6EE] hover:bg-[#C93C20]/10 hover:text-[#C93C20] transition-all font-mono text-left group"
                                title="Adicionar Média ao Pedido"
                              >
                                <span>M: <span className="text-gray-500 font-sans text-[10px]">8f</span></span>
                                <span className="font-bold text-[#1E1A17] group-hover:text-[#C93C20] transition-colors">
                                  R$ {pizza.prices.media.toFixed(2)}
                                </span>
                              </button>

                              {/* Grande */}
                              <button 
                                onClick={() => addToCart(pizza, true, 'grande')}
                                className="flex items-center justify-between p-1.5 rounded-lg bg-[#FAF6EE] hover:bg-[#C93C20]/10 hover:text-[#C93C20] transition-all font-mono text-left group"
                                title="Adicionar Grande ao Pedido"
                              >
                                <span>G: <span className="text-gray-500 font-sans text-[10px]">12f</span></span>
                                <span className="font-bold text-[#1E1A17] group-hover:text-[#C93C20] transition-colors">
                                  R$ {pizza.prices.grande.toFixed(2)}
                                </span>
                              </button>

                              {/* Extra Grande */}
                              <button 
                                onClick={() => addToCart(pizza, true, 'extraGrande')}
                                className="flex items-center justify-between p-1.5 rounded-lg bg-[#FAF6EE] hover:bg-[#C93C20]/10 hover:text-[#C93C20] transition-all font-mono text-left group"
                                title="Adicionar Extra Grande ao Pedido"
                              >
                                <span>EG: <span className="text-gray-500 font-sans text-[10px]">24f</span></span>
                                <span className="font-bold text-[#1E1A17] group-hover:text-[#C93C20] transition-colors">
                                  R$ {pizza.prices.extraGrande.toFixed(2)}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. BEBIDAS SUBSECTION */}
                {(menuFilter === 'all' || menuFilter === 'bebidas') && (
                  <div className="space-y-8 pt-4">
                    <div className="flex items-center gap-3 border-b border-[#1E1A17]/5 pb-3">
                      <span className="w-3 h-3 rounded-full bg-[#4F5D2F]" />
                      <h3 className="font-serif text-2xl font-bold text-[#1E1A17]">Bebidas</h3>
                      <span className="text-xs font-mono text-gray-500 font-medium">Sempre Geladas</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {bebidasCategories.map((cat, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-2xl border border-[#1E1A17]/5 shadow-sm space-y-4">
                          <h4 className="font-serif text-lg font-bold text-[#4F5D2F] border-b border-gray-100 pb-2">
                            {cat.category}
                          </h4>
                          
                          <div className="space-y-3">
                            {cat.items.map((drink, dIdx) => (
                              <button
                                key={dIdx}
                                onClick={() => addToCart(drink, false)}
                                className="w-full flex items-center justify-between text-left p-2 rounded-xl bg-[#FAF6EE] hover:bg-[#4F5D2F]/10 hover:text-[#4F5D2F] transition-all group cursor-pointer"
                                title={`Adicionar ${drink.name} ao Pedido`}
                              >
                                <div className="space-y-0.5">
                                  <p className="text-xs font-semibold text-[#1E1A17] group-hover:text-[#4F5D2F] transition-colors leading-tight">
                                    {drink.name}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-[#1E1A17]/80 group-hover:text-[#4F5D2F]">
                                    R$ {drink.price.toFixed(2).replace('.', ',')}
                                  </span>
                                  {/* Plus icon on hover */}
                                  <span className="w-5 h-5 rounded-full bg-[#4F5D2F]/10 text-[#4F5D2F] flex items-center justify-center text-[10px] font-bold opacity-50 group-hover:opacity-100 transition-opacity">
                                    +
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* PAYMENT TYPES & INFORMATION SECTION */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-12 border-t border-[#1E1A17]/10">
                <div className="bg-white rounded-3xl p-8 border border-[#1E1A17]/5 shadow-sm">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    {/* Left Grid: payment heading */}
                    <div className="lg:col-span-4 space-y-3 text-center lg:text-left">
                      <span className="text-xs font-mono text-[#C93C20] uppercase tracking-wider font-bold">Facilidade na entrega</span>
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E1A17]">Formas de Pagamento</h3>
                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                        Aceitamos diversas opções práticas para sua comodidade, incluindo pagamento rápido via internet ou no ato da entrega em sua residência.
                      </p>
                    </div>

                    {/* Right Grid: payment options */}
                    <div className="lg:col-span-8">
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        
                        {/* PIX */}
                        <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-dashed border-[#1E1A17]/10 text-center space-y-2 flex flex-col items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                            Pix
                          </div>
                          <span className="text-xs font-bold font-serif text-[#1E1A17]">Pix</span>
                          <span className="text-[10px] font-mono text-gray-400">Envio Instantâneo</span>
                        </div>

                        {/* CARTÃO CREDITO */}
                        <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-dashed border-[#1E1A17]/10 text-center space-y-2 flex flex-col items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-[#C93C20]/10 text-[#C93C20] flex items-center justify-center">
                            <CreditCard size={18} />
                          </div>
                          <span className="text-xs font-bold font-serif text-[#1E1A17]">Cartão Crédito</span>
                          <span className="text-[10px] font-mono text-gray-400">Todas as Bandeiras</span>
                        </div>

                        {/* CARTÃO DEBITO */}
                        <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-dashed border-[#1E1A17]/10 text-center space-y-2 flex flex-col items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-[#4F5D2F]/10 text-[#4F5D2F] flex items-center justify-center">
                            <CreditCard size={18} />
                          </div>
                          <span className="text-xs font-bold font-serif text-[#1E1A17]">Cartão Débito</span>
                          <span className="text-[10px] font-mono text-gray-400">Na Maquininha</span>
                        </div>

                        {/* DINHEIRO */}
                        <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-dashed border-[#1E1A17]/10 text-center space-y-2 flex flex-col items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold font-mono text-sm">
                            $
                          </div>
                          <span className="text-xs font-bold font-serif text-[#1E1A17]">Dinheiro</span>
                          <span className="text-[10px] font-mono text-gray-400">Levar Troco</span>
                        </div>

                        {/* WHATSAPP PAYMENT */}
                        <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-dashed border-[#1E1A17]/10 text-center space-y-2 col-span-2 sm:col-span-1 flex flex-col items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs">
                            💬
                          </div>
                          <span className="text-xs font-bold font-serif text-[#1E1A17]">WhatsApp</span>
                          <span className="text-[10px] font-mono text-gray-400">Pagamento Direto</span>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              </section>

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* REVOLUTIONARY ORDER BUILDER SIDE DRAWER PANEL (Forno D’Oro Order Assistant) */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            
            {/* Backdrop shadow screen */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
              onClick={() => setIsCartOpen(false)}
            />

            {/* Core Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-[#FAF6EE] h-full shadow-2xl flex flex-col z-10 border-l border-[#1E1A17]/10"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-[#1E1A17]/10 flex items-center justify-between bg-[#1E1A17] text-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#C93C20] flex items-center justify-center text-white">
                    <ShoppingBag size={16} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold">
                      {checkoutStep === 'cart' && 'Seu Pedido'}
                      {checkoutStep === 'shipping' && 'Endereço de Entrega'}
                      {checkoutStep === 'payment' && 'Procedimento de Pagamento'}
                      {checkoutStep === 'success' && 'Pedido Confirmado!'}
                    </h3>
                    <p className="text-[10px] font-mono text-[#FFE082] uppercase">
                      {checkoutStep === 'cart' && 'Carrinho de compras'}
                      {checkoutStep === 'shipping' && 'Etapa 2 de 3'}
                      {checkoutStep === 'payment' && 'Etapa 3 de 3'}
                      {checkoutStep === 'success' && 'Seu pedido está sendo preparado!'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    if (checkoutStep === 'success') {
                      setCheckoutStep('cart');
                    }
                  }}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                
                {/* STEP 1: CART LIST */}
                {checkoutStep === 'cart' && (
                  <>
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                          <ShoppingBag size={28} />
                        </div>
                        <div className="space-y-1">
                          <p className="font-serif font-bold text-gray-700">Seu pedido está vazio</p>
                          <p className="text-xs text-gray-500 max-w-xs">
                            Visite nosso cardápio e adicione pizzas e bebidas deliciosas para finalizar sua compra diretamente pelo site!
                          </p>
                        </div>
                        <button
                          onClick={() => { setActivePage('menu'); setIsCartOpen(false); }}
                          className="px-5 py-2.5 bg-[#C93C20] text-white rounded-lg font-bold text-xs shadow hover:bg-[#A32A15] transition-colors cursor-pointer"
                        >
                          Ir para o Cardápio
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs text-gray-500 font-mono pb-2 border-b border-[#1E1A17]/5">
                          <span>ITENS SELECIONADOS</span>
                          <button onClick={clearCart} className="text-[#C93C20] hover:underline font-bold cursor-pointer">
                            Limpar Tudo
                          </button>
                        </div>

                        {cart.map((item) => (
                          <div 
                            key={item.id} 
                            className="bg-white p-4 rounded-xl border border-[#1E1A17]/5 flex items-center justify-between gap-4 shadow-xs"
                          >
                            <div className="space-y-1">
                              <h4 className="text-xs font-bold text-[#1E1A17] leading-snug">
                                {item.name}
                              </h4>
                              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                                {item.type === 'bebida' ? 'Bebida' : 'Pizza'} • R$ {item.price.toFixed(2).replace('.', ',')}
                              </p>
                            </div>

                            {/* Adjust quantities */}
                            <div className="flex items-center gap-3 shrink-0">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-[#C93C20]/10 hover:text-[#C93C20] flex items-center justify-center transition-colors text-xs font-bold cursor-pointer"
                              >
                                <Minus size={12} />
                              </button>
                              
                              <span className="font-mono text-xs font-bold text-[#1E1A17] w-4 text-center">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-[#C93C20]/10 hover:text-[#C93C20] flex items-center justify-center transition-colors text-xs font-bold cursor-pointer"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* STEP 2: SHIPPING FORM */}
                {checkoutStep === 'shipping' && (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-500 font-medium font-mono uppercase tracking-wider border-b border-[#1E1A17]/5 pb-2">
                      INFORMAÇÕES DE ENTREGA
                    </p>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Seu Nome Completo *</label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Ex: Matheus Oliveira"
                          className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C93C20] focus:ring-1 focus:ring-[#C93C20]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Telefone Celular / WhatsApp *</label>
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="Ex: (19) 99876-5432"
                          className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C93C20] focus:ring-1 focus:ring-[#C93C20]"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Rua / Logradouro *</label>
                          <input
                            type="text"
                            required
                            value={customerAddress}
                            onChange={(e) => setCustomerAddress(e.target.value)}
                            placeholder="Ex: Av. Francisco Glicério"
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C93C20] focus:ring-1 focus:ring-[#C93C20]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Número *</label>
                          <input
                            type="text"
                            required
                            value={customerNumber}
                            onChange={(e) => setCustomerNumber(e.target.value)}
                            placeholder="Ex: 450"
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C93C20] focus:ring-1 focus:ring-[#C93C20]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Bairro *</label>
                        <input
                          type="text"
                          required
                          value={customerNeighborhood}
                          onChange={(e) => setCustomerNeighborhood(e.target.value)}
                          placeholder="Ex: Cambuí"
                          className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#C93C20] focus:ring-1 focus:ring-[#C93C20]"
                        />
                      </div>

                      <div className="bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 text-amber-800 text-[11px] leading-relaxed">
                        ⚠️ No momento, fazemos entregas exclusivas em toda a região urbana de <strong>Campinas - SP</strong>. Taxa de entrega fixa de <strong>R$ 7,00</strong>.
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: PAYMENT METHOD */}
                {checkoutStep === 'payment' && (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-500 font-medium font-mono uppercase tracking-wider border-b border-[#1E1A17]/5 pb-2">
                      MÉTODO DE PAGAMENTO
                    </p>

                    {/* Method Selection cards */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCustomerPaymentMethod('pix')}
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                          customerPaymentMethod === 'pix'
                            ? 'border-[#C93C20] bg-[#C93C20]/5 text-[#C93C20] font-bold'
                            : 'border-gray-200 bg-white text-gray-700'
                        }`}
                      >
                        <span className="text-xs">📱 Pix</span>
                        <span className="text-[9px] text-gray-400 font-mono font-normal">Chave CNPJ Direta</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCustomerPaymentMethod('credit')}
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                          customerPaymentMethod === 'credit'
                            ? 'border-[#C93C20] bg-[#C93C20]/5 text-[#C93C20] font-bold'
                            : 'border-gray-200 bg-white text-gray-700'
                        }`}
                      >
                        <span className="text-xs">💳 C. Crédito</span>
                        <span className="text-[9px] text-gray-400 font-mono font-normal">Online no site</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCustomerPaymentMethod('debit')}
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                          customerPaymentMethod === 'debit'
                            ? 'border-[#C93C20] bg-[#C93C20]/5 text-[#C93C20] font-bold'
                            : 'border-gray-200 bg-white text-gray-700'
                        }`}
                      >
                        <span className="text-xs">💳 C. Débito</span>
                        <span className="text-[9px] text-gray-400 font-mono font-normal">Na Entrega</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCustomerPaymentMethod('cash')}
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                          customerPaymentMethod === 'cash'
                            ? 'border-[#C93C20] bg-[#C93C20]/5 text-[#C93C20] font-bold'
                            : 'border-gray-200 bg-white text-gray-700'
                        }`}
                      >
                        <span className="text-xs">💵 Dinheiro</span>
                        <span className="text-[9px] text-gray-400 font-mono font-normal">Na Entrega</span>
                      </button>
                    </div>

                    {/* Method details fields */}
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs space-y-3 mt-4">
                      
                      {/* PIX INSTRUCTIONS */}
                      {customerPaymentMethod === 'pix' && (
                        <div className="space-y-3 text-center py-1">
                          <p className="text-xs text-gray-600 leading-relaxed">
                            Efetue a transferência Pix para a nossa chave oficial abaixo e clique em <strong>Finalizar Pagamento</strong> para validarmos o recebimento.
                          </p>
                          
                          <div className="p-3 bg-[#FAF6EE] rounded-xl border border-dashed border-[#1E1A17]/10 flex flex-col items-center gap-1">
                            <span className="text-[10px] text-gray-400 font-mono font-bold uppercase">CHAVE CNPJ PIX</span>
                            <span className="font-mono text-xs font-bold text-[#1E1A17]">48.291.332/0001-92</span>
                            <span className="text-[9px] text-emerald-600 font-semibold font-serif">Forno D'Oro Pizzaria Ltda</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText("48.291.332/0001-92");
                              setPixCopied(true);
                              setTimeout(() => setPixCopied(false), 2000);
                            }}
                            className="inline-flex items-center gap-2 text-xs font-bold text-[#C93C20] hover:underline cursor-pointer"
                          >
                            <Copy size={14} />
                            {pixCopied ? 'Chave Copiada! ✓' : 'Copiar Chave CNPJ'}
                          </button>
                        </div>
                      )}

                      {/* CREDIT CARD FIELDS */}
                      {customerPaymentMethod === 'credit' && (
                        <div className="space-y-3">
                          <p className="text-xs text-gray-500 font-medium">Preencha os dados do seu cartão com segurança:</p>
                          
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-0.5">NÚMERO DO CARTÃO</label>
                            <input
                              type="text"
                              maxLength={19}
                              value={cardNumber}
                              onChange={(e) => {
                                let v = e.target.value.replace(/\D/g, '');
                                v = v.replace(/(\d{4})(?=\d)/g, '$1 ');
                                setCardNumber(v);
                              }}
                              placeholder="4444 5555 6666 7777"
                              className="w-full p-2 bg-[#FAF6EE] border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-[#C93C20]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-0.5">NOME IMPRESSO NO CARTÃO</label>
                            <input
                              type="text"
                              value={cardHolder}
                              onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                              placeholder="EX: MATHEUS OLIVEIRA"
                              className="w-full p-2 bg-[#FAF6EE] border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-[#C93C20]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 mb-0.5">VALIDADE</label>
                              <input
                                type="text"
                                maxLength={5}
                                value={cardExpiry}
                                onChange={(e) => {
                                  let v = e.target.value.replace(/\D/g, '');
                                  if (v.length > 2) {
                                    v = v.substring(0, 2) + '/' + v.substring(2, 4);
                                  }
                                  setCardExpiry(v);
                                }}
                                placeholder="MM/AA"
                                className="w-full p-2 bg-[#FAF6EE] border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-[#C93C20]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 mb-0.5">CVV / CÓD. SEGURANÇA</label>
                              <input
                                type="password"
                                maxLength={3}
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                                placeholder="123"
                                className="w-full p-2 bg-[#FAF6EE] border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-[#C93C20]"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* DEBIT CARD INSTRUCTIONS */}
                      {customerPaymentMethod === 'debit' && (
                        <div className="text-center py-2 space-y-2">
                          <p className="text-xs text-gray-600 leading-relaxed">
                            O entregador levará a maquininha sem fio até sua residência. 
                          </p>
                          <p className="text-[11px] text-gray-400 font-mono">
                            Aceitamos Visa, Mastercard, Elo, Amex e Hipercard.
                          </p>
                        </div>
                      )}

                      {/* CASH INSTRUCTIONS / CHANGE OPTIONS */}
                      {customerPaymentMethod === 'cash' && (
                        <div className="space-y-3">
                          <p className="text-xs text-gray-600">Precisa de troco para dinheiro?</p>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setNeedsChange(false);
                                setChangeAmount('');
                              }}
                              className={`p-2 rounded-lg border text-xs font-semibold cursor-pointer text-center ${
                                needsChange === false
                                  ? 'border-[#C93C20] bg-[#C93C20]/5 text-[#C93C20]'
                                  : 'border-gray-200 text-gray-700'
                              }`}
                            >
                              Sem Troco (Valor exato)
                            </button>
                            <button
                              type="button"
                              onClick={() => setNeedsChange(true)}
                              className={`p-2 rounded-lg border text-xs font-semibold cursor-pointer text-center ${
                                needsChange === true
                                  ? 'border-[#C93C20] bg-[#C93C20]/5 text-[#C93C20]'
                                  : 'border-gray-200 text-gray-700'
                              }`}
                            >
                              Sim, preciso de troco
                            </button>
                          </div>

                          {needsChange === true && (
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 mb-1">PAGAR COM QUANTO? (CALCULAREMOS O TROCO)</label>
                              <div className="relative">
                                <span className="absolute left-2.5 top-2 text-xs font-mono text-gray-400">R$</span>
                                <input
                                  type="text"
                                  value={changeAmount}
                                  onChange={(e) => setChangeAmount(e.target.value.replace(/\D/g, ''))}
                                  placeholder="Ex: 100"
                                  className="w-full pl-8 pr-3 p-2 bg-[#FAF6EE] border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-[#C93C20]"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  </div>
                )}

                {/* STEP 4: ORDER SUCCESS CELEBRATION */}
                {checkoutStep === 'success' && (
                  <div className="space-y-6 py-4 flex flex-col items-center">
                    
                    {/* Glowing golden-green visual check circle */}
                    <div className="relative w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-xl">
                      <Check size={32} strokeWidth={3} className="animate-pulse" />
                    </div>

                    <div className="text-center space-y-2">
                      <h4 className="font-serif text-xl font-bold text-[#1E1A17]">Seu Pedido foi Recebido!</h4>
                      <p className="text-xs text-gray-500 px-4 leading-relaxed">
                        Obrigado, <strong>{customerName}</strong>! Seu pedido de <strong>Forno D’Oro</strong> já foi enviado diretamente para nossa central de preparo.
                      </p>
                    </div>

                    {/* Receipt breakdown summary card */}
                    <div className="bg-white w-full rounded-2xl p-4 border border-gray-100 shadow-xs space-y-3 font-mono text-xs text-gray-600">
                      <div className="flex justify-between border-b border-dashed border-gray-200 pb-2">
                        <span className="font-bold text-[#1E1A17]">PEDIDO:</span>
                        <span className="font-bold text-[#C93C20]">{orderNumber}</span>
                      </div>
                      <div className="space-y-1">
                        {cart.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-[11px]">
                            <span>{item.quantity}x {item.name}</span>
                            <span>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between font-bold text-[#1E1A17] text-sm">
                        <span>PAGO COM:</span>
                        <span className="uppercase font-serif text-[#4F5D2F]">
                          {customerPaymentMethod === 'pix' && '📱 Pix'}
                          {customerPaymentMethod === 'credit' && '💳 C. Crédito'}
                          {customerPaymentMethod === 'debit' && '💳 C. Débito'}
                          {customerPaymentMethod === 'cash' && '💵 Dinheiro'}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-[#1E1A17] text-sm">
                        <span>TOTAL GERAL:</span>
                        <span>R$ {(cartTotal + 7.00).toFixed(2).replace('.', ',')}</span>
                      </div>
                    </div>

                    {/* PIZZA PREP PROGRESS TRACKER */}
                    <div className="w-full bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-4">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-gray-700">STATUS DO PREPARO:</span>
                        <span className="text-emerald-600 font-bold">{prepProgress}%</span>
                      </div>

                      {/* Actual visual custom track progress bar */}
                      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden relative">
                        <div 
                          className="bg-[#C93C20] h-full transition-all duration-1000 ease-out"
                          style={{ width: `${prepProgress}%` }}
                        />
                      </div>

                      <div className="flex gap-2.5 items-start text-[11px] text-[#1E1A17]/80 italic">
                        <span className="animate-bounce">🍕</span>
                        <p>{prepStatus}</p>
                      </div>

                      <p className="text-[10px] text-gray-400 leading-relaxed font-mono text-center">
                        Tempo estimado de entrega: <strong>35 - 50 minutos</strong>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        clearCart();
                        setCheckoutStep('cart');
                        setIsCartOpen(false);
                      }}
                      className="w-full py-3 bg-[#1E1A17] hover:bg-[#C93C20] text-white rounded-xl text-xs font-bold transition-all duration-300 shadow cursor-pointer"
                    >
                      Realizar Novo Pedido
                    </button>
                  </div>
                )}

              </div>

              {/* Drawer Footer Actions */}
              {cart.length > 0 && checkoutStep !== 'success' && (
                <div className="p-6 bg-white border-t border-[#1E1A17]/10 space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-gray-500 font-mono">
                      <span>Subtotal Itens</span>
                      <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                    {checkoutStep !== 'cart' && (
                      <div className="flex justify-between text-xs text-gray-500 font-mono">
                        <span>Taxa de Entrega Fixa</span>
                        <span>R$ 7,00</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-bold text-[#1E1A17] border-t border-gray-100 pt-2">
                      <span className="font-serif">Total Geral</span>
                      <span className="font-mono text-[#C93C20]">
                        R$ {(checkoutStep === 'cart' ? cartTotal : cartTotal + 7.00).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>

                  {/* Submit buttons */}
                  <div className="space-y-2 pt-2">
                    
                    {checkoutStep === 'cart' && (
                      <button
                        type="button"
                        onClick={() => setCheckoutStep('shipping')}
                        className="w-full py-4 bg-[#C93C20] hover:bg-[#A32A15] text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
                      >
                        Prosseguir para Entrega
                        <ChevronRight size={16} />
                      </button>
                    )}

                    {checkoutStep === 'shipping' && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setCheckoutStep('cart')}
                          className="w-1/3 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          Voltar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!customerName || !customerPhone || !customerAddress || !customerNumber || !customerNeighborhood) {
                              alert('Por favor, preencha todos os campos obrigatórios (*).');
                              return;
                            }
                            setCheckoutStep('payment');
                          }}
                          className="w-2/3 py-3.5 bg-[#C93C20] hover:bg-[#A32A15] text-white rounded-xl font-bold text-sm shadow transition-colors cursor-pointer"
                        >
                          Ir para Pagamento
                        </button>
                      </div>
                    )}

                    {checkoutStep === 'payment' && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setCheckoutStep('shipping')}
                          className="w-1/3 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          Voltar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (customerPaymentMethod === 'credit' && (!cardNumber || !cardHolder || !cardExpiry || !cardCvv)) {
                              alert('Por favor, insira todos os dados do seu cartão de crédito.');
                              return;
                            }
                            if (customerPaymentMethod === 'cash' && needsChange === null) {
                              alert('Por favor, informe se precisa de troco.');
                              return;
                            }
                            if (customerPaymentMethod === 'cash' && needsChange === true && !changeAmount) {
                              alert('Por favor, informe com quanto irá pagar para calcularmos o troco.');
                              return;
                            }
                            // Generate random order number
                            const num = Math.floor(1000 + Math.random() * 9000);
                            setOrderNumber(`#FD-${num}`);
                            setCheckoutStep('success');
                          }}
                          className="w-2/3 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Check size={18} />
                          Finalizar Pagamento
                        </button>
                      </div>
                    )}
                    
                    {checkoutStep !== 'payment' && checkoutStep !== 'shipping' && (
                      <button
                        type="button"
                        onClick={() => setIsCartOpen(false)}
                        className="w-full py-3 bg-[#FAF6EE] text-gray-600 hover:text-[#1E1A17] rounded-xl font-semibold text-xs border border-gray-200 transition-colors cursor-pointer text-center"
                      >
                        Continuar Escolhendo
                      </button>
                    )}
                  </div>

                  <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                    Pagamento 100% seguro processado de forma local direta no servidor da Forno D'Oro.
                  </p>
                </div>
              )}

            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* FLOATING ACTION CART BUTTON (ALWAYS PRESENT FOR MAXIMUM UX COMFORT WHEN CART HAS ITEMS) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        
        {/* Floating Cart Badge / Helper if items are present */}
        {cartTotalItems > 0 && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => setIsCartOpen(true)}
            className="bg-[#C93C20] text-white px-5 py-3.5 rounded-full flex items-center gap-2.5 shadow-2xl hover:bg-[#A32A15] hover:scale-105 active:scale-95 transition-all duration-300 animate-bounce cursor-pointer border border-white/20"
          >
            <ShoppingBag size={18} />
            <span className="text-xs font-bold font-mono">Meu Pedido ({cartTotalItems})</span>
            <span className="text-xs bg-[#FFE082] text-[#1E1A17] font-mono px-2 py-0.5 rounded-full font-bold">
              R$ {cartTotal.toFixed(0)}
            </span>
          </motion.button>
        )}

      </div>

      {/* FOOTER */}
      <footer className="bg-[#1E1A17] text-white/70 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-white/10 pb-8 mb-8 text-center md:text-left">
            
            {/* Logo/Name Column */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="font-serif text-lg font-bold text-[#FFE082]">
                Forno D’Oro Pizzaria
              </h4>
              <p className="text-xs leading-relaxed max-w-sm mx-auto md:mx-0 font-light">
                O sabor da tradição em cada fatia. Massa artesanal de fermentação lenta com ingredientes selecionados assados no fogo de verdade.
              </p>
            </div>

            {/* Quick Links Column */}
            <div className="md:col-span-4 flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => setActivePage('home')}
                className="text-xs font-semibold hover:text-white transition-colors"
              >
                Início & Apresentação
              </button>
              <button 
                onClick={() => setActivePage('menu')}
                className="text-xs font-semibold hover:text-white transition-colors"
              >
                Nosso Cardápio
              </button>
              <a 
                href="#onde-estamos" 
                className="text-xs font-semibold hover:text-white transition-colors"
              >
                Localização
              </a>
            </div>

            {/* Safety & Developer credits column */}
            <div className="md:col-span-4 text-center md:text-right space-y-2">
              <p className="text-xs font-mono text-gray-500">
                Atendimento das 18h às 23h30
              </p>
              <p className="text-xs font-mono text-gray-500">
                Campinas / SP
              </p>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
            <p>
              Forno D’Oro Pizzaria © 2026. Todos os direitos reservados.
            </p>
            <p>
              Orgulhosamente artesanal.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
