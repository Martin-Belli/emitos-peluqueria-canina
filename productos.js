const CONFIG = Object.freeze({
  shopName: "Emitos Peluqueria Canina",
  whatsappNumber: "5491127374051",
  currency: "ARS",
  locale: "es-AR"
});

const PRODUCTS = Object.freeze([
  Object.freeze({
    id: 1,
    name: "Royal Canin Mini Adult 3 kg",
    category: "Alimentos",
    price: 28500,
    description: "Alimento seco para perros adultos de razas pequeñas.",
    image: "https://placehold.co/600x450?text=Royal+Canin"
  }),
  Object.freeze({
    id: 2,
    name: "Snack Dental",
    category: "Snacks",
    price: 4500,
    description: "Snack para complementar la higiene oral de tu mascota.",
    image: "https://placehold.co/600x450?text=Snack+Dental"
  }),
  Object.freeze({
    id: 3,
    name: "Pretal Regulable",
    category: "Accesorios",
    price: 16000,
    description: "Pretal regulable para paseos diarios. Disponible en varios talles.",
    image: "https://placehold.co/600x450?text=Pretal"
  })
]);
