// src/config/gouvernementConfig.js

// Définition des niveaux de permission
export const PERMISSIONS = {
  ADMIN: "admin", // Maire et Vice-Maire (accès total)
  LIMITEE: "limitee", // Autres membres (accès restreint)
};

// Liste des membres du gouvernement et leurs codes
export const gouvernementMembres = [
  {
    roleNom: "Maire",
    code: "000000",
    permission: PERMISSIONS.ADMIN,
  },
  {
    roleNom: "Vice-Maire",
    code: "111111",
    permission: PERMISSIONS.ADMIN,
  },
  {
    roleNom: "Secteur / Assainisseur",
    code: "222222",
    permission: PERMISSIONS.LIMITEE,
  },
  {
    roleNom: "Commandant",
    code: "333333",
    permission: PERMISSIONS.LIMITEE,
  },
];