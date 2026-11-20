const indicatifs = {
ZA: "+27",
DZ: "+213",
AO: "+244",
BJ: "+229",
BW: "+267",
BF: "+226",
BI: "+257",
CV: "+238",
CM: "+237",
KM: "+269",
CG: "+242",
CI: "+225",
DJ: "+253",
EG: "+20",
ER: "+291",
SZ: "+268",
ET: "+251",
GA: "+241",
GM: "+220",
GH: "+233",
GN: "+224",
GW: "+245",
GQ: "+240",
KE: "+254",
LS: "+266",
LR: "+231",
LY: "+218",
MG: "+261",
MW: "+265",
ML: "+223",
MA: "+212",
MU: "+230",
MR: "+222",
MZ: "+258",
NA: "+264",
NE: "+227",
NG: "+234",
UG: "+256",
CF: "+236",
CD: "+243",
RW: "+250",
ST: "+239",
SN: "+221",
SC: "+248",
SL: "+232",
SO: "+252",
SD: "+249",
SS: "+211",
TZ: "+255",
TD: "+235",
TG: "+228",
TN: "+216",
ZM: "+260",
ZW: "+263",
};

function recupererComptes() {
return JSON.parse(localStorage.getItem("comptes")) || [];
}

function afficherErreur(champ, identifiant, texte) {
const erreur = document.getElementById(identifiant);

if (erreur) {
erreur.textContent = texte;
}

champ.classList.add("invalid");
}

function effacerErreur(champ, identifiant) {
const erreur = document.getElementById(identifiant);

if (erreur) {
erreur.textContent = "";
}
champ.classList.remove("invalid");
}

function nettoyerTelephone(numero) {
return numero.replace(/\D/g, "");
}

const formulaireInscription = document.querySelector("#inscriptionForm");

