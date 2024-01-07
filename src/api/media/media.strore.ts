import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { MemoryStoredFile } from 'nestjs-form-data';
function string_to_slug(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
  const to = 'aaaaeeeeiiiioooouuuunc------';
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
}
@Injectable()
export class LocalStorageFile {
  private path = path.join(process.cwd(), 'public');
  async saveFile(file: MemoryStoredFile, folder: string = ''): Promise<any> {
    const projectRoot = 'public';
    const name = this.transformFile(file);
    const filePath = path.join(projectRoot, folder, name);
    const filePathFolder = path.join(projectRoot, folder);

    // Vérifiez si le dossier existe, sinon, créez-le
    if (!fs.existsSync(filePathFolder)) {
      fs.mkdirSync(filePathFolder);
    }

    try {
      fs.writeFileSync(filePath, file.buffer);
      return {
        url: filePath,
        mimetype: file.mimeType,
        size: file.size,
        name,
      };
    } catch (error) {
      console.log("Erreur lors de l'insertion: ", error);
      throw new HttpException(
        "Echec d'enregistrement d'image",
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      );
    }
  }
  transformFile(file: MemoryStoredFile): string {
    console.log(file);
    const uuid = uuidv4().slice(0, 6);
    const name = string_to_slug(file.originalName.split('.')[0]);
    const fileName = `${name}-${uuid}${path.extname(file.originalName)}`;
    return fileName;
  }
  async removeImage(filePath: string): Promise<void> {
    try {
      // Utiliser fs.promises.unlink pour supprimer le fichier
      await fs.promises.unlink(filePath);
      console.log('Fichier supprimé avec succès');
    } catch (erreur) {
      console.error('Erreur lors de la suppression du fichier :', erreur);
      throw erreur; // Vous pouvez choisir de gérer l'erreur différemment si nécessaire
    }
  }
}
