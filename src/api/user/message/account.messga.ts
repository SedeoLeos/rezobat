export enum AccountCRUDMessage {
  // Créer
  ACTIVATE_SUCCESS = 'Compte activé avec succès.',
  ACTIVATE_ERROR = "Erreur lors de l'activation de votre compte.",

  PASSWORD_SUCCESS = 'Mot de passe modifier avec succès.',
  PASSWORD_ERROR = 'Erreur lors de la modification de votre mot de passe.',

  // Lire
  UPLOAD_SUCCESS = 'Photo de profile mis á jour avec succès.',
  UPLOAD_ERROR = 'Erreur lors de la mis á jour de votre photo de profile.',

  // Mettre à jour
  UPDATE_SUCCESS = 'Compte mis à jour avec succès.',
  UPDATE_ERROR = 'Erreur lors de la mise à jour de votre compte.',

  ADD_WORK_SUCCESS = 'Metier ajouté avec succès.',
  ADD_WORK_ERROR = "Erreur lors de l'ajout de metier.",

  REMOVE_WORK_SUCCESS = 'Metier supprimé avec succès.',
  REMOVE_WORK_ERROR = 'Erreur lors de la suppression de metier.',

  // Supprimer
  DELETE_SUCCESS = 'Compte supprimé avec succès.',
  DELETE_ERROR = 'Erreur lors de la suppression de votre compte.',
}
