// import { Request, Response, NextFunction } from "express";

// export const imageFileVerification = (req: Request, rep: Response, next: NextFunction): void => {
// 	const body = req.body
// };









// app.post('/upload', async (req, res) => {
// 	const { contentType, data } = req.body;
// 	const buffer = Buffer.from(data, 'base64');
// 	if (buffer.length > 5000000) { // Limite de 5 Mo
// 		return res.status(400).send('File size exceeds the limit');
// 	}
// 	if (!['image/jpeg', 'image/png'].includes(contentType)) {
// 		return res.status(400).send('Invalid file type');
// 	}

// 	// Continuez avec le stockage de l'image
// });

// const handleSubmit = async (e) => {
// 	e.preventDefault();
// 	const reader = new FileReader();
// 	reader.readAsDataURL(file);
// 	reader.onloadend = async () => {
// 		const base64data = reader.result.split(',')[1];
// 		const response = await axios.post('/upload', {
// 			filename: file.name,
// 			contentType: file.type,
// 			data: base64data,
// 			userId: 'user-id-here' // Remplacez par l'ID de l'utilisateur
// 		});
// 		console.log(response.data);
// 	};
// };

// <input type="file" onChange = { handleFileChange } />
// 	<button type="submit" > Upload </button>

// const handleFileChange = (e) => {
// 	const file = e.target.files[0];
// 	if (file.size > 5000000) { // Limite de 5 Mo
// 		alert('File size exceeds the limit');
// 		return;
// 	}
// 	if (!['image/jpeg', 'image/png'].includes(file.type)) {
// 		alert('Invalid file type');
// 		return;
// 	}
// 	setFile(file);
// };