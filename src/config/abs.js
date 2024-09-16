const { BlobServiceClient } = require("@azure/storage-blob");
require("dotenv").config();
const fs = require("fs");

const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;

// Conexión a Azure Blob Storage
async function uploadToBlobStorage(filePath, fileName) {
  const time = new Date();

  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  );
  const containerClient = blobServiceClient.getContainerClient("imagenes");
  //await containerClient.createIfNotExists();
  const blockBlobClient = containerClient.getBlockBlobClient(
    time?.getTime()?.toString() + fileName
  );
  await blockBlobClient.uploadFile(filePath);

  return blockBlobClient.url;
}

// Subir imagen
const createImagen = async (file) => {
  let blobUrl = "";
  try {
    blobUrl = await uploadToBlobStorage(file.path, file.originalname);
    fs.unlinkSync(file.path); // Eliminar archivo temporal
  } catch (err) {
    console.error("Error subiendo la imagen:", err);
  }
  return blobUrl;
};

const deleteImagen = async (imageUrl) => {
  try {
    console.log("imageUrl");
    console.log(imageUrl);
    console.log(imageUrl?.split("/"));
    const blobName = decodeURIComponent(imageUrl?.split("/")?.pop() || "");
    console.log(blobName);
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING
    );
    const containerClient = blobServiceClient.getContainerClient("imagenes");
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient?.delete();
  } catch (err) {
    console.log(err);
  }
};

module.exports = { createImagen, deleteImagen };