if (formulaireInscription) {
const message = document.querySelector("#successMessage");

const nomInput = document.querySelector("#nameInput");
const emailInput = document.querySelector("#emailInput");
const paysInput = document.querySelector("#pays");
const telephoneInput = document.querySelector("#telephoneInput");
const passwordInput = document.querySelector("#passwordInput");
const indicatif = document.querySelector("#indicatif");

formulaireInscription.noValidate = true;

paysInput.addEventListener("change", function () {
indicatif.textContent = indicatifs[paysInput.value] || "";
});

formulaireInscription.addEventListener("submit", function (event) {
event.preventDefault();

let valide = true;

const nom = nomInput.value.trim();
const email = emailInput.value.trim();
const pays = paysInput.value;
const telephone = telephoneInput.value.trim();
const password = passwordInput.value;

effacerErreur(nomInput, "nameError");
effacerErreur(emailInput, "emailError");
effacerErreur(paysInput, "paysError");
effacerErreur(telephoneInput, "telephoneError");
effacerErreur(passwordInput, "passwordError");

if (nom.length < 3) {
    afficherErreur(
    nomInput, "nameError" , "Veuillez entrer votre nom complet (3 caractères minimum)." ,
    );
    valide=false;
    }

    const formatEmail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatEmail.test(email)) {
    afficherErreur(emailInput, "emailError" , "Format requis : nom@gmail.com" );
    valide=false;
    }

    if (pays==="" ) {
    afficherErreur(
    paysInput, "paysError" , "Veuillez sélectionner votre pays." ,
    );
    valide=false;
    }

    const formatTelephone=/^[0-9]{6,15}$/;

    if (!formatTelephone.test(telephone)) {
    afficherErreur(
    telephoneInput, "telephoneError" , "Entrez un numéro valide de 6 à 15 chiffres." ,
    );
    valide=false;
    }

    if (password.length < 8) {
    afficherErreur(
    passwordInput, "passwordError" , "Le mot de passe doit contenir au moins 8 caractères." ,
    );
    valide=false;
    }

    if (!valide) {
    return;
    }

    const nouveauCompte={
    nom: nom,
    email: email,
    pays: pays,
    indicatif: indicatifs[pays],
    telephone: telephone,
    telephoneComplet: indicatifs[pays] + telephone,
    password: password,
    };

    const comptes=recupererComptes();

    const emailExiste=comptes.some(function (compte) {
    return compte.email.toLowerCase()===email.toLowerCase();
    });

    const telephoneExiste=comptes.some(function (compte) {
    return compte.telephoneComplet===nouveauCompte.telephoneComplet;
    });

    if (emailExiste) {
    afficherErreur(
    emailInput, "emailError" , "Cette adresse e-mail possède déjà un compte." ,
    );
    }

    if (telephoneExiste) {
    afficherErreur(
    telephoneInput, "telephoneError" , "Ce numéro de téléphone possède déjà un compte." ,
    );
    }

    if (emailExiste || telephoneExiste) {
    return;
    }

    comptes.push(nouveauCompte);

    localStorage.setItem("comptes", JSON.stringify(comptes));

    message.innerHTML=`
    <span class="success-icon">✓</span>
    <span>Inscription réussie !</span>
    <p>Votre compte a été créé avec succès.</p>
    `;

    message.style.display = "flex";

    setTimeout(function () {
    window.location.href = "index.html";
    }, 5000);
    });
    }

    const formulaireConnexion = document.querySelector("#loginForm");

    if (formulaireConnexion) {
    const message = document.querySelector("#successMessage");

    const methode = document.querySelector("#loginMethod");

    const emailGroup = document.querySelector("#emailGroup");
    const telephoneGroup = document.querySelector("#telephoneGroup");

    const emailInput = document.querySelector("#emailInput");
    const telephoneInput = document.querySelector("#telephoneInput");
    const passwordInput = document.querySelector("#passwordInput");

    const indicatif = document.querySelector("#indicatif");

    formulaireConnexion.noValidate = true;

    methode.addEventListener("change", function () {
    if (methode.value === "email") {
    emailGroup.hidden = false;
    telephoneGroup.hidden = true;

    effacerErreur(emailInput, "emailError");
    effacerErreur(telephoneInput, "telephoneError");

    indicatif.textContent = "";
    } else {
    emailGroup.hidden = true;
    telephoneGroup.hidden = false;

    effacerErreur(emailInput, "emailError");
    effacerErreur(telephoneInput, "telephoneError");

    indicatif.textContent = "";
    }
    });

    telephoneInput.addEventListener("input", function () {
    const numero = nettoyerTelephone(telephoneInput.value);

    const comptes = recupererComptes();

    const compte = comptes.find(function (compte) {
    return nettoyerTelephone(compte.telephone) === numero;
    });

    if (compte && numero.length > 0) {
    indicatif.textContent = compte.indicatif;
    } else {
    indicatif.textContent = "";
    }
    });

    formulaireConnexion.addEventListener("submit", function (event) {
    event.preventDefault();

    const password = passwordInput.value;

    let identifiant = "";

    effacerErreur(emailInput, "emailError");
    effacerErreur(telephoneInput, "telephoneError");
    effacerErreur(passwordInput, "passwordError");

    let champIdentifiant;

    let erreurIdentifiant;

    if (methode.value === "email") {
    identifiant = emailInput.value.trim().toLowerCase();

    champIdentifiant = emailInput;
    erreurIdentifiant = "emailError";

    const formatEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatEmail.test(identifiant)) {
    afficherErreur(
    emailInput,
    "emailError",
    "Veuillez entrer une adresse e-mail valide.",
    );

    return;
    }
    } else {
    identifiant = nettoyerTelephone(telephoneInput.value);

    champIdentifiant = telephoneInput;
    erreurIdentifiant = "telephoneError";

    if (!/^[0-9]{6,15}$/.test(identifiant)) {
    afficherErreur(
    telephoneInput,
    "telephoneError",
    "Veuillez entrer un numéro de téléphone valide.",
    );

    return;
    }
    }

    if (password === "") {
    afficherErreur(
    passwordInput,
    "passwordError",
    "Veuillez entrer votre mot de passe.",
    );

    return;
    }

    const comptes = recupererComptes();

    let compteTrouve;

    if (methode.value === "email") {
    compteTrouve = comptes.find(function (compte) {
    return compte.email.toLowerCase() === identifiant;
    });
    } else {
    compteTrouve = comptes.find(function (compte) {
    return nettoyerTelephone(compte.telephone) === identifiant;
    });
    }

    if (!compteTrouve) {
    afficherErreur(
    champIdentifiant,
    erreurIdentifiant,
    "Aucun compte ne correspond à cet identifiant.",
    );

    return;
    }

    if (compteTrouve.password !== password) {
    afficherErreur(passwordInput, "passwordError", "Mot de passe incorrect.");

    return;
    }

    message.innerHTML = `
    <span class="success-icon">✓</span>
    <span>Connexion réussie !</span>
    `;

    message.style.display = "flex";

    setTimeout(function () {
    window.location.href = "index.html";
    }, 5000);
    });
    }