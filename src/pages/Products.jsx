import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import GridBackground from '../components/GridBackground';

const Products = () => {
  const [filter, setFilter] = useState('all');
  const [selectedHeadset, setSelectedHeadset] = useState(null);

  const headsets = [
    {
      id: 'google-cardboard',
      name: 'Google Cardboard',
      price: '₹499',
      priceValue: 499,
      category: 'budget',
      image: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Google-Cardboard.jpg',
      specs: 'DIY VR, Works with smartphones',
      rating: 3.9,
      features: ['Ultra Budget', 'Portable', 'Entry-Level VR'],
      details: {
        description: 'Google Cardboard is an ultra-affordable VR viewer that works with your smartphone. Perfect for getting started with VR therapy.',
        pros: ['Extremely affordable', 'Easy to use', 'Works with most phones', 'Portable and lightweight'],
        cons: ['Basic experience', 'Limited comfort', 'No head tracking', 'Manual interaction only'],
        compatibility: 'Compatible with Android and iOS smartphones'
      }
    },
    {
      id: 'jio-dive',
      name: 'JIO Dive',
      price: '₹1,400',
      priceValue: 1400,
      category: 'budget',
      image: 'https://i.cdn.newsbytesapp.com/images/l45420230501135802.png',
      specs: 'Smartphone VR, Bluetooth Controller',
      rating: 4.0,
      features: ['Jio Content', 'Affordable', 'Mobile VR'],
      details: {
        description: 'JIO Dive offers an enhanced mobile VR experience with exclusive Jio content and a Bluetooth controller for better interaction.',
        pros: ['Affordable price', 'Bluetooth controller included', 'Access to Jio VR content', 'Good for Indian market'],
        cons: ['Limited third-party app support', 'Smartphone dependent', 'Basic optics', 'Controller quality varies'],
        compatibility: 'Compatible with Android smartphones'
      }
    },
    {
      id: 'bnext-vr',
      name: 'BNEXT VR Headset',
      price: '₹1,499',
      priceValue: 1499,
      category: 'budget',
      image: 'https://m.media-amazon.com/images/I/71cCETgUlyL.jpg',
      specs: 'Smartphone-based, Comfortable Design',
      rating: 4.1,
      features: ['Wide Compatibility', 'Lightweight', 'Adjustable Straps'],
      details: {
        description: 'BNEXT VR Headset provides comfortable smartphone-based VR experience with adjustable straps and wide phone compatibility.',
        pros: ['Comfortable padding', 'Works with most smartphones', 'Lightweight design', 'Adjustable IPD'],
        cons: ['No controller', 'Basic lens quality', 'Limited FOV', 'Phone heating issues'],
        compatibility: 'Compatible with 4.7-6.3 inch smartphones (Android & iOS)'
      }
    },
    {
      id: 'procus-one',
      name: 'Procus ONE VR',
      price: '₹2,499',
      priceValue: 2499,
      category: 'budget',
      image: 'https://m.media-amazon.com/images/I/3151NtwcVML._UF1000,1000_QL80_.jpg',
      specs: '42mm Optical Lenses, 100° FOV',
      rating: 4.3,
      features: ['Good Build Quality', 'Universal Phone Mount', 'Head Straps'],
      details: {
        description: 'Procus ONE VR offers better build quality with 42mm optical lenses and 100° field of view for immersive experiences.',
        pros: ['Good build quality', '100° field of view', 'Comfortable head straps', 'Anti-blue ray lenses'],
        cons: ['Heavier than competitors', 'Phone compatibility limited', 'No controller', 'Gets warm during use'],
        compatibility: 'Compatible with 4.7-6 inch smartphones'
      }
    },
    {
      id: 'irusu-play-vr',
      name: 'Irusu Play VR Plus',
      price: '₹2,999',
      priceValue: 2999,
      category: 'budget',
      image: 'https://www.jiomart.com/images/product/original/rv8yewdxth/irusu-black-play-vr-plus-virtual-reality-headset-with-headphones-for-gaming-product-images-orv8yewdxth-p591295822-0-202205132119.jpg?im=Resize=(1000,1000)',
      specs: 'Smartphone-based, 42mm Lenses',
      rating: 4.2,
      features: ['Budget-Friendly', 'Works with Any Phone', 'Adjustable'],
      details: {
        description: 'Irusu Play VR Plus combines affordability with decent features including built-in headphones for complete immersion.',
        pros: ['Built-in headphones', 'Comfortable foam padding', 'Adjustable focus', 'Good value for money'],
        cons: ['Sound quality average', 'Limited ventilation', 'Heavy for extended use', 'No controller'],
        compatibility: 'Compatible with 4.5-6 inch smartphones (Android & iOS)'
      }
    },
    {
      id: 'meta-quest-2',
      name: 'Meta Quest 2',
      price: '₹24,900',
      priceValue: 24900,
      category: 'budget',
      image: 'https://roadtovrlive-5ea0.kxcdn.com/wp-content/uploads/2022/04/meta-quest-2-logo.png',
      specs: '1832 x 1920 per eye, Snapdragon XR2',
      rating: 4.7,
      features: ['Standalone', 'Hand Tracking', 'Wireless PC VR'],
      details: {
        description: 'Meta Quest 2 is a standalone VR headset with excellent performance, hand tracking, and wireless PC VR capabilities.',
        pros: ['No PC required', 'Hand tracking', 'Wireless PC VR', 'Large app library', 'Good performance'],
        cons: ['Facebook account required', 'Battery life 2-3 hours', 'Comfort needs upgrade', 'Extra cost for elite strap'],
        compatibility: 'Standalone device, works with Windows PC for PCVR'
      }
    },
    {
      id: 'pico-4',
      name: 'PICO 4',
      price: '₹35,700',
      priceValue: 35700,
      category: 'premium',
      image: 'https://i.ytimg.com/vi/OY8UNLOaHxc/maxresdefault.jpg',
      specs: '2160 x 2160 per eye, Snapdragon XR2',
      rating: 4.6,
      features: ['Standalone', '105° FOV', 'Pancake Lenses'],
      details: {
        description: 'PICO 4 features pancake lenses for a slimmer design with high resolution and comfortable fit.',
        pros: ['Pancake lenses (slimmer)', 'High resolution', 'Comfortable design', 'Good tracking', '105° FOV'],
        cons: ['Limited app ecosystem', 'Less content than Quest', 'No official India support', 'Battery on back'],
        compatibility: 'Standalone device with PC VR support'
      }
    },
    {
      id: 'meta-quest-3',
      name: 'Meta Quest 3',
      price: '₹41,500',
      priceValue: 41500,
      category: 'premium',
      image: 'https://roadtovrlive-5ea0.kxcdn.com/wp-content/uploads/2023/09/quest-3-18.jpg',
      specs: '2064 x 2208 per eye, Snapdragon XR2 Gen 2',
      rating: 4.8,
      features: ['Standalone', 'Hand Tracking', 'Passthrough AR'],
      details: {
        description: 'Meta Quest 3 is the latest standalone VR headset with mixed reality capabilities and improved performance.',
        pros: ['Mixed reality features', 'Improved optics', 'Better performance', 'Slimmer design', 'Full color passthrough'],
        cons: ['Expensive', 'Facebook account required', '2-3 hour battery life', 'Premium accessories cost extra'],
        compatibility: 'Standalone device, works with Windows PC for PCVR'
      }
    },
    {
      id: 'psvr2',
      name: 'PlayStation VR2',
      price: '₹45,700',
      priceValue: 45700,
      category: 'premium',
      image: 'https://gmedia.playstation.com/is/image/SIEPDC/PSVR2-thumbnail-01-en-22feb22?$facebook$',
      specs: '2000 x 2040 per eye, HDR, 120Hz',
      rating: 4.7,
      features: ['PS5 Required', 'Eye Tracking', 'Haptic Feedback'],
      details: {
        description: 'PlayStation VR2 offers premium VR gaming with eye tracking, haptic feedback, and stunning visuals.',
        pros: ['Eye tracking', 'Haptic feedback', 'OLED HDR display', '120Hz refresh rate', 'Exclusive PS5 games'],
        cons: ['Requires PS5', 'Limited to gaming', 'Expensive', 'No backward compatibility with PSVR1'],
        compatibility: 'Requires PlayStation 5 console'
      }
    },
    {
      id: 'valve-index',
      name: 'Valve Index',
      price: '₹83,200',
      priceValue: 83200,
      category: 'premium',
      image: 'https://m.media-amazon.com/images/I/71ZgOpN805L._UF894,1000_QL80_.jpg',
      specs: '1440 x 1600 per eye, 120Hz (144Hz experimental)',
      rating: 4.8,
      features: ['PC VR', 'Finger Tracking', 'Wide FOV 130°'],
      details: {
        description: 'Valve Index is the premium PC VR headset with finger tracking controllers and industry-leading field of view.',
        pros: ['130° FOV widest available', 'Finger tracking controllers', '144Hz refresh rate', 'Excellent build quality', 'Best PC VR experience'],
        cons: ['Very expensive', 'Requires high-end PC', 'Wired only', 'Limited availability in India'],
        compatibility: 'Requires Windows PC with VR-ready specifications'
      }
    },
    {
      id: 'vision-pro',
      name: 'Apple Vision Pro',
      price: '₹2,90,000',
      priceValue: 290000,
      category: 'premium',
      image: 'https://www.ediiie.com/blog/assets/admin/uploads/apple-vision-pro-features.jpg',
      specs: '3680 x 3140 per eye, M2 + R1 chips',
      rating: 4.9,
      features: ['Spatial Computing', 'Eye Tracking', 'Premium Display'],
      details: {
        description: 'Apple Vision Pro represents the pinnacle of mixed reality with industry-leading display technology and spatial computing capabilities.',
        pros: ['Highest resolution display', 'Premium build quality', 'Advanced eye tracking', 'Spatial computing', 'M2 + R1 chips', 'Best passthrough quality'],
        cons: ['Extremely expensive', 'Heavy (600g)', '2 hour battery', 'Limited app ecosystem initially', 'No gaming focus'],
        compatibility: 'Standalone spatial computer, works with Apple ecosystem'
      }
    }
  ];

  const categories = [
    { id: 'all', label: 'All Headsets' },
    { id: 'premium', label: 'Premium' },
    { id: 'budget', label: 'Budget-Friendly' }
  ];

  const filteredHeadsets = filter === 'all' 
    ? headsets 
    : headsets.filter(h => h.category === filter);

  return (
    <GridBackground className="min-h-screen">
      <Navbar transparent={true} />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="gradient-text">VR Headsets</span> for Aura
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Choose the perfect VR headset for your immersive therapy experience. From premium to budget-friendly options.
            </p>
            
            {/* Compatibility Badge */}
            <div className="inline-flex items-center space-x-2 glass px-6 py-3 rounded-full">
              <svg className="w-5 h-5 text-aura-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-white font-medium">All headsets support WebXR technology</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-8 py-3 rounded-full font-semibold transition-all ${
                  filter === cat.id
                    ? 'bg-aura-green text-black'
                    : 'glass text-white hover:bg-white/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Headsets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHeadsets.map((headset) => (
              <Card key={headset.id} hover={true} className="p-0 overflow-hidden">
                {/* Image */}
                <div className="h-64 bg-aura-gray relative overflow-hidden">
                  <img 
                    src={headset.image}
                    alt={headset.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback gradient if image fails
                      e.target.style.display = 'none';
                      e.target.parentElement.style.background = 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)';
                    }}
                  />
                  {/* Price Tag */}
                  <div className="absolute top-4 right-4 bg-aura-green text-black px-4 py-2 rounded-full font-bold text-lg">
                    {headset.price}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-white">{headset.name}</h3>
                    <div className="flex items-center space-x-1">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-white font-semibold">{headset.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-4">{headset.specs}</p>

                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {headset.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm text-gray-300">
                        <svg className="w-4 h-4 text-aura-purple flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setSelectedHeadset(headset)}
                    className="w-full btn-primary"
                  >
                    View Details
                  </button>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-bold text-white mb-2">WebXR Compatible</h3>
              <p className="text-gray-400 text-sm">All listed headsets support WebXR for seamless browser-based VR</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-white mb-2">Budget Options</h3>
              <p className="text-gray-400 text-sm">Start your VR therapy journey with affordable headsets from ₹499</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-2">Instant Setup</h3>
              <p className="text-gray-400 text-sm">No app installation required - works directly in your browser</p>
            </Card>
          </div>
        </div>
      </div>

      {selectedHeadset && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4"
          onClick={() => setSelectedHeadset(null)}
        >
          <div 
            className="glass rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedHeadset.name}</h2>
                <p className="text-aura-green text-2xl font-bold">{selectedHeadset.price}</p>
              </div>
              <button
                onClick={() => setSelectedHeadset(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <img 
                src={selectedHeadset.image}
                alt={selectedHeadset.name}
                className="w-full h-64 object-cover rounded-2xl"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Description</h3>
                <p className="text-gray-300">{selectedHeadset.details?.description || selectedHeadset.specs}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-3">Features</h3>
                <div className="grid grid-cols-1 gap-2">
                  {selectedHeadset.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-gray-300">
                      <svg className="w-5 h-5 text-aura-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedHeadset.details?.pros && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Pros</h3>
                  <div className="space-y-2">
                    {selectedHeadset.details.pros.map((pro, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-green-400">
                        <span className="text-xl">+</span>
                        <span>{pro}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedHeadset.details?.cons && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Cons</h3>
                  <div className="space-y-2">
                    {selectedHeadset.details.cons.map((con, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-red-400">
                        <span className="text-xl">-</span>
                        <span>{con}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedHeadset.details?.compatibility && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Compatibility</h3>
                  <p className="text-gray-300">{selectedHeadset.details.compatibility}</p>
                </div>
              )}

              <div className="flex items-center space-x-2 text-yellow-400">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xl font-bold">{selectedHeadset.rating} / 5.0</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </GridBackground>
  );
};

export default Products;
