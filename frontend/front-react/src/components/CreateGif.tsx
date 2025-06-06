'use client';

import React, { useState } from "react";
import Image from "next/image";

interface IImage {
    _id: string;
    data: string;
    filename: string;
}

interface CreateGifProps {
    images: IImage[];
    onCreateGif: (ids: string[]) => void;
}

const CreateGif: React.FC<CreateGifProps> = ({ images, onCreateGif }) => {
    const [selected, setSelected] = useState<string[]>([]);

    // Sélection/désélection
    const toggleSelect = (id: string) => {
        setSelected(sel =>
            sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]
        );
    };

    // Monter une image
    const moveUp = (idx: number) => {
        if (idx === 0) return;
        setSelected(sel => {
            const arr = [...sel];
            [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
            return arr;
        });
    };

    // Descendre une image
    const moveDown = (idx: number) => {
        if (idx === selected.length - 1) return;
        setSelected(sel => {
            const arr = [...sel];
            [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
            return arr;
        });
    };

    const handleCreate = () => {
        if (selected.length < 2) {
            alert("Sélectionne au moins 2 images pour créer un GIF.");
            return;
        }
        if (selected.length > 4) {
            alert("Max 4 images pour créer un GIF.");
            return;
        }
        onCreateGif(selected);
    };

    return (
        <div className="w-full flex flex-col items-center">
            <h2 className="text-lg font-bold mb-2">Sélectionne et ordonne tes images</h2>
            <div className="flex flex-wrap gap-2 mb-4 justify-center">
                {images.map(img => (
                    <div
                        key={img._id}
                        className={`border-2 rounded-md p-1 cursor-pointer ${selected.includes(img._id) ? "border-green-500" : "border-gray-300"}`}
                        onClick={() => toggleSelect(img._id)}
                        title={img.filename}
                        style={{ width: 64, height: 64, objectFit: "cover", borderRadius: "0.5rem" }}
                    >
                        <Image
                            src={img.data}
                            alt={img.filename}
                            width={64}
                            height={64}
                            className="object-cover rounded"
                        />
                        {selected.includes(img._id) && (
                            <div className="text-xs text-green-600 text-center">Choisie</div>
                        )}
                    </div>
                ))}
            </div>

            {/* Réordonner */}
            {selected.length > 0 && (
                <div className="mb-4 w-full">
                    <h3 className="text-sm font-semibold mb-1">Ordre du GIF :</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {selected.map((id, idx) => {
                            const img = images.find(i => i._id === id);
                            if (!img) return null;
                            return (
                                <div key={id}
                                    className="flex flex-col items-center"
                                >
                                    <Image
                                        src={img.data}
                                        alt={img.filename}
                                        width={64}
                                        height={64}
                                        style={{ width: 64, height: 64, objectFit: "cover", borderRadius: "0.5rem" }}
                                    />
                                    <div className="flex gap-1 mt-1">
                                        <button
                                            onClick={() => moveUp(idx)}
                                            disabled={idx === 0}
                                            className="text-xs px-1 py-0.5 bg-gray-200 rounded disabled:opacity-50"
                                        >↑</button>
                                        <button
                                            onClick={() => moveDown(idx)}
                                            disabled={idx === selected.length - 1}
                                            className="text-xs px-1 py-0.5 bg-gray-200 rounded disabled:opacity-50"
                                        >↓</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <button
                className="mt-3 px-4 py-2 bg-green-500 text-white rounded-md w-full"
                onClick={handleCreate}
                disabled={selected.length < 2}
            >
                Créer le GIF
            </button>
        </div>
    );
};

export default CreateGif;