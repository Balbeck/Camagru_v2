"use client";

// import { useRef, useState, useEffect } from "react";

export default function PhotoBooth() {
// 	const videoRef = useRef<HTMLVideoElement | null>(null);
// 	const canvasRef = useRef<HTMLCanvasElement | null>(null);
// 	const [photo, setPhoto] = useState<string | null>(null);
// 	const [stream, setStream] = useState<MediaStream | null>(null);
// 	const [error, setError] = useState<string | null>(null);
// 	const [filter, setFilter] = useState<string>("");
// 	const [overlayImage, setOverlayImage] = useState<string | null>(null);
// 	const [overlayImageSize, setOverlayImageSize] = useState<number>(100); // Taille initiale à 100%

// 	// 📌 Demander l'accès à la caméra et afficher le flux vidéo
// 	const startCamera = async () => {
// 		setError(null);
// 		try {
// 			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
// 			setStream(stream);
// 			if (videoRef.current) {
// 				videoRef.current.srcObject = stream;
// 			}
// 		} catch (error) {
// 			console.log("⚠️ Impossible d'accéder à la caméra: ",error);
// 		}
// 	};

// 	// 📌 Prendre une photo
// 	const takePhoto = () => {
// 		if (videoRef.current && canvasRef.current) {
// 			const context = canvasRef.current.getContext("2d");
// 			if (context) {
// 				canvasRef.current.width = videoRef.current.videoWidth;
// 				canvasRef.current.height = videoRef.current.videoHeight;
// 				context.drawImage(videoRef.current, 0, 0);

// 				// Applique le filtre sur la photo capturée
// 				context.filter = filter;

// 				if (overlayImage) {
// 					const img = new Image();
// 					img.src = overlayImage;
// 					img.onload = () => {
// 						const width = (img.width * overlayImageSize) / 100; // Appliquer la taille à partir du slider
// 						const height = (img.height * overlayImageSize) / 100; // Appliquer la taille à partir du slider
// 						const x = canvasRef.current.width / 2 - width / 2;
// 						const y = canvasRef.current.height / 2 - height / 2;
// 						context.drawImage(img, x, y, width, height); // Dessiner l'image avec la nouvelle taille
// 						setPhoto(canvasRef.current.toDataURL("image/png"));
// 					};
// 				} else {
// 					setPhoto(canvasRef.current.toDataURL("image/png"));
// 				}
// 			}
// 		}
// 	};

// 	// 📌 Arrêter la caméra
// 	const stopCamera = () => {
// 		if (stream) {
// 			stream.getTracks().forEach((track) => track.stop());
// 			setStream(null);
// 		}
// 	};

// 	// 📌 Nettoyer la caméra quand on quitte la page
// 	useEffect(() => {
// 		return () => {
// 			stopCamera();
// 		};
// 	}, []);

// 	// 📌 Liste des filtres avec icônes
// 	const filters = [
// 		{ name: "Noir et Blanc", style: "grayscale(100%)", icon: "🌑" },
// 		{ name: "Sépia", style: "sepia(100%)", icon: "🟤" },
// 		{ name: "Inversé", style: "invert(100%)", icon: "🔁" },
// 		{ name: "Flou", style: "blur(5px)", icon: "🌫️" },
// 		{ name: "Saturation", style: "saturate(2)", icon: "🌈" },
// 		{ name: "Contraste", style: "contrast(2)", icon: "⚫" },
// 		{ name: "Luminosité", style: "brightness(1.5)", icon: "💡" },
// 		{ name: "Teinte", style: "hue-rotate(91deg)", icon: "🎨" },
// 	];

// 	// 📌 Liste des images SVG pour superposition
// 	const overlayImages = [
// 		{ src: "/stickers/diving-goggles-svgrepo-com.svg", alt: "Overlay 1" },
// 		{ src: "/stickers/hat-svgrepo-com.svg", alt: "Overlay 2" },
// 		{ src: "/stickers/hot-air-balloon-svgrepo-com.svg", alt: "Overlay 3" },
// 	];

// 	// 📌 Fonction pour télécharger l'image
// 	const downloadPhoto = () => {
// 		if (photo) {
// 			const link = document.createElement("a");
// 			link.href = photo;
// 			link.download = "photo_booth.png";
// 			link.click();
// 		}
// 	};

// 	// 📌 Fonction pour partager sur Twitter
// 	const sharePhoto = () => {
// 		if (photo) {
// 			const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(photo)}&text=Check%20out%20my%20photo%20from%20PhotoBooth!`;
// 			window.open(url, "_blank");
// 		}
// 	};

	return (
		<h1>Hello PhotoBooth</h1>
	)
// 	return (
// 		<div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-900 text-white">
// 			{/* Sidebar Filters */}
// 			<div className="md:w-60 w-full p-4 bg-gray-800 text-white rounded-lg flex-shrink-0">
// 				<h2 className="text-xl font-semibold mb-4">🎨 Filtres</h2>
// 				<div className="space-y-4">
// 					{filters.map((f, index) => (
// 						<button
// 							key={index}
// 							onClick={() => setFilter(f.style)}
// 							className="w-full text-2xl p-3 bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg transform transition duration-300 ease-in-out hover:scale-105"
// 						>
// 							{f.icon} {f.name}
// 						</button>
// 					))}
// 				</div>
// 			</div>

// 			{/* Camera & Overlay Section */}
// 			<div className="flex-1 flex flex-col items-center relative">
// 				{/* PhotoBooth Zone */}
// 				<div className="relative w-80 h-80 border-4 border-white rounded-lg overflow-hidden">
// 					{!photo ? (
// 						<video
// 							ref={videoRef}
// 							autoPlay
// 							className={`w-full h-full object-cover ${filter ? 'filter' : ''}`}
// 							style={{ filter: filter }}
// 						></video>
// 					) : (
// 						<img src={photo} alt="Captured" className="w-full h-full object-cover" />
// 					)}

// 					{overlayImage && !photo && (
// 						<img
// 							src={overlayImage}
// 							alt="Overlay"
// 							style={{
// 								width: `${(overlayImageSize)}%`, // Applique la taille dynamique en temps réel
// 								height: "auto", // Garde le ratio de l'image intact
// 							}}
// 							className="absolute top-0 left-0 object-contain"
// 						/>
// 					)}
// 				</div>

// 				{/* Canvas caché pour capturer l'image */}
// 				<canvas ref={canvasRef} className="hidden"></canvas>

// 				{/* Buttons */}
// 				<div className="mt-4 flex space-x-4">
// 					{!stream ? (
// 						<button onClick={startCamera} className="px-4 py-2 bg-green-500 rounded-lg">
// 							📷 Activer la caméra
// 						</button>
// 					) : (
// 						<>
// 							{!photo && (
// 								<button onClick={takePhoto} className="px-4 py-2 bg-blue-500 rounded-lg">
// 									📸 Prendre une photo
// 								</button>
// 							)}
// 							<button onClick={stopCamera} className="px-4 py-2 bg-red-500 rounded-lg">
// 								❌ Arrêter
// 							</button>
// 						</>
// 					)}

// 					{photo && (
// 						<button onClick={() => setPhoto(null)} className="px-4 py-2 bg-yellow-500 rounded-lg">
// 							🔄 Reprendre
// 						</button>
// 					)}
// 				</div>

// 				{/* Taille de l'image SVG */}
// 				{overlayImage && !photo && (
// 					<div className="mt-4 w-full px-4">
// 						<label htmlFor="overlay-size" className="text-sm text-white mb-2">
// 							Ajuster la taille de l'image
// 						</label>
// 						<input
// 							id="overlay-size"
// 							type="range"
// 							min="0"
// 							max="100"
// 							value={overlayImageSize}
// 							onChange={(e) => setOverlayImageSize(Number(e.target.value))}
// 							className="w-full"
// 						/>
// 						<p className="text-sm text-white text-center">{overlayImageSize}%</p>
// 					</div>
// 				)}

// 				{/* Additional Actions */}
// 				<div className="mt-4 flex space-x-4">
// 					{photo && (
// 						<>
// 							<button onClick={downloadPhoto} className="px-4 py-2 bg-purple-500 rounded-lg">
// 								📥 Télécharger
// 							</button>
// 							<button onClick={sharePhoto} className="px-4 py-2 bg-blue-500 rounded-lg">
// 								🐦 Partager
// 							</button>
// 						</>
// 					)}
// 				</div>

// 				{error && <p className="text-red-500 mt-2">{error}</p>}
// 			</div>

// 			{/* Sidebar Overlay Images */}
// 			<div className="md:w-60 w-full p-4 bg-gray-800 text-white rounded-lg flex-shrink-0 mt-4 md:mt-0">
// 				<h2 className="text-xl font-semibold mb-4">📸 Superposition d'images</h2>
// 				<div className="space-y-4">
// 					{overlayImages.map((image, index) => (
// 						<button
// 							key={index}
// 							onClick={() => setOverlayImage(image.src)}
// 							className="w-full text-2xl p-3 bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg transform transition duration-300 ease-in-out hover:scale-105"
// 						>
// 							<img src={image.src} alt={image.alt} className="w-16 h-16 object-contain" />
// 						</button>
// 					))}
// 				</div>
// 			</div>
// 		</div>
// 	);
}
