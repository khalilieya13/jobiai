export const handleAxiosError = (axiosError: any): string => {
    // Gestion des erreurs d'axios
    if (axiosError.response) {
        // L'API a renvoyé une réponse avec un code d'erreur
        return `Erreur ${axiosError.response.status}: ${axiosError.response.data.message || 'Une erreur est survenue. Essayez plus tard.'}`;
    } else if (axiosError.request) {
        // La requête a été envoyée mais aucune réponse n'a été reçue
        return 'Aucune réponse reçue du serveur. Vérifiez votre connexion.';
    } else {
        // Erreur de configuration de la requête
        return 'Erreur dans la configuration de la requête.';
    }
};

export const handleFieldErrors = (company: any): string => {
    // Validation des champs obligatoires
    if (!company.name || !company.location || !company.website || !company.size || !company.description ||
        !company.industry || !company.founded || !company.email || !company.phone || !company.address) {
        return 'Tous les champs sont obligatoires.';
    }

    // Vérification que le champ "founded" est un nombre
    if (isNaN(company.founded) || company.founded <= 0) {
        return 'L\'année de création doit être une année valide';
    }

    // Vérification de la forme de l'email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(company.email)) {
        return 'L\'email doit être au format valide.';
    }

    return ''; // Pas d'erreur
};
