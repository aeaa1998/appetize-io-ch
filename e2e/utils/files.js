import fs from "fs"
import path from "path"

const itExists = async (path) => {
    try {
      await fs.promises.access(path);
      return true;
    } catch {
      return false;
    }
}
  
/**
 * Function to create a file from a buffer into a desired path. Use this function to delegate
 * the creation of the folders when required.
 * @param {string} filePath The path for the file to store. e.g test-results/iphone15/17.0/image.png
 * @param {Buffer} data The buffer array to be stored in the path provided
 */
export const writeBuffer = async (filePath, data) => {
    try {
      const dirname = path.dirname(filePath);
      const exist = await itExists(dirname);
      if (!exist) {
        // Create the directory of the file if it does not exist and make it recursive
        // since we can be nesting depending on configuration
        await fs.promises.mkdir(dirname, { recursive: true });
      }
      
      await fs.promises.writeFile(filePath, data);
    } catch (err) {
      throw new Error(err);
    }
}