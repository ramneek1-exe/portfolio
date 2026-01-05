'use client';

import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

interface Page {
    title: string;
    story: string;
    gradientClass: string;
    noteStyle: string;
    notePosition: { x: number; y: number };
    imageUrl?: string;
}

interface Destination {
    id: number;
    title: string;
    coverImage: string; // New: Static image for the card background
    pages: Page[];
}

interface Card {
    id: number;
}

interface SingleNote {
    x: number;
    y: number;
    rotation: number;
    currentPageIndex: number;
}

const FlipBookGallery: React.FC = () => {
    const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
    const [cards, setCards] = useState<Card[]>([]);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);
    
    const [singleNote, setSingleNote] = useState<SingleNote>({
        x: 480, 
        y: 100,
        rotation: 3,
        currentPageIndex: 0
    });

    const [imageDimensions, setImageDimensions] = useState<Record<number, { width: number; height: number }>>({});
    const singleNoteRef = useRef<HTMLDivElement>(null);

    const destinations: Destination[] = [
        {
            id: 1,
            title: "Canadian Rockies",
            coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop", 
            pages: [
                {
                    title: "Upper Waterton Lake",
                    story: "Gorgeous view from the lookout point next to the Prince of Wales hotel.",
                    gradientClass: "linear-gradient(135deg, #74b9ff 0%, #00cec9 50%, #55a3ff 100%)",
                    noteStyle: "#dbeafe",
                    notePosition: { x: 250, y: -80 },
                    imageUrl: "/w/w1.jpg"
                },
                {
                    title: "Prince of Wales",
                    story: "Distant view of the Prince of Wales hotel in the month of December.",
                    gradientClass: "linear-gradient(135deg, #ffecd2 0%, #74b9ff 100%)",
                    noteStyle: "#fef3c7",
                    notePosition: { x: -200, y: 100 },
                    imageUrl: "/w/w2.jpg"
                },
                {
                    title: "Cameron Falls",
                    story: "The iconic waterfall located in the Waterton town site.",
                    gradientClass: "linear-gradient(135deg, #e0ffff 0%, #74b9ff 100%)",
                    noteStyle: "#ded2bd",
                    notePosition: { x: 180, y: 150 },
                    imageUrl: "w/w3.jpg"
                },
                {
                    title: "Prince of Wales",
                    story: "A stunning view of the hotel with a Toyota Supra Mk V in the foreground.",
                    gradientClass: "linear-gradient(135deg, #f8f9fa 0%, #74b9ff 100%)",
                    noteStyle: "#fce7f3",
                    notePosition: { x: -150, y: -50 },
                    imageUrl: "/w/w4.jpg"
                },
                {
                    title: "Mt. Blakiston",
                    story: "The tallest peak in Waterton National Park in goldern hour after fresh rain.",
                    gradientClass: "linear-gradient(135deg, #e0ffff 0%, #74b9ff 100%)",
                    noteStyle: "#cacfcc",
                    notePosition: { x: -170, y: 150 },
                    imageUrl: "w/w5.jpg"
                }, 
                {
                    title: "Albertan Wild Rose",
                    story: "A close up shot of a flower that gave the Wild Rose Country its name!",
                    gradientClass: "linear-gradient(135deg, #e0ffff 0%, #74b9ff 100%)",
                    noteStyle: "#a5ccb0",
                    notePosition: { x: 120, y: -110 },
                    imageUrl: "w/w6.jpg"
                },
                {
                    title: "Mt. Blakiston",
                    story: "Mt. Blakiston during sunset.",
                    gradientClass: "linear-gradient(135deg, #e0ffff 0%, #74b9ff 100%)",
                    noteStyle: "#c9ccd4",
                    notePosition: { x: 190, y: 150 },
                    imageUrl: "w/w7.jpg"
                },
                {
                    title: "Bertha Lake",
                    story: "After a difficult 4-hour hike, one discovers this beautiful nestled between lush greenery and mountains.",
                    gradientClass: "linear-gradient(135deg, #e0ffff 0%, #74b9ff 100%)",
                    noteStyle: "#b4dbcd",
                    notePosition: { x: 90, y: -110 },
                    imageUrl: "w/w8.jpg"
                },
                {
                    title: "Snowy Peaks",
                    story: "View of the Canadian Rockies on a frigid December morning.",
                    gradientClass: "linear-gradient(135deg, #e0ffff 0%, #74b9ff 100%)",
                    noteStyle: "#e6ede4",
                    notePosition: { x: 180, y: 160 },
                    imageUrl: "w/w9.jpg"
                },
                {
                    title: "Reflective Lakes",
                    story: "Waterton Lakes National Park during sunset.",
                    gradientClass: "linear-gradient(135deg, #e0ffff 0%, #74b9ff 100%)",
                    noteStyle: "#a1c7a2",
                    notePosition: { x: 260, y: -90 },
                    imageUrl: "w/w10.jpg"
                }
            ]
        },
        {
            id: 2,
            title: "Baja Beaches",
            coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
            pages: [
                {
                    title: "Coastline",
                    story: "Aerial view of the Baja California Sur coastline.",
                    gradientClass: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
                    noteStyle: "#dbeafe",
                    notePosition: { x: 220, y: -60 },
                    imageUrl: "b/b1.jpg"
                },
                {
                    title: "El Arco",
                    story: "The beautiful granite arch of Cabo San Lucas also known as land's end.",
                    gradientClass: "linear-gradient(135deg, #fdcb6e 0%, #e84393 100%)",
                    noteStyle: "#fef3c7",
                    notePosition: { x: -180, y: 120 },
                    imageUrl: "b/b2.jpg"
                },
                {
                    title: "Playa Cabo Bello",
                    story: "Beach located in the Cabo Bello hotel zone in Cabo San Lucas.",
                    gradientClass: "linear-gradient(135deg, #00cec9 0%, #55a3ff 100%)",
                    noteStyle: "#cffafe",
                    notePosition: { x: 160, y: 140 },
                    imageUrl: "b/b3.jpg"
                },
                {
                    title: "Town of Colours",
                    story: "View of a street in Todos Santos, Baja California Sur.",
                    gradientClass: "linear-gradient(135deg, #fdcb6e 0%, #e84393 100%)",
                    noteStyle: "#aae1e6",
                    notePosition: { x: 200, y: 160 },
                    imageUrl: "b/b4.jpg"
                },
                {
                    title: "Hidden Beach",
                    story: "An inaccessible beach in Todos Santos called Playa La Cachora.",
                    gradientClass: "linear-gradient(135deg, #fdcb6e 0%, #e84393 100%)",
                    noteStyle: "#fef3c7",
                    notePosition: { x: -180, y: 80 },
                    imageUrl: "b/b5.jpg"
                },
                {
                    title: "The Wishing Tree",
                    story: "Travellers from all over write their wishes on a piece of paper and hang it on this tree called Árbol de Los Deseos.",
                    gradientClass: "linear-gradient(135deg, #fdcb6e 0%, #e84393 100%)",
                    noteStyle: "#e9c2ed",
                    notePosition: { x: -100, y: -120 },
                    imageUrl: "b/b6.jpg"
                },
                {
                    title: "Ocean Escape",
                    story: "View of a yacht by Playa El Tecolote near La Paz, Baja California Sur.",
                    gradientClass: "linear-gradient(135deg, #fdcb6e 0%, #e84393 100%)",
                    noteStyle: "#c0e9f0",
                    notePosition: { x: 70, y: 90 },
                    imageUrl: "b/b7.jpg"
                },
                {
                    title: "Serene Sunset",
                    story: "Sunset view from Hammerhead Beach at Malecón La Paz.",
                    gradientClass: "linear-gradient(135deg, #fdcb6e 0%, #e84393 100%)",
                    noteStyle: "#f0907f",
                    notePosition: { x: -50, y: -120 },
                    imageUrl: "b/b8.jpg"
                },
                {
                    title: "Puesta de Sol",
                    story: "Another view of sunset at La Paz.",
                    gradientClass: "linear-gradient(135deg, #fdcb6e 0%, #e84393 100%)",
                    noteStyle: "#cbd1d6",
                    notePosition: { x: -220, y: 120 },
                    imageUrl: "b/b9.jpg"
                },
                {
                    title: "Night Lights",
                    story: "The city of Cabo San Lucas under the stars.",
                    gradientClass: "linear-gradient(135deg, #fdcb6e 0%, #e84393 100%)",
                    noteStyle: "#fef3c7",
                    notePosition: { x: 130, y: -60 },
                    imageUrl: "b/b10.jpg"
                }
            ]
        }
    ];


    useEffect(() => {
        if (!selectedDestination) {
            setImageDimensions({});
            return;
        }
        const loadImageDimensions = async () => {
            const dimensions: Record<number, { width: number; height: number }> = {};
            for (let i = 0; i < selectedDestination.pages.length; i++) {
                const page = selectedDestination.pages[i];
                if (page.imageUrl) {
                    try {
                        const img = new Image();
                        await new Promise<void>((resolve, reject) => {
                            img.onload = () => resolve();
                            img.onerror = () => reject();
                            img.src = page.imageUrl!;
                        });
                        dimensions[i] = { width: img.naturalWidth, height: img.naturalHeight };
                    } catch (error) {
                        dimensions[i] = { width: 1, height: 1 };
                    }
                } else {
                    dimensions[i] = { width: 1, height: 1 };
                }
            }
            setImageDimensions(dimensions);
        };
        loadImageDimensions();
    }, [selectedDestination]);

    useEffect(() => {
        if (!selectedDestination || cards.length === 0) return;
        const cardElements = document.querySelectorAll('.gsap-card');
        const draggableInstances: any[] = [];

        cardElements.forEach((cardEl: Element) => {
            const htmlCardEl = cardEl as HTMLElement;
            const cardId = parseInt(htmlCardEl.dataset.cardId || '0');

            const draggable = Draggable.create(htmlCardEl, {
                type: "x,y",
                bounds: { minX: -200, maxX: 200, minY: -200, maxY: 200 },
                inertia: true,
                edgeResistance: 0.8,
                onDrag: function () {
                    const dragX = this.x;
                    const dragY = this.y;
                    gsap.set(htmlCardEl, {
                        rotationY: dragX * 0.05,
                        rotationX: -dragY * 0.05,
                        scale: 1.02,
                        zIndex: 1000
                    });
                },
                onDragEnd: function () {
                    const distance = Math.sqrt(this.x * this.x + this.y * this.y);
                    if (distance > 100) {
                        gsap.set(htmlCardEl, {
                            zIndex: -1,
                            rotationX: 0,
                            rotationY: 0,
                            scale: 1
                        });
                        sendToBack(cardId);
                    } else {
                        gsap.to(htmlCardEl, {
                            x: 0, y: 0, rotationX: 0, rotationY: 0, scale: 1,
                            duration: 0.4, ease: "power2.out"
                        });
                    }
                }
            })[0];
            draggableInstances.push(draggable);
        });

        return () => {
            draggableInstances.forEach(instance => instance?.kill?.());
        };
    }, [selectedDestination, cards]);

    useEffect(() => {
        setMounted(true);
        if (typeof document !== 'undefined') {
            const styleEl = document.createElement('style');
            styleEl.id = 'flipbook-visibility-fix';
            styleEl.innerHTML = `
        .flipbook-force-visible,
        .flipbook-force-visible * { visibility: visible !important; opacity: 1 !important; }
        .flipbook-force-visible div { display: block !important; }
        .flipbook-force-visible div[style*="flex"] { display: flex !important; }
      `;
            document.head.appendChild(styleEl);
            return () => { document.getElementById('flipbook-visibility-fix')?.remove(); };
        }
    }, []);

    const openDestination = (destination: Destination) => {
        setSelectedDestination(destination);
        setCards(destination.pages.map((_, index) => ({ id: index })));
        setSingleNote({ x: 480, y: 100, rotation: Math.random() * 10 - 5, currentPageIndex: 0 });
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setSelectedDestination(null);
        setCards([]);
        setSingleNote({ x: 480, y: 100, rotation: 3, currentPageIndex: 0 });
        if (typeof document !== 'undefined') document.body.style.overflow = 'auto';
    };

    const animateNoteDisplacement = () => {
        const noteEl = singleNoteRef.current;
        if (!noteEl) return;
        const airForce = { x: (Math.random() - 0.5) * 120, y: (Math.random() - 0.5) * 80, rotation: (Math.random() - 0.5) * 25 };
        noteEl.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        noteEl.style.transform = `translateX(${singleNote.x + airForce.x}px) translateY(${singleNote.y + airForce.y}px) translateZ(15px) rotate(${singleNote.rotation + airForce.rotation}deg) scale(1.02)`;
        
        setTimeout(() => {
            const finalPos = { x: singleNote.x + airForce.x * 0.6, y: singleNote.y + airForce.y * 0.7, rotation: singleNote.rotation + airForce.rotation * 0.4 };
            noteEl.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            noteEl.style.transform = `translateX(${finalPos.x}px) translateY(${finalPos.y}px) translateZ(0px) rotate(${finalPos.rotation}deg) scale(1)`;
            setSingleNote(prev => ({ ...prev, x: finalPos.x, y: finalPos.y, rotation: finalPos.rotation }));
        }, 400);
    };

    const sendToBack = (id: number) => {
        setCards((prev) => {
            const newCards = [...prev];
            const index = newCards.findIndex((card) => card.id === id);
            if (index === -1) return prev;
            const [card] = newCards.splice(index, 1);
            newCards.unshift(card);
            const newTopCard = newCards[newCards.length - 1];
            if (newTopCard) setSingleNote(prev => ({ ...prev, currentPageIndex: newTopCard.id }));
            return newCards;
        });
        setTimeout(() => animateNoteDisplacement(), 50);
    };

    const containerStyle: React.CSSProperties = { minHeight: '100px', fontFamily: 'Benton Modern Display, serif', fontStyle: 'italic', padding: '2rem' };
    const albumsContainerStyle: React.CSSProperties = { maxWidth: '64rem', margin: '0 auto' };
    const albumsGridStyle: React.CSSProperties = { display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center', minHeight: '100px' };
    
    const albumCardStyle: React.CSSProperties = {
        position: 'relative', cursor: 'pointer', transform: 'scale(1)', transition: 'transform 0.3s ease',
        borderRadius: '1rem', padding: '2rem', width: '24rem', height: '18rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', color: 'white',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start',
        overflow: 'hidden', pointerEvents: 'auto', background: '#000'
    };

    const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(12px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' };
    const modalContentStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, marginTop: '4500px', marginLeft: 'calc(50vw - 450px)', width: '900px', height: '600px', maxWidth: '95vw', maxHeight: '95vh', borderRadius: '1rem', overflow: 'visible', zIndex: 10000 };
    const stackContainerStyle: React.CSSProperties = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', overflow: 'visible' };
    const perspectiveContainerStyle: React.CSSProperties = { position: 'fixed', width: 400, height: 300, perspective: 1000 };

    return (
        <>
            <div style={containerStyle}>
                {selectedDestination && (
                    <div className="flipbook-force-visible" style={modalOverlayStyle} onClick={closeModal}>
                        <div className="flipbook-force-visible" style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                            <div className="flipbook-force-visible" style={stackContainerStyle}>
                                <div className="flipbook-force-visible" style={perspectiveContainerStyle}>
                                    {cards.map((card, index) => {
                                        const page = selectedDestination.pages[card.id];
                                        const stackRotation = (cards.length - index - 1) * 4 + (Math.random() * 10 - 5);
                                        const stackScale = 1 + index * 0.06 - cards.length * 0.06;
                                        const dimensions = imageDimensions[card.id];
                                        const baseWidth = 500;
                                        let cardHeight = baseWidth;
                                        if (dimensions) {
                                            const aspectRatio = dimensions.width / dimensions.height;
                                            cardHeight = baseWidth / aspectRatio;
                                        }
                                        const isTopCard = index === cards.length - 1;
                                        const cardShadow = isTopCard ? '0 25px 50px rgba(0, 0, 0, 0.4), 0 15px 25px rgba(0, 0, 0, 0.2)' : `0 ${8 + index * 4}px ${16 + index * 8}px rgba(0, 0, 0, 0.15)`;

                                        return (
                                            <div
                                                key={card.id}
                                                className="flipbook-force-visible gsap-card"
                                                data-card-id={card.id}
                                                style={{
                                                    position: 'absolute', width: baseWidth, height: cardHeight,
                                                    left: '50%', top: '50%', marginLeft: -baseWidth / 2, marginTop: -cardHeight / 2,
                                                    cursor: 'grab', transformOrigin: "50% 50%"
                                                }}
                                                ref={(el) => {
                                                    if (el) gsap.to(el, { x: 0, y: 0, rotation: stackRotation, scale: stackScale, zIndex: index, duration: 0.4, ease: "back.out(1.7)" });
                                                }}
                                            >
                                                <div className="flipbook-force-visible" style={{ width: '100%', height: '100%', borderRadius: '1.5rem', backgroundImage: `url(${page.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: cardShadow }} />
                                            </div>
                                        );
                                    })}

                                    {/* Floating Notes */}
                                    {selectedDestination && (
                                        <div
                                            ref={singleNoteRef}
                                            className="flipbook-force-visible"
                                            style={{
                                                position: 'absolute', pointerEvents: 'none', zIndex: 50,
                                                transform: `translateX(${singleNote.x}px) translateY(${singleNote.y}px) rotate(${singleNote.rotation}deg)`,
                                                transition: 'none'
                                            }}
                                        >
                                            <div className="flipbook-force-visible"
                                                style={{
                                                    backgroundColor: selectedDestination.pages[singleNote.currentPageIndex].noteStyle,
                                                    padding: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                                    maxWidth: '12rem', fontFamily: 'Geist',
                                                    border: '2px solid rgba(156, 163, 175, 0.3)', borderRadius: '0.5rem',
                                                    transition: 'all 0.5s ease-in-out'
                                                }}
                                            >
                                                <h3 className="flipbook-force-visible" style={{ fontWeight: 'bold', fontSize: '0.875rem', fontFamily: 'Benton Modern Display, serif', fontStyle: 'italic', marginBottom: '0.5rem', color: '#374151' }}>
                                                    {selectedDestination.pages[singleNote.currentPageIndex].title}
                                                </h3>
                                                <p className="flipbook-force-visible" style={{ fontSize: '0.75rem', fontFamily: 'Geist, sans-serif', color: '#4b5563', lineHeight: '1.4' }}>
                                                    {selectedDestination.pages[singleNote.currentPageIndex].story}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div style={albumsContainerStyle}>
                    <div style={albumsGridStyle}>
                        {destinations.map((destination) => (
                            <div
                                data-cursor-target
                                key={destination.id}
                                style={albumCardStyle}
                                onClick={() => openDestination(destination)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                    setHoveredCard(destination.id);
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    setHoveredCard(null);
                                }}
                            >
                                {/* Static Image Background with Blur Animation */}
                                <div style={{
                                    position: 'absolute', top: '-5%', left: '-5%', width: '110%', height: '110%', 
                                    borderRadius: 'inherit', zIndex: 0,
                                    backgroundImage: `url(${destination.coverImage})`,
                                    backgroundSize: 'cover', backgroundPosition: 'center',
                                    filter: hoveredCard === destination.id ? 'blur(0px)' : 'blur(5px)',
                                    transform: hoveredCard === destination.id ? 'scale(1.0)' : 'scale(1.1)',
                                    transition: 'filter 0.5s ease, transform 0.5s ease'
                                }} />

                                {/* Text Overlay Gradient */}
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%)',
                                    borderRadius: 'inherit', zIndex: 1
                                }} />

                                {/* Content */}
                                <div style={{
                                    position: 'relative', zIndex: 2, textAlign: 'left',
                                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                                    height: '100%', gap: '0.5rem', paddingBottom: '1rem'
                                }}>
                                    <p style={{ fontSize: '0.75rem', fontWeight: '500', fontFamily: 'Geist', color: '#E5E7EB', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                                        PHOTO ALBUM
                                    </p>
                                    <h2 style={{ fontSize: '2rem', fontFamily: 'Benton Modern Display, serif', fontStyle: 'italic', fontWeight: '700', color: 'white', lineHeight: '1.1', margin: 0 }}>
                                        {destination.title}
                                    </h2>
                                    <p style={{ fontSize: '0.875rem', color: '#D1D5DB', margin: 0, opacity: hoveredCard === destination.id ? 1 : 0.8, transition: 'opacity 0.3s' }}>
                                        {destination.id === 1 ? 'Majestic mountain landscapes.' : 'Coastal moments seaside.'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default FlipBookGallery;