const utilisateurConnecte = JSON.parse(localStorage.getItem("utilisateurConnecte"));

if (!utilisateurConnecte) {
  window.location.href = "connexion.html";
} else {
  const titreBienvenue = document.querySelector("#bienvenueUser");
  if (titreBienvenue) {
    titreBienvenue.textContent = `Bienvenue, ${utilisateurConnecte.nom} !`;
  }
}

const btnDeconnexion = document.querySelector("#btnDeconnexion");
if (btnDeconnexion) {
  btnDeconnexion.addEventListener("click", function () {
    localStorage.removeItem("utilisateurConnecte");
    window.location.href = "login.html";
  });
}

const listeInscrits = document.querySelector("#listeInscrits");
const inscrits = JSON.parse(localStorage.getItem("inscrits")) || [];

if (inscrits.length === 0) {
  listeInscrits.textContent = "Aucun inscrit pour le moment.";
} else {
  inscrits.forEach(function (inscrit, index) {
    const personne = document.createElement("div");

    const badgeMoi = (utilisateurConnecte && inscrit.email === utilisateurConnecte.email) 
      ? ' <span style="color: #198754; font-size: 13px;">(Vous)</span>' 
      : '';

    personne.innerHTML = `
      <h3>${index + 1}. ${inscrit.nom}${badgeMoi}</h3>
      <p>Email : ${inscrit.email}</p>
      <p>Pays : ${inscrit.pays}</p>
      <p>Téléphone : ${inscrit.telephone}</p>
    `;

    listeInscrits.appendChild(personne);
  });
}
