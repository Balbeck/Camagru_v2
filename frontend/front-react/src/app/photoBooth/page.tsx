"use client";

import { IImage } from "@/components/Interface";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

export default function PhotoBooth() {
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [photo, setPhoto] = useState<string | null>(null);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [filter, setFilter] = useState<string>("");
	const [overlayImage, setOverlayImage] = useState<string | null>(null);
	const [overlayImageSize, setOverlayImageSize] = useState<number>(50);

	// Thumbnails - Images vars
	const [userImages, setUserImages] = useState<IImage[]>([]);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [thumbStart, setThumbStart] = useState(0);
	const THUMB_WINDOW = 10;

	const fetchUserimages = async () => {
		try {
			const response = await fetch('http://localhost:3000/image/all', {
				method: 'GET',
				credentials: 'include',
			});

			if (response.ok) {
				const data = await response.json();
				setUserImages(data);
			} else {
				console.error('Failed to fetch user images');
			}
		} catch (error) {
			console.error('Error fetching user images:', error);
		}
	};

	const thumbnailsRef = useRef<HTMLDivElement>(null);

	const scrollThumbnails = (direction: "up" | "down") => {
		if (direction === "up") {
			setThumbStart((prev) => Math.max(prev - 1, 0));
		} else {
			setThumbStart((prev) =>
				Math.min(prev + 1, Math.max(userImages.length - THUMB_WINDOW, 0))
			);
		}
	};




	const startCamera = async () => {
		setError(null);
		setSelectedImage(null);
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			setStream(stream);
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
			}
		} catch (error) {
			console.log("⚠️ Impossible to access the Cam Bro: ", error);
		}
	};

	const stopCamera = () => {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			setStream(null);
		}
	};



	const takePhoto = async () => {
		let photoData: string | null = null;

		if (selectedImage) {
			// Si une image de la galerie est sélectionnée, on l'utilise
			photoData = selectedImage;
		} else if (videoRef.current && canvasRef.current) {
			// Sinon, on capture la frame vidéo
			const context = canvasRef.current.getContext("2d");
			if (context) {
				canvasRef.current.width = videoRef.current.videoWidth;
				canvasRef.current.height = videoRef.current.videoHeight;
				context.drawImage(videoRef.current, 0, 0);
				photoData = canvasRef.current.toDataURL("image/png");
			}
		}

		if (!photoData) {
			setError("Aucune image à traiter.");
			return;
		}

		const payload = {
			photo: photoData, // toujours une image en base64
			filter: filter || null,
			overlay: overlayImage || null,
			overlaySize: overlayImageSize || 50,
		};
		console.log("photoData", photoData);
		console.log("payload", payload);
		try {
			const response = await fetch("http://localhost:3000/image/uploadForMontage", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
				credentials: "include"
			});
			if (response.ok) {
				const data = await response.json();
				setPhoto(data.processedPhoto);
			} else {
				setError("Erreur lors du traitement de la photo en Back");
			}
		} catch (err) {
			setError("Erreur réseau lors de l'envoi de la photo.");
			setError(err instanceof Error ? err.message : "Error Bro");
		}
	};



	// Filtres pour la CAM
	const filters = [
		{ name: "Noir et Blanc", style: "grayscale(100%)", icon: "🌑" },
		{ name: "Sépia", style: "sepia(100%)", icon: "🟤" },
		{ name: "Inversé", style: "invert(100%)", icon: "🔁" },
		{ name: "Flou", style: "blur(5px)", icon: "🌫️" },
		{ name: "Saturation", style: "saturate(2)", icon: "🌈" },
		{ name: "Contraste", style: "contrast(2)", icon: "⚫" },
		{ name: "Luminosité", style: "brightness(1.5)", icon: "💡" },
		{ name: "Teinte", style: "hue-rotate(91deg)", icon: "🎨" },
	];

	// SVG pour les overlays
	const overlayImages = [
		{ src: "/stickers/diving-goggles-svgrepo-com.svg", alt: "Overlay 1" },
		{ src: "/stickers/hat-svgrepo-com.svg", alt: "Overlay 2" },
		{ src: "/stickers/hot-air-balloon-svgrepo-com.svg", alt: "Overlay 3" },
	];

	// 📌 Fonction pour télécharger l'image
	const downloadPhoto = () => {
		if (photo) {
			const link = document.createElement("a");
			link.href = photo;
			link.download = "photo_booth.png";
			link.click();
		}
	};

	// 📌 Fonction pour partager sur Twitter
	const sharePhoto = () => {
		if (photo) {
			const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(photo)}&text=Check%20out%20my%20photo%20from%20PhotoBooth!`;
			window.open(url, "_blank");
		}
	};


	useEffect(() => {
		fetchUserimages();
		return () => {
			stopCamera();
		};
	}, []);


	return (
		<div className="flex flex-col md:flex-row min-h-screen bg-gray-900 text-white">
			{/* MAIN SECTION */}
			{/* <main className="flex-1 flex flex-col md:flex-row items-center justify-center p-4"> */}
			<main className="flex-1 flex flex-col md:flex-row items-center justify-center p-4 max-h-[38rem] w-full my-auto">

				{/* LEFT SIDEBAR: Filters */}
				<aside className="w-full md:w-48 mb-4 md:mb-0 md:mr-4 flex-shrink-0">
					<div className="bg-gray-800 rounded-lg p-2 flex md:flex-col flex-row overflow-x-auto md:overflow-y-auto md:overflow-x-hidden">
						{filters.map((f, idx) => (
							<button
								key={idx}
								onClick={() => setFilter(f.style)}
								className="m-1 p-2 bg-gray-700 rounded-lg hover:bg-gray-600 flex-shrink-0 text-xl"
							>
								{f.icon} {f.name}
							</button>
						))}
					</div>
				</aside>

				{/* CAM */}
				<section className="flex-1 flex flex-col items-center">
					{/* Webcam Preview */}
					<div className="relative w-80 h-80 border-4 border-white rounded-lg overflow-hidden">
						{selectedImage ? (
							<Image
								src={selectedImage}
								alt="Selected"
								fill
								className="object-cover"
								sizes="320px"
								priority
							/>
						) : !photo ? (
							<video
								ref={videoRef}
								autoPlay
								className="w-full h-full object-cover"
								style={{ filter: filter }}
							/>
						) : (
							<Image
								src={photo}
								alt="Captured"
								fill
								className="object-cover"
								sizes="320px"
								priority
							/>
						)}

						{overlayImage && (
							<div
								className="absolute"
								style={{
									width: `${overlayImageSize}%`,
									height: `${overlayImageSize}%`,
									left: "50%",
									top: "50%",
									// width: "50%",
									// left: "50%",
									// top: "50%",
									transform: "translate(-50%, -50%)",
									aspectRatio: "1/1",
									pointerEvents: "none",
								}}
							>
								<Image
									src={overlayImage}
									alt="Overlay"
									fill
									unoptimized
									className="object-contain"
									priority
								/>
							</div>
						)}

					</div>
					<canvas ref={canvasRef} className="hidden"></canvas>
					{/* ...dans ta section <section className="flex-1 flex flex-col items-center"> ... */}
					{overlayImage && (
						<div className="w-64 mt-4 flex flex-col items-center">
							<label htmlFor="overlay-size" className="mb-1 text-sm">
								Size : {overlayImageSize}%
							</label>
							<input
								id="overlay-size"
								type="range"
								min={1}
								max={100}
								value={overlayImageSize}
								onChange={e => setOverlayImageSize(Number(e.target.value))}
								className="w-full"
							/>
						</div>
					)}

					{/* Affichage conditionnel des Buttons */}
					<div className="mt-4 flex space-x-2 flex-wrap">
						{!stream ? (
							<div>
								<button onClick={startCamera} className="px-4 py-2 bg-green-500 rounded-lg">
									📷 Activer la caméra
								</button>
								{selectedImage && overlayImage && (
									<button onClick={takePhoto} className="px-4 py-2 bg-blue-500 rounded-lg">
										📸 Save
									</button>
								)}
							</div>
						) : (
							<div>
								{!photo && (
									<button onClick={takePhoto} className="px-4 py-2 bg-blue-500 rounded-lg">
										📸 Prendre une photo
									</button>
								)}
								<button onClick={stopCamera} className="px-4 py-2 bg-red-500 rounded-lg">
									❌ Arrêter
								</button>
							</div>
						)}
						{photo && (
							<div>
								<button onClick={() => setPhoto(null)} className="px-4 py-2 bg-yellow-500 rounded-lg">
									🔄 Reprendre
								</button>
								<button onClick={downloadPhoto} className="px-4 py-2 bg-purple-500 rounded-lg">
									📥 Télécharger
								</button>
								<button onClick={sharePhoto} className="px-4 py-2 bg-blue-500 rounded-lg">
									🐦 Partager
								</button>
							</div>
						)}
					</div>
					{error && <p className="text-red-500 mt-2">{error}</p>}
				</section>

				{/* Overlay Svg preview images */}
				<aside className="w-full md:w-48 mt-4 md:mt-0 md:ml-4 flex-shrink-0">
					<div className="bg-gray-800 rounded-lg p-2 flex md:flex-col flex-row overflow-x-auto md:overflow-y-auto md:overflow-x-hidden">
						{overlayImages.map((image, idx) => (
							<button
								key={idx}
								onClick={() => setOverlayImage(image.src)}
								className="m-1 p-2 bg-gray-700 rounded-lg hover:bg-gray-600 flex-shrink-0 flex items-center justify-center"
							>
								<Image
									src={image.src}
									alt={image.alt}
									width={64}
									height={64}
									className="object-contain"
									unoptimized
								/>
							</button>
						))}
					</div>
				</aside>
			</main>


			{/* Sidebar -> Thumbnails */}
			<aside className="relative md:w-32 w-full bg-gray-800 p-2 flex md:flex-col flex-row md:static fixed bottom-0 left-0 right-0 z-30 md:flex-shrink-0 md:items-stretch">
				{/* Desktop: vertical flex, Mobile: horizontal flex */}
				<div className="flex md:flex-col flex-row w-full items-center md:items-stretch">
					{/* Fleche Up (desk) */}
					<button
						type="button"
						onClick={() => scrollThumbnails("up")}
						className="hidden md:flex justify-center items-center mb-2 bg-gray-700 hover:bg-gray-600 rounded-full p-1"
						aria-label="Scroll up"
						style={{ minHeight: "2rem" }}
					>
						▲
					</button>
					{/* Fleche Up (mob) */}
					<button
						type="button"
						onClick={() => thumbnailsRef.current?.scrollBy({ left: -80, behavior: "smooth" })}
						className="md:hidden flex justify-center items-center mr-2 bg-gray-700 hover:bg-gray-600 rounded-full p-1"
						aria-label="Scroll left"
						style={{ minWidth: "2rem" }}
					>
						◀
					</button>
					{/* Miniatures */}
					<div
						ref={thumbnailsRef}
						className="flex-1 flex md:flex-col flex-row gap-4 w-full h-full md:overflow-y-auto overflow-x-auto md:py-2 items-center"
						style={{
							maxHeight: "calc(100vh - 4rem)",
							minHeight: "5rem",
							scrollbarWidth: "thin",
						}}
					>
						{userImages.slice(thumbStart, thumbStart + THUMB_WINDOW).map((image) => (
							<button
								key={image._id}
								onClick={() => {
									setSelectedImage(image.data);
									stopCamera();
								}}
								className="bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 rounded-full flex-shrink-0 flex items-center justify-center w-20 h-20 md:w-20 md:h-20 w-16 h-16 shadow-lg border-4 border-white transition-all duration-200 hover:scale-105 hover:shadow-pink-400/60"
								style={{
									minWidth: "4rem",
									minHeight: "4rem",
								}}
							>
								<div className="bg-gray-900 rounded-full w-16 h-16 md:w-16 md:h-16 flex items-center justify-center overflow-hidden">
									<Image
										src={image.data}
										alt={image.filename}
										width={64}
										height={64}
										className="object-contain"
										unoptimized
									/>
								</div>
							</button>
						))}
					</div>

					{/* Fleche Down (desk) */}
					<button
						type="button"
						onClick={() => scrollThumbnails("down")}
						className="hidden md:flex justify-center items-center mt-2 bg-gray-700 hover:bg-gray-600 rounded-full p-1"
						aria-label="Scroll down"
						style={{ minHeight: "2rem" }}
					>
						▼
					</button>
					{/* Fleche Down (mob) */}
					<button
						type="button"
						onClick={() => thumbnailsRef.current?.scrollBy({ left: 80, behavior: "smooth" })}
						className="md:hidden flex justify-center items-center ml-2 bg-gray-700 hover:bg-gray-600 rounded-full p-1"
						aria-label="Scroll right"
						style={{ minWidth: "2rem" }}
					>
						▶
					</button>
				</div>
			</aside>

		</div>
	);





}
