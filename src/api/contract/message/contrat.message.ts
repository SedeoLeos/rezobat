export enum ContratCRUDMessage {
  // Créer
  CREATE_SUCCESS = 'Contrat créé avec succès.',
  CREATE_ERROR = 'Erreur lors de la création du contrat.',

  // Lire
  READ_SUCCESS = 'Contrat récupéré avec succès.',
  READ_ERROR = 'Erreur lors de la récupération du contrat.',

  // Mettre à jour
  UPDATE_SUCCESS = 'Contrat mis à jour avec succès.',
  UPDATE_ERROR = 'Erreur lors de la mise à jour du contrat.',
  // Mettre à jour la lecture du contract
  UPDATE_READ_SUCCESS = 'Contrat lue avec succès.',
  UPDATE_READ_ERROR = 'Erreur lors de la lectur du contrat.',
  // Mettre à jour
  STATUS_SUCCESS = 'Statut du contrat mis à jour avec succès.',
  STATUS_ERROR = 'Erreur lors de la mise à jour du statut.',

  // Supprimer
  DELETE_SUCCESS = 'Contrat supprimé avec succès.',
  DELETE_ERROR = 'Erreur lors de la suppression du contrat.',
}
