import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Camera, 
  Upload, 
  Heart, 
  ShoppingBag, 
  Search, 
  Share2, 
  RotateCcw, 
  Check, 
  MapPin, 
  X, 
  Info, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight,
  Eye,
  Sliders,
  Sparkle,
  BadgePercent,
  Compass,
  DollarSign,
  Smartphone,
  Download
} from 'lucide-react';

// ==========================================
// Types & Core Interfaces
// ==========================================
interface JewelryItem {
  id: string;
  name: string;
  category: 'Necklaces' | 'Earrings' | 'Bracelets' | 'Rings';
  basePriceINR: number;
  description: string;
  purity: '22k' | '18k' | '14k';
  weight: string;
  stones: string;
  certificate: string;
  shapeKey: 'choker' | 'jhumka' | 'kada' | 'ring' | 'mala';
  isExclusive?: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  suggestedAction?: {
    type: 'select-product' | 'apply-metal';
    value: string;
  };
}

// ==========================================
// High-End Curated Masterpieces Dataset - Premium Artificial & Fashion Jewelry
// ==========================================
const MASTERPIECES: JewelryItem[] = [
  {
    id: 'suryavanshi-choker',
    name: 'Suryavanshi Kundan Choker',
    category: 'Necklaces',
    basePriceINR: 1999,
    description: 'An imperial festive choker featuring high-grade Hand-Cut Kundan glasswork and radiant simulated rubies. Designed for brides and partygoers on an accessible budget.',
    purity: '22k',
    weight: '42.5 g',
    stones: 'Imitation Ruby Crystals & High-Grade Kundan Glass',
    certificate: 'Vajra Anti-Tarnish Assurance - Brass Base',
    shapeKey: 'choker',
    isExclusive: true
  },
  {
    id: 'mayura-jhumkas',
    name: 'Mayura Peacock Jhumkas',
    category: 'Earrings',
    basePriceINR: 699,
    description: 'Symmetrical twin peacock traditional dangling jhumkas featuring micro-pavé Cubic Zirconia feathers and drops of hand-woven faux shell pearls.',
    purity: '22k',
    weight: '12.2 g',
    stones: 'AAA+ Cushion Cubic Zirconia & Premium Faux Pearls',
    certificate: 'Lead & Nickel Free Certified',
    shapeKey: 'jhumka'
  },
  {
    id: 'nizami-kada',
    name: 'Nizami Emerald Kada Bangle',
    category: 'Bracelets',
    basePriceINR: 1199,
    description: 'A majestic openable fashion wrist bangle, showcasing intricate traditional filigree work and radiant simulated emerald cabochons.',
    purity: '22k',
    weight: '24.0 g',
    stones: 'Simulated Zambian Emeralds & Faux Polki',
    certificate: 'Skin-Friendly Alloy Certification',
    shapeKey: 'kada'
  },
  {
    id: 'devika-solitaire',
    name: 'Eternal Solitaire CZ Ring',
    category: 'Rings',
    basePriceINR: 599,
    description: 'A super-sparkling central cushion-cut Cubic Zirconia gemstone, held securely within a premium silver-plated vintage rope-braid band.',
    purity: '18k',
    weight: '4.8 g',
    stones: 'Hearts & Arrows Cushion Cubic Zirconia (1.5 Ct Equiv.)',
    certificate: '1-Year Plating Warranty Certificate',
    shapeKey: 'ring'
  },
  {
    id: 'chandra-mala',
    name: 'Chandra Pearl Mala Necklace',
    category: 'Necklaces',
    basePriceINR: 2499,
    description: 'Three cascading arrays of luxurious triple-polished pearl beads representing lunar cycles, anchored by stunning twin faux ruby floral side-hooks.',
    purity: '22k',
    weight: '45.2 g',
    stones: 'Simulated Rubies & High-Luster Selected Glass Pearls',
    certificate: 'High Gloss Polish Approved',
    shapeKey: 'mala'
  }
];

// Model Presets for Virtual Try-On Studio
const MODEL_PRESETS = [
  {
    id: 'model-portrait-1',
    name: 'Royal Bridal Portrait',
    category: 'Necklaces',
    url: 'https://images.unsplash.com/photo-1599839575157-2c9cc0dfd23b?auto=format&fit=crop&q=80&w=800',
    type: 'neck'
  },
  {
    id: 'model-portrait-2',
    name: 'Hand & Wrist Placement',
    category: 'Bracelets',
    url: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800',
    type: 'wrist'
  },
  {
    id: 'model-portrait-3',
    name: 'Elegant Profile Portrait',
    category: 'Earrings',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
    type: 'ear'
  }
];

