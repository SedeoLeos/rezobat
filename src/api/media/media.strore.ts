import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
@Injectable()
export class LocalStorageFile {
  async saveFile(
    file: any,
    photoNoms: string,
    folder: string = '',
  ): Promise<void> {
    const projectRoot = path.resolve(__dirname, '..');

    const filePath = path.join(projectRoot, '..', photoNoms);

    // Vérifiez si le dossier existe, sinon, créez-le
    if (!fs.existsSync(path.join(projectRoot, '..', 'public', folder))) {
      fs.mkdirSync(path.join(projectRoot, '..', 'public', folder));
    }

    try {
      fs.writeFileSync(filePath, file.buffer);
    } catch (error) {
      console.log("Erreur lors de l'insertion: ", error);
      throw new HttpException(
        "Echec d'enregistrement d'image",
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      );
    }
  }
  async transformFile(file: any, userId: string): Promise<string> {
    console.log(file.originalname);

    const fileName = `${userId}_${uuidv4()}${path.extname(file.originalname)}`;

    const fileSave = path.join('assets', 'profil-img', fileName);
    const data = fileSave.replace(/\\/g, '/');

    return data;
  }
  async supprimerImage(cheminFichier: string): Promise<void> {
    try {
      // Utiliser fs.promises.unlink pour supprimer le fichier
      await fs.promises.unlink(cheminFichier);
      console.log('Fichier supprimé avec succès');
    } catch (erreur) {
      console.error('Erreur lors de la suppression du fichier :', erreur);
      throw erreur; // Vous pouvez choisir de gérer l'erreur différemment si nécessaire
    }
  }
}
