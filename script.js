function afficherErreur(champ, identifiant, message) {
  const erreur = document.querySelector(identifiant);
  if (erreur) {
    erreur.textContent = message;
  }
  if (champ) {
    champ.classList.add("invalid");
  }
}

function effacerErreur(champ, identifiant) {
  const erreur = document.querySelector(identifiant);
  if (erreur) {
    erreur.textContent = "";
  }
  if (champ) {
    champ.classList.remove("invalid");
  }
}

function afficherNotification(type, titre, message) {
  const notification = document.querySelector("#notification");
  const icon = document.querySelector("#notificationIcon");
  const titreElement = document.querySelector("#notificationTitle");
  const texteElement = document.querySelector("#notificationText");
  const closeButton = document.querySelector("#closeNotification");

  if (!notification) return;

  notification.className = "notification " + type;
  notification.style.display = "flex";

  icon.textContent = type === "success" ? "✓" : "✕";
  titreElement.textContent = titre;
  texteElement.textContent = message;

  closeButton.onclick = function () {
    notification.style.display = "none";
  };

  setTimeout(function () {
    notification.style.display = "none";
  }, 5000);
}

const formatEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const formatTelephone = /^[0-9]{6,15}$/;

// --- INSCRIPTION ---
const formulaire = document.querySelector("#inscriptionForm");

if (formulaire) {
  const nomInput = document.querySelector("#name");
  const emailInput = document.querySelector("#email");
  const paysInput = document.querySelector("#pays");
  const telephoneInput = document.querySelector("#telephone");
  const passwordInput = document.querySelector("#password");

  const successMessage = document.querySelector("#successMessage");
  const errorMessage = document.querySelector("#errorMessage");

  telephoneInput.addEventListener("keydown", function (event) {
    if (event.key && event.key.length === 1 && !/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  });

  telephoneInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });

  formulaire.addEventListener("submit", function (event) {
    event.preventDefault();

    let valide = true;

    const nom = nomInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const pays = paysInput.value.trim();
    const telephone = telephoneInput.value.trim();
    const password = passwordInput.value;

    effacerErreur(nomInput, "#nameError");
    effacerErreur(emailInput, "#emailError");
    effacerErreur(telephoneInput, "#telephoneError");
    effacerErreur(passwordInput, "#passwordError");
    effacerErreur(paysInput, "#paysError");

    if (successMessage) successMessage.style.display = "none";
    if (errorMessage) errorMessage.style.display = "none";

    if (nom.length < 3) {
      afficherErreur(nomInput, "#nameError", "Le nom doit contenir au moins 3 caractères.");
      valide = false;
    }

    if (!formatEmail.test(email)) {
      afficherErreur(emailInput, "#emailError", "Veuillez entrer un email valide.");
      valide = false;
    }

    if (pays === "") {
      afficherErreur(paysInput, "#paysError", "Veuillez sélectionner votre pays.");
      valide = false;
    }

    if (!formatTelephone.test(telephone)) {
      afficherErreur(telephoneInput, "#telephoneError", "Le téléphone doit contenir entre 6 et 15 chiffres.");
      valide = false;
    }

    if (password.length < 8) {
      afficherErreur(passwordInput, "#passwordError", "Le mot de passe doit contenir au moins 8 caractères.");
      valide = false;
    }

    if (!valide) {
      afficherNotification("error", "Inscription échouée", "Veuillez vérifier les champs du formulaire.");
      return;
    }

    let inscrits = JSON.parse(localStorage.getItem("inscrits")) || [];

    const dejaInscrit = inscrits.some(
      (user) => user.email === email || user.telephone === telephone
    );

    if (dejaInscrit) {
      afficherNotification("error", "Compte existant", "Cet email ou ce numéro de téléphone est déjà utilisé.");
      return;
    }

    const nouvelInscrit = {
      nom: nom,
      email: email,
      pays: pays,
      telephone: telephone,
      password: password,
    };

    inscrits.push(nouvelInscrit);
    localStorage.setItem("inscrits", JSON.stringify(inscrits));
    localStorage.setItem("utilisateurConnecte", JSON.stringify(nouvelInscrit));

    afficherNotification(
      "success",
      "Inscription réussie !",
      "Heureux de vous compter parmi nos utilisateurs."
    );

    setTimeout(function () {
      window.location.href = "accueil.html";
    }, 2000);
  });
}

// --- CONNEXION ---
const connexionForm = document.querySelector("#connexionForm");

if (connexionForm) {
  const identifiantInput = document.querySelector("#identifiant");
  const loginPasswordInput = document.querySelector("#loginPassword");

  connexionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    let valide = true;
    const saisie = identifiantInput.value.trim();
    const password = loginPasswordInput.value;

    effacerErreur(identifiantInput, "#identifiantError");
    effacerErreur(loginPasswordInput, "#loginPasswordError");

    const estEmail = formatEmail.test(saisie);
    const estTelephone = formatTelephone.test(saisie);

    if (saisie === "") {
      afficherErreur(identifiantInput, "#identifiantError", "Veuillez entrer votre email ou numéro.");
      valide = false;
    } else if (!estEmail && !estTelephone) {
      afficherErreur(identifiantInput, "#identifiantError", "Format invalide (email ou 6 à 15 chiffres).");
      valide = false;
    }

    if (password === "") {
      afficherErreur(loginPasswordInput, "#loginPasswordError", "Veuillez entrer votre mot de passe.");
      valide = false;
    }

    if (!valide) return;

    const inscrits = JSON.parse(localStorage.getItem("inscrits")) || [];

    const utilisateurTrouve = inscrits.find(function (user) {
      if (estEmail) {
        return user.email === saisie.toLowerCase() && user.password === password;
      }
      if (estTelephone) {
        return user.telephone === saisie && user.password === password;
      }
      return false;
    });

    if (utilisateurTrouve) {
      localStorage.setItem("utilisateurConnecte", JSON.stringify(utilisateurTrouve));

      afficherNotification(
        "success",
        "Connexion réussie !",
        "Bienvenue " + utilisateurTrouve.nom + " !"
      );

      setTimeout(function () {
        window.location.href = "accueil.html";
      }, 2000);
    } else {
      afficherNotification(
        "error",
        "Échec de connexion",
        "Email/numéro ou mot de passe incorrect."
      );
    }
  });
}