export default function App() {
  // --- STATE ---
  const [selectedProduct, setSelectedProduct] = useState<JewelryItem>(MASTERPIECES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Necklaces' | 'Earrings' | 'Bracelets' | 'Rings'>('All');
  
  // Customization Options
  const [metalColor, setMetalColor] = useState<'Yellow Gold' | 'Rose Gold' | 'Platinum'>('Yellow Gold');
  const [goldPurity, setGoldPurity] = useState<'22k' | '18k' | '14k'>('22k');
  const [engravingText, setEngravingText] = useState('');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Multi-drawer States
  const [wishlist, setWishlist] = useState<string[]>(['mayura-jhumkas']); // pre-liked
  const [cart, setCart] = useState<{ item: JewelryItem; metal: string; purity: string; engraving: string; quantity: number }[]>([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showWishlistDrawer, setShowWishlistDrawer] = useState(false);
  
  // Try-on Studio
  const [isTryOnActive, setIsTryOnActive] = useState(false);
  const [tryOnMethod, setTryOnMethod] = useState<'camera' | 'model' | 'upload'>('model');
  const [selectedModel, setSelectedModel] = useState(MODEL_PRESETS[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  
  // Try-on positioning sliders
  const [overlayScale, setOverlayScale] = useState(1.1);
  const [overlayRotation, setOverlayRotation] = useState(0);
  const [overlayX, setOverlayX] = useState(0);
  const [overlayY, setOverlayY] = useState(40);
  const [isDraggingOverlay, setIsDraggingOverlay] = useState(false);
  const dragStartCoords = useRef({ x: 0, y: 0 });
  const dragOffsetInitial = useRef({ x: 0, y: 0 });

  // Camera & Video ref
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chatbot State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Greetings. I am your Vajra AI Stylist. Tell me about your outfit or look, and I will recommend gorgeous, highly affordable premium artificial jewelry, CZ stones, or Kundan statement pieces that elevate your style within your budget!'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatTyping, setIsChatTyping] = useState(false);

  // UI Modal overlays
  const [activeInfoModal, setActiveInfoModal] = useState<'certificate' | 'shipping' | 'stores' | 'snapshot' | null>(null);
  const [capturedSnapshotUrl, setCapturedSnapshotUrl] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'idle' | 'shipping' | 'payment' | 'completed'>('idle');

  // Android Simulation and PWA Installer States
  const [isAndroidSimulatedFrameActive, setIsAndroidSimulatedFrameActive] = useState(false);
  const [showAndroidBanner, setShowAndroidBanner] = useState(true);
  const [isAndroidHubOpen, setIsAndroidHubOpen] = useState(false);
  const [apkDownloadState, setApkDownloadState] = useState<'idle' | 'building' | 'installing' | 'ready'>('idle');
  const [apkInstallProgress, setApkInstallProgress] = useState(0);

  // ==========================================
  // Custom helper variables
  // ==========================================
  const conversionRate = 83.5; // 1 USD = 83.5 INR

  const formatPrice = (priceINR: number) => {
    // Modify based on premium plating upgrades
    let dynamicPrice = priceINR;
    if (metalColor === 'Rose Gold') dynamicPrice += 150;
    if (metalColor === 'Platinum') dynamicPrice += 250;
    if (goldPurity === '18k') dynamicPrice -= 80;
    if (goldPurity === '14k') dynamicPrice -= 150;

    if (currency === 'INR') {
      return `₹${dynamicPrice.toLocaleString('en-IN')}`;
    } else {
      const usdPrice = Math.round(dynamicPrice / conversionRate);
      return `$${usdPrice.toLocaleString('en-US')}`;
    }
  };

  const getPriceRaw = (item: JewelryItem) => {
    let dynamicPrice = item.basePriceINR;
    if (metalColor === 'Rose Gold') dynamicPrice += 150;
    if (metalColor === 'Platinum') dynamicPrice += 250;
    if (goldPurity === '18k') dynamicPrice -= 80;
    if (goldPurity === '14k') dynamicPrice -= 150;
    return dynamicPrice;
  };

  // Start simulated APK compilation / download
  const handleStartApkDownload = () => {
    if (apkDownloadState !== 'idle') return;
    setApkDownloadState('building');
    setApkInstallProgress(0);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      if (currentProgress < 40) {
        // Keep in building state
      } else if (currentProgress >= 40 && currentProgress < 85) {
        setApkDownloadState('installing');
      } else if (currentProgress >= 100) {
        clearInterval(interval);
        setApkDownloadState('ready');
        setApkInstallProgress(100);
        return;
      }
      setApkInstallProgress(currentProgress);
    }, 200);
  };

  // Filter jewelry according to category and search query
  const filteredProducts = MASTERPIECES.filter(prod => {
    const matchesCategory = activeCategory === 'All' || prod.category === activeCategory;
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.stones.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // ==========================================
  // Interactions & Actions handlers
  // ==========================================
  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      setWishlist(prev => prev.filter(id => id !== productId));
    } else {
      setWishlist(prev => [...prev, productId]);
    }
  };

  const addToCart = () => {
    setCart(prev => [
      ...prev,
      {
        item: selectedProduct,
        metal: metalColor,
        purity: goldPurity,
        engraving: engravingText,
        quantity: 1
      }
    ]);
    setShowCartDrawer(true);
    setEngravingText('');
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  // Try-on Camera streams
  useEffect(() => {
    if (isTryOnActive && tryOnMethod === 'camera') {
      navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
        .then(stream => {
          setCameraStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(err => console.log("Video playback interrupted", err));
          }
        })
        .catch(err => {
          console.warn("Camera permission declined or unavailable:", err);
          alert("Could not access your camera. Please ensure camera permissions are active. Reverting to preset models.");
          setTryOnMethod('model');
        });
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isTryOnActive, tryOnMethod]);

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string);
          setTryOnMethod('upload');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handlers for pointer drag movement on Try-On layout
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDraggingOverlay(true);
    dragStartCoords.current = { x: e.clientX, y: e.clientY };
    dragOffsetInitial.current = { x: overlayX, y: overlayY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingOverlay) return;
    const deltaX = e.clientX - dragStartCoords.current.x;
    const deltaY = e.clientY - dragStartCoords.current.y;
    // Map movement limits
    setOverlayX(dragOffsetInitial.current.x + deltaX);
    setOverlayY(dragOffsetInitial.current.y + deltaY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDraggingOverlay(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  // Snapshot Capture logic
  const handleCaptureSnapshot = () => {
    // Generate a beautiful preview composite modal
    setCapturedSnapshotUrl(selectedModel.url);
    setActiveInfoModal('snapshot');
  };

  // AI Stylist Chat triggers
  const handleSendChat = (text: string) => {
    if (!text.trim()) return;

    const newMsgs = [...chatMessages, { id: `user-${Date.now()}`, sender: 'user' as const, text }];
    setChatMessages(newMsgs);
    setChatInput('');
    setIsChatTyping(true);

    // Simulate luxury expert answer
    setTimeout(() => {
      const q = text.toLowerCase();
      let responseText = "That sounds fascinating! Our master jewelry designers suggest selecting our handcrafted Suryavanshi Golden Choker styled beautifully in 22k Yellow Gold. Would you like me to adjust your design panel now to try this on?";
      let action: any = undefined;

      if (q.includes('red') || q.includes('velvet') || q.includes('maroon') || q.includes('lehenga') || q.includes('outfit')) {
        responseText = "Superb choice. For dark velvet reds and velvet maroons, our 'Suryavanshi Choker' showcases rare crimson Burma Rubies that create a breathtaking royal match. Contrast this with our 22k pure yellow gold finish.";
        action = { type: 'select-product', value: 'suryavanshi-choker' };
      } else if (q.includes('earring') || q.includes('jhumka') || q.includes('ear')) {
        responseText = "For ears, our traditional 'Mayura Jhumkas' with twin carved peacocks and Basra pearls look exquisite when catching low evening lights. Let’s load the try-on models!";
        action = { type: 'select-product', value: 'mayura-jhumkas' };
      } else if (q.includes('diamond') || q.includes('ring') || q.includes('solitaire') || q.includes('modern')) {
        responseText = "Our 'Devika Solitaire Ring' features a certified cushion solitaire set inside highly complex geometric rope-braids. I’ve updated your studio with Platinum finish!";
        action = { type: 'select-product', value: 'devika-solitaire' };
      } else if (q.includes('gold') || q.includes('pure') || q.includes('bangle') || q.includes('bracelet')) {
        responseText = "Nothing carries historic legacy like heavy cuffs. The 'Nizami Kada' matches solid gold frameworks with rich green Zambian emeralds. I am loading this on your design stage.";
        action = { type: 'select-product', value: 'nizami-kada' };
      } else if (q.includes('rose') || q.includes('pink')) {
        responseText = "A warm modern aesthetic. I have instantly modified your gold base parameters to '18k Rose Gold' to highlight softer romantic light reflections.";
        action = { type: 'apply-metal', value: 'Rose Gold' };
      } else if (q.includes('platinum') || q.includes('white')) {
        responseText = "Understood. Rebuilding the setting using stellar Platinum alloy to highlight pristine modern white-reflective radiance.";
        action = { type: 'apply-metal', value: 'Platinum' };
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: responseText,
          suggestedAction: action
        }
      ]);
      setIsChatTyping(false);
    }, 1100);
  };

  const applyAIAction = (action: { type: 'select-product' | 'apply-metal'; value: string }) => {
    if (action.type === 'select-product') {
      const prod = MASTERPIECES.find(m => m.id === action.value);
      if (prod) {
        setSelectedProduct(prod);
        // Switch TRY-ON model overlay placement based on catalog item
        if (prod.category === 'Earrings') setSelectedModel(MODEL_PRESETS[2]);
        else if (prod.category === 'Bracelets') setSelectedModel(MODEL_PRESETS[1]);
        else setSelectedModel(MODEL_PRESETS[0]);
      }
    } else if (action.type === 'apply-metal') {
      setMetalColor(action.value as any);
    }
  };

  // Get color hex values according to selected metal
  const getMetalHex = () => {
    if (metalColor === 'Rose Gold') return { main: '#D49D8F', highlight: '#fbdcd5', dark: '#5e3a32' };
    if (metalColor === 'Platinum') return { main: '#E5E7EB', highlight: '#FFFFFF', dark: '#4B5563' };
    return { main: '#D4AF37', highlight: '#FBE9A3', dark: '#6B5111' }; // Yellow Gold
  };

  const goldColors = getMetalHex();

  // ==========================================
  // Vector SVG Jewelry Graphic Generators
  // ==========================================
  const renderVectorJewelry = (sizeClass = "w-64 h-64", scaleOverride?: number, customEngraving?: string) => {
    const scale = scaleOverride || 1;
    const strokeWidth = 2 / scale;

    const engravingEl = customEngraving ? (
      <text 
        x="100" 
        y="178" 
        fontFamily='"JetBrains Mono", sans-serif' 
        fontSize="5" 
        fill={goldColors.highlight} 
        textAnchor="middle" 
        letterSpacing="1"
        opacity="0.8"
      >
        {customEngraving.slice(0, 15).toUpperCase()}
      </text>
    ) : null;

    switch (selectedProduct.shapeKey) {
      case 'choker':
        return (
          <svg className={sizeClass} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform={`scale(${scale}) translate(${(100 - 100 * scale)}, ${(100 - 100 * scale)})`}>
              {/* Outer halo */}
              <circle cx="100" cy="100" r="82" stroke={`${goldColors.dark}33`} strokeWidth="1" strokeDasharray="3 3" />
              {/* Main Golden Neck Curve */}
              <path d="M40 70C40 120 70 160 100 160C130 160 160 120 160 70" stroke={goldColors.main} strokeWidth="6" strokeLinecap="round" />
              <path d="M40 70C40 120 70 160 100 160C130 160 160 120 160 70" stroke={goldColors.highlight} strokeWidth="2" strokeLinecap="round" strokeDasharray="10 5" />
              
              {/* Hanging Rubies & Filigree Droplets */}
              {[45, 55, 65, 75, 85, 95, 100, 105, 115, 125, 135, 145, 155].map((angle, idx) => {
                const rad = (angle * Math.PI) / 180;
                // calculate neck center projection offset
                const x0 = 100 + 60 * Math.sin(rad - Math.PI/2);
                const y0 = 98 + 62 * Math.cos(rad - Math.PI/2) * 1.05;
                const x1 = 100 + 72 * Math.sin(rad - Math.PI/2);
                const y1 = 98 + 74 * Math.cos(rad - Math.PI/2) * 1.05;

                const isCenter = idx === 6;
                return (
                  <g key={idx}>
                    {/* Link Pin */}
                    <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={goldColors.main} strokeWidth="1.5" />
                    {/* Golden bead separator */}
                    <circle cx={x0} cy={y0} r="2" fill={goldColors.highlight} />
                    {/* Hanging gem (Ruby vs Diamond loop) */}
                    <circle 
                      cx={x1} 
                      cy={y1} 
                      r={isCenter ? "6" : "4.5"} 
                      fill={isCenter ? "#B22222" : (idx % 2 === 0 ? "#8B0000" : goldColors.highlight)} 
                      stroke={goldColors.main} 
                      strokeWidth="1" 
                    />
                    {/* Glistening white point */}
                    <circle cx={x1 - 1.5} cy={y1 - 1.5} r="1" fill="#FFFFFF" opacity="0.9" />
                  </g>
                );
              })}

              {/* Central Imperial Pendant Crown */}
              <g transform="translate(100, 158)">
                <path d="M-15 0 L15 0 L20 -15 L10 -8 L0 -22 L-10 -8 L-20 -15 Z" fill={goldColors.main} stroke={goldColors.highlight} strokeWidth="1" />
                <circle cx="0" cy="-10" r="5" fill="#B22222" />
                <circle cx="0" cy="-10" r="1.5" fill="#FFFFFF" />
                {/* Embedded Diamond beads */}
                <circle cx="-10" cy="-6" r="2" fill="#E5E7EB" />
                <circle cx="10" cy="-6" r="2" fill="#E5E7EB" />
              </g>

              {/* Inner collar structure */}
              <path d="M50 78C50 115 72 144 100 144C128 144 150 115 150 78" stroke={`${goldColors.main}99`} strokeWidth="1.5" />
              
              {/* Engraving Tag if active */}
              {engravingEl}
            </g>
          </svg>
        );

      case 'jhumka':
        return (
          <svg className={sizeClass} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform={`scale(${scale}) translate(${(100 - 100 * scale)}, ${(100 - 100 * scale)})`}>
              {/* Geometric Balance - concentric rings background */}
              <circle cx="100" cy="100" r="85" stroke={`${goldColors.dark}44`} strokeWidth="1" />
              <circle cx="100" cy="100" r="65" stroke={`${goldColors.dark}22`} strokeWidth="1" />

              {/* Earring 1 (Left Showcase) */}
              <g transform="translate(65, 30)">
                {/* Fastener Hook */}
                <path d="M35 15 C35 0, 25 0, 25 10" stroke={goldColors.main} strokeWidth="1.5" strokeLinecap="round" />
                
                {/* Traditional Peacock Fan Top stud */}
                <path d="M15 35 C 15 20, 45 20, 45 35 C 43 45, 17 45, 15 35 Z" fill={`${goldColors.main}EE`} stroke={goldColors.highlight} strokeWidth="1" />
                {/* Central Emerald on top */}
                <circle cx="30" cy="32" r="4.5" fill="#047857" />
                <circle cx="28.5" cy="30.5" r="1" fill="#FFF" />
                
                {/* Dynamic Link Chains */}
                <line x1="30" y1="42" x2="30" y2="55" stroke={goldColors.main} strokeWidth="2" strokeDasharray="2 2" />
                
                {/* Dome-shaped Jhumka Base */}
                <g transform="translate(30, 75)">
                  <path d="M-22 -8 C-22 -30, 22 -30, 22 -8 L22 2 C22 5, -22 5, -22 2 Z" fill={goldColors.main} stroke={goldColors.highlight} strokeWidth="1.5" />
                  {/* Filigree detail lines */}
                  <path d="M-18 -8 Q0 -19 18 -8" stroke={goldColors.highlight} strokeWidth="1" strokeDasharray="3 2" />
                  <path d="M-15 -14 Q0 -23 15 -14" stroke={goldColors.highlight} strokeWidth="1" strokeDasharray="3 2" />
                  
                  {/* Tiny hanging gold beads along rim */}
                  {[-18, -12, -6, 0, 6, 12, 18].map((xOffset, i) => (
                    <g key={i} transform={`translate(${xOffset}, 5)`}>
                      <line x1="0" y1="0" x2="0" y2="8" stroke={goldColors.main} strokeWidth="1" />
                      <circle cx="0" cy="9" r="2.5" fill={goldColors.highlight} />
                      <circle cx="0" cy="11.5" r="1.5" fill="#FFF" />
                    </g>
                  ))}
                  
                  {/* Majestic core drop pearl */}
                  <g transform="translate(0, 4)">
                    <line x1="0" y1="0" x2="0" y2="20" stroke={goldColors.main} strokeWidth="2" />
                    <path d="M-5 20 C-5 14, 5 14, 5 20 C5 26, -5 26, -5 20 Z" fill="#F3F4F6" stroke={goldColors.main} strokeWidth="1" />
                    <circle cx="-1.5" cy="18.5" r="1.2" fill="#FFF" />
                  </g>
                </g>
              </g>

              {/* Earring 2 (Right Showcase) */}
              <g transform="translate(105, 30)">
                <path d="M35 15 C35 0, 25 0, 25 10" stroke={goldColors.main} strokeWidth="1.5" strokeLinecap="round" />
                <path d="M15 35 C 15 20, 45 20, 45 35 C 43 45, 17 45, 15 35 Z" fill={`${goldColors.main}EE`} stroke={goldColors.highlight} strokeWidth="1" />
                <circle cx="30" cy="32" r="4.5" fill="#047857" />
                <circle cx="28.5" cy="30.5" r="1" fill="#FFF" />
                
                <line x1="30" y1="42" x2="30" y2="55" stroke={goldColors.main} strokeWidth="2" strokeDasharray="2 2" />
                
                <g transform="translate(30, 75)">
                  <path d="M-22 -8 C-22 -30, 22 -30, 22 -8 L22 2 C22 5, -22 5, -22 2 Z" fill={goldColors.main} stroke={goldColors.highlight} strokeWidth="1.5" />
                  <path d="M-18 -8 Q0 -19 18 -8" stroke={goldColors.highlight} strokeWidth="1" strokeDasharray="3 2" />
                  <path d="M-15 -14 Q0 -23 15 -14" stroke={goldColors.highlight} strokeWidth="1" strokeDasharray="3 2" />
                  
                  {[-18, -12, -6, 0, 6, 12, 18].map((xOffset, i) => (
                    <g key={i} transform={`translate(${xOffset}, 5)`}>
                      <line x1="0" y1="0" x2="0" y2="8" stroke={goldColors.main} strokeWidth="1" />
                      <circle cx="0" cy="9" r="2.5" fill={goldColors.highlight} />
                      <circle cx="0" cy="11.5" r="1.5" fill="#FFF" />
                    </g>
                  ))}
                  
                  <g transform="translate(0, 4)">
                    <line x1="0" y1="0" x2="0" y2="20" stroke={goldColors.main} strokeWidth="2" />
                    <path d="M-5 20 C-5 14, 5 14, 5 20 C5 26, -5 26, -5 20 Z" fill="#F3F4F6" stroke={goldColors.main} strokeWidth="1" />
                    <circle cx="-1.5" cy="18.5" r="1.2" fill="#FFF" />
                  </g>
                </g>
              </g>

              {/* Engraving plate if active */}
              {engravingEl}
            </g>
          </svg>
        );

      case 'kada':
        return (
          <svg className={sizeClass} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform={`scale(${scale}) translate(${(100 - 100 * scale)}, ${(100 - 100 * scale)})`}>
              {/* Outer starry halo */}
              <circle cx="100" cy="100" r="72" stroke={goldColors.main} strokeWidth="0.5" strokeDasharray="5 5" opacity="0.6"/>
              
              {/* Main Bracelet Ellipse from fine angle perspective */}
              <ellipse cx="100" cy="100" rx="65" ry="32" stroke={goldColors.main} strokeWidth="9" />
              <ellipse cx="100" cy="100" rx="65" ry="32" stroke={goldColors.highlight} strokeWidth="2" strokeDasharray="8 4" />
              
              {/* Inner hole */}
              <ellipse cx="100" cy="100" rx="55" ry="24" stroke={goldColors.dark} strokeWidth="1.5" />

              {/* Jewel Cabochons studded along the top rim */}
              {[
                { cx: 42, cy: 92, r: 5, color: '#047857' },    // Left Emerald
                { cx: 62, cy: 82, r: 5.5, color: '#047857' },
                { cx: 83, cy: 75, r: 6, color: '#B22222' },     // Center Ruby
                { cx: 100, cy: 72, r: 7.5, color: '#047857' }, // Imperial Emerald
                { cx: 118, cy: 75, r: 6, color: '#B22222' },    // Center Ruby
                { cx: 138, cy: 82, r: 5.5, color: '#047857' },
                { cx: 158, cy: 92, r: 5, color: '#047857' },   // Right Emerald
              ].map((gem, idx) => (
                <g key={idx}>
                  {/* Bezel cup boundary */}
                  <circle cx={gem.cx} cy={gem.cy} r={gem.r + 1.5} fill={goldColors.main} />
                  {/* Polki Gold Beads */}
                  <circle cx={gem.cx} cy={gem.cy} r={gem.r + 0.5} fill="none" stroke={goldColors.highlight} strokeWidth="0.8" />
                  {/* Gemstone body */}
                  <circle cx={gem.cx} cy={gem.cy} r={gem.r} fill={gem.color} />
                  {/* Glisten flare */}
                  <circle cx={gem.cx - 1.5} cy={gem.cy - 1.5} r="1.3" fill="#FFF" opacity="0.9" />
                </g>
              ))}

              {/* Hinge Joint Details */}
              <rect x="33" y="96" width="4" height="8" fill={goldColors.highlight} stroke={goldColors.dark} strokeWidth="0.8" rx="1" />
              <rect x="163" y="96" width="4" height="8" fill={goldColors.highlight} stroke={goldColors.dark} strokeWidth="0.8" rx="1" />
              <circle cx="35" cy="100" r="1" fill="#000" />
              <circle cx="165" cy="100" r="1" fill="#000" />

              {/* Beautiful filigree detail waves on lower bracelet front */}
              <path d="M45 106 Q100 138 155 106" stroke={goldColors.highlight} strokeWidth="1.5" strokeLinecap="round" />
              <path d="M50 110 Q100 142 150 110" stroke={goldColors.highlight} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" />

              {/* Engraving Plate */}
              {customEngraving && (
                <g transform="translate(100, 115)">
                  <rect x="-24" y="-5" width="48" height="10" fill={goldColors.dark} stroke={goldColors.main} strokeWidth="1" rx="2" />
                  <text 
                    x="0" 
                    y="2" 
                    fontFamily='"JetBrains Mono", sans-serif' 
                    fontSize="5" 
                    fill="#FFF" 
                    textAnchor="middle" 
                    opacity="0.9"
                    letterSpacing="0.8"
                  >
                    {customEngraving.slice(0, 12).toUpperCase()}
                  </text>
                </g>
              )}
            </g>
          </svg>
        );

      case 'ring':
        return (
          <svg className={sizeClass} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform={`scale(${scale}) translate(${(100 - 100 * scale)}, ${(100 - 100 * scale)})`}>
              {/* Deep Shadow Circle */}
              <ellipse cx="100" cy="155" rx="36" ry="7" fill="black" opacity="0.4" />
              
              {/* Circular Ring Band (3/4 angle) */}
              <ellipse cx="100" cy="115" rx="42" ry="40" stroke={goldColors.main} strokeWidth="6.5" />
              <ellipse cx="100" cy="115" rx="42" ry="40" stroke={goldColors.highlight} strokeWidth="1.5" strokeDasharray="6 3" />
              <ellipse cx="100" cy="115" rx="35" ry="33" stroke={`${goldColors.dark}AA`} strokeWidth="1" />

              {/* Detailed Crown Prongs */}
              <path d="M80 65 L84 45 L90 40 L96 45 L100 65" fill={goldColors.main} stroke={goldColors.highlight} strokeWidth="1" />
              <path d="M120 65 L116 45 L110 40 L104 45 L100 65" fill={goldColors.main} stroke={goldColors.highlight} strokeWidth="1" />

              {/* Brilliant Cushion Cut Diamond */}
              <g transform="translate(100, 48)">
                {/* Outer stone facet boundary */}
                <path d="M-20 -15 L20 -15 L28 8 L0 25 L-28 8 Z" fill="#EBF3F5" stroke="#90A4AE" strokeWidth="1.5" />
                
                {/* Facets layout */}
                <polygon points="0,-15 -20,-15 -14,-4" fill="#FFFFFF" stroke="#90A4AE" strokeWidth="0.5" />
                <polygon points="0,-15 20,-15 14,-4" fill="#DCEFEF" stroke="#90A4AE" strokeWidth="0.5" />
                <polygon points="-20,-15 -28,8 -14,-4" fill="#C2E2E6" stroke="#90A4AE" strokeWidth="0.5" />
                <polygon points="20,-15 28,8 14,-4" fill="#E6FAF9" stroke="#90A4AE" strokeWidth="0.5" />
                <polygon points="-28,8 0,25 -14,-4" fill="#AFDBDF" stroke="#90A4AE" strokeWidth="0.5" />
                <polygon points="28,8 0,25 14,-4" fill="#FFFFFF" stroke="#90A4AE" strokeWidth="0.5" />
                <polygon points="-14,-4 14,-4 0,25" fill="#E8F9FB" stroke="#90A4AE" strokeWidth="0.5" />
                <polygon points="-14,-4 14,-4 0,-15" fill="#FFFFFF" stroke="#90A4AE" strokeWidth="0.5" />
                
                {/* Shiny Stars */}
                <polygon points="-2,-13 0,-7 2,-13 0,-15" fill="#FFF" />
                <polygon points="12,10 14,13 16,10 14,8" fill="#FFF" />
              </g>

              {/* Side Accent Small Diamonds on Shank */}
              {[
                { cx: 64, cy: 92 },
                { cx: 70, cy: 84 },
                { cx: 78, cy: 78 },
                { cx: 136, cy: 92 },
                { cx: 130, cy: 84 },
                { cx: 122, cy: 78 },
              ].map((pt, i) => (
                <g key={i}>
                  <circle cx={pt.cx} cy={pt.cy} r="2.8" fill={goldColors.main} />
                  <circle cx={pt.cx} cy={pt.cy} r="1.8" fill="#FFF" />
                  <circle cx={pt.cx - 0.5} cy={pt.cy - 0.5} r="0.5" fill="#FFF" />
                </g>
              ))}

              {/* Inside Shank Custom Engraving Preview */}
              {customEngraving && (
                <g transform="translate(100, 138)">
                  <path d="M-20 0 Q0 8 20 0" stroke={goldColors.highlight} strokeWidth="1" fill="none" />
                  <text 
                    x="0" 
                    y="7" 
                    fontFamily='"JetBrains Mono", sans-serif' 
                    fontSize="5" 
                    fill={goldColors.highlight} 
                    textAnchor="middle" 
                    letterSpacing="0.8"
                    opacity="0.8"
                  >
                    {customEngraving.slice(0, 10).toUpperCase()}
                  </text>
                </g>
              )}
            </g>
          </svg>
        );

      case 'mala':
        return (
          <svg className={sizeClass} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform={`scale(${scale}) translate(${(100 - 100 * scale)}, ${(100 - 100 * scale)})`}>
              {/* Outer halo */}
              <circle cx="100" cy="100" r="80" stroke={`${goldColors.dark}33`} strokeWidth="1" />

              {/* Layer 1 (Inner Bead strand) */}
              <path d="M55 55C55 110 75 132 100 132C125 132 145 110 145 55" stroke={goldColors.main} strokeWidth="3" />
              <path d="M55 55C55 110 75 132 100 132C125 132 145 110 145 55" stroke={goldColors.highlight} strokeWidth="1.2" strokeDasharray="4 6" />

              {/* Layer 2 (Middle Bead strand) */}
              <path d="M48 50C48 120 72 152 100 152C128 152 152 120 152 50" stroke={goldColors.main} strokeWidth="4.5" />
              <path d="M48 50C48 120 72 152 100 152C128 152 152 120 152 50" stroke={goldColors.highlight} strokeWidth="1.5" strokeDasharray="6 8" />

              {/* Layer 3 (Outer heavy Bead strand with pendants) */}
              <path d="M40 45C40 130 68 174 100 174C132 174 160 130 160 45" stroke={goldColors.main} strokeWidth="6" />
              <path d="M40 45C40 130 68 174 100 174C132 174 160 130 160 45" stroke={goldColors.highlight} strokeWidth="2" strokeDasharray="10 10" />

              {/* Floral Clasp Left */}
              <g transform="translate(42, 48)">
                <circle cx="0" cy="0" r="5" fill={goldColors.main} stroke={goldColors.highlight} strokeWidth="1" />
                <circle cx="0" cy="0" r="2.5" fill="#B22222" />
              </g>

              {/* Floral Clasp Right */}
              <g transform="translate(158, 48)">
                <circle cx="0" cy="0" r="5" fill={goldColors.main} stroke={goldColors.highlight} strokeWidth="1" />
                <circle cx="0" cy="0" r="2.5" fill="#B22222" />
              </g>

              {/* Tiny Pendants dangling from outer heavy line */}
              {[60, 75, 90, 100, 110, 125, 140].map((angle, idx) => {
                const rad = (angle * Math.PI) / 180;
                const xl = 100 + 74 * Math.sin(rad - Math.PI/2);
                const yl = 85 + 87 * Math.cos(rad - Math.PI/2) * 1.05;
                const isCenter = idx === 3;
                return (
                  <g key={idx}>
                    <line x1={xl} y1={yl} x2={xl} y2={yl + (isCenter ? 14 : 9)} stroke={goldColors.main} strokeWidth="1.5" />
                    <circle cx={xl} cy={yl + (isCenter ? 14 : 9)} r={isCenter ? "4" : "2.5"} fill="#B22222" />
                    <circle cx={xl} cy={yl + (isCenter ? 14 : 9)} r="1" fill="#FFF" />
                  </g>
                );
              })}

              {/* Engraving plaque inside layout */}
              {engravingEl}
            </g>
          </svg>
        );
      
      default:
        return null;
    }
  };

  const renderAppContent = () => {
    return (
      <div className="w-full min-h-screen bg-[#0A0A0A] text-white flex flex-col overflow-x-hidden font-sans relative selection:bg-gold-500 selection:text-black">
        
        {/* Elegant Android Native App Banner */}
        {showAndroidBanner && !isAndroidSimulatedFrameActive && (
          <div id="android-notification-hero" className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border-b border-amber-500/20 px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between text-xs gap-3 relative z-30 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-amber-500/20 shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="font-bold text-neutral-200 flex items-center gap-1.5 mb-0.5">
                  Vajra Android Web-App Available
                  <span className="bg-emerald-500/20 text-emerald-400 text-[8px] px-1.5 py-0.2 rounded uppercase font-mono tracking-tight font-black">PWA Ready</span>
                </p>
                <p className="text-[10px] text-neutral-400 leading-normal">Install directly or preview the optimized Android mobile view. Ideal for touch-screen try-ons!</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button 
                id="android-sim-btn-banner"
                onClick={() => {
                  setIsAndroidSimulatedFrameActive(true);
                }}
                className="px-3 py-1.5 bg-neutral-900 hover:bg-[#D4AF37] hover:text-black text-neutral-200 text-[10px] font-extrabold uppercase rounded border border-neutral-700 hover:border-[#D4AF37] tracking-wider transition-all cursor-pointer"
              >
                📱 Simulated Android Screen
              </button>
              <button 
                id="android-hub-btn-banner"
                onClick={() => setIsAndroidHubOpen(true)}
                className="px-3 py-1.5 bg-[#D4AF37] hover:bg-gold-600 text-black text-[10px] font-extrabold uppercase rounded tracking-wider transition-all cursor-pointer"
              >
                Install App Guide
              </button>
              <button 
                onClick={() => setShowAndroidBanner(false)}
                className="p-1 px-2 text-neutral-500 hover:text-white"
                title="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      
      {/* ==========================================
          NAVBAR (Geometric Balance Height: 20 -> h-20)
       ========================================== */}
      <nav id="navbar-vajra" className="h-20 border-b border-amber-900/30 flex items-center justify-between px-6 lg:px-12 bg-black/40 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-4 lg:gap-8">
          <div className="flex flex-col">
            <div className="text-2xl lg:text-3xl font-serif tracking-widest text-[#D4AF37] font-extrabold flex items-center gap-2 leading-none">
              VAJRA
            </div>
            <span className="text-[8px] tracking-[0.25em] text-amber-500/80 font-black uppercase mt-1">Premium Artificial Jewelry</span>
          </div>
          
          {/* Main Navigation links */}
          <div className="hidden md:flex gap-6 text-xs uppercase tracking-widest text-neutral-400 font-medium h-full items-center">
            {['All', 'Necklaces', 'Earrings', 'Bracelets', 'Rings'].map((cat) => (
              <button 
                id={`cat-nav-${cat}`}
                key={cat} 
                onClick={() => {
                  setActiveCategory(cat as any);
                  // Auto scroll catalog into view on mobile
                  const el = document.getElementById('catalog-grid-header');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`transition-all duration-300 relative py-1 cursor-pointer hover:text-white ${
                  activeCategory === cat ? 'text-[#D4AF37] font-semibold' : 'text-neutral-400'
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] blur-[0.5px]"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Central Search block & Currency & Actions tools */}
        <div className="flex items-center gap-3 lg:gap-6">
          
          {/* Symmetrical AI Search Box */}
          <div className="relative hidden sm:flex items-center bg-neutral-900 border border-amber-900/40 px-3 py-1.5 rounded-full transition-all duration-300 focus-within:border-gold-500">
            <span className="text-[10px] text-gold-500 mr-2 uppercase tracking-tight font-semibold">AI Search</span>
            <input 
              id="ai-search-input"
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='"Gold Jhumkas..."'
              className="w-32 lg:w-40 bg-transparent text-xs text-neutral-300 italic focus:outline-none placeholder-neutral-600 focus:w-44 lg:focus:w-56 transition-all duration-300"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-neutral-500 hover:text-white ml-1">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Region / Currency Switcher */}
          <div className="flex bg-neutral-950 border border-neutral-800 rounded-lg p-0.5">
            <button 
              id="currency-inr"
              onClick={() => setCurrency('INR')}
              className={`px-2 py-1 text-[10px] uppercase font-bold rounded ${currency === 'INR' ? 'bg-gold-500 text-black' : 'text-neutral-500'}`}
            >
              ₹
            </button>
            <button 
              id="currency-usd"
              onClick={() => setCurrency('USD')}
              className={`px-2 py-1 text-[10px] uppercase font-bold rounded ${currency === 'USD' ? 'bg-gold-500 text-black' : 'text-neutral-500'}`}
            >
              $
            </button>
          </div>

          {/* Wishlist Icon with Dynamic Badging */}
          <button 
            id="wishlist-trigger"
            onClick={() => setShowWishlistDrawer(true)}
            className="w-8 h-8 rounded-full border border-amber-500/20 flex items-center justify-center text-xs relative hover:bg-neutral-900 hover:border-gold-500 transition-all cursor-pointer"
          >
            <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'fill-amber-500 text-amber-500' : 'text-neutral-300'}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Bag Icon with Dynamic Badging */}
          <button 
            id="cart-trigger"
            onClick={() => setShowCartDrawer(true)}
            className="w-8 h-8 rounded-full border border-amber-500/20 flex items-center justify-center text-xs relative hover:bg-neutral-900 hover:border-gold-500 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-neutral-300" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>

          {/* User Accent circle identifier */}
          <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-xs text-black font-extrabold shadow-[0_0_12px_rgba(212,175,55,0.4)]">
            A
          </div>
        </div>
      </nav>

      {/* ==========================================
          MAIN TWO-COLUMN GRID SYSTEM
       ========================================== */}
      <main className="flex-1 flex flex-col lg:flex-row min-h-0 bg-[#0A0A0A] w-full max-w-[1440px] mx-auto">
        
        {/* -------------------------------------
            LEFT VIEW: HERO MAIN PANEL & TRY-ON STUDIO
           ------------------------------------- */}
        <div id="product-display-column" className="w-full lg:w-1/2 p-4 lg:p-12 xl:p-16 flex flex-col justify-between border-r border-amber-900/20 bg-gradient-to-br from-black to-[#0d0c0a] relative select-none">
          
          {/* Top category info status */}
          <div className="w-full flex justify-between items-start mb-6">
            <div>
              <div className="mb-2.5 inline-block px-3 py-1 border border-amber-700/50 rounded-full text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold animate-pulse">
                ✦ VAJRA SIGNATURE ✦
              </div>
              <p className="text-neutral-500 text-xs tracking-widest uppercase font-mono">
                Model: 2026/Luxe • {selectedProduct.category}
              </p>
            </div>
            
            {/* Quick try on live indicator status */}
            {isTryOnActive && (
              <span className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 px-2.5 py-1 rounded-full text-[10px] uppercase text-green-400 font-bold tracking-tight">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                Virtual Try-On Active
              </span>
            )}
          </div>

          {/* Interactive Toggle between regular detailed showcase OR Virtual Try-On Stage */}
          <div className="relative flex-1 flex flex-col justify-center items-center py-6 min-h-[380px]">
            
            {!isTryOnActive ? (
              /* ==========================================
                 AESTHETIC JEWELRY GRAPHIC VIEW (STATIC ROTATOR)
                 ========================================== */
              <div 
                id="main-jewelry-stage"
                className="relative group w-full max-w-[340px] aspect-square flex items-center justify-center bg-zinc-950/40 border border-neutral-900 rounded-3xl overflow-hidden p-6 shadow-[inset_0_0_30px_rgba(212,175,55,0.04)]"
              >
                {/* Radial golden mesh backdrop effect */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,_#d4af37_0%,_transparent_65%)]"></div>
                <div className="absolute top-2 right-2 flex gap-1.5">
                  <button 
                    id="wishlist-btn-toggle"
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className="w-8 h-8 rounded-full bg-neutral-900/60 border border-neutral-800 flex items-center justify-center text-xs hover:text-amber-400 transition"
                  >
                    <Heart className={`w-4 h-4 ${wishlist.includes(selectedProduct.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </button>
                </div>

                {/* Symmetrical Geometric lines layout structure */}
                <div className="absolute inset-4 border border-amber-900/10 rounded-2xl pointer-events-none"></div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* Subtle rotating helper boundaries matching theme */}
                  <div className="w-[280px] h-[280px] border border-amber-600/5 rotate-45 rounded-sm"></div>
                  <div className="w-[220px] h-[220px] border border-amber-600/5 -rotate-12 rounded-full"></div>
                </div>

                {/* Live Vector SVG showcase */}
                <div className="relative z-10 filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform duration-500">
                  {renderVectorJewelry("w-64 h-64", 1.05, engravingText)}
                </div>

                {/* Fine scale feedback overlay helper */}
                <div className="absolute bottom-2 text-[9px] text-neutral-500 tracking-[0.25em] uppercase font-mono bg-neutral-950/80 px-3 py-1 rounded border border-neutral-900">
                  Interactive Vector Preview
                </div>
              </div>
            ) : (
              /* ==========================================
                 ADVANCED TRY-ON STUDIO PANEL
                 ========================================== */
              <div 
                id="tryon-studio-panel"
                className="relative w-full max-w-[420px] aspect-[4/5] bg-black border border-amber-500/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              >
                {/* Upper control layout for try-on method */}
                <div className="p-3 bg-neutral-950 border-b border-neutral-900 flex justify-between items-center gap-2 z-20">
                  <span className="text-[10px] text-amber-500 uppercase tracking-widest font-black flex items-center gap-1">
                    <Camera className="w-3 h-3 animate-pulse" /> Try-On Studio
                  </span>
                  
                  {/* Choose method */}
                  <div className="flex gap-1.5 bg-neutral-900 p-0.5 rounded-lg border border-neutral-800">
                    <button 
                      id="opt-tryon-model"
                      onClick={() => { setTryOnMethod('model'); stopCamera(); }}
                      className={`text-[9px] uppercase tracking-tighter font-extrabold px-2 py-1 rounded transition ${tryOnMethod === 'model' ? 'bg-amber-500 text-black' : 'text-neutral-400'}`}
                    >
                      Models
                    </button>
                    <button 
                      id="opt-tryon-camera"
                      onClick={() => setTryOnMethod('camera')}
                      className={`text-[9px] uppercase tracking-tighter font-extrabold px-2 py-1 rounded transition ${tryOnMethod === 'camera' ? 'bg-amber-500 text-black' : 'text-neutral-400'}`}
                    >
                      Webcam
                    </button>
                    <button 
                      id="opt-tryon-upload"
                      onClick={() => { setTryOnMethod('upload'); stopCamera(); fileInputRef.current?.click(); }}
                      className={`text-[9px] uppercase tracking-tighter font-extrabold px-2 py-1 rounded transition ${tryOnMethod === 'upload' ? 'bg-amber-500 text-black' : 'text-neutral-400'}`}
                    >
                      Upload
                    </button>
                  </div>
                </div>

                {/* Sub-panels depending on Try on method */}
                <div className="flex-1 relative overflow-hidden bg-neutral-950 flex items-center justify-center p-2">
                  
                  {/* Webcamera Feed Element */}
                  {tryOnMethod === 'camera' && (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                      <video 
                        id="tryon-webcam-video"
                        ref={videoRef} 
                        playsInline 
                        muted 
                        className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                      />
                      {!cameraStream && (
                        <div className="text-center p-6 z-10">
                          <span className="material-symbols-outlined text-4xl text-amber-500 animate-spin">sync</span>
                          <p className="text-xs text-neutral-400 mt-2 font-mono">Awaiting video permission approval...</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Preset Model backdrop */}
                  {tryOnMethod === 'model' && (
                    <div className="absolute inset-0 w-full h-full">
                      <img 
                        id="tryon-model-image"
                        src={selectedModel.url} 
                        alt="Style model placement matrix" 
                        className="w-full h-full object-cover brightness-[0.7] transition-all duration-300"
                      />
                      {/* Model Selector Bar overlay */}
                      <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-black/75 backdrop-blur-md p-1.5 rounded-lg border border-neutral-800 flex gap-1.5 overflow-x-auto z-10">
                        {MODEL_PRESETS.map((m) => (
                          <button 
                            id={`model-select-${m.id}`}
                            key={m.id} 
                            onClick={() => setSelectedModel(m)}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded text-[9px] uppercase tracking-tighter font-mono border whitespace-nowrap transition-all duration-300 ${
                              selectedModel.id === m.id ? 'border-amber-500/80 bg-amber-500/20 text-white' : 'border-neutral-800 hover:border-neutral-700 text-neutral-400'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                            {m.name.slice(0, 14)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* User Upload Panel */}
                  {tryOnMethod === 'upload' && (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                      {uploadedImage ? (
                        <img src={uploadedImage} alt="User facial try on matrix" className="w-full h-full object-cover brightness-[0.85]" />
                      ) : (
                        <div 
                          id="upload-dropzone"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-4/5 h-3/5 border-2 border-dashed border-amber-900/40 rounded-xl flex flex-col justify-center items-center p-6 text-center cursor-pointer hover:border-amber-500/60 hover:bg-amber-900/5 transition duration-300"
                        >
                          <Upload className="w-8 h-8 text-amber-500 mb-2 animate-bounce" />
                          <p className="text-xs text-neutral-200 uppercase tracking-widest font-bold">Select Portrait Image</p>
                          <p className="text-[10px] text-neutral-400 mt-1 italic font-serif">Supports JPG, PNG with neutral lighting</p>
                        </div>
                      )}
                      
                      <input 
                        id="user-image-upload-input"
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                    </div>
                  )}

                  {/* ==========================================
                     FLOATING ORNAMENT INTERACTIVE OVERLAY DRAGGER
                     ========================================== */}
                  <div 
                    id="tryon-draggable-ornament"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    style={{
                      transform: `translate(${overlayX}px, ${overlayY}px) rotate(${overlayRotation}deg) scale(${overlayScale})`,
                      touchAction: 'none'
                    }}
                    className={`absolute z-30 cursor-grab active:cursor-grabbing select-none filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.65)] hover:bg-[#D4AF37]/5 transition-shadow p-4 rounded-full ${
                      isDraggingOverlay ? 'cursor-grabbing border border-amber-500/30 ring-2 ring-amber-500/10' : ''
                    }`}
                  >
                    {/* SVG container rendering inside matrix context */}
                    {renderVectorJewelry("w-36 h-36", 0.9, engravingText)}
                  </div>

                  {/* Interaction instructions */}
                  <div className="absolute top-2 left-2 z-10 bg-black/80 px-2 py-0.5 rounded text-[8px] text-neutral-400 border border-neutral-900 tracking-wider">
                    Drag jewelry to reposition
                  </div>
                </div>

                {/* Fine positioning Slider adjustments at the bottom */}
                <div className="p-3 bg-neutral-950 border-t border-neutral-900 flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Scale Sizer */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[9px] uppercase tracking-wider text-neutral-400">
                        <span>Scale sizer:</span>
                        <span className="text-gold-500 font-bold font-mono">{Math.round(overlayScale * 100)}%</span>
                      </div>
                      <input 
                        id="tryon-scale-slider"
                        type="range" 
                        min="0.4" 
                        max="2.0" 
                        step="0.05"
                        value={overlayScale}
                        onChange={(e) => setOverlayScale(parseFloat(e.target.value))}
                        className="w-full accent-amber-500 bg-neutral-800 rounded-lg appearance-none h-1"
                      />
                    </div>

                    {/* Rotation sizer */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[9px] uppercase tracking-wider text-neutral-400">
                        <span>Angle tilt:</span>
                        <span className="text-gold-500 font-bold font-mono">{overlayRotation}°</span>
                      </div>
                      <input 
                        id="tryon-rotation-slider"
                        type="range" 
                        min="-180" 
                        max="180" 
                        step="5"
                        value={overlayRotation}
                        onChange={(e) => setOverlayRotation(parseInt(e.target.value))}
                        className="w-full accent-amber-500 bg-neutral-800 rounded-lg appearance-none h-1"
                      />
                    </div>
                  </div>

                  {/* Reset coordinates and Save actions */}
                  <div className="flex justify-between items-center mt-1 pt-1.5 border-t border-neutral-900">
                    <button 
                      id="tryon-reset-btn"
                      onClick={() => {
                        setOverlayRotation(0);
                        setOverlayScale(1.1);
                        setOverlayX(0);
                        setOverlayY(40);
                      }}
                      className="text-[9px] tracking-widest text-neutral-400 uppercase font-black flex items-center gap-1 hover:text-white"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reset Matrix
                    </button>

                    <button 
                      id="tryon-capture-btn"
                      onClick={handleCaptureSnapshot}
                      className="bg-[#D4AF37] hover:bg-gold-600 font-extrabold text-[9px] uppercase text-black tracking-widest px-3 py-1 flex items-center gap-1 bg-gradient-to-r from-amber-400 to-[#D4AF37]"
                    >
                      <Share2 className="w-3 h-3" /> Custom Snapshot
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Exclusive content introduction */}
          <div className="mt-6">
            <h1 className="text-4xl xl:text-5xl font-serif leading-tight mb-3">
              Affordable <br/>
              <span className="text-[#D4AF37] italic font-serif relative">
                Luxury
                <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#D4AF37]/50 blur-[0.2px]"></span>
              </span> For All
            </h1>
            
            <p className="text-neutral-400 text-xs xl:text-sm leading-relaxed mb-6 max-w-md italic font-serif">
              "{selectedProduct.description}"
            </p>

            {/* Customization Details Controls Panel */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 border-y border-amber-900/20 py-5 my-5 bg-black/20 p-4 rounded-xl">
              {/* Core selection info: weight & stones */}
              <div>
                <span className="text-[9px] text-amber-600 block uppercase tracking-wider font-extrabold">Net weight</span>
                <span className="text-xs text-white font-mono">{selectedProduct.weight}</span>
              </div>
              <div>
                <span className="text-[9px] text-amber-600 block uppercase tracking-wider font-extrabold">Stone Details</span>
                <span className="text-xs text-neutral-300 font-mono line-clamp-1">{selectedProduct.stones}</span>
              </div>
              <div>
                <span className="text-[9px] text-amber-600 block uppercase tracking-wider font-extrabold">Quality Standard</span>
                <button 
                  id="certificate-info-btn"
                  onClick={() => setActiveInfoModal('certificate')}
                  className="text-xs text-[#D4AF37] font-semibold flex items-center gap-1 hover:underline underline-offset-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Skin-Safe & Anti-Tarnish
                </button>
              </div>
            </div>

            {/* Configurator Parameters */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase tracking-widest mb-2 font-bold">Select Premium Plating Luster:</span>
                <div className="flex gap-2">
                  {[
                    { label: 'Yellow Gold', desc: 'Premium 18k Micron Plating', colorHex: 'bg-[#D4AF37]' },
                    { label: 'Rose Gold', desc: 'Romantic Pinkish Gold Finish', colorHex: 'bg-[#E29D8C]' },
                    { label: 'Platinum', desc: 'Ultra-bright Rhodium Finish', colorHex: 'bg-[#DFE1E5]' },
                  ].map((cfg) => (
                    <button 
                      id={`metal-opt-${cfg.label.replace(' ', '-')}`}
                      key={cfg.label}
                      onClick={() => setMetalColor(cfg.label as any)}
                      className={`flex-1 p-2 border rounded-xl/md text-left transition-all cursor-pointer ${
                        metalColor === cfg.label 
                          ? 'border-[#D4AF37] bg-amber-500/5' 
                          : 'border-neutral-900 hover:border-neutral-800 bg-neutral-950/40'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`w-3 h-3 rounded-full ${cfg.colorHex} border border-black/40`}></span>
                        <span className="text-[11px] font-bold text-white leading-none">{cfg.label}</span>
                      </div>
                      <span className="text-[9px] text-neutral-500 block">{cfg.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Engraving Text Field */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-neutral-400 block uppercase tracking-widest font-bold">
                  Custom Plaque / Shank Engraving:
                </span>
                <div className="relative">
                  <input 
                    id="engraving-text-input"
                    type="text"
                    maxLength={20}
                    value={engravingText}
                    onChange={(e) => setEngravingText(e.target.value)}
                    placeholder="Enter name or date (e.g., ADITI 2026)"
                    className="w-full bg-neutral-950 border border-amber-900/20 rounded-lg px-3 py-2 text-xs text-neutral-200 placeholder-neutral-700 outline-none focus:border-gold-500 font-mono uppercase"
                  />
                  {engravingText && (
                    <span className="absolute right-3 top-2.5 text-[9px] text-gold-500 font-mono tracking-tight glow">
                      • Simulated Live
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Global CTA actions segment with dynamic price upgrades */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 border-t border-amber-950/30 pt-6">
              <div className="flex-1">
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest block font-extrabold">Final customized price</span>
                <span className="text-3xl font-serif text-[#D4AF37] font-black glow">{formatPrice(selectedProduct.basePriceINR)}</span>
              </div>

              <div className="flex gap-2">
                {/* Try On Studio Trigger */}
                <button 
                  id="tryon-studio-toggle"
                  onClick={() => setIsTryOnActive(prev => !prev)}
                  className={`px-4 py-3 rounded-lg border text-xs uppercase tracking-widest font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isTryOnActive 
                      ? 'border-[#D4AF37] bg-amber-500/10 text-white' 
                      : 'border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-950'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  {isTryOnActive ? "Close Studio" : "Virtual Try-On"}
                </button>

                {/* Add to Cart Trigger */}
                <button 
                  id="add-to-cart-btn"
                  onClick={addToCart}
                  className="px-6 py-3 bg-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-widest hover:bg-gold-600 transition duration-300 flex items-center justify-center gap-1.5 shadow-[0_4px_20px_rgba(212,175,55,0.25)] rounded-lg cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Order
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------------
            RIGHT VIEW: AI RECOMMENDATION LAB & COMPONENT CATALOG GRID
           ------------------------------------- */}
        <div id="recommendation-column" className="w-full lg:w-1/2 p-4 lg:p-12 flex flex-col justify-between bg-[#0F0F0F] relative min-h-screen lg:min-h-0 overflow-y-auto">
          
          {/* Section 1: AI Recommendation Headers */}
          <div>
            <div className="flex justify-between items-end border-b border-amber-900/30 pb-4 mb-6">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                  <h2 className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-bold">AI Recommendation Engine</h2>
                </div>
                <p className="text-md text-neutral-300 font-serif">
                  Curated for <span className="italic text-neutral-400">"{selectedProduct.name}"</span> pairing style
                </p>
              </div>
              <div className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase">
                {filteredProducts.length} masterpieces matched
              </div>
            </div>

            {/* Inner category control segment selectors */}
            <div id="catalog-grid-header" className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-black">Curated Collection</span>
              
              <div className="flex gap-1.5 items-center">
                <span className="text-[9px] text-neutral-500 uppercase font-mono">Category Filter:</span>
                <select 
                  id="category-dropdown-filter"
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value as any)}
                  className="bg-neutral-950 border border-neutral-800 text-[10px] font-bold text-neutral-300 uppercase py-1 px-2.5 rounded-lg focus:outline-none focus:border-gold-500"
                >
                  <option value="All">All Pieces</option>
                  <option value="Necklaces">Necklaces</option>
                  <option value="Earrings">Earrings</option>
                  <option value="Bracelets">Bracelets</option>
                  <option value="Rings">Rings</option>
                </select>
              </div>
            </div>

            {/* ==================================================
                SYMMETRICAL GEOMETRIC JEWELRY DISPLAY CATALOG GRID
               ================================================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-8">
              {filteredProducts.map((prod) => {
                const isSelected = selectedProduct.id === prod.id;
                
                // Set geometric pattern layout parameters according to catalog specifications
                const geometricPattern = prod.category === 'Earrings' ? (
                  // Circles
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] group-hover:opacity-[0.14] transition-all pointer-events-none">
                    <div className="w-36 h-36 border-2 border-amber-500 rounded-full"></div>
                    <div className="w-24 h-24 border border-amber-500 rounded-full absolute"></div>
                    <div className="w-12 h-12 border border-dashed border-amber-500 rounded-full absolute"></div>
                  </div>
                ) : (
                  // Diamond Rotated Lines Group
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] group-hover:opacity-[0.12] transition-all pointer-events-none">
                    <div className="w-28 h-28 border-2 border-amber-500 rotate-45 transform"></div>
                    <div className="w-36 h-36 border border-amber-600 rotate-12 transform absolute"></div>
                  </div>
                );

                return (
                  <div 
                    id={`product-card-${prod.id}`}
                    key={prod.id}
                    onClick={() => {
                      setSelectedProduct(prod);
                      // Align try-on model presets based on the chosen category
                      if (prod.category === 'Earrings') setSelectedModel(MODEL_PRESETS[2]);
                      else if (prod.category === 'Bracelets') setSelectedModel(MODEL_PRESETS[1]);
                      else setSelectedModel(MODEL_PRESETS[0]);
                    }}
                    className={`group relative p-4 bg-zinc-950 rounded-2xl border transition-all duration-500 cursor-pointer flex flex-col justify-between ${
                      isSelected 
                        ? 'border-amber-500/80 bg-[#0F0E0B] shadow-[0_12px_24px_rgba(212,175,55,0.06)]' 
                        : 'border-neutral-900 hover:border-neutral-800'
                    }`}
                  >
                    {/* Upper decorative elements */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                        {prod.category}
                      </span>
                      {prod.isExclusive && (
                        <span className="text-[8px] bg-red-950 text-red-400 px-1.5 py-0.5 rounded font-black tracking-widest uppercase">
                          VIP Set
                        </span>
                      )}
                    </div>

                    {/* Symmetrical Geometric Container */}
                    <div className="aspect-[4/5] bg-neutral-950 border border-neutral-900/60 rounded-xl flex items-center justify-center p-4 relative overflow-hidden mb-4 shadow-inner">
                      {geometricPattern}
                      
                      {/* Interactive Vector Graphic representation inside card context */}
                      <div className="relative z-10 w-32 h-32 flex items-center justify-center filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] group-hover:scale-110 transition duration-500">
                        {/* Dynamic SVG with fixed small styling */}
                        {prod.shapeKey === 'choker' && (
                          <svg className="w-28 h-28" viewBox="0 0 200 200" fill="none">
                            <path d="M40 70C40 120 70 160 100 160C130 160 160 120 160 70" stroke="#D4AF37" strokeWidth="6" strokeLinecap="round" />
                            <circle cx="100" cy="160" r="5" fill="#B22222" />
                            {[55, 75, 95, 105, 125, 145].map((angle, i) => (
                              <circle key={i} cx={100 + 60 * Math.sin((angle*Math.PI)/180 - Math.PI/2)} cy={98 + 62 * Math.cos((angle*Math.PI)/180 - Math.PI/2)} r="3" fill="#D4AF37" />
                            ))}
                          </svg>
                        )}
                        {prod.shapeKey === 'jhumka' && (
                          <svg className="w-28 h-28" viewBox="0 0 200 200" fill="none">
                            <g transform="translate(60, 40)">
                              <path d="M15 35 C 15 20, 45 20, 45 35 Z" fill="#D4AF37" />
                              <circle cx="30" cy="70" r="14" fill="#D4AF37" />
                              <line x1="30" y1="35" x2="30" y2="70" stroke="#D4AF37" strokeWidth="2" />
                            </g>
                            <g transform="translate(110, 40)">
                              <path d="M15 35 C 15 20, 45 20, 45 35 Z" fill="#D4AF37" />
                              <circle cx="30" cy="70" r="14" fill="#D4AF37" />
                              <line x1="30" y1="35" x2="30" y2="70" stroke="#D4AF37" strokeWidth="2" />
                            </g>
                          </svg>
                        )}
                        {prod.shapeKey === 'kada' && (
                          <svg className="w-28 h-28" viewBox="0 0 200 200" fill="none">
                            <ellipse cx="100" cy="100" rx="58" ry="24" stroke="#D4AF37" strokeWidth="6" />
                            <circle cx="100" cy="76" r="6" fill="#047857" />
                            <circle cx="70" cy="80" r="4.5" fill="#B22222" />
                            <circle cx="130" cy="80" r="4.5" fill="#B22222" />
                          </svg>
                        )}
                        {prod.shapeKey === 'ring' && (
                          <svg className="w-28 h-28" viewBox="0 0 200 200" fill="none">
                            <ellipse cx="100" cy="115" rx="35" ry="33" stroke="#D4AF37" strokeWidth="5" />
                            <rect x="88" y="55" width="24" height="24" fill="#EBF3F5" stroke="#90A4AE" rx="2" transform="rotate(45 100 67)" />
                          </svg>
                        )}
                        {prod.shapeKey === 'mala' && (
                          <svg className="w-28 h-28" viewBox="0 0 200 200" fill="none">
                            <path d="M55 55C55 110 75 132 100 132C125 132 145 110 145 55" stroke="#D4AF37" strokeWidth="3" />
                            <path d="M48 50C48 120 72 152 100 152C128 152 152 120 152 50" stroke="#D4AF37" strokeWidth="4.5" strokeDasharray="4 4" />
                          </svg>
                        )}
                      </div>

                      {/* Info details floating flag */}
                      <div className="absolute bottom-2 left-2 right-2 bg-neutral-950/70 backdrop-blur p-1 rounded border border-neutral-900 flex justify-between text-[8px] text-neutral-400 font-mono">
                        <span>Purity: {prod.purity}</span>
                        <span>Wt: {prod.weight}</span>
                      </div>
                    </div>

                    {/* Metadata label rows */}
                    <div className="mt-2 flex justify-between items-start">
                      <div className="flex-1 pr-2">
                        <h3 className="text-xs font-bold text-neutral-200 group-hover:text-amber-400 transition-colors uppercase tracking-wider line-clamp-1">
                          {prod.name}
                        </h3>
                        <p className="text-[10px] text-neutral-500 italic mt-0.5 line-clamp-1 font-serif">
                          {prod.stones.split('&')[0]}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-[#D4AF37] block">
                          {currency === 'INR' 
                            ? `₹${prod.basePriceINR.toLocaleString('en-IN')}`
                            : `$${Math.round(prod.basePriceINR / conversionRate).toLocaleString('en-US')}`
                          }
                        </span>
                        
                        {/* Selected product checkmark */}
                        {isSelected ? (
                          <span className="text-[8px] text-[#D4AF37] uppercase font-black block tracking-tighter">
                            Active Design
                          </span>
                        ) : (
                          <span className="text-[8px] text-neutral-600 block opacity-0 group-hover:opacity-100 transition-opacity uppercase font-mono">
                            View details
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ==================================================
              SECTION 3: AI STYLIST INTERACTIVE CONVERSATION CHATBOX
             ================================================== */}
          <div id="ai-chatbox-widget" className="mt-auto border-t border-amber-900/40 pt-6">
            <div className="bg-amber-900/5 border border-amber-500/20 rounded-2xl p-5 flex flex-col gap-4">
              
              {/* Header profile of the Virtual Stylist */}
              <div className="flex items-center justify-between border-b border-amber-900/20 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-amber-500/20 border border-amber-500/40 rounded-full flex items-center justify-center relative">
                    <span className="absolute top-0 right-0 w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                      Vajra AI Assistant
                    </h4>
                    <span className="text-[9px] text-neutral-500 uppercase tracking-tighter block">
                      Fine Jewelry Expert • Online
                    </span>
                  </div>
                </div>

                {/* Secure certificate info button */}
                <span className="text-[9px] text-neutral-500 uppercase tracking-widest">
                  Secure Consultation
                </span>
              </div>

              {/* Chat Message Logs container (max height, auto-scroll representation) */}
              <div className="max-h-[140px] overflow-y-auto space-y-3 pr-2 scroll-smooth">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-lg text-xs leading-relaxed max-w-[85%] ${
                      msg.sender === 'user' 
                        ? 'bg-[#D4AF37] text-black font-semibold rounded-tr-none' 
                        : 'bg-neutral-900 text-neutral-300 border border-neutral-800 rounded-tl-none font-serif italic'
                    }`}>
                      {msg.text}

                      {/* Clickable Recommended action button prompt */}
                      {msg.suggestedAction && (
                        <div className="mt-2.5">
                          <button 
                            id={`ai-suggestion-apply`}
                            onClick={() => applyAIAction(msg.suggestedAction!)}
                            className="bg-black text-[9px] font-black text-[#D4AF37] uppercase tracking-widest px-2.5 py-1.5 rounded hover:bg-neutral-950 border border-amber-500/30 flex items-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-3 h-3" /> Apply Style Recommendation
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* AI Typist loader */}
                {isChatTyping && (
                  <div className="flex justify-start">
                    <div className="bg-neutral-900 border border-neutral-850 p-2.5 rounded-lg flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Pre-assembled Styling Advice quick suggestions */}
              <div className="flex flex-wrap gap-1.5 mt-1 border-t border-amber-900/10 pt-3">
                {[
                  { text: 'Outfit Match: Maroon Velvet', value: 'Recommend deep Burma Rubies and gold choker sets' },
                  { text: 'Compare 18k Rose vs Yellow Gold', value: 'What is the color difference for warm sub-tones?' },
                  { text: 'Recommend Jhumka accessories', value: 'Earring accessories recommendations' },
                ].map((tag, i) => (
                  <button 
                    id={`quick-adv-tag-${i}`}
                    key={i}
                    onClick={() => handleSendChat(tag.value)}
                    className="text-[9px] uppercase tracking-tighter bg-neutral-950 hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-850 px-2 py-1 rounded transition duration-200 cursor-pointer"
                  >
                    ✦ {tag.text}
                  </button>
                ))}
              </div>

              {/* Input Chat Field */}
              <div className="flex gap-2">
                <input 
                  id="chat-input-text"
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat(chatInput)}
                  placeholder="Ask advisor (e.g. 'Complementary set for Suryavanshi')"
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-gold-500"
                />
                
                <button 
                  id="chat-send-btn"
                  onClick={() => handleSendChat(chatInput)}
                  className="bg-[#D4AF37] hover:bg-gold-600 text-black px-3.5 rounded-lg flex items-center justify-center transition cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* ==========================================
          FOOTER SEGMENT (Geometric Balance height: 12)
       ========================================== */}
      <footer id="footer-vajra" className="h-12 border-t border-amber-900/20 bg-black flex flex-col sm:flex-row items-center justify-between px-6 lg:px-12 py-2 gap-2 text-center">
        <div className="text-[10px] text-neutral-500 uppercase tracking-widest flex items-center gap-1">
          Secure Payments Verified via 
          <span className="text-neutral-300 font-bold ml-1 flex items-center gap-1 hover:text-white transition cursor-pointer">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Razorpay
          </span>
        </div>

        {/* Informative Footer Links */}
        <div className="flex gap-4 lg:gap-8 text-[10px] text-neutral-500 uppercase tracking-[0.2em]">
          <button onClick={() => { setActiveInfoModal('shipping'); }} className="hover:text-[#D4AF37] transition cursor-pointer">Exchange & Return</button>
          <button onClick={() => { setActiveInfoModal('certificate'); }} className="hover:text-[#D4AF37] transition cursor-pointer font-bold">Purity Cert</button>
          <button onClick={() => { setActiveInfoModal('stores'); }} className="hover:text-[#D4AF37] transition cursor-pointer">Store Locator</button>
        </div>
      </footer>

      {/* ==================================================
          WISHLIST DRAWER OVERLAY
         ================================================== */}
      {showWishlistDrawer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md bg-[#0D0D0D] border-l border-amber-900/30 h-full p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex justify-between items-center border-b border-amber-900/20 pb-4 mb-6">
                <h3 className="text-lg font-serif uppercase tracking-widest text-gold-500 font-black">
                  My Loved Ornaments ({wishlist.length})
                </h3>
                <button onClick={() => setShowWishlistDrawer(false)} className="text-neutral-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-16">
                  <Heart className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
                  <p className="text-xs text-neutral-400 uppercase tracking-wider">Your wishlist is currently empty</p>
                  <p className="text-[10px] text-neutral-600 italic font-serif mt-1">Tap the heart on any luxury piece to save.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                  {wishlist.map((id) => {
                    const prod = MASTERPIECES.find(m => m.id === id);
                    if (!prod) return null;
                    return (
                      <div key={id} className="bg-neutral-900/50 border border-neutral-850 p-4 rounded-xl flex gap-4 items-center">
                        <div className="w-14 h-14 bg-black border border-neutral-800 rounded-lg flex items-center justify-center p-2">
                          {prod.shapeKey === 'choker' && <span className="text-xl">📿</span>}
                          {prod.shapeKey === 'jhumka' && <span className="text-xl">💎</span>}
                          {prod.shapeKey === 'kada' && <span className="text-xl">💍</span>}
                          {prod.shapeKey === 'ring' && <span className="text-xl">💍</span>}
                          {prod.shapeKey === 'mala' && <span className="text-xl">📿</span>}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">{prod.name}</h4>
                          <span className="text-[10px] text-neutral-500 font-mono block mt-0.5">{prod.stones}</span>
                          <span className="text-xs font-mono text-[#D4AF37] font-bold block mt-1">
                            {currency === 'INR' ? `₹${prod.basePriceINR.toLocaleString()}` : `$${Math.round(prod.basePriceINR/conversionRate).toLocaleString()}`}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => { setSelectedProduct(prod); setShowWishlistDrawer(false); }}
                            className="text-[9px] uppercase tracking-widest text-black bg-[#D4AF37] hover:bg-gold-600 px-2 py-1 rounded font-bold"
                          >
                            Explore
                          </button>
                          <button 
                            onClick={() => toggleWishlist(id)}
                            className="text-[9px] uppercase tracking-widest text-red-400 hover:text-red-300 font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button 
              onClick={() => setShowWishlistDrawer(false)}
              className="w-full py-3 bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs font-bold uppercase tracking-widest hover:text-white"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      )}

      {/* ==================================================
          SHOPPING BAG DRAWER OVERLAY
         ================================================== */}
      {showCartDrawer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md bg-[#0D0D0D] border-l border-amber-900/30 h-full p-6 flex flex-col justify-between shadow-2xl">
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-amber-900/20 pb-4 mb-4">
                  <h3 className="text-lg font-serif uppercase tracking-widest text-[#D4AF37] font-black">
                    Vajra Private Order ({cart.length})
                  </h3>
                  <button onClick={() => { setShowCartDrawer(false); setCheckoutStep('idle'); }} className="text-neutral-400 hover:text-white p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {checkoutStep === 'idle' && (
                  <div>
                    {cart.length === 0 ? (
                      <div className="text-center py-20">
                        <ShoppingBag className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
                        <p className="text-xs text-neutral-400 uppercase tracking-widest">Your customized cart is empty</p>
                        <p className="text-[10px] text-neutral-600 mt-1 italic font-serif">Add custom configurations of precious sets to prepare checkouts.</p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                        {cart.map((entry, idx) => (
                          <div key={idx} className="bg-neutral-900/40 border border-neutral-850 p-4 rounded-xl">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider">{entry.item.name}</h4>
                                <span className="text-[9px] text-amber-500 uppercase tracking-widest font-mono">
                                  {entry.metal} ({entry.purity})
                                </span>
                              </div>
                              <button 
                                onClick={() => removeFromCart(idx)}
                                className="text-neutral-500 hover:text-white p-0.5"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            {entry.engraving && (
                              <div className="bg-black p-1.5 rounded text-[9px] font-mono text-neutral-300 italic mb-2 border border-amber-500/10">
                                Engraved Plaque: "{entry.engraving.toUpperCase()}"
                              </div>
                            )}

                            <div className="flex justify-between items-end mt-2 pt-2 border-t border-neutral-850">
                              <span className="text-[9px] text-neutral-500 uppercase">Quantity: {entry.quantity}</span>
                              <span className="text-sm font-mono text-[#D4AF37] font-bold">
                                {formatPrice(entry.item.basePriceINR)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Secure Shipping Details Stepper inside shopping bag */}
                {checkoutStep === 'shipping' && (
                  <div className="space-y-4 p-1">
                    <h4 className="text-xs text-amber-500 uppercase tracking-widest font-bold">1. Insured Delivery Location</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] text-neutral-500 block uppercase mb-1">Insured Recipient Name</label>
                        <input type="text" placeholder="Aditi Sharma" defaultValue="Aditi Sharma" className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white" />
                      </div>
                      <div>
                        <label className="text-[9px] text-neutral-500 block uppercase mb-1">Insured Delivery Address</label>
                        <textarea placeholder="Imperial Towers, Sector 4, Mumbai, MH, 400001" defaultValue="Imperial Towers, Sector 4, Mumbai, MH, 400001" rows={3} className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-neutral-500 block uppercase mb-1">Contact Phone</label>
                          <input type="text" placeholder="+91 98200 XXXXX" className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white" />
                        </div>
                        <div>
                          <label className="text-[9px] text-neutral-500 block uppercase mb-1">Customs Pin Code</label>
                          <input type="text" placeholder="400001" defaultValue="400001" className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-500/5 p-3 rounded border border-amber-500/10 text-[9px] text-neutral-400 italic">
                      ✦ Included benefit: Free secure shipping in protective anti-tarnish velvet boxes. Enjoy premium imitation luxury straight to your doorstep.
                    </div>
                  </div>
                )}

                {/* Secure Payment Steps */}
                {checkoutStep === 'payment' && (
                  <div className="space-y-4">
                    <h4 className="text-xs text-[#D4AF37] uppercase tracking-widest font-bold">2. Razorpay Encrypted Gateway</h4>
                    
                    <div className="bg-neutral-950 p-4 border border-zinc-900 rounded-xl space-y-3">
                      <div className="flex justify-between items-center text-xs pb-2 border-b border-neutral-900">
                        <span className="text-neutral-400">Transit Assurance fee:</span>
                        <span className="text-green-400 font-bold uppercase tracking-widest text-[9px]">FREE</span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-400">Total Order Charge:</span>
                        <span className="text-sm font-mono font-bold text-gold-500">
                          {currency === 'INR' 
                            ? `₹${cart.reduce((sum, item) => sum + getPriceRaw(item.item), 0).toLocaleString()}`
                            : `$${Math.round(cart.reduce((sum, item) => sum + getPriceRaw(item.item), 0) / conversionRate).toLocaleString()}`
                          }
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 bg-neutral-950 border border-neutral-900 rounded-lg flex items-center justify-between cursor-pointer hover:border-gold-500">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#D4AF37]" />
                          <span className="text-xs font-bold text-white uppercase tracking-wider">UPI GPay / PhonePe</span>
                        </div>
                        <span className="text-[10px] text-neutral-500">Instant setup</span>
                      </div>

                      <div className="p-3 bg-zinc-950 border border-neutral-900 rounded-lg flex items-center justify-between opacity-55">
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border border-neutral-800"></span>
                          <span className="text-xs font-bold text-white uppercase tracking-wider">Net banking secure</span>
                        </div>
                        <span className="text-[10px] text-neutral-500">3% bank clearance delay</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Order complete status */}
                {checkoutStep === 'completed' && (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-8 h-8 text-emerald-400" />
                    </div>
                    
                    <h4 className="text-md font-serif uppercase tracking-widest text-emerald-400 font-black">
                      Fashion Order Registered!
                    </h4>

                    <p className="text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed font-serif italic">
                      "Thank you for choosing Vajra. Your gorgeous artificial jewelry configuration is in safe hands. Our dispatch team is preparing your anti-tarnish micro-plates. Your tracking coordinates will be sent via SMS shortly."
                    </p>

                    <div className="bg-neutral-950 p-4 border border-neutral-850 rounded-xl space-y-2 text-left">
                      <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                        <span>Quality Assurance Inspector:</span>
                        <span className="text-white font-bold">Vajra Crafts Team</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                        <span>Plating Certification:</span>
                        <span className="text-gold-500 font-bold">Skin-Safe Lead-Free Micro-Overlay</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Bottom button control stack inside basket */}
              {cart.length > 0 && (
                <div className="border-t border-amber-900/20 pt-4 mt-6">
                  {checkoutStep === 'idle' && (
                    <button 
                      onClick={() => setCheckoutStep('shipping')}
                      className="w-full py-3 bg-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-widest hover:bg-gold-600 transition flex items-center justify-center gap-1 bg-gradient-to-r from-amber-400 to-[#D4AF37] rounded-lg cursor-pointer"
                    >
                      Insured Checkout Appen <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  {checkoutStep === 'shipping' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setCheckoutStep('idle')}
                        className="flex-1 py-3 border border-neutral-800 text-neutral-400 text-xs uppercase tracking-widest hover:text-white"
                      >
                        Back
                      </button>
                      <button 
                        onClick={() => setCheckoutStep('payment')}
                        className="flex-1 py-3 bg-[#D4AF37] text-black font-extrabold text-xs uppercase tracking-widest hover:bg-[#b58d27] rounded-lg cursor-pointer"
                      >
                        Proceed to Pay
                      </button>
                    </div>
                  )}

                  {checkoutStep === 'payment' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setCheckoutStep('shipping')}
                        className="flex-1 py-3 border border-neutral-800 text-neutral-400 text-xs uppercase tracking-widest hover:text-white"
                      >
                        Back
                      </button>
                      <button 
                        onClick={() => {
                          setCheckoutStep('completed');
                          setCart([]); // Clear cart safely
                        }}
                        className="flex-1 py-3 bg-emerald-500 text-black font-extrabold text-xs uppercase tracking-widest hover:bg-emerald-600 rounded-lg cursor-pointer"
                      >
                        Verify Razorpay INR
                      </button>
                    </div>
                  )}

                  {checkoutStep === 'completed' && (
                    <button 
                      onClick={() => {
                        setShowCartDrawer(false);
                        setCheckoutStep('idle');
                      }}
                      className="w-full py-3 bg-neutral-900 text-neutral-300 text-xs font-bold uppercase tracking-widest hover:text-white"
                    >
                      Return to Showroom
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          DETAILED POLICY & LAB CERTIFICATE INFO MODAL
         ================================================== */}
      {activeInfoModal === 'certificate' && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-55 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0F0F0F] border border-amber-900/30 p-6 rounded-3xl relative">
            <button onClick={() => setActiveInfoModal(null)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif text-[#D4AF37] uppercase tracking-widest mb-3 font-black">
              Premium Artificial Craftsmanship Guarantee
            </h3>
            <p className="text-xs text-neutral-400 italic mb-5 font-serif">
              "Every elegant piece from Vajra is engineered to serve the luxury style needs of ordinary, trendy fashion lovers at smart pricing."
            </p>

            <div className="space-y-4 font-mono text-[11px]">
              <div className="bg-neutral-950 p-4 border border-zinc-900 rounded-lg space-y-2.5">
                <div className="flex justify-between border-b border-amber-900/20 pb-1.5 text-neutral-400">
                  <span>Plating Standard:</span>
                  <span className="text-white font-bold">18k Premium Plating Finish</span>
                </div>
                <div className="flex justify-between border-b border-amber-900/20 pb-1.5 text-neutral-400">
                  <span>Base Premium Metal:</span>
                  <span className="text-[#D4AF37] font-bold">Skin-Safe Durable Copper & Brass</span>
                </div>
                <div className="flex justify-between border-b border-amber-900/20 pb-1.5 text-[#D4AF37]">
                  <span>Simulated Crystals Verification:</span>
                  <span className="text-white font-bold">A++ Brilliant Cubic Zirconia & Kundan Glass</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Nickel & Lead-Free:</span>
                  <span className="text-emerald-400 font-bold">100% Skin Safe Verified</span>
                </div>
              </div>

              <div className="p-3 bg-amber-900/10 border border-amber-500/20 rounded-lg text-neutral-400 italic leading-relaxed font-serif">
                "Vajra ensures elite artificial design precision. Get flawless shine and anti-tarnish micro overlays that retain their luster during regular casual or festive wear."
              </div>
            </div>

            <button 
              onClick={() => setActiveInfoModal(null)}
              className="mt-6 w-full py-2.5 bg-neutral-900 hover:bg-neutral-850 text-[#D4AF37] font-bold text-xs uppercase tracking-widest rounded-lg"
            >
              Close Ledger Details
            </button>
          </div>
        </div>
      )}

      {/* SHIPPING MODAL POLICY */}
      {activeInfoModal === 'shipping' && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-55 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0F0F0F] border border-amber-900/30 p-6 rounded-3xl">
            <div className="flex justify-between items-center border-b border-amber-900/20 pb-3 mb-4">
              <h3 className="text-base font-serif text-[#D4AF37] uppercase tracking-widest font-black">
                Exchange Policy & Delivery
              </h3>
              <button onClick={() => setActiveInfoModal(null)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-neutral-300 leading-relaxed font-serif italic">
              <p>
                <strong>1. 10-Day Hassle-Free Return:</strong> If the physical model size or look doesn't match your Virtual Try-on expectations, we offer zero-questions exchange.
              </p>
              <p>
                <strong>2. Free Prompt Courier:</strong> Fast, safe packaging, custom-padded to keep stones and delicate Kundan elements perfectly safe until they reach your hands.
              </p>
              <p>
                <strong>3. Anti-Tarnish Assurance:</strong> Every design features durable chemical protection over the high-grade brass core to resist sweat or moisture tarnish.
              </p>
            </div>

            <button 
              onClick={() => setActiveInfoModal(null)}
              className="mt-6 w-full py-2.5 bg-neutral-900 text-neutral-300 text-xs uppercase tracking-widest font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* STORE LOCATOR MODAL */}
      {activeInfoModal === 'stores' && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-55 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0F0F0F] border border-amber-900/30 p-6 rounded-3xl">
            <div className="flex justify-between items-center border-b border-amber-900/20 pb-3 mb-4">
              <h3 className="text-base font-serif text-[#D4AF37] uppercase tracking-widest font-bold">
                Vajra Luxury Showrooms
              </h3>
              <button onClick={() => setActiveInfoModal(null)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-400 italic mb-4 font-serif">
              "Visit our pocket-friendly physical outlets for automated holographic try-on, styling sessions, and seasonal trend showcases."
            </p>

            <div className="space-y-3 font-mono text-[11px]">
              <div className="p-3 bg-neutral-950 border border-neutral-900 rounded-lg flex justify-between items-center">
                <div>
                  <h4 className="text-white font-bold uppercase select-text">1. Mumbai Galleria</h4>
                  <p className="text-[10px] text-neutral-500 mt-1">Colaba Harbour Rd, Mumbai • 022-9918</p>
                </div>
                <span className="text-[9px] text-[#D4AF37] border border-amber-500/20 px-2 py-0.5 rounded font-black">
                  Open until 8 PM
                </span>
              </div>

              <div className="p-3 bg-neutral-950 border border-neutral-900 rounded-lg flex justify-between items-center">
                <div>
                  <h4 className="text-white font-bold uppercase select-text">2. Delhi Imperial Mansion</h4>
                  <p className="text-[10px] text-neutral-500 mt-1">Connaught Circular, New Delhi • 011-8891</p>
                </div>
                <span className="text-[9px] text-neutral-400 border border-neutral-800 px-2 py-0.5 rounded">
                  Closes at 7:30 PM
                </span>
              </div>

              <div className="p-3 bg-neutral-950 border border-neutral-900 rounded-lg flex justify-between items-center">
                <div>
                  <h4 className="text-white font-bold uppercase select-text">3. Bangalore Tech Atelier</h4>
                  <p className="text-[10px] text-neutral-500 mt-1">Lavelle Road, Bangalore • 080-1120</p>
                </div>
                <span className="text-[9px] text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Exclusive Salon Live
                </span>
              </div>
            </div>

            <button 
              onClick={() => setActiveInfoModal(null)}
              className="mt-6 w-full py-2.5 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 text-xs uppercase tracking-widest font-bold rounded-lg"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* SNAPSHOT SHARE DIALOG MODAL */}
      {activeInfoModal === 'snapshot' && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-55 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0A0A0A] border border-[#D4AF37]/40 p-6 rounded-3xl relative text-center">
            <button onClick={() => setActiveInfoModal(null)} className="absolute top-4 right-4 text-neutral-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            {/* Glowing brand lockup */}
            <h4 className="text-lg font-serif text-[#D4AF37] tracking-widest uppercase font-black mb-1">
              VAJRA STUDIO
            </h4>
            <span className="text-[9px] text-neutral-500 uppercase tracking-widest block mb-4">
              Holographic Try-on Portrait
            </span>

            {/* Simulated Snapped Canvas Composite */}
            <div className="relative w-full aspect-square bg-[#0F0F0F] rounded-2xl overflow-hidden border border-neutral-900 p-2.5 mb-4 shadow-xl">
              {capturedSnapshotUrl && (
                <img 
                  src={capturedSnapshotUrl} 
                  alt="Final mock client portrait tryon design" 
                  className="w-full h-full object-cover rounded-xl brightness-[0.7]" 
                />
              )}
              {/* Overlay jewelry layer */}
              <div 
                style={{
                  transform: `translate(-50%, -50%) translate(${overlayX/3}px, ${overlayY/3}px) rotate(${overlayRotation}deg) scale(${overlayScale * 0.85})`,
                  left: '50%',
                  top: '55%'
                }}
                className="absolute w-28 h-28 pointer-events-none filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]"
              >
                {renderVectorJewelry("w-full h-full", 1, engravingText)}
              </div>

              {/* Secure Gia Seal Stamp */}
              <div className="absolute bottom-2 left-2 bg-black/85 px-2 py-1 rounded text-[8px] text-[#D4AF37] border border-amber-500/20 font-mono tracking-tight text-left">
                ✦ VAJRA APPR • {selectedProduct.category} Class <br/>
                {selectedProduct.weight}
              </div>
            </div>

            <p className="text-xs text-neutral-400 italic mb-6 font-serif max-w-xs mx-auto">
              "Your bespoke custom {selectedProduct.name} mock placement has been generated successfully. Share with partners or save design vectors."
            </p>

            <div className="flex gap-2">
              <button 
                id="screenshot-download-btn"
                onClick={(e) => {
                  const target = e.currentTarget;
                  const originalText = target.innerText;
                  target.innerText = "Downloaded ✓";
                  target.style.opacity = "0.7";
                  setTimeout(() => {
                    target.innerText = originalText;
                    target.style.opacity = "1";
                  }, 2000);
                  setActiveInfoModal(null);
                }}
                className="flex-1 py-2.5 bg-[#D4AF37] hover:bg-gold-600 text-black font-extrabold text-xs uppercase tracking-widest rounded-lg cursor-pointer transition-all"
              >
                Download PNG
              </button>
              
              <button 
                id="screenshot-share-btn"
                onClick={(e) => {
                  const target = e.currentTarget;
                  const originalText = target.innerText;
                  navigator.clipboard.writeText(window.location.href);
                  target.innerText = "Link Copied ✓";
                  target.style.opacity = "0.7";
                  setTimeout(() => {
                    target.innerText = originalText;
                    target.style.opacity = "1";
                  }, 2000);
                }}
                className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 font-bold text-xs uppercase tracking-widest rounded-lg transition-all"
              >
                Share Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          ANDROID INSTANT HUB & PWA INSTALLER MODAL
       ========================================== */}
      {isAndroidHubOpen && (
        <div id="android-hub-modal" className="fixed inset-0 bg-black/90 backdrop-blur-md z-55 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0D0D0D] border border-amber-500/30 p-6 rounded-3xl relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsAndroidHubOpen(false)} 
              className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Hub Title */}
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-2">
                <Smartphone className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-xl font-serif text-[#D4AF37] uppercase tracking-widest font-black">
                Vajra Android App Hub
              </h3>
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest mt-1">
                Install direct or try virtual APK simulation
              </p>
            </div>

            {/* Quick Pitch */}
            <p className="text-xs text-center text-neutral-300 leading-relaxed italic font-serif mb-6 px-2">
              "Enjoy 1.2s offline load times, native camera virtual try-ons, and direct access to trendy imitation & Kundan sets without the Google Play Store!"
            </p>

            {/* Tab: Options */}
            <div className="space-y-4">
              
              {/* Option A: Quick PWA registration */}
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-900 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">1</span>
                  <h4 className="text-xs uppercase tracking-wider text-white font-extrabold text-left">Instant Home Screen Web-App</h4>
                </div>
                
                <p className="text-[11px] text-neutral-400 leading-relaxed text-left">
                  Save on storage! Runs beautifully like a native app by adding to your home screen:
                </p>

                <div className="bg-black/55 p-3 rounded-lg text-[10px] space-y-1.5 font-mono text-neutral-400 text-left">
                  <div className="flex gap-2">
                    <span className="text-[#D4AF37]">❖ Chrome:</span>
                    <span>Tap Menu <span className="text-white font-bold font-sans">⋮</span> &rarr; <span className="text-white">Add to Home Screen</span></span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[#D4AF37]">❖ Samsung:</span>
                    <span>Tap Menu <span className="text-white font-bold font-sans">☰</span> &rarr; <span className="text-white">Add Page to &rarr; Home Screen</span></span>
                  </div>
                </div>

                <button 
                  onClick={(e) => {
                    const btn = e.currentTarget;
                    btn.innerText = "Registered On Homescreen ✓";
                    btn.classList.add("bg-emerald-500", "text-black");
                    btn.classList.remove("bg-neutral-800");
                    setTimeout(() => {
                      btn.innerText = "Simulate PWA Install Link";
                      btn.classList.remove("bg-emerald-500", "text-black");
                      btn.classList.add("bg-neutral-800");
                    }, 3000);
                  }}
                  className="w-full py-2 bg-neutral-850 text-xs text-center border border-neutral-800 hover:border-amber-500 hover:text-white transition-all font-extrabold uppercase tracking-widest rounded-lg cursor-pointer text-neutral-200"
                >
                  Simulate PWA Install Link
                </button>
              </div>

              {/* Option B: Gamified APK Compiler */}
              <div className="bg-neutral-950 p-4 rounded-xl border border-amber-500/10 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-[10px] font-bold">2</span>
                  <h4 className="text-xs uppercase tracking-wider text-white font-extrabold text-left">Simulated Offline APK Compiler</h4>
                </div>

                <p className="text-[11px] text-neutral-400 leading-relaxed text-left">
                  Compile and download a ready-to-test offline package designed for local Android deployment.
                </p>

                {apkDownloadState === 'idle' && (
                  <button 
                    onClick={handleStartApkDownload}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-[#D4AF37] hover:from-amber-600 hover:to-gold-600 text-black text-[10px] font-extrabold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" /> Compile Vajra .apk Package
                  </button>
                )}

                {apkDownloadState === 'building' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                      <span className="flex items-center gap-1.5 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        Compiling Assets...
                      </span>
                      <span>{apkInstallProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                      <div style={{ width: `${apkInstallProgress}%` }} className="h-full bg-amber-500 transition-all duration-300"></div>
                    </div>
                  </div>
                )}

                {apkDownloadState === 'installing' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Writing Android Package...
                      </span>
                      <span>{apkInstallProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                      <div style={{ width: `${apkInstallProgress}%` }} className="h-full bg-emerald-500 transition-all duration-200"></div>
                    </div>
                  </div>
                )}

                {apkDownloadState === 'ready' && (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-lg space-y-2 text-center">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold block">
                      Vajra APK Package Built!
                    </span>
                    <p className="text-[9px] text-neutral-400 leading-relaxed">
                      Filename: <span className="text-white font-mono text-[9.5px]">com.vajra.artificial_jewelry.apk</span> (4.2 MB)
                    </p>
                    <button 
                      onClick={() => {
                        setIsAndroidHubOpen(false);
                        setIsAndroidSimulatedFrameActive(true);
                       }}
                      className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-[10px] uppercase tracking-widest rounded-lg cursor-pointer transition-all"
                    >
                      Instant Safe Launch in Simulator
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Quick control button to toggle screen preview */}
            <div className="mt-6 flex gap-2">
              <button 
                onClick={() => {
                  setIsAndroidSimulatedFrameActive(!isAndroidSimulatedFrameActive);
                  setIsAndroidHubOpen(false);
                }}
                className="flex-1 py-2.5 bg-neutral-950 hover:bg-neutral-850 text-neutral-300 font-bold text-xs uppercase tracking-widest rounded-lg border border-neutral-850 cursor-pointer transition-all"
              >
                {isAndroidSimulatedFrameActive ? 'Normal View' : 'Launch Simulator'}
              </button>
              <button 
                onClick={() => setIsAndroidHubOpen(false)}
                className="px-5 py-2.5 bg-[#D4AF37] hover:bg-gold-600 text-black text-xs uppercase font-extrabold tracking-widest rounded-lg transition-all cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Floating Shortcut to Android Hub (Only visible when browser is NOT in simulator mode and banner is dismissed) */}
      {!isAndroidSimulatedFrameActive && !showAndroidBanner && (
        <button 
          id="android-fab-hub"
          onClick={() => setIsAndroidHubOpen(true)}
          className="fixed bottom-6 left-6 z-40 bg-neutral-950/95 border border-amber-500/35 text-[#D4AF37] p-3 rounded-full hover:scale-105 transition-all shadow-xl hover:bg-neutral-900 group flex items-center gap-2 cursor-pointer"
          title="Vajra Android Setup Hub"
        >
          <Smartphone className="w-5 h-5 animate-pulse" />
          <span className="text-[10px] uppercase font-bold tracking-widest pr-1 hidden sm:inline-block text-white opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-[120px] transition-all duration-300">
            Vajra Android App
          </span>
        </button>
      )}

    </div>
  );
};

  if (isAndroidSimulatedFrameActive) {
    return (
      <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(212,175,55,0.08),rgba(255,255,255,0))] font-sans text-white">
        {/* Background ambiance */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=1500')] bg-cover bg-center opacity-[0.03] blur-3xl"></div>
        
        {/* Top Live Simulator Controller Panel */}
        <div className="relative z-45 mb-6 bg-black/90 border border-amber-500/30 px-5 py-3 rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-xs shadow-2xl backdrop-blur max-w-full text-center">
          <div className="flex items-center gap-2 animate-fade-in">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="font-mono text-neutral-300 font-bold uppercase tracking-wider text-[10px]">Android Device Emulator Active</span>
          </div>
          <div className="hidden sm:block h-4 w-[1px] bg-neutral-800"></div>
          <div className="flex items-center gap-2 flex-wrap justify-center font-bold">
            <button 
              id="android-sim-apk-trigger"
              onClick={() => setIsAndroidHubOpen(true)}
              className="px-3.5 py-1.5 bg-[#D4AF37] hover:bg-gold-600 text-black font-extrabold text-[9px] uppercase rounded-lg tracking-wider transition-all cursor-pointer"
            >
              Get Android APK
            </button>
            <button 
              id="android-sim-exit"
              onClick={() => setIsAndroidSimulatedFrameActive(false)}
              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold text-[9px] uppercase rounded-lg tracking-wider transition-all cursor-pointer border border-neutral-800"
            >
              Fullscreen Web View
            </button>
          </div>
        </div>

        {/* Smartphone Chassis */}
        <div id="android-chassis" className="relative w-[385px] max-w-full h-[790px] rounded-[52px] border-[10px] border-neutral-850 bg-[#0A0A0A] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_0_3px_#222222] overflow-hidden flex flex-col text-white transition-all duration-300 relative z-30">
          
          {/* Android simulated status bar */}
          <div className="bg-black text-[9px] font-mono select-none px-6 pt-3 pb-2 flex justify-between items-center shrink-0 relative z-50 border-b border-neutral-950">
            <span className="text-[#D4AF37] font-semibold">10:42 AM</span>
            <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-3.5 h-3.5 rounded-full bg-neutral-950 ring-1 ring-neutral-850"></div>
            <div className="flex items-center gap-1.5 text-neutral-400 font-bold">
              <span className="text-[7px] text-emerald-500 font-black tracking-tighter">5G LTE</span>
              <Smartphone className="w-2.5 h-2.5 text-emerald-500" />
              <div className="flex gap-0.5 items-end">
                <div className="w-0.5 h-1 bg-emerald-500"></div>
                <div className="w-0.5 h-1.5 bg-emerald-500"></div>
                <div className="w-0.5 h-2 bg-emerald-500"></div>
              </div>
              <span className="text-neutral-300">98%</span>
            </div>
          </div>

          {/* Core scrollable viewport */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none flex flex-col relative bg-[#0A0A0A]">
            {renderAppContent()}
          </div>

          {/* Android gesture pill bar */}
          <div className="h-[18px] bg-black flex items-center justify-center shrink-0 w-full relative z-40 border-t border-neutral-950">
            <div className="w-18 h-[3px] bg-neutral-700 rounded-full"></div>
          </div>
        </div>

        {/* Small floating prompt helper */}
        <p className="text-[10px] text-neutral-500 mt-4 font-mono font-medium max-w-sm text-center">
          Tap virtual items to customize instantly inside our simulated Android shell.
        </p>

        {/* Render Android Hub also here if open so it takes precedence over simulator frame */}
        {isAndroidHubOpen && (
          <div id="android-hub-modal" className="fixed inset-0 bg-black/95 backdrop-blur-md z-55 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#0D0D0D] border border-amber-500/30 p-6 rounded-3xl relative shadow-2xl max-h-[90vh] overflow-y-auto text-center">
              <button 
                onClick={() => setIsAndroidHubOpen(false)} 
                className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-2">
                <Smartphone className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-xl font-serif text-[#D4AF37] uppercase tracking-widest font-black">
                Vajra Android App Hub
              </h3>
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest mt-1 mb-4">
                Simulated APK Complete!
              </p>

              <div className="bg-neutral-950 p-4 rounded-xl border border-emerald-500/20 mb-4 text-left">
                <p className="text-xs text-white font-bold mb-1">✓ APK Ready for Local Sideloader</p>
                <p className="text-[11px] text-neutral-400 leading-relaxed mb-3">
                  This virtual installation registers safe push triggers for flash discounts on trendy earrings & necklaces.
                </p>
                <div className="text-[10px] font-mono text-neutral-400 space-y-1">
                  <div>• Package: <span className="text-white">com.vajra.fashion.app</span></div>
                  <div>• SDK Targets: <span className="text-white">Android 9.0 to 14.0+</span></div>
                </div>
              </div>

              <button 
                onClick={() => setIsAndroidHubOpen(false)}
                className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#c4a133] text-black font-extrabold text-xs uppercase tracking-widest rounded-lg cursor-pointer transition-all"
              >
                Resume Simulator Screen
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return renderAppContent();
}
